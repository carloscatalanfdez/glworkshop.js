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

function generateArrayWithDefaultObject(length, Object) {
  var array = new Array(length);
  for (var i = 0; i < length; i++) {
    array[i] = new Object();
  }

  return array;
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

function Vector4(x, y, z, w) {
  var self = object();

  self.x = x || 0;
  self.y = y || 0;
  self.z = z || 0;
  self.w = w || 0;
  
  self.get = function(idx) {
    switch(idx) {
      case 0: return self.x;
      case 1: return self.y;
      case 2: return self.z;
      case 3: return self.w;
      default: return 0;
    }
  }

  self.set = function(idx, value) {
    switch(idx) {
      case 0: self.x = value;
      case 1: self.y = value;
      case 2: self.z = value;
      case 3: self.w = value;
    }
  }

  return self;
}

function Face() {
  var self = object();

  self.vertexNormalPairs;

  self.init = function(nvertex) {
    self.vertexNormalPairs = generateArrayWithDefaultObject(
      nvertex, 
      function() {
        var self = object();
        self.vertex;
        self.normal;
        return self;
      });
  }

  self.nextVertex = function(idx) {
    return (idx + 1) % self.vertexNormalPairs.length;
  }

  self.computeNormal = function(vertexPool) {
    
    var out = new Vector4(0, 0, 0, 0);
    for (var i = 0; i < self.vertexNormalPairs.length; i++) {
        var ni = self.nextVertex(i);
        // (yi - suc(yi))*(zi + suc(zi)
        out.x += (vertexPool[self.vertexNormalPairs[i].vertex].y - vertexPool[self.vertexNormalPairs[ni].vertex].y) *
                    (vertexPool[self.vertexNormalPairs[i].vertex].z + vertexPool[self.vertexNormalPairs[ni].vertex].z);

        // (zi - suc(zi))*(xi + suc(xi)
        out.y += (vertexPool[self.vertexNormalPairs[i].vertex].z - vertexPool[self.vertexNormalPairs[ni].vertex].z) *
                    (vertexPool[self.vertexNormalPairs[i].vertex].x + vertexPool[self.vertexNormalPairs[ni].vertex].x);

        // (xi - suc(xi))*(yi + suc(yi)
        out.z += (vertexPool[self.vertexNormalPairs[i].vertex].x - vertexPool[self.vertexNormalPairs[ni].vertex].x) *
                    (vertexPool[self.vertexNormalPairs[i].vertex].y + vertexPool[self.vertexNormalPairs[ni].vertex].y);
    }

   	return out;
  }

  self.computeCenter = function(vertexPool) {
    // TODO: test
    var center = new Vertex4(0, 0, 0, 1);
    var nvertex = self.vertexNormalPairs.length;
    for (var i = 0; i < nvertex; i++) {
        center.x += vertexPool[self.vertexNormalPairs[i].vertex].x;
        center.y += vertexPool[self.vertexNormalPairs[i].vertex].y;
        center.z += vertexPool[self.vertexNormalPairs[i].vertex].z;
    }

    center.x /= nvertex;
    center.y /= nvertex;
    center.z /= nvertex;
        
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
    self.vertexPool = generateArrayWithDefaultObject(nvertex, Vector4);
    self.normalPool = generateArrayWithDefaultObject(nnormals, Vector4);
    self.faces = generateArrayWithDefaultObject(nnormals, Face);
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
                self.compiledVertex[n + k] = self.vertexPool[iV].get(k);
                self.compiledVertex[n + k + 3] = self.normalPool[iN].get(k);
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
 * Game arquitecture
 *******************************************************
 ******************************************************/

function GameState() {
  var self = object();

  self.game;
  self.init = function() {
  }

  self.update = function() {
  }

  self.render = function() {
  }

  return self;
}

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

/*******************************************************
 *******************************************************
 * Game implementation
 *******************************************************
 ******************************************************/

function Level() {
  var self = object(new GameState());

  self.init = function() {
    self.super.init();
    
    // Shaders
    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.bind();
    shaderProgram = shader.program;
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.normalPositionAttribute = gl.getAttribLocation(shaderProgram, "aNormalPosition");
    console.log(shaderProgram);
    console.log(shaderProgram.vertexPositionAttribute);
    console.log(shaderProgram.normalPositionAttribute);
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


    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
       1.0,  1.0,  0.0, 0.0, 0.0, 0.0,
      -1.0,  1.0,  0.0, 0.0, 0.0, 0.0,
       1.0, -1.0,  0.0, 0.0, 0.0, 0.0,
      -1.0, -1.0,  0.0, 0.0, 0.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 6;
    squareVertexPositionBuffer.numItems = 4;

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
 
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
    
    mat4.translate(mvMatrix, [-1.5 + x, 0.0 + y, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 6*4, 0);
    gl.vertexAttribPointer(shaderProgram.normalPositionAttribute, 3, gl.FLOAT, false, 6*4, 3*4);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 6*4, 0);
    gl.vertexAttribPointer(shaderProgram.normalPositionAttribute, 3, gl.FLOAT, false, 6*4, 3*4);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);    

    mat4.translate(mvMatrix, [3.0 + 2.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, m.compiledVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 6 * 4, 0);
    gl.vertexAttribPointer(shaderProgram.normalPositionAttribute, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, m.compiledVertexBuffer.numItems);
  }

  // Private
  var mvMatrix = mat4.create();
  var pMatrix = mat4.create();
  var triangleVertexPositionBuffer;
  var squareVertexPositionBuffer;

  var setMatrixUniforms = function() {
      gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
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

    if (self.input.keyPressed(83)) {
      console.log("pressed");
    }
    if (self.input.keyReleased(83)) {
      console.log("released");
    }
    if (self.input.keyCheck(83)) {
      console.log("down");
    }
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
  m.vertexPool[0] = new Vector4(-0.5, -0.5, -0.5, 1);
  m.vertexPool[1] = new Vector4(-0.5, -0.5, 0.5, 1);
  m.vertexPool[2] = new Vector4(-0.5, 0.5, -0.5, 1);
  m.vertexPool[3] = new Vector4(-0.5, 0.5, 0.5, 1);
  m.vertexPool[4] = new Vector4(0.5, -0.5, -0.5, 1);
  m.vertexPool[5] = new Vector4(0.5, -0.5, 0.5, 1);
  m.vertexPool[6] = new Vector4(0.5, 0.5, -0.5, 1);
  m.vertexPool[7] = new Vector4(0.5, 0.5, 0.5, 1);

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
