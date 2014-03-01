precision highp float;

varying vec4 vertexPosEye;
varying vec4 normalEye;
varying vec2 texCoord;

uniform sampler2D uTexSampler0;

uniform vec3 uLightPos0;
uniform vec3 uLightColor0;
uniform vec3 uColor;

void main(void) {
    vec4 colorMap  = texture2D(uTexSampler0, texCoord.xy);

    vec3 N = normalize(normalEye.xyz);
    vec3 L = normalize(uLightPos0 - vertexPosEye.xyz);
    float diffuse = max(0.0, dot(N, L));
    vec3 shadow = uLightColor0;
    gl_FragColor = vec4(uColor *colorMap.xyz *diffuse *shadow, 1.0);
}
