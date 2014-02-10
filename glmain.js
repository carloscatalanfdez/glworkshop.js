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

function Input() {
  this.keyStates = [];
  this.prevKeyStates = [];
  this.currKeyStates = [];

  this.onKeyPressed = function(keyCode) {
    this.keyStates[keyCode] = true;
    dirtyKeys[nDirtyKeys++] = keyCode;
  };
  this.onKeyReleased = function(keyCode) {
    this.keyStates[keyCode] = false;
    dirtyKeys[nDirtyKeys++] = keyCode;
  };

  this.update = function() {
    var nextNumDirtyKeys = 0;
    for (var i = 0; i < nDirtyKeys; i++) {
      var idx = dirtyKeys[i];
      this.prevKeyStates[idx] = this.currKeyStates[idx];
      this.currKeyStates[idx] = this.keyStates[idx];
      
      // If value has changed, consider them as dirty for next step
      if (this.currKeyStates[idx] ^ this.prevKeyStates[idx]) {
          dirtyKeys[nextNumDirtyKeys++] = idx;
      }
    }
    nDirtyKeys = nextNumDirtyKeys;
  }

  this.keyCheck = function(keyCode) {
    return this.currKeyStates[keyCode];
  }

  this.keyPressed = function(keyCode) {
    return this.currKeyStates[keyCode] && !this.prevKeyStates[keyCode];
  }

  this.keyReleased = function(keyCode) {
    return !this.currKeyStates[keyCode] && this.prevKeyStates[keyCode];
  }

  // Private data
  var dirtyKeys = [];
  var nDirtyKeys = 0;
}

function GameState() {
  this.game;
  this.init = function() {
    // Shaders
    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.bind();
    shaderProgram = shader.program;
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");   

    // Buffers
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
       0.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
       1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
       1.0, -1.0,  0.0,
      -1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
  }

  this.update = function() {
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

  this.render = function() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
    
    mat4.translate(mvMatrix, [-1.5 + x, 0.0 + y, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);


    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
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
}

function Game() {
  this.width;
  this.height;
  this.world;
  this.input;

  this.initSettings = function() {
    this.width = 640;
    this.height = 480;
  }
    
  this.init = function(canvas) {
    this.initSettings();
    WebGl.game = this;
    WebGl.canvas = this;
    WebGl.init();
    this.input = WebGl.input;

    this.changeWorld(new GameState());
  }

  this.update = function() {
    this.input.update();
    this.world.update();


    if (this.input.keyPressed(83)) {
      console.log("pressed");
    }
    if (this.input.keyReleased(83)) {
      console.log("released");
    }
    if (this.input.keyCheck(83)) {
      console.log("down");
    }
  }

  this.render = function() {
    this.world.render();
  }

  this.changeWorld = function(world) {
    world.game = this;
    world.init();
    this.world = world;
  }

  this.run = function() {
    WebGl.run();
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

function Shader() {
  this.program;
  this.init = function(vertPathName, fragPathName) {
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
    this.program = shaderProgram;
  }

  this.bind = function() {
    gl.useProgram(this.program);
  }
}


function initGL(canvas) {
}

function initShaders() {
    var shader = new Shader();
    shader.init("shader.vs", "shader.fs");
    shader.bind();

    shaderProgram = shader.program;

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function main() {
    var canvas = document.getElementById("canvas");

    // TODO: Game inheritance
    var game = new Game();
    game.init(canvas);
    game.run();
}
