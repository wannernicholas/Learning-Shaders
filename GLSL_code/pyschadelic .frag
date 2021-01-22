#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main(){
    vec2 coord = 6.0* gl_FragCoord.xy/ u_resolution;

    for(int n = 1;n<8;n++ ){
        float i = float(n);
        coord += vec2(0.7 / i * cos(i* coord.y + u_time + 1.6 *i*.5 ) + 1.8, 0.35 / i* cos( coord.x - u_time + 0.3 * i) +.4);

    }

    coord *= vec2(0.7 / cos(coord.y + u_time + 0.3) + 0.8, 0.4 / 1.-sin(coord.x + u_time + 0.3) +1.6);
    vec3 color = vec3(0.5* sin(coord.x) +0.5, 0.5 * 1.-sin(coord.y) + 0.5, cos(coord.x + coord.y));
    
    gl_FragColor = vec4(color,1.0);
}
