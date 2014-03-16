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
  self.enemy = new Enemy();
  self.levelCamera;
  self.playerCamera;

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
    self.enemy.init(self.game, self).translate([-5, 0, -5]).poleyaw(1);
    self.entities.push(self.enemy);

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
    self.super.update();

    self.player.bbox.generateGlobalPools(self.player.transform);
    self.enemy.bbox.generateGlobalPools(self.enemy.transform);
    if (self.player.bbox.collides(self.enemy.bbox)) {
      vec3.set([0.98, 0.67, 0.1], self.player.bbox.shader.color);
    } else {
      vec3.set([0.34, 0.34, 0.34], self.player.bbox.shader.color);
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
      self.world.createEntities.push(bullet);
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

function Bullet(/* float */ force, /* int - time in frames */ lifespan) {
  var self = object(new Entity());

  self.force = force;
  self.lifespan = lifespan || 10;

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

    self.translate([0, 0, -zs/2 + self.force]);  // first frame always on 0
  }

  self.update = function() {
    self.super.update();

    self.translate([0, 0, -force]);
    
    if (--self.lifespan < 0) {
      self.world.removeEntities.push(self);
    }
  }

  return self;
}

function Enemy() {
  var self = object(new Entity());


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
    self.super.bbox = new Cube().init(xs * 2, ys, zs).compile(shader);

    return self;
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
