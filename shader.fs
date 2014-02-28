precision highp float;


varying vec4 vertexPosEye;
varying vec4 normalEye;

uniform vec3 uLightPos0;
uniform vec3 uLightColor0;
uniform vec3 uColor;

void main(void) {
    vec3 N = normalize(normalEye.xyz);
    //vec3 L = normalize(gl_LightSource[0].position.xyz - vertexPosEye.xyz);
    vec3 lightSource = vec3(0.0, 10.0, 3.0);
    vec3 L = normalize(uLightPos0 - vertexPosEye.xyz);
    float diffuse = max(0.0, dot(N, L));
    vec3 shadow = uLightColor0;
    gl_FragColor = vec4(uColor *diffuse *shadow, 1.0);
}
