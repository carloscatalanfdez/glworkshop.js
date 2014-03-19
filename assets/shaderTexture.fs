precision highp float;

varying vec4 vertexPosEye;
varying vec4 normalEye;
varying vec2 texCoord;

uniform sampler2D uTexSampler0;

uniform vec4 uLightPos0;
uniform vec4 uLightColor0;
uniform vec4 uColor;

void main(void) {
    vec4 colorMap  = texture2D(uTexSampler0, texCoord.xy);

    vec3 N = normalize(normalEye.xyz);
    vec3 L = normalize(uLightPos0.xyz - vertexPosEye.xyz);
    float diffuse = max(0.0, dot(N, L));
    vec3 shadow = uLightColor0.xyz;
    gl_FragColor = vec4(uColor.xyz *colorMap.xyz *diffuse *shadow, uColor.w);
}
