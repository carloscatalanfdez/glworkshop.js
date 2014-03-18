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
      gl.uniform3fv(self.uniforms["lightColor" + i], lights.l[i].color);
    }

    // Color
    if (!self.color) {
      self.color = vec3.create([0.598, 0.63, 0.6]);
    }
    gl.uniform3fv(self.uniforms.color, self.color);

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

/*
 * Vertext have to be specified clockwise by an outside party
 */
function Mesh() {
  var self = object();

  self.vertexPool;
  self.normalPool;
  self.edgePool;
  self.globalVertexPool;
  self.globalNormalPool;
  self.globalEdgePool;

  self.faces;
  self.shader;

  self.compiledVertex;
  self.compiledVertexBuffer;

  self.init = function(nvertex, nnormals) {
    self.vertexPool = generateArrayWithInitializer(nvertex, function() { return quat4.create() });
    self.normalPool = generateArrayWithInitializer(nnormals, function() { return vec3.create() });
    self.edgePool = generateArrayWithInitializer(nvertex + nnormals - 2, function() { return vec3.create() });
    self.faces = generateArrayWithInitializer(nnormals, function() { return new Face(); });

    return self;
  }

  self.computeNormals = function() {
    for (var i = 0; i < self.faces.length; i++) {
      self.normalPool[i] = self.faces[i].computeNormal(self.vertexPool);
      for (var j = 0; j < self.faces[i].vertexNormalPairs.length; j++) {
        self.faces[i].vertexNormalPairs[j].normal = i;
      }
    }

    return self;
  }

  self.computeEdges = function() {
    var nfaces = self.faces.length;
    var nvertex = self.vertexPool.length;
    var nedgespool = 0;
    for (var i = 0; i < self.faces.length; i++) {
      var face = self.faces[i];
      for (var j = 1; j < face.vertexNormalPairs.length; j++) {
        var edge = vec3.subtract(self.vertexPool[face.vertexNormalPairs[j].vertex], self.vertexPool[face.vertexNormalPairs[j-1].vertex], vec3.create());
        if (self.edgePool.indexOf(edge) < 0) {
          self.edgePool[nedgespool++] = edge;
        }
      }
    }

    return self;
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

    self.shader = shader;

    return self;
  }

  self.render = function(drawingPrimitive) {
    if (self.shader) {
      self.shader.bind();

      // Geometry attribs
      gl.bindBuffer(gl.ARRAY_BUFFER, self.compiledVertexBuffer);
      gl.enableVertexAttribArray(self.shader.attributes.vertexPosition);
      gl.enableVertexAttribArray(self.shader.attributes.normalPosition);
      gl.vertexAttribPointer(self.shader.attributes.vertexPosition, 3, gl.FLOAT, false, 6 * 4, 0);
      gl.vertexAttribPointer(self.shader.attributes.normalPosition, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

      if (!drawingPrimitive) {
        drawingPrimitive = gl.TRIANGLES;
      }

      gl.drawArrays(drawingPrimitive, 0, self.compiledVertexBuffer.numItems);
      
      gl.disableVertexAttribArray(self.shader.attributes.vertexPosition);
      gl.disableVertexAttribArray(self.shader.attributes.normalPosition);
    }

    return self;
  }

  self.collides = function(other) {
    var myLocalVertexPool = self.vertexPool;
    var myLocalNormalPool = self.normalPool;
    var myLocalEdgePool = self.edgePool;
    var otherLocalVertexPool = other.vertexPool;
    var otherLocalNormalPool = other.normalPool;
    var otherLocalEdgePool = other.edgePool;

    self.vertexPool = self.globalVertexPool;
    self.normalPool = self.globalNormalPool;
    self.edgePool = self.globalEdgePool;
    other.vertexPool = other.globalVertexPool;
    other.normalPool = other.globalNormalPool;
    other.edgePool = other.globalEdgePool;

    var intersect = true;

    // Test using self normals as separating axis
    if (intersect) {
      for (var i = 0; i < self.faces.length; i++) {
        var normal = self.normalPool[self.faces[i].vertexNormalPairs[0].normal];
        if (!intersectOnProjection(self, other, normal)) {
          intersect = false;
        }
      }
    }
    
    // Test using other normals as separating axis
    if (intersect) {
      for (var i = 0; i < other.faces.length; i++) {
        var normal = other.normalPool[other.faces[i].vertexNormalPairs[0].normal];
        if (!intersectOnProjection(other, self, normal)) {
          intersect = false;
        }
      }
    }

    // Test using the cross product of the edges as separating axis
    if (intersect) {
      for (var i = 0; i < self.edgePool.length; i++) {
        for (var j = 0; j < other.edgePool.length; j++) {
          var normal = vec3.cross(self.edgePool[i], other.edgePool[j]);
          if (!intersectOnProjection(self, other, normal)) {
            intersect = false;
          }
        }
      }
    }

    self.vertexPool = myLocalVertexPool;
    self.normalPool = myLocalNormalPool;
    self.edgePool = myLocalEdgePool;
    other.vertexPool = otherLocalVertexPool;
    other.normalPool = otherLocalNormalPool;
    other.edgePool = otherLocalEdgePool;

    return intersect;
  }

  /**
   * Computes the projection interval of this polyhedron onto the given vector (min and max projected vertices)
   */
  self.computeProjectionInterval = function(vector) {
    var max = min = null;

    // console.log("--------- vector ", logvertex(vector));
    for (var i = 0; i < self.vertexPool.length; i++) {
      projectedVertex = vec3.dot(vector, self.vertexPool[i]);
      max = max != null ? Math.max(max, projectedVertex) : projectedVertex;
      min = min != null ? Math.min(min, projectedVertex) : projectedVertex;
    }

    return [min, max];
  }

  self.generateGlobalPools = function(transform) {
    var varray = new Array(self.vertexPool.length);
    for (var i = 0; i < varray.length; i++) {
      varray[i] = mat4.multiplyVec4(transform, self.vertexPool[i], quat4.create());
    }
 
    // Store base values in tmp vars
    localVertexPool = self.vertexPool;
    localNormalPool = self.normalPool;
    localEdgePool = self.edgePool;

    // Compute global values
    self.vertexPool = varray;
    self.normalPool = new Array(self.vertexPool.length);
    self.edgePool = new Array(self.vertexPool.length);
    self.computeNormals().computeEdges();

    // Store global values
    self.globalVertexPool = varray;
    self.globalNormalPool = self.normalPool;
    self.globalEdgePool = self.edgePool;

    // Swap values back
    self.vertexPool = localVertexPool;
    self.normalPool = localNormalPool;
    self.edgePool = localEdgePool;

    return self;
  }

  self.bind = function() {
    localVertexPool = self.vertexPool;
    localNormalPool = self.normalPool;
    localEdgePool = self.edgePool;

    self.vertexPool = self.globalVertexPool;
    self.normalPool = self.globalNormalPool;
    self.edgePool = self.globalEdgePool;
  }

  self.unbind = function() {
    self.vertexPool = localVertexPool;
    self.normalPool = localNormalPool;
    self.edgePool = localEdgePool;

    localVertexPool = localNormalPool = localEdgePool = null;
  }

  var intersectOnProjection = function(polyedraA, polyedraB, vector) {
    var myInterval = polyedraA.computeProjectionInterval(vector);
    var otherInterval = polyedraB.computeProjectionInterval(vector);

    var intersection = [ Math.max(myInterval[0], otherInterval[0]), Math.min(myInterval[1], otherInterval[1])];
    return intersection[0] <= intersection[1];
  }

  var localVertexPool
    , localNormalPool
    , localEdgePool;

  return self;
}

function Cube() {
  var self = object(new Mesh());

  self.init = function(xs, ys, zs) {
    self.super.init(8, 12);

    var halfxs = xs / 2;
    var halfys = ys / 2;
    var halfzs = zs / 2;

    self.vertexPool[0] = quat4.create([-halfxs, -halfys, -halfzs, 1]);
    self.vertexPool[1] = quat4.create([-halfxs, -halfys, halfzs, 1]);
    self.vertexPool[2] = quat4.create([-halfxs, halfys, -halfzs, 1]);
    self.vertexPool[3] = quat4.create([-halfxs, halfys, halfzs, 1]);
    self.vertexPool[4] = quat4.create([halfxs, -halfys, -halfzs, 1]);
    self.vertexPool[5] = quat4.create([halfxs, -halfys, halfzs, 1]);
    self.vertexPool[6] = quat4.create([halfxs, halfys, -halfzs, 1]);
    self.vertexPool[7] = quat4.create([halfxs, halfys, halfzs, 1]);

    self.faces[0].init(3);
    self.faces[0].vertexNormalPairs[0].vertex = 4;
    self.faces[0].vertexNormalPairs[1].vertex = 6;
    self.faces[0].vertexNormalPairs[2].vertex = 5;
    self.faces[1].init(3);
    self.faces[1].vertexNormalPairs[0].vertex = 5;
    self.faces[1].vertexNormalPairs[1].vertex = 6;
    self.faces[1].vertexNormalPairs[2].vertex = 7;

    self.faces[2].init(3);
    self.faces[2].vertexNormalPairs[0].vertex = 6;
    self.faces[2].vertexNormalPairs[1].vertex = 2;
    self.faces[2].vertexNormalPairs[2].vertex = 7;
    self.faces[3].init(3);
    self.faces[3].vertexNormalPairs[0].vertex = 7;
    self.faces[3].vertexNormalPairs[1].vertex = 2;
    self.faces[3].vertexNormalPairs[2].vertex = 3;

    self.faces[4].init(3);
    self.faces[4].vertexNormalPairs[0].vertex = 2;
    self.faces[4].vertexNormalPairs[1].vertex = 0;
    self.faces[4].vertexNormalPairs[2].vertex = 3;
    self.faces[5].init(3);
    self.faces[5].vertexNormalPairs[0].vertex = 3;
    self.faces[5].vertexNormalPairs[1].vertex = 0;
    self.faces[5].vertexNormalPairs[2].vertex = 1;

    self.faces[6].init(3);
    self.faces[6].vertexNormalPairs[0].vertex = 0;
    self.faces[6].vertexNormalPairs[1].vertex = 4;
    self.faces[6].vertexNormalPairs[2].vertex = 1;
    self.faces[7].init(3);
    self.faces[7].vertexNormalPairs[0].vertex = 1;
    self.faces[7].vertexNormalPairs[1].vertex = 4;
    self.faces[7].vertexNormalPairs[2].vertex = 5;

    self.faces[8].init(3);
    self.faces[8].vertexNormalPairs[0].vertex = 7;
    self.faces[8].vertexNormalPairs[1].vertex = 3;
    self.faces[8].vertexNormalPairs[2].vertex = 5;
    self.faces[9].init(3);
    self.faces[9].vertexNormalPairs[0].vertex = 5;
    self.faces[9].vertexNormalPairs[1].vertex = 3;
    self.faces[9].vertexNormalPairs[2].vertex = 1;

    self.faces[10].init(3);
    self.faces[10].vertexNormalPairs[0].vertex = 4;
    self.faces[10].vertexNormalPairs[1].vertex = 0;
    self.faces[10].vertexNormalPairs[2].vertex = 6;
    self.faces[11].init(3);
    self.faces[11].vertexNormalPairs[0].vertex = 6;
    self.faces[11].vertexNormalPairs[1].vertex = 0;
    self.faces[11].vertexNormalPairs[2].vertex = 2;

    self.computeNormals().computeEdges();

    return self;
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
    self.initSettings();
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
  self.createEntities = [];
  self.removeEntities = [];

  self.init = function(game) {
    self.game = game;
    self.camera = new Camera();

    return self;
  }

  self.update = function() {
    for (var i = 0; i < self.createEntities.length; i++) {
      self.createEntities[i].init(game, self);
      self.entities.push(self.createEntities[i]);
    }
    self.entities = self.entities.filter(function (i) { return self.removeEntities.indexOf(i) < 0; });
    self.createEntities = [];
    self.removeEntities = [];

    for (var i = 0; i < self.entities.length; i++) {
        self.entities[i].update();
    }

    return self;
  }

  self.render = function() {
    self.camera.commit();
    return self;
  }

  return self;
}

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

  self.init = function(game, world) {
    self.game = game;
    self.world = world;

    return self;
  }

  self.update = function() {
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
