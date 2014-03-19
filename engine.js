/*******************************************************
 *******************************************************
 * Utils
 *******************************************************
 ******************************************************/

/**
 * Inheritance
 * This model is based on Douglas Crockford's power constructor
 * With this, function are not constructors anymore, and so the new
 * operator is not needed. We will still use it in our code in case
 * the inheritance model is changed.
 */
function object(o) {
  function F() { };
  if (o) {
    F.prototype = o;
    var n = new F();
    n.super = o;
    o.vself = n;
    n.vself = n;
    return n;
  } else {
    var n = new F();
    n.vself = n;
    return n;
  }
}

function loadFile(path) {
    var xhr = new XMLHttpRequest;
    xhr.open("get", path, false /* synchronous */);
    xhr.send(null);
    if (xhr.readyState == 4) {
      return text = xhr.responseText;
    }

    return null;
}

function generateArrayWithInitializer(length, generate) {
  var array = new Array(length);
  for (var i = 0; i < length; i++) {
    array[i] = generate();
  }

  return array;
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

/*******************************************************
 *******************************************************
 * Webgl base
 *******************************************************
 ******************************************************/

var DEBUG = false;

var gl;
var WebGl = {
  game: null,
  input: new Input(),
  canvas: null,
  init: function() {
    try {
      gl = canvas.getContext("experimental-webgl", { antialias:true });
      if (WebGl.game.width)
        canvas.width = WebGl.game.width;
      if (WebGl.game.height)
        canvas.height = WebGl.game.height;
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL");
    }

    var self = WebGl;
    document.onkeydown = function(event) { 
      self.input.onKeyPressed(event.keyCode);
    };
    document.onkeyup = function(event) {
      self.input.onKeyReleased(event.keyCode);
    };
    document.onmousedown = function(event) {
      self.input.onMouseDown(event);
    }
    document.onmouseup = function(event) {
      self.input.onMouseUp(event);
    }
    document.onmousemove = function(event) {
      self.input.onMouseMove(event);
    }
  },

  run: function() {
    setInterval(WebGl.step, 1000/30);
  },

  step: function() {
    WebGl.game.update();
    WebGl.game.render();
  }
}

/**
 * Modelview matrix
 */
var mv = {
  matrixStack: [],
  matrix: mat4.create(),
  pushMatrix: function() {
    var copy = mat4.create();
    mat4.set(mv.matrix, copy);
    mv.matrixStack.push(copy);
  },
  popMatrix: function() {
    if (mv.matrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mat4.set(mv.matrixStack.pop(), mv.matrix);
  },
  resetWithMatrix: function(m) {
    mv.matrixStack = [];
    mv.matrix = m;
  }
}

/**
 * Global projection matrix
 */
var p = {
  matrix: mat4.create(),
  resetWithMatrix: function(m) {
    p.matrix = m;
 }
}

/**
 * Global context matrices
 * To be updated everytime the camera is commited
 */
var global = {
  mv: mv.matrix,
  mvp: mat4.multiply(p.matrix, mv.matrix, mat4.create())
}

/**
 * Lights
 *
 * light.l[i] is { pos, color, (mvpPos) }
 */
var lights = {
  l: []
}

function Shader() {
  var self = object();

  self.program;
  self.attributes = {};
  self.uniforms = {};
  self.color;

  self.init = function(vertPathName, fragPathName) {
    var shadersData = {
      vertex: { 
        type:gl.VERTEX_SHADER,
        dataPath:vertPathName,
        compiledShader:null
      },
      fragment: { 
        type:gl.FRAGMENT_SHADER,
        dataPath:fragPathName,
        compiledShader:null
      }
    };
    for (var type in shadersData) {
      var shaderData = shadersData[type];
      var shader = gl.createShader(shaderData.type);
      var shaderText = loadFile(shaderData.dataPath);
      gl.shaderSource(shader, shaderText);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
          throw gl.getShaderInfoLog(shader);

      shaderData.compiledShader = shader;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, shadersData.vertex.compiledShader);
    gl.attachShader(shaderProgram, shadersData.fragment.compiledShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    self.program = shaderProgram;
    
    self.attributes = getDefaultAttributes(self.program);
    self.uniforms = getDefaultUniforms(self.program);

    return self;
  }

  self.bind = function() {
    gl.useProgram(self.program);

    // MVP matrices
    gl.uniformMatrix4fv(self.uniforms.pMatrix, false, p.matrix);
    gl.uniformMatrix4fv(self.uniforms.mvMatrix, false, mv.matrix);
    gl.uniformMatrix4fv(self.uniforms.mvpMatrix, false, mat4.multiply(p.matrix, mv.matrix, mat4.create()));
    gl.uniformMatrix4fv(self.uniforms.normalMatrix, false, mat4.transpose(mat4.inverse(mv.matrix, mat4.create())));

    // Lights
    for (var i = 0; i < lights.l.length; i++) {
      gl.uniform4fv(self.uniforms["lightPos" + i], lights.l[i].mvPos);
      gl.uniform4fv(self.uniforms["lightColor" + i], lights.l[i].color);
    }

    // Color
    if (!self.color) {
      self.color = quat4.create([0.598, 0.63, 0.6, 1.0]);
    }
    gl.uniform4fv(self.uniforms.color, self.color);

    return self;
  }

  // Private declarations
  var getDefaultAttributes = function(program) {
    return {
      vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
      normalPosition: gl.getAttribLocation(program, "aNormalPosition"),
      texCoord: gl.getAttribLocation(program, "aTexCoord")
    }
  }

  var getDefaultUniforms = function(program) {
    // Scene
    var uniforms = {
      pMatrix: gl.getUniformLocation(program, "uPMatrix"),
      mvMatrix: gl.getUniformLocation(program, "uMVMatrix"), 
      mvpMatrix: gl.getUniformLocation(program, "uMVPMatrix"),
      normalMatrix: gl.getUniformLocation(program, "uNormalMatrix")
    }

    // Light
    for (var i = 0; i < lights.l.length; i++) {
      uniforms["lightPos" + i] = gl.getUniformLocation(self.program, "uLightPos" + i);
      uniforms["lightColor" + i] = gl.getUniformLocation(self.program, "uLightColor" + i);
    }

    uniforms.color = gl.getUniformLocation(program, "uColor");

    return uniforms;
  }

  return self;
}

var MOUSE_KEYCODE = 0;
function Input() {
  var self = object();

  self.keyStates = [];
  self.prevKeyStates = [];
  self.currKeyStates = [];
  
  self.mouseX = 0;
  self.mouseY = 0;
  self.mouseXinc = 0;
  self.mouseYinc = 0;

  self.onKeyPressed = function(keyCode) {
    self.keyStates[keyCode] = true;
    dirtyKeys[nDirtyKeys++] = keyCode;
  };

  self.onKeyReleased = function(keyCode) {
    self.keyStates[keyCode] = false;
    dirtyKeys[nDirtyKeys++] = keyCode;
  };

  self.onMouseDown = function() {
    self.onKeyPressed(MOUSE_KEYCODE);
  }

  self.onMouseUp = function() {
    self.onKeyReleased(MOUSE_KEYCODE);
  }

  self.onMouseMove = function(event) {
    dirtyMouseX = event.clientX;
    dirtyMouseY = event.clientY;
  }

  self.update = function() {
    var nextNumDirtyKeys = 0;
    for (var i = 0; i < nDirtyKeys; i++) {
      var idx = dirtyKeys[i];
      self.prevKeyStates[idx] = self.currKeyStates[idx];
      self.currKeyStates[idx] = self.keyStates[idx];
      
      // If value has changed, consider them as dirty for next step
      if (self.currKeyStates[idx] ^ self.prevKeyStates[idx]) {
          dirtyKeys[nextNumDirtyKeys++] = idx;
      }
    }
    nDirtyKeys = nextNumDirtyKeys;

    self.mouseXinc = dirtyMouseX - self.mouseX;
    self.mouseYinc = dirtyMouseY - self.mouseY;
    self.mouseX = dirtyMouseX;
    self.mouseY = dirtyMouseY;

    return self;
  }

  self.keyCheck = function(keyCode) {
    return self.currKeyStates[keyCode];
  }

  self.keyPressed = function(keyCode) {
    return self.currKeyStates[keyCode] && !self.prevKeyStates[keyCode];
  }

  self.keyReleased = function(keyCode) {
    return !self.currKeyStates[keyCode] && self.prevKeyStates[keyCode];
  }

  // Private data
  var dirtyKeys = [];
  var nDirtyKeys = 0;
  var dirtyMouseX = self.mouseX;
  var dirtyMouseY = self.mouseY;

  return self;
}

/*******************************************************
 *******************************************************
 * View math
 *******************************************************
 ******************************************************/

function Camera() {
  var self = object();

  self.mvMatrix = mat4.create();
  self.pMatrix = mat4.create();

  self.pitchAngle;
  self.yawAngle;
  self.rollAngle;
  self.pos;

  self.target;
  self.targetOffsetTransform;

  /**
   * Stablishes this object as the current MVP matrix wrapper
   *
   * @param mat4 target Transform matrix defining the frame whose origin will be
   * the lock-on target of this camera
   *
   * @param object vv Object containing the parameters of the camera's view volume
   */
  self.init = function(vv) {
    self.pitchAngle = self.yawAngle = self.rollAngle = 0;
    self.pos = quat4.create([0, 0, 0, 1]);

    if (vv) {
      mat4.frustum(vv.xL, vv.xR, vv.yB, vv.yT, vv.N, vv.F, self.pMatrix);
    } else {
      mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, self.pMatrix);
    }

    mat4.identity(self.mvMatrix);

    return self;
  }

  /* After this call, accessing self.mvMatrix will have the same
   * effect as accessing mv.matrix (same with self.pMatrix and p.matrix)
   */
  self.activate = function() {
    mv.resetWithMatrix(self.mvMatrix);
    p.resetWithMatrix(self.pMatrix);

    return self;
  }

  self.isActive = function() {
    return mv.matrix == self.mvMatrix;
  }

  self.translate = function(t) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, t);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    vec3.add(self.pos, t);
    
    return self;
  }

  self.translateX = function(tx) {
    self.translate([tx, 0, 0]);

    return self;
  }

  self.translateY = function(ty) {
    self.translate([0, ty, 0]);

    return self;
  }

  self.translateZ = function(tz) {
    self.translate([0, 0, tz]);

    return self;
  }

  self.pitch = function(alpha) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.rotateX(m, alpha);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    self.pitchAngle += alpha;
    
    return self;
  }

  self.yaw = function(alpha) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.rotateY(m, alpha);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    self.yawAngle += alpha;

    return self;
  }

  self.poleyaw = function(alpha) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.rotateX(m, self.pitchAngle);
    mat4.rotateY(m, alpha);
    mat4.rotateX(m, -self.pitchAngle);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    // uh?
    self.yawAngle += alpha;

    return self;
  }

  self.roll = function(alpha) {
    var m = mat4.create();
    mat4.identity(m);
    mat4.rotateZ(m, alpha);
    mat4.multiply(m, self.mvMatrix, self.mvMatrix);

    self.rollAngle += alpha;

    return self;
  }

  self.orbitatepitch = function(alpha) {
    mat4.rotateX(self.mvMatrix, alpha);
    self.pitchAngle += alpha;

    return self;
  }

  self.orbitatepoleyaw = function(alpha) {
    mat4.rotateX(self.mvMatrix, -self.pitchAngle);
    mat4.rotateY(self.mvMatrix, alpha);
    mat4.rotateX(self.mvMatrix, self.pitchAngle);

    self.yawAngle += alpha;

    return self;
  }

  self.orbitateyaw = function(alpha) {
    mat4.rotateY(self.mvMatrix, alpha);
    self.yawAngle += alpha;

    return self;
  }

  self.orbitateroll = function(alpha) {
    mat4.rotateZ(self.mvMatrix, alpha);
    self.rollAngle += alpha;

    return self;
  }  

  self.lockOn = function(transform, offsetTransform) {
    self.target = transform;
    self.targetOffsetTransform = offsetTransform;

    return self;
  }

  self.lockOff = function() {
    self.target = null;

    return self;
  }

  self.commit = function() {
    if (self.target) {
      mat4.inverse(self.target, self.mvMatrix);
      mat4.multiply(self.targetOffsetTransform, self.mvMatrix, self.mvMatrix);
    } else {
      // nothing to do here, really
    }

    // Compute global params
    global.mv = mv.matrix;
    global.mvp = mat4.multiply(p.matrix, mv.matrix, global.mvp);

    // Lights
    for (var i = 0; i < lights.l.length; i++) {
      lights.l[i].mvPos = mat4.multiplyVec4(global.mv, lights.l[i].pos, quat4.create());
      lights.l[i].mvpPos = mat4.multiplyVec4(global.mvp, lights.l[i].pos, quat4.create());
    }

    return self;
  }

  return self;
}


