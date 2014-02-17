attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0) + vec4(aNormalPosition, 0.0);
}
