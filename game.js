/*******************************************************
 *******************************************************
 * Game implementation
 *******************************************************
 ******************************************************/

function GameApp() {
  var self = object(new Game());
  
  self.initSettings = function() {
    self.width = 640;
    self.height = 480;

    return self;
  }

  self.init = function() {
    self.super.init();

    self.changeWorld(new Level());

    return self;
  }

  self.update = function() {
    self.super.update();

    return self;
  }

  return self;
}

function Level() {
  var self = object(new GameState());

  self.player = new Player();
  self.levelCamera;
  self.playerCamera;

  self.paused = false;

  self.lightPos;

  self.init = function(game) {
    self.super.init(game);

    /*****************
    /* Camera setup
    /****************/
    // View Volume
    var vv = {};
    vv.N = 0.1;
    vv.F = 1000;
    vv.xR = 0.05;
    vv.xL = - vv.xR;
    vv.yT = vv.xR * gl.viewportHeight / gl.viewportWidth;
    vv.yB = - vv.yT;
    // Main camera setup
    self.camera.init(vv).translate([-10, -10, -10]).pitch(Math.PI / 4).poleyaw(-Math.PI / 4).activate();
    self.levelCamera = self.camera;
    // Player fps camera setup
    self.playerCamera = new Camera().init();  // will point to the player later

    /*****************
    /* Scene setup
    /****************/
    // Lights
    lights.l[0] = {
      pos: quat4.create([-4.0, 5.0, -4.0, 1.0]),
      color: vec3.create([1.0, 1.0, 0.95])
    }

    /****************
    /* Entities setup
    /***************/
    // Player
    self.player.init(self.game, self);
    self.entities.push(self.player);
    // Main Enemy
    self.entities.push(new EnemySpawner(Enemy).init(self.game, self));

    /******************
    /* Hardcoded scene
    /*****************/
    // Shaders
    var shader = new Shader().init("shaderTexture.vs", "shaderTexture.fs");
    shaderProgram = shader;
    shaderProgram.color = vec3.create([1.0, 1.0, 0.8]);
    // Buffers
    tmpBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tmpBuffer);
    // Grid
    var vertices = [
      -20, -5, -20, 0, 1, 0, 20.0, 0.0,
      20, -5, -20, 0, 1, 0, 0.0, 0.0,
      -20, -5, 20, 0, 1, 0, 20.0, 20.0,
      20, -5, -20, 0, 1, 0, 0.0, 0.0,
      -20, -5, 20, 0, 1, 0, 20.0, 20.0,
      20, -5, 20, 0, 1, 0, 0.0, 20.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    tmpBuffer.itemSize = 8;
    tmpBuffer.numItems = vertices.length / tmpBuffer.itemSize;
    // Texture
    floorTexture = gl.createTexture();
    floorTexture.image = new Image();
    floorTexture.image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, floorTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, floorTexture.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.bindTexture(gl.TEXTURE_2D, null);

      shaderProgram.uniforms.texture0 = gl.getUniformLocation(shaderProgram.program, "uTexSampler0");
    }
    floorTexture.image.src = "floortile.png";
      
    toggleCamera();

    return self;
  }

  self.update = function() {
    
    /*****************************
     * Pause logic
     *****************************/
    if (self.game.input.keyPressed(84)) {  // t
      self.paused = !self.paused
    }
    if (self.paused)
      return;

    /*****************************
     * Gameplay logic
     *****************************/
    self.super.update();
    
    /**
     * Collisions
     */
    for (var i = 0; i < self.entities.length; i++) {
      if (self.entities[i].bbox) {
        self.entities[i].bbox.generateGlobalPools(self.entities[i].transform);
      }
    }
    
    for (var i = 0; i < self.entities.length - 1; i++) {
      var firstEntity = self.entities[i];
      for (var j = i + 1; j < self.entities.length; j++) {
        var secondEntity = self.entities[j];
        if (firstEntity.bbox && secondEntity.bbox && firstEntity != secondEntity) {
          if (firstEntity.bbox.collides(secondEntity.bbox)) {
            firstEntity.onCollide(secondEntity);
            secondEntity.onCollide(firstEntity);
          }
        }
      }
    }

    if (self.levelCamera.isActive()) {
      var x = 0, y = 0;
      var tinc = 0.5;
      var rinc = 0.1;
      if (self.game.input.keyCheck(87)) {  // w
        y += tinc;
      }
      if (self.game.input.keyCheck(65)) {  // a
        x += tinc;
      }
      if (self.game.input.keyCheck(83)) {  // s
        y -= tinc;
      }
      if (self.game.input.keyCheck(68)) {  // d
        x -= tinc;
      }

      var yaw = 0, pitch = 0;
      if (self.game.input.keyCheck(37)) {  // left
        yaw -= rinc;
      }
      if (self.game.input.keyCheck(38)) {  // up
        pitch += rinc;
      }
      if (self.game.input.keyCheck(39)) {  // right
        yaw += rinc;
      }
      if (self.game.input.keyCheck(40)) {  // down
        pitch -= rinc;
      }

      self.camera.translate([x, 0, y]).poleyaw(yaw).pitch(-pitch);
    }

    if (self.game.input.keyPressed(80)) {  // p
      toggleCamera();
    }

    if (self.game.input.keyPressed(89)) {  // y
      DEBUG = !DEBUG;
    }

    return self;
  }

  self.render = function() {
    self.super.render();
 
    // Clear view
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw floor
    mv.pushMatrix();
      shaderProgram.bind();
      gl.enableVertexAttribArray(shaderProgram.attributes.vertexPosition);
      gl.enableVertexAttribArray(shaderProgram.attributes.normalPosition);

      gl.bindBuffer(gl.ARRAY_BUFFER, tmpBuffer);
      gl.vertexAttribPointer(shaderProgram.attributes.vertexPosition, 3, gl.FLOAT, false, tmpBuffer.itemSize*4, 0);
      gl.vertexAttribPointer(shaderProgram.attributes.normalPosition, 3, gl.FLOAT, false, tmpBuffer.itemSize*4, 3*4);
      if (shaderProgram.attributes.texCoord >= 0) {
        gl.enableVertexAttribArray(shaderProgram.attributes.texCoord);
        gl.vertexAttribPointer(shaderProgram.attributes.texCoord, 2, gl.FLOAT, false, tmpBuffer.itemSize*4, 6*4);
      
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, floorTexture);
        gl.uniform1i(shaderProgram.uniforms.texture0, 0);
      }

      gl.drawArrays(gl.TRIANGLES, 0, tmpBuffer.numItems);

      gl.disableVertexAttribArray(shaderProgram.attributes.vertexPosition);
      gl.disableVertexAttribArray(shaderProgram.attributes.normalPosition);
      if (shaderProgram.attributes.texCoord >= 0) {
        gl.disableVertexAttribArray(shaderProgram.attributes.texCoord);
      }
    mv.popMatrix();
    
    // Draw player
    for (var i = 0; i < self.entities.length; i++) {
        self.entities[i].render();
    }

    return self;
  }

  // Private
  var tmpBuffer;

  var toggleCamera = function() {
    if (self.camera == self.levelCamera) {
      self.playerCamera.lockOn(self.player.transform, self.player.cameraOffsetTransform);
      self.super.camera = self.playerCamera;
    } else {
      self.super.camera = self.levelCamera;
    }
  
    self.super.camera.activate();
  }

  return self;
}

