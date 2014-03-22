var PITCH_STATE = {
  IDLE: 0,
  UP: 1,
  DOWN: 2
}
var YAW_STATE = {
  IDLE: 0,
  LEFT: 1,
  RIGHT: 2
}
PITCH_TIMER = 0;
YAW_TIMER = 1;
ROTATION_TIME = 10;
ROTATION_TIME_OFFSET = 40;
IDLE_TIME = 10;
IDLE_TIME_OFFSET = 50;
function LogoLevel() {
  var self = object(new GameState());

  self.logo = new Logo();
  self.camera;
  self.playerCamera;

  self.pitchState;
  self.yawState;

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
    self.camera.init(vv).translate([0, 0, -4]).activate();
    self.camera.activate();

    /*****************
    /* Scene setup
    /****************/
    // Lights
    lights.l[0] = {
      pos: quat4.create([1.5, 3.0, 100.0, 1.0]),
      color: quat4.create([1.0, 1.0, 1.0, 1.0])
    }

    /****************
    /* Entities setup
    /***************/
    // Player
    self.logo.init(self.game, self);
    self.entities.push(self.logo);
    self.entities.push(new DotGenerator([0.5, -0.075, 0.875]).init(self.game, self));
    self.entities.push(new DotGenerator([0.6, -0.075, 0.875]).init(self.game, self));
    self.entities.push(new DotGenerator([0.7, -0.075, 0.875]).init(self.game, self));
    

    switchYawState(YAW_STATE.IDLE);
    switchPitchState(PITCH_STATE.IDLE);

    return self;
  }

  self.render = function() {
    self.super.render();
 
    // Clear view
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    // Draw player
    for (var i = 0; i < self.entities.length; i++) {
        self.entities[i].render();
    }

    return self;
  }

  self.update = function() {
    self.super.update();

    if (self.game.input.keyCheck(66)) {
      switchYawState(YAW_STATE.IDLE);
      switchPitchState(PITCH_STATE.IDLE);
    }

    if (self.game.input.keyCheck(MOUSE_KEYCODE)) {  // Mouse click
      var yaw = 0, pitch = 0;
      yaw += self.game.input.mouseXinc / 500;
      pitch += self.game.input.mouseYinc / 500;
      self.camera.orbitatepoleyaw(yaw).orbitatepitch(pitch);

      switchYawState(YAW_STATE.IDLE);
      switchPitchState(PITCH_STATE.IDLE);

      restore = false;
    } else if (self.game.input.keyReleased(MOUSE_KEYCODE)) {  // Mouse release
      switchYawState(YAW_STATE.IDLE);
      switchPitchState(PITCH_STATE.IDLE);

      forceRestore();
    } else {
      if (restore) {
        forceRestore();
      } else {
        var rinc = 0.0001;
        var maxSpeed = 0.005;
        switch (self.pitchState) {
          case PITCH_STATE.IDLE:
            if (self.camera.pitchAngle > maxSpeed) {
              pitchSpeed = Math.max(-maxSpeed, pitchSpeed - rinc);
            } else if (self.camera.pitchAngle < -maxSpeed) {
              pitchSpeed = Math.min(maxSpeed, pitchSpeed + rinc);
            } else if (self.camera.pitchAngle != 0) {
              pitchSpeed = 0;
              self.camera.orbitatepitch(-self.camera.pitchAngle);
            }
            break;
          case PITCH_STATE.UP:
            pitchSpeed = Math.min(maxSpeed, pitchSpeed + rinc);
            break;
          case PITCH_STATE.DOWN:
            pitchSpeed = Math.max(-maxSpeed, pitchSpeed - rinc);
            break;
        }

        switch (self.yawState) {
          case YAW_STATE.IDLE:
            if (self.camera.yawAngle > maxSpeed) {
              yawSpeed = Math.max(-maxSpeed, yawSpeed - rinc);
            } else if (self.camera.yawAngle < -maxSpeed) {
              yawSpeed = Math.min(maxSpeed, yawSpeed + rinc);
            } else if (self.camera.yawAngle != 0) {
              yawSpeed = 0;
              self.camera.orbitatepoleyaw(yawSpeed);
            }
            break;
          case YAW_STATE.LEFT:
            yawSpeed = Math.max(-maxSpeed, yawSpeed - rinc);
            break;
          case YAW_STATE.RIGHT:
            yawSpeed = Math.min(maxSpeed, yawSpeed + rinc);
            break;
        }
        self.camera.orbitatepoleyaw(yawSpeed).orbitatepitch(pitchSpeed);
      }
    }
  }

  var forceRestore = function() {
    var restorepitchinc = 0.1;
    var restoreyawinc = 0.1;
    var yaw = 0, pitch = 0;
    if (self.camera.yawAngle > restoreyawinc) {
      yaw -= restoreyawinc;
    } else if (self.camera.yawAngle < -restoreyawinc) {
      yaw += restoreyawinc;
    } else if (self.camera.yawAngle != 0) {
      yaw -= self.camera.yawAngle;
    }
    if (self.camera.pitchAngle > restorepitchinc) {
      pitch -= restorepitchinc;
    } else if (self.camera.pitchAngle < -restorepitchinc) {
      pitch += restorepitchinc;
    } else if (self.camera.pitchAngle != 0) {
      pitch -= self.camera.pitchAngle;
    }

    self.camera.orbitatepoleyaw(yaw).orbitatepitch(pitch);
    
    restore = self.camera.pitchAngle !== 0 || self.camera.yawAngle !== 0;
  }

  self.onTimer = function(i) {
    // Change directions
    var stateObject;
    if (i == YAW_TIMER) {
      stateObject = {
        'idle': YAW_STATE.IDLE,
        'one': YAW_STATE.LEFT,
        'other': YAW_STATE.RIGHT,
        'switch': switchYawState
      };
    } else if (i == PITCH_TIMER) {
      stateObject = {
        'idle': PITCH_STATE.IDLE,
        'one': PITCH_STATE.UP,
        'other': PITCH_STATE.DOWN,
        'switch': switchPitchState
      };
    }

    if (self.state === stateObject.idle) {
      switch (Math.round(Math.random() * 1)) {
        case 0:
          stateObject['switch'](stateObject.one);
          break;
        case 1:
          stateObject['switch'](stateObject.other);
          break;
      }
    } else {
      // If already changing, then most likely go back to idle
      switch (Math.round(Math.random() * 4)) {
        case 0:
          stateObject['switch'](stateObject.one);
          break;
        case 1:
          stateObject['switch'](stateObject.other);
          break;
        case 2:
        case 3:
        case 4:
          stateObject['switch'](stateObject.idle);
          break;
      }
    }
  }

  var yawSpeed = 0;
  var pitchSpeed = 0;
  var restore = false;

  var switchYawState = function(nextState) {
    self.yawState = nextState;
    var time;
    if (nextState == YAW_STATE.IDLE) {
      time = IDLE_TIME;
      timeoffset = IDLE_TIME_OFFSET;
    } else {
      time = ROTATION_TIME;
      timeoffset = ROTATION_TIME_OFFSET;
    }
    self.timers[YAW_TIMER] = Math.random() * time + timeoffset;
  }

  var switchPitchState = function(nextState) {
    self.pitchState = nextState;
    var time;
    if (nextState == PITCH_STATE.IDLE) {
      time = IDLE_TIME;
      timeoffset = IDLE_TIME_OFFSET;
    } else {
      time = ROTATION_TIME;
      timeoffset = ROTATION_TIME_OFFSET;
    }
    self.timers[PITCH_TIMER] = Math.random() * time + timeoffset;
  }

  return self;
}

