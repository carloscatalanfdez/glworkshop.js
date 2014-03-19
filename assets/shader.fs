precision highp float;

varying vec4 vertexPosEye;
varying vec4 normalEye;

uniform vec4 uLightPos0;
uniform vec4 uLightColor0;
uniform vec4 uColor;

void main(void) {
    vec3 N = normalize(normalEye.xyz);
    vec3 L = normalize(uLightPos0.xyz - vertexPosEye.xyz);
    float diffuse = max(0.0, dot(N, L));
    vec3 shadow = uLightColor0.xyz;
    gl_FragColor = vec4(uColor.xyz *diffuse *shadow, uColor.w);
}