/*******************************************************
 *******************************************************
 * Entities
 *******************************************************
 ******************************************************/

var TYPE_PLAYER = 'p';
function Player() {
  var self = object(new Entity());

  self.cameraOffsetTransform;
  
  self.init = function(game, world) {
    self.super.init(game, world);

    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.color = vec3.create([0.34, 0.32, 1.0]);

    // Create mesh (cube)
    var m = new Cube().init(1, 1, 1).compile(shader);

    self.super.mesh = m;

    // Camera offset transform
    var mat = mat4.identity(mat4.create());
    mat4.rotateX(mat, Math.PI / 32);
    mat4.translate(mat, [0, -2.5, -5]);
    self.cameraOffsetTransform = mat;

    shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.color = vec3.create([1.0, 1.0, 1.0]);
    self.super.bbox = new Cube().init(1, 1, 1).compile(shader);

    self.super.type = TYPE_PLAYER;

    return self;
  }

  self.update = function() {
    self.super.update();

    var x = 0, y = 0;
    var tinc = 0.5;
    if (self.game.input.keyCheck(87)) {  // w
      y -= tinc;
    }
    if (self.game.input.keyCheck(65)) {  // a
      x -= tinc;
    }
    if (self.game.input.keyCheck(83)) {  // s
      y = tinc;
    }
    if (self.game.input.keyCheck(68)) {  // d
      x = tinc;
    }

    var yaw = 0, pitch = 0;
    var rinc = 0.07;
    if (self.game.input.keyCheck(37)) {  // left
      yaw += rinc;
    }
    if (self.game.input.keyCheck(38)) {  // up
      pitch -= rinc;
    }
    if (self.game.input.keyCheck(39)) {  // right
      yaw -= rinc;
    }
    if (self.game.input.keyCheck(40)) {  // down
      pitch += rinc;
    }

    if (self.game.input.keyPressed(32)) {  // Space
      var bullet = new Bullet(2, 0);
      bullet.copyTransform(self);
      self.world.incomingEntities.push(bullet);
    }

    var idlation = 0.03*Math.sin(0.1*i);
    i++;

    if (self.world.camera != self.world.levelCamera) {
      self.poleyaw(yaw).pitch(-pitch).translate([x, idlation, y]);
    } else {
      self.translate([0, idlation, 0]);
    }      

    return self;
  }

  // Private
  var i = 0;

  return self;
}

