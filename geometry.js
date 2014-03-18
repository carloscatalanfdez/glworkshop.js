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
