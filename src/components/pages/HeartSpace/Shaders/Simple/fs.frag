varying vec3 vPos;

void main () {
  gl_FragColor = vec4(vec3(vPos), 1.0);
}