/*******************************************************
 *******************************************************
 * Game arquitecture
 *******************************************************
 ******************************************************/

function Game() {
  var self = object();

  self.width;
  self.height;
  self.world;
  self.input;

  self.initSettings = function() {
    self.width = 640;
    self.height = 480;

    return self;
  }
    
  self.init = function(canvas) {
    self.vself.initSettings();
    WebGl.game = self;
    WebGl.canvas = self;
    WebGl.init();
    self.input = WebGl.input;

    return self;

  }

  self.update = function() {
    self.input.update();
    self.world.update();

    return self;
  }

  self.render = function() {
    self.world.render();

    return self;
  }

  self.changeWorld = function(world) {
    world.init(self);
    self.world = world;

    return self;
  }

  self.run = function() {
    WebGl.run();

    return self;
  }

  return self;
}

function GameState() {
  var self = object();

  self.game;
  self.camera;

  self.entities = [];
  self.incomingEntities = [];
  self.outgoingEntities = [];

  self.timers = [];

  self.init = function(game) {
    self.game = game;
    self.camera = new Camera();

    return self;
  }

  self.update = function() {
    for (var i = 0; i < self.timers.length; i++) {
      if (!isNaN(self.timers[i]) || self.timers[i] >= 0) {
        self.timers[i]--;
        if (self.timers[i] < 0) {
          self.vself.onTimer(i);
        }
      }
    }

    for (var i = 0; i < self.incomingEntities.length; i++) {
      self.incomingEntities[i].init(game, self);
      self.entities.push(self.incomingEntities[i]);
    }
    self.entities = self.entities.filter(function (i) { return self.outgoingEntities.indexOf(i) < 0; });
    self.incomingEntities = [];
    self.outgoingEntities = [];

    for (var i = 0; i < self.entities.length; i++) {
      self.entities[i].update();
    }

    return self;
  }

  self.render = function() {
    self.camera.commit();
    return self;
  }

  self.onTimer = function() {}

  return self;
}