function Dot(lifespan) {
  var self = object(new Entity());

  self.alive = true;
  self.lifespan = Math.random()*20 + 30;
  self.maxLifespan = self.lifespan;

  self.init = function(game, world) {
    self.super.init(game, world);

    var shader = new Shader();
    shader.init("/assets/shader.vs", "/assets/shader.fs");
    shader.color = quat4.create([0.1, 0.1, 0.1, 1.0]);

    // Mesh dimensions
    var xs = 0.03,
        ys = 0.03,
        zs = 0.001;
    // Create mesh
    var m = new Cube().init(xs, ys, zs).compile(shader);
    self.super.mesh = m;

    self.generateDirection();

    return self;
  }

  self.generateDirection = function() {
    var random = Math.random()/300 - 1 / 600;
    var randomProp = Math.random();
    var tx = random * randomProp;
    var ty = random * (1 - randomProp)
    dir = [tx, ty, 0];
  }

  self.regenerate = function() {
    self.alive = true;
    self.lifespan = self.maxLifespan;
    self.generateDirection();
  }

  self.update = function() {
    var alpha = 1.0;
    var uplimit = 0.6 * self.maxLifespan;
    var downlimit = 0.4 * self.maxLifespan;
    if (self.lifespan > uplimit) {
      alpha = 1 - (self.lifespan - uplimit) / (self.maxLifespan - uplimit);
    } else if (self.lifespan < downlimit) {
      alpha = self.lifespan / downlimit;
    }
    self.super.mesh.shader.color[3] = alpha;
    self.translate(dir);
    
    self.lifespan--;
    if (self.lifespan < 0) {
      self.alive = false;
    }
  }

  var dir;

  return self;
}