var TYPE_WEAPON = 'w';
function Bullet(/* float */ force, /* int - time in frames */ lifespan) {
  var self = object(new Entity());

  self.force = force;
  self.lifespan = lifespan || 30;

  self.init = function(game, world) {
    self.super.init(game, world);

    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.color = vec3.create([0.64, 0.92, 0.2]);

    // Mesh dimensions (long cube)
    var xs = 0.1,
        ys = 0.1,
        zs = 2;
    // Create mesh
    var m = new Cube().init(xs, ys, zs).compile(shader);

    self.super.mesh = m;
    
    self.super.bbox = new Cube().init(xs, ys, zs).compile(shader);

    self.translate([0, 0, -zs/2 + self.force]);  // first frame always on 0
    
    self.super.type = TYPE_WEAPON;

    return self;
  }

  self.update = function() {
    self.super.update();

    self.translate([0, 0, -force]);
    
    if (--self.lifespan < 0) {
      self.world.outgoingEntities.push(self);
    }
  }

  self.onCollide = function(other) {
    if (other.type === TYPE_ENEMY) {
      other.die();
      self.world.outgoingEntities.push(self);
    }
  }

  return self;
}

var TYPE_ENEMY = 'x';
var EnemyState = {
  IDLE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
}
function Enemy() {
  var self = object(new Entity());

  self.alive = true;
  self.state;

  self.init = function(game, world) {
    self.super.init(game, world);

    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.color = vec3.create([0.94, 0.22, 0.22]);

    var xs = 1.5,
        ys = 2.5,
        zs = 1;
    // Create mesh
    var m = new Cube().init(xs, ys, zs).compile(shader);
    self.super.mesh = m;

    var shader = new Shader();   
    shader.init("shader.vs", "shader.fs");
    shader.color = vec3.create([1.0, 1.0, 1.0]);
    self.super.bbox = new Cube().init(xs, ys, zs).compile(shader);

    self.alive = true;
    self.super.type = TYPE_ENEMY; // enemy
    
    switchState(EnemyState.IDLE);
    return self;
  }

  self.update = function() {
    self.super.update();

    var rspeed = 0.1;
    var tspeed = 0.5;
    switch (self.state) {
      case EnemyState.IDLE:
        break;
      case EnemyState.UP:
        self.pitch(rspeed);
        break;
      case EnemyState.DOWN:
        self.pitch(-rspeed);
        break;
      case EnemyState.LEFT:
        self.poleyaw(-rspeed);
        break;
      case EnemyState.RIGHT:
        self.poleyaw(rspeed);
        break;
    }
    self.translate([0, 0, tspeed]);
  }

  self.die = function() {
    self.alive = false;
    self.world.outgoingEntities.push(self);
  }
  
  self.onTimer = function(i) {
    self.super.onTimer(i);
    
    // Change directions
    if (self.state === EnemyState.IDLE) {
      switch (Math.round(Math.random() * 3)) {
        case 0:
          switchState(EnemyState.UP);
          break;
        case 1:
          switchState(EnemyState.DOWN);
          break;
        case 2:
          switchState(EnemyState.LEFT);
          break;
        case 3:
          switchState(EnemyState.RIGHT);
          break;
      }
    } else {
      // If already changing, then most likely go back to idle
      switch (Math.round(Math.random() * 9)) {
        case 0:
          switchState(EnemyState.UP);
          break;
        case 1:
          switchState(EnemyState.DOWN);
          break;
        case 2:
          switchState(EnemyState.LEFT);
          break;
        case 3:
          switchState(EnemyState.RIGHT);
          break;
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          switchState(EnemyState.IDLE);
          break;
      }
    }
  }

  var switchState = function(nextState) {
    console.log("Switcheroo");
    if (self.state !== nextState) {
      self.state = nextState;
      self.timers[0] = Math.random() * 20;
    }
  }

  return self;
}

function EnemySpawner(enemyConstructor) {
  var self = object();

  self.game;
  self.world;
  self.enemyConstructor = enemyConstructor || Enemy;

  self.enemy;

  self.init = function(game, world) {
    self.game = game;
    self.world = world;
    self.enemyConstructor = enemyConstructor;

    return self;
  }

  self.update = function() {
    if (!self.enemy || !self.enemy.alive) {
      self.spawnEnemy();
    }
  }

  self.render = function() {}

  self.spawnEnemy = function() {
    self.enemy = new self.enemyConstructor();
    self.enemy.translate([-5, 0, -5]).poleyaw(1);
    self.world.incomingEntities.push(self.enemy);
  }

  return self;
}

/*******************************************************
 *******************************************************
 * Main
 *******************************************************
 ******************************************************/

function main() {
    var canvas = document.getElementById("canvas");

    game = new GameApp().init(canvas).run();
}