var TYPE_ENTITY = 'e';
function Entity() {
  var self = object();

  self.game;
  self.world;
  self.mesh;
  self.shader;
  self.bbox;

  self.transform = mat4.identity(mat4.create());
  self.pitchAngle = 0;
  self.yawAngle = 0;
  self.rollAngle = 0;
  self.pos = quat4.create([0, 0, 0, 1]);

  self.timers = [];

  self.type;

  self.init = function(game, world) {
    self.game = game;
    self.world = world;

    self.type = TYPE_ENTITY; // entity

    return self;
  }

  self.update = function() {
    for (var i = 0; i < self.timers.length; i++) {
      if (!isNaN(self.timers[i]) || self.timers[i] >= 0) {
        self.timers[i]--;
        if (self.timers[i] < 0) {
          self.vself.onTimer(i);
        }
      }
    }

    return self;
  }

  self.render = function() {
    if (DEBUG && self.bbox) {
      self.bbox.bind();
      self.bbox.compile(self.bbox.shader);
      self.bbox.render();
      self.bbox.unbind();

      return self;
    }

    mv.pushMatrix();
      mat4.multiply(mv.matrix, self.transform, mv.matrix);

      if (self.mesh) {
        self.mesh.render();
      }

    mv.popMatrix();

    return self;
  }

  self.onCollide = function() {}

  self.onTimer = function(i) {}

  self.translate = function(t) {
    mat4.translate(self.transform, t);
    vec3.add(self.pos, t);

    return self;
  }

  self.translateX = function(tx) {
    self.translate([tx, 0, 0]);

    return self;
  }

  self.translateY = function(ty) {
    self.translate([0, ty, 0]);

    return self;
  }

  self.translateZ = function(tz) {
    self.translate([0, 0, tz]);

    return self;
  }

  self.pitch = function(alpha) {
    mat4.rotateX(self.transform, alpha);
    self.pitchAngle += alpha;

    return self;
  }

  self.poleyaw = function(alpha) {
    mat4.rotateX(self.transform, -self.pitchAngle);
    mat4.rotateY(self.transform, alpha);
    mat4.rotateX(self.transform, self.pitchAngle);

    self.yawAngle += alpha;

    return self;
  }

  self.yaw = function(alpha) {
    mat4.rotateY(self.transform, alpha);
    self.yawAngle += alpha;

    return self;
  }

  self.roll = function(alpha) {
    mat4.rotateZ(self.transform, alpha);
    self.rollAngle += alpha;

    return self;
  }

  self.copyTransform = function(entity) {
    self.transform = mat4.set(entity.transform, mat4.create());

    self.pitchAngle = entity.pitchAngle;
    self.yawAngle = entity.yawAngle;
    self.rollAngle = entity.rollAngle;

    self.pos = quat4.set(entity.pos, quat4.create());

    return self;
  }

  return self;
}
