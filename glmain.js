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
    n = new F();
    n.super = o;
    return n;
  } else {
    return new F();
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

var gl;
var WebGl = {
  game: null,
  input: new Input(),
  canvas: null,
  init: function() {
    try {
      gl = canvas.getContext("experimental-webgl");
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
 * Global modelview matrix
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
    // mv.matrix = mv.matrixStack.pop();
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

function Shader() {
  var self = object();

  self.program;
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
  }

  self.bind = function() {
    gl.useProgram(self.program);
  }

  return self;
}

function Input() {
  var self = object();

  self.keyStates = [];
  self.prevKeyStates = [];
  self.currKeyStates = [];

  self.onKeyPressed = function(keyCode) {
    self.keyStates[keyCode] = true;
    dirtyKeys[nDirtyKeys++] = keyCode;
  };
  self.onKeyReleased = function(keyCode) {
    self.keyStates[keyCode] = false;
    dirtyKeys[nDirtyKeys++] = keyCode;
  };

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

  return self;
}

/*******************************************************
 *******************************************************
 * Geometry
 *******************************************************
 ******************************************************/

function Face() {
  var self = object();

  self.vertexNormalPairs;

  self.init = function(nvertex) {
    self.vertexNormalPairs = generateArrayWithInitializer(nvertex, function() { return {} });
  }

  self.nextVertex = function(idx) {
    return (idx + 1) % self.vertexNormalPairs.length;
  }

  self.computeNormal = function(vertexPool) {
    
    var out = quat4.create(); out[0] = out[1] = out[2] = out[3] = 0;
    for (var i = 0; i < self.vertexNormalPairs.length; i++) {
        var ni = self.nextVertex(i);
        // (yi - suc(yi))*(zi + suc(zi))
        out[0] += (vertexPool[self.vertexNormalPairs[i].vertex][1] - vertexPool[self.vertexNormalPairs[ni].vertex][1]) *
                    (vertexPool[self.vertexNormalPairs[i].vertex][2] + vertexPool[self.vertexNormalPairs[ni].vertex][2]);

        // (zi - suc(zi))*(xi + suc(xi))
        out[1] += (vertexPool[self.vertexNormalPairs[i].vertex][2] - vertexPool[self.vertexNormalPairs[ni].vertex][2]) *
                    (vertexPool[self.vertexNormalPairs[i].vertex][0] + vertexPool[self.vertexNormalPairs[ni].vertex][0]);

        // (xi - suc(xi))*(yi + suc(yi))
        out[2] += (vertexPool[self.vertexNormalPairs[i].vertex][0] - vertexPool[self.vertexNormalPairs[ni].vertex][0]) *
                    (vertexPool[self.vertexNormalPairs[i].vertex][1] + vertexPool[self.vertexNormalPairs[ni].vertex][1]);
    }

   	return out;
  }

  self.computeCenter = function(vertexPool) {
    // TODO: test
    var center = quat4.create(); out[0] = out[1] = out[2] = 0; out[3] = 1;
    var nvertex = self.vertexNormalPairs.length;
    for (var i = 0; i < nvertex; i++) {
        center[0] += vertexPool[self.vertexNormalPairs[i].vertex][0];
        center[1] += vertexPool[self.vertexNormalPairs[i].vertex][1];
        center[2] += vertexPool[self.vertexNormalPairs[i].vertex][2];
    }

    center[0] /= nvertex;
    center[1] /= nvertex;
    center[2] /= nvertex;
        
    return center;
  }

  return self;
}


function Mesh() {
  var self = object();

  self.vertexPool;
  self.normalPool;
  self.faces;

  self.compiledVertex;
  self.compiledVertexBuffer;

  self.init = function(nvertex, nnormals) {
    self.vertexPool = generateArrayWithInitializer(nvertex, function() { return quat4.create() });
    self.normalPool = generateArrayWithInitializer(nnormals, function() { return quat4.create() });
    self.faces = generateArrayWithInitializer(nnormals, function() { return new Face(); });
  }

  self.computeNormals = function() {
    for (var i = 0; i < self.faces.length; i++) {
      self.normalPool[i] = self.faces[i].computeNormal(self.vertexPool);
      for (var j = 0; j < self.faces[i].vertexNormalPairs.length; j++) {
        self.faces[i].vertexNormalPairs[j].normal = i;
      }
    }

  }

  self.compile = function(shader) {

    var compiledVertexCount = 0;
    for (var i = 0; i < self.faces.length; i++) {
      for (var j = 0; j < self.faces[i].vertexNormalPairs.length; j++) {
        compiledVertexCount++;
      }
    }

    self.compiledVertex = new Array(compiledVertexCount * 6); // 3 vertex, 3 normal
    var n = 0;
    for (var i = 0; i < self.faces.length; i++) {
        for (var j = 0; j < self.faces[i].vertexNormalPairs.length; j++) {
            var iV = self.faces[i].vertexNormalPairs[j].vertex;
            var iN = self.faces[i].vertexNormalPairs[j].normal;
            for (var k = 0; k < 3; k++) {
                self.compiledVertex[n + k] = self.vertexPool[iV][k];
                self.compiledVertex[n + k + 3] = self.normalPool[iN][k];
            }
            n += 6;
        }
    }

    self.compiledVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, self.compiledVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(self.compiledVertex), gl.STATIC_DRAW);
    self.compiledVertexBuffer.itemSize = 6;
    self.compiledVertexBuffer.numItems = compiledVertexCount;
  }

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
  self.viewVolume = {};

  /**
   * Stablishes this object as the current MVP matrix wrapper
   * After this call, accessing self.mvMatrix will have the same
   * effect as accessing mv.matrix (same with self.pMatrix and p.matrix)
   */
  self.init = function() {

    // TODO: set these
    // self.eye = quat4.create([10, 10, 10, 1]);
    // var target = quat4.create([0, 0, 0, 1]);
    // self.lookAt = quat4.create(eye.sub(target));
    // self.focalLength = self.lookAt.module();
    // self.lookAt.normalize();

    self.viewVolume.N = 2;
    self.viewVolume.F = 10000;
    self.viewVolume.xR = 0.2;
    self.viewVolume.xL = - self.viewVolume.xR;
    self.viewVolume.yT = 0.2;
    self.viewVolume.yB = - self.viewVolume.yT;
    var vv = self.viewVolume;

    // mat4.frustum(vv.xL, vv.xR, vv.yT, vv.yB, vv.N, vv.F, p.matrix); // TODO: make this work
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, self.pMatrix);
    mat4.identity(self.mvMatrix);

    mv.resetWithMatrix(self.mvMatrix);
    p.resetWithMatrix(self.pMatrix);
  }

  self.translate = function(tx, ty, tz) {
    mat4.translate(mv.matrix, [tx, ty, tz]);
  }

  self.translateX = function(tx) {
    self.translate(tx, ty, tz);
  }

  self.translateX = function(ty) {
    self.translate(tx, ty, tz);
  }

  self.translateZ = function(tz) {
    self.translate(tx, ty, tz);
  }

  self.pitch = function(alpha) {
    self.rotate(mv.matrix, alpha, [1, 0, 0]);
  }

  self.yaw = function(alpha) {
    self.rotate(mv.matrix, alpha, [0, 1, 0]);
  }

  self.roll = function(alpha) {
    self.rotate(mv.matrix, alpha, [0, 0, 1]);
  }

  self.orbitate = function() {
    // TODO
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
  }
    
  self.init = function(canvas) {
    self.initSettings();
    WebGl.game = self;
    WebGl.canvas = self;
    WebGl.init();
    self.input = WebGl.input;

  }

  self.update = function() {
    self.input.update();
    self.world.update();
  }

  self.render = function() {
    self.world.render();
  }

  self.changeWorld = function(world) {
    world.game = self;
    world.init();
    self.world = world;
  }

  self.run = function() {
    WebGl.run();
  }

  return self;
}

function GameState() {
  var self = object();

  self.game;
  self.camera;
  self.init = function() {
    self.camera = new Camera();
  }

  self.update = function() {
  }

  self.render = function() {
  }

  return self;
}

function Entity() {
  var self = object();

  self.game;
  self.world;
  self.transform;
  self.mesh;

  self.camera;
  self.init = function(game, world) {
    self.game = game;
    self.world = world
    self.transform = mat4.create();
    mat4.identity(self.transform);
  }

  self.update = function() {
  }

  self.render = function() {
    mv.pushMatrix();
      mv.matrix.set(transform);

      if (self.mesh) {
        mesh.render();
      }

    mv.popMatrix();    
  }

  return self;

}

/*******************************************************
 *******************************************************
 * Game implementation
 *******************************************************
 ******************************************************/

function Level() {
  var self = object(new GameState());


  self.init = function() {
    self.super.init();

    self.camera.init();
    
    // Shaders
    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.bind();
    shaderProgram = shader.program;
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.normalPositionAttribute = gl.getAttribLocation(shaderProgram, "aNormalPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgram.normalPositionAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");    

    // // Buffers
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
       0.0,  1.0,  0.0, 0.0, 0.0, 0.0,
      -1.0, -1.0,  0.0, 0.0, 0.0, 0.0,
       1.0, -1.0,  0.0, 0.0, 0.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 6;
    triangleVertexPositionBuffer.numItems = 3;

    initBigGuy(shader);
  }

  self.update = function() {
    self.super.update();

    if (this.game.input.keyCheck(87)) {  // w
      y += 0.1;
    }
    if (this.game.input.keyCheck(65)) {  // a
      x -= 0.1;
    }
    if (this.game.input.keyCheck(83)) {  // s
      y -= 0.1;
    }
    if (this.game.input.keyCheck(68)) {  // d
      x += 0.1;
    }
  }

  self.render = function() {
    self.super.render();
 
    // Clear view
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mv.pushMatrix();
      self.camera.translate(-1.5 + x, 0, -7.0);
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 6*4, 0);
      gl.vertexAttribPointer(shaderProgram.normalPositionAttribute, 3, gl.FLOAT, false, 6*4, 3*4);
      setMatrixUniforms();
      gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    mv.popMatrix();
    
    mv.pushMatrix();
      self.camera.translate(x, 0.5, -y);
      gl.bindBuffer(gl.ARRAY_BUFFER, m.compiledVertexBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 6 * 4, 0);
      gl.vertexAttribPointer(shaderProgram.normalPositionAttribute, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
      setMatrixUniforms();
      gl.drawArrays(gl.TRIANGLES, 0, m.compiledVertexBuffer.numItems);
    mv.popMatrix();
  }

  // Private
  var triangleVertexPositionBuffer;

  var setMatrixUniforms = function() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, self.camera.pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, self.camera.mvMatrix);
  }

  var x = 0;
  var y = 0;

  return self;
}

function GameApp() {
  var self = object(new Game());
  
  self.initSettings = function() {
    self.width = 640;
    self.height = 480;
  }

  self.init = function() {
    self.super.init();

    self.changeWorld(new Level());
  }

  self.update = function() {
    self.super.update();
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

    game = new GameApp();
    game.init(canvas);
    game.run();
}


function initBigGuy(shader) {
  m = new Mesh();
  m.init(8, 12);
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

  m.computeNormals();
  m.compile(shader);
}
