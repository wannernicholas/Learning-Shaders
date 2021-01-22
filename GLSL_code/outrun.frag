#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;

float getHeight(float x){
    //return sin(x);  Just A sign wave
    float buildings;
    buildings = .5*sign(sin(-x*3.6)+.6);
    buildings += .8*sign(sin(x*4.6)+.2);
    buildings += .3*sign(sin(x*.4)+1.);
    buildings += .7*sign(sin(-x*.3)+.5);
    buildings += .4*sign(sin(x*2.8)+.3);
    //buildings += .1*sign(sin(x*.5)+.9);
    buildings -= 2.3;
    return buildings*.5;
}

float grid(vec2 uv, float battery){

    vec2 size = vec2(uv.y, uv.y * uv.y * 0.2) * 0.01;
    uv += vec2(0.0, (.6*u_time) * 4.0 * (battery + 0.05));
    uv = abs(fract(uv) - 0.5);
 	vec2 lines = smoothstep(size, vec2(0.0), uv);
 	lines += smoothstep(size * 5.0, vec2(0.0), uv) * 0.4 * battery;
    return clamp(lines.x + lines.y, 0.0, 3.0);
}
float Hash21(vec2 p){
    p = fract(p*vec2(234.45,765.34));
    p+= dot(p,p+547.123);
    return fract(p.x *p.y);
}
float TaperBox(vec2 p , float wb, float wt, float yb, float yt,float blur){
    float m = smoothstep(-blur,blur ,p.y - yb);
    m *= smoothstep(blur,-blur ,p.y - yt);
    p.x = abs(p.x);
    //returns 0 where p.y = yb, 1 p.y = yt
    float w = mix(wb,wt,(p.y-yb) /(yt-yb));
    m*=smoothstep(blur,-blur ,p.x - w);
    
    //m*=smoothstep(-blur,blur ,p.x - yt);
    return m;
}

float moon(vec2 uv,float blur){
    float moon = smoothstep(.01,-.01,length(uv-vec2(1.8,1.6))-.65);
    vec2 pos = vec2(uv.x-1.5,uv.y-1.8);
    moon *= 1.-TaperBox(pos, 1.03,1.03, -0.025,0.025, blur);
    pos.y +=.2;
    moon *= 1.-TaperBox(pos, 1.03,1.03, -0.025,0.025, blur);
    pos.y +=.2;
    moon *= 1.-TaperBox(pos, 1.03,1.03, -0.025,0.025, blur);
    pos.y +=.2;
    moon *= 1.-TaperBox(pos, 1.03,1.03, -0.025,0.025, blur);
    pos.y +=.2;
    moon *= 1.-TaperBox(pos, 1.03,1.03, -0.025,0.025, blur);
    return moon;
}

void main(){
    vec2 uv = (gl_FragCoord.xy - .5*u_resolution.xy) / u_resolution.y; 
    //uv.x += u_time*.1;
    uv*=5.0;
    vec3 col = vec3(0.0);
    vec3 colorA = vec3(0.7451, 0.3686, 0.7137);
    vec3 colorB = vec3(0.8196, 0.5882, 0.5882);
    vec3 pct = vec3(uv.y +(.15*sin(u_time)));
   // vec3 test = vec3(uv.y);
    float blur = .005;

    vec3 test =  mix(colorA, colorB, pct);
    col -=test;
    
    float t = u_time*.2;
    float twinkle = dot(length(sin(uv+t)), length(cos(uv.y+uv.x*vec2(22,6.7)-t*3.)));
    float stars = pow(Hash21(uv),90.0)* twinkle;
    //col+=twinkle;
    col+= stars;

    
    
    col+=moon(uv,blur);
    
    col += smoothstep(-.005,.005,uv.y +getHeight(uv.x + (u_time*.3)));  //makes buildings
    

    if (uv.y < -0.2)
        {
          uv.y = 3.0 / (abs(uv.y + 0.2) + 0.05);
            uv.x *= uv.y * 1.0;
            float gridVal = grid(uv, 1.0);
            col = mix(col, vec3(0.2588, 0.4588, 0.5216), gridVal);
        }
    
    //col += buildings(uv);
    gl_FragColor=vec4(col,1.0);
}
