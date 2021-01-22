#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

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
vec4 Tree(vec2 uv,vec3 col,float blur){
    
    float m = TaperBox(uv, 0.03,0.03, -0.05,0.25, blur); //trunk
    m+= TaperBox(uv, 0.2,0.1, 0.25,0.5, blur); //canopy 1
    m+= TaperBox(uv, 0.15,0.05, 0.5,0.75, blur); //canopy 2
    m+= TaperBox(uv, 0.1,0., 0.75,1., blur); //top
    float shadow = TaperBox(uv-vec2(.2,0), .1,.5,.15,.25,blur); //trunk shadow
    shadow += TaperBox(uv+vec2(.25,0), -.1,.5,.45,.5,blur); //canopy shadow
    shadow += TaperBox(uv-vec2(.2,0), -.1,.5,.7,.75,blur); //canopy 2 shadow
    col-=shadow *.8;
    //m=1.;
    return vec4(col,m);
}
float getHeight(float x){
    return sin(x*.423) + sin(x)*.3;
}
vec4 layer(vec2 uv, float blur){
    vec4 col =vec4(0.0);
    
    //uv.y += .5;
    float id = floor(uv.x);
    float n = fract(sin(id*234.12)*5463.3)*2. -1.;
    float x=n*.3;
    float y = getHeight(uv.x);
    float ground= smoothstep(blur,-blur,uv.y+  y);
    col += ground;
    y= getHeight(id +.5+x);
    uv.x = fract(uv.x) -.5;
    
    vec4 tree = Tree((uv-vec2(x,-y))*vec2(1,1.+n*.2),vec3(1.),blur);

    //col.rg = uv;
    
    col = mix(col,tree,tree.a);
    col.a = max(ground,tree.a);
    //col -=ground;
    return col;
}
float Hash21(vec2 p){
    p = fract(p*vec2(234.45,765.34));
    p+= dot(p,p+547.123);
    return fract(p.x *p.y);
}
void main(){
    vec2 uv = (gl_FragCoord.xy - .5*u_resolution.xy) / u_resolution.xy; 
    vec2 mouse = (u_mouse.xy / u_resolution.xy)*2. - 1.;
    //uv.x += u_time *.1;
    //uv*=5.;
    float blur = .0005;
    vec4 col =vec4(0.0);
    vec4 Layer = vec4(0.);
    float t = u_time *.3;
    
    float twinkle = dot(length(sin(uv+t)), length(cos(uv*vec2(22,6.7)-t*3.)));
    float stars = pow(Hash21(uv),90.0)* twinkle;
    col+= stars;
    //col+=twinkle;
    float moon = smoothstep(.01,-.01,length(uv-vec2(.4,.2))-.15);
    col *= 1.-moon;
    moon *=smoothstep(-.01,.1,length(uv-vec2(.5,.25))-.15);
    
    col+= moon;
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));

    for(float i = 0.; i <1.; i+= 1./15.){
        float scale = mix(30.,1.,i);
        blur = mix(.05,.005,i);
        Layer =layer(uv*scale +vec2(t+i*100.,i)-mouse,blur);
        Layer =layer(uv*scale +vec2(t+i*100.,i),blur);//-mouse,blur);
        Layer.rgb *= (1.-i)*vec3(.9,.9,1.);
        //Layer = Layer * rot;
        //Layer = vec4(1,1,1,1);
        col = mix(col,Layer,Layer.a);

    }
    Layer =layer(uv +vec2(t,1)-mouse, .07);
    Layer =layer(uv +vec2(t,1), .07);

    //Layer.rbg = vec3(0,0,0);
    col = mix(col,Layer*.1,Layer.a);
    //float test= smoothstep(blur,-blur,uv.y+  getHeight(uv.x));
    //test *=1.5;
    //col +=test;
    //col+=
    //col+= tree(uv,vec3(1,1,1),blur);
    //float thickness = 1./u_resolution.y;
    //if(abs(uv.x) < thickness) col.g = 1.;
    //if(abs(uv.y) < thickness) col.r = 1.;
    gl_FragColor= vec4(col);   
}