function DotGenerator(toffset) {
  var self = object();

  self.game;
  self.world;

  self.enemy;

  self.init = function(game, world) {
    self.game = game;
    self.world = world;

    return self;
  }

  self.update = function() {
    if (!self.dot || !self.dot.alive) {
      self.spawnDot();
    }
  }

  self.render = function() {}

  self.spawnDot = function() {
    if (!self.dot) {
      self.dot = new Dot();
      self.dot.translate(toffset);
      self.world.incomingEntities.push(self.dot);
    } else {
      self.dot.regenerate();
      mat4.identity(self.dot.transform);
      self.dot.translate(toffset);
    }
  }

  return self;
}

function Logo() {
  var self = object(new Entity());

  self.init = function(game, world) {
    self.super.init(game, world);

    var shader = new Shader();
    shader.init("/assets/shader.vs", "/assets/shader.fs");
    shader.color = quat4.create([1.0, 1.0, 1.0, 1.0]);

    // Mesh dimensions
    var xs = 1.75,
        ys = 1.75,
        zs = 1.75;
    // Create mesh
    var m = new Cube().init(xs, ys, zs).compile(shader);

    self.super.mesh = m;
    
    self.super.bbox = new Cube().init(xs, ys, zs).compile(shader);

    /******************
    /* Hardcoded logo
    /*****************/
    // Shaders
    logoShader = new Shader().init("/assets/shaderTexture.vs", "/assets/shaderTexture.fs");
    logoShader.color = quat4.create([1.0, 1.0, 1.0, 1.0]);
    // Buffers
    logoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, logoBuffer);
    // Grid
    xs = xs / 2;
    ys = ys / 2;
    zs = zs / 2;
    var vertices = [
      -xs, -ys, zs, 0, 0, 1, 0.0, 0.0,
      xs, -ys, zs, 0, 0, 1, 1.0, 0.0,
      -xs, ys, zs, 0, 0, 1, 0.0, 1.0,
      xs, -ys, zs, 0, 0, 1, 1.0, 0.0,
      -xs, ys, zs, 0, 0, 1, 0.0, 1.0,
      xs, ys, zs, 0, 0, 1, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    logoBuffer.itemSize = 8;
    logoBuffer.numItems = vertices.length / logoBuffer.itemSize;
    // Texture
    logoTexture = gl.createTexture();
    logoTexture.image = new Image();
    logoTexture.image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, logoTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, logoTexture.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.bindTexture(gl.TEXTURE_2D, null);

      logoShader.uniforms.texture0 = gl.getUniformLocation(logoShader.program, "uTexSampler0");
    }
    logoTexture.image.src = "/assets/soon_logo.png";

    return self;
  }

  self.render = function() {

    // Draw floor
    mv.pushMatrix();
      mat4.multiply(mv.matrix, self.transform, mv.matrix);

      logoShader.bind();
      gl.enableVertexAttribArray(logoShader.attributes.vertexPosition);
      gl.enableVertexAttribArray(logoShader.attributes.normalPosition);

      gl.bindBuffer(gl.ARRAY_BUFFER, logoBuffer);
      gl.vertexAttribPointer(logoShader.attributes.vertexPosition, 3, gl.FLOAT, false, logoBuffer.itemSize*4, 0);
      gl.vertexAttribPointer(logoShader.attributes.normalPosition, 3, gl.FLOAT, false, logoBuffer.itemSize*4, 3*4);
      if (logoShader.attributes.texCoord >= 0) {
        gl.enableVertexAttribArray(logoShader.attributes.texCoord);
        gl.vertexAttribPointer(logoShader.attributes.texCoord, 2, gl.FLOAT, false, logoBuffer.itemSize*4, 6*4);
      
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, logoTexture);
        gl.uniform1i(logoShader.uniforms.texture0, 0);
      }

      gl.drawArrays(gl.TRIANGLES, 0, logoBuffer.numItems);

      gl.disableVertexAttribArray(logoShader.attributes.vertexPosition);
      gl.disableVertexAttribArray(logoShader.attributes.normalPosition);
      if (logoShader.attributes.texCoord >= 0) {
        gl.disableVertexAttribArray(logoShader.attributes.texCoord);
      }
    mv.popMatrix();

    self.super.render();
  }

  var logoBuffer;
  var logoTexture;
  var logoShader;

  return self;
}

function LogoGame() {
  var self = object(new Game());
  
  self.initSettings = function() {
    self.super.width = 640;
    self.super.height = 480;

    return self;
  }

  self.init = function() {
    self.super.init();

    self.changeWorld(new LogoLevel());

    return self;
  }

  self.update = function() {
    self.super.update();

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

    game = new LogoGame().init(canvas).run();
}
