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

  self.lightPos;

  self.init = function(game) {
    self.super.init(game);

    // Camera setup
    self.playerCamera = new Camera().init();
    self.camera.init().translate([-10, -10, -10]).pitch(Math.PI / 4).poleyaw(-Math.PI / 4).activate();
    self.levelCamera = self.camera;

    // Scene setup
    lights.l[0] = {
      pos: vec3.create([0.0, 5.0, 0.0]),
      color: vec3.create([1.0, 1.0, 0.95])
    }

    // Entities setup
    self.player.init(self.game, self);

    // Shaders
    var shader = new Shader().init("shaderTexture.vs", "shaderTexture.fs");
    shaderProgram = shader;
    shaderProgram.color = vec3.create([1.0, 1.0, 0.8]);

    // // Buffers
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

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    tmpBuffer.itemSize = 8;
    tmpBuffer.numItems = vertices.length / tmpBuffer.itemSize;

    return self;
  }

  self.update = function() {
    self.super.update();

    if (self.levelCamera.isActive()) {
      var x = 0, y = 0;
      if (self.game.input.keyCheck(87)) {  // w
        y += 0.1;
      }
      if (self.game.input.keyCheck(65)) {  // a
        x += 0.1;
      }
      if (self.game.input.keyCheck(83)) {  // s
        y -= 0.1;
      }
      if (self.game.input.keyCheck(68)) {  // d
        x -= 0.1;
      }

      var yaw = 0, pitch = 0;
      if (self.game.input.keyCheck(37)) {  // left
        yaw -= 0.07;
      }
      if (self.game.input.keyCheck(38)) {  // up
        pitch += 0.07;
      }
      if (self.game.input.keyCheck(39)) {  // right
        yaw += 0.07;
      }
      if (self.game.input.keyCheck(40)) {  // down
        pitch -= 0.07;
      }

      self.camera.translate([x, 0, y]).poleyaw(yaw).pitch(-pitch);
    }

    if (self.game.input.keyPressed(80)) {  // p
      toggleCamera();
    }

    self.player.update();

    return self;
  }

  self.render = function() {
    self.super.render();
 
    // Clear view
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
    
    self.player.render();

    return self;
  }

  // Private
  var tmpBuffer;

  var toggleCamera = function() {
    if (self.camera == self.levelCamera) {
      self.playerCamera.lockOn(self.player.transform);
      self.super.camera = self.playerCamera;
    } else {
      self.super.camera = self.levelCamera;
    }
  
    self.super.camera.activate();
  }

  return self;
}

function Player() {
  var self = object(new Entity());

  self.init = function(game, world) {
    self.super.init(game, world);

    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.color = vec3.create([0.34, 0.32, 1.0]);

    // Create mesh (cube)
    var m = new Mesh().init(8, 12);
    m.vertexPool[0] = quat4.create([-0.5, -0.5, -0.5, 1]);
    m.vertexPool[1] = quat4.create([-0.5, -0.5, 0.5, 1]);
    m.vertexPool[2] = quat4.create([-0.5, 0.5, -0.5, 1]);
    m.vertexPool[3] = quat4.create([-0.5, 0.5, 0.5, 1]);
    m.vertexPool[4] = quat4.create([0.5, -0.5, -0.5, 1]);
    m.vertexPool[5] = quat4.create([0.5, -0.5, 0.5, 1]);
    m.vertexPool[6] = quat4.create([0.5, 0.5, -0.5, 1]);
    m.vertexPool[7] = quat4.create([0.5, 0.5, 0.5, 1]);

    m.faces[0].init(3);
    m.faces[0].vertexNormalPairs[0].vertex = 4;
    m.faces[0].vertexNormalPairs[1].vertex = 6;
    m.faces[0].vertexNormalPairs[2].vertex = 5;
    m.faces[1].init(3);
    m.faces[1].vertexNormalPairs[0].vertex = 5;
    m.faces[1].vertexNormalPairs[1].vertex = 6;
    m.faces[1].vertexNormalPairs[2].vertex = 7;

    m.faces[2].init(3);
    m.faces[2].vertexNormalPairs[0].vertex = 6;
    m.faces[2].vertexNormalPairs[1].vertex = 2;
    m.faces[2].vertexNormalPairs[2].vertex = 7;
    m.faces[3].init(3);
    m.faces[3].vertexNormalPairs[0].vertex = 7;
    m.faces[3].vertexNormalPairs[1].vertex = 2;
    m.faces[3].vertexNormalPairs[2].vertex = 3;

    m.faces[4].init(3);
    m.faces[4].vertexNormalPairs[0].vertex = 2;
    m.faces[4].vertexNormalPairs[1].vertex = 0;
    m.faces[4].vertexNormalPairs[2].vertex = 3;
    m.faces[5].init(3);
    m.faces[5].vertexNormalPairs[0].vertex = 3;
    m.faces[5].vertexNormalPairs[1].vertex = 0;
    m.faces[5].vertexNormalPairs[2].vertex = 1;

    m.faces[6].init(3);
    m.faces[6].vertexNormalPairs[0].vertex = 0;
    m.faces[6].vertexNormalPairs[1].vertex = 4;
    m.faces[6].vertexNormalPairs[2].vertex = 1;
    m.faces[7].init(3);
    m.faces[7].vertexNormalPairs[0].vertex = 1;
    m.faces[7].vertexNormalPairs[1].vertex = 4;
    m.faces[7].vertexNormalPairs[2].vertex = 5;

    m.faces[8].init(3);
    m.faces[8].vertexNormalPairs[0].vertex = 7;
    m.faces[8].vertexNormalPairs[1].vertex = 3;
    m.faces[8].vertexNormalPairs[2].vertex = 5;
    m.faces[9].init(3);
    m.faces[9].vertexNormalPairs[0].vertex = 5;
    m.faces[9].vertexNormalPairs[1].vertex = 3;
    m.faces[9].vertexNormalPairs[2].vertex = 1;

    m.faces[10].init(3);
    m.faces[10].vertexNormalPairs[0].vertex = 4;
    m.faces[10].vertexNormalPairs[1].vertex = 0;
    m.faces[10].vertexNormalPairs[2].vertex = 6;
    m.faces[11].init(3);
    m.faces[11].vertexNormalPairs[0].vertex = 6;
    m.faces[11].vertexNormalPairs[1].vertex = 0;
    m.faces[11].vertexNormalPairs[2].vertex = 2;

    m.computeNormals().compile(shader);

    self.super.mesh = m;

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

/*******************************************************
 *******************************************************
 * Main
 *******************************************************
 ******************************************************/

function main() {
    var canvas = document.getElementById("canvas");

    game = new GameApp().init(canvas).run();
}
