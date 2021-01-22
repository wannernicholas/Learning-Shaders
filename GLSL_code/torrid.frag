#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main(){
    vec2 coord = (gl_FragCoord.xy -.5 *u_resolution)/ u_resolution.y;

    float time = u_time*.2;
    coord*= mat2(cos(time),-sin(time),sin(time),cos(time));
    vec3 ro =  vec3(0.0, 0.0,-1.0);
    vec3 lookat =mix(vec3(0),vec3(-1.0,0,-1.0),sin(time*1.56)*.5 +.5); //vec3(0.0);
    float zoom = mix(0.2,0.7,sin(time)*.5+.5);

    vec3 f = normalize(lookat - ro);
    vec3 r = normalize(cross(vec3(0.0,1.0,0.0),f));
    vec3 u = cross(f,r);
    vec3 c = ro+f*zoom;
    vec3 i = c+ coord.x * r + coord.y * u;
    vec3 rd = normalize(i-ro);

    float radius = .75;//mix(.3, 1.5 , sin(time*.4)*.5 + .5);
    float dS,dO;
    vec3 p;
    for(int i =0; i < 100; i ++){
        p = ro+ rd*dO;
        dS = -(length(vec2(length(p.xz)-1.0,p.y)) -radius);
        if(dS < 0.001) break;
        dO+=dS;
    }
    vec3 col = vec3(0);
    float bands;
    
    if(dS<.001){
        float x = atan(p.x,p.z)+time*.5;
        float y = atan(length(p.xz)-1.0,p.y);
        float bands= sin(y*10.0 +x*30.0);
        float ripples= sin((x*10.0 -y*30.0)*3.0)*.5 +.5;
        
        float waves= sin(x -y*6.0+time*20.0) ;

        float b1 = smoothstep(-.2,.2,bands);
        float b2 = smoothstep(-.2,.2,bands-.5);
        
        float m= b1 * (1.-b2);
        m= max(m,ripples*b2* max(0.0,waves));
        m+= max(0.0,waves*.3 * b2);
        col+=mix(m,1.0-m,smoothstep(-.3,.3, sin(x*2.0+time)));
        //col+=waves;
    }
    //col+=bands;
    col+=bands;
    //col += vec3(col + coord.y, col + coord.x,  col + cos(u_time) + sin(u_time));
    //col += vec3(sin(u_time), 0, col+cos(u_time)+sin(u_time));
    //col = rd;
    gl_FragColor= vec4(col,1.0);
}
