export default {
  vertexShaderSource: `
  attribute vec4 aPosition;

  uniform vec2 uResolution;

  void main() {
    // convert the position from pixels to clipspace
    vec2 clipSpace = ((aPosition.xy / uResolution) * 2.0) - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
  `,
  fragmentShaderSource: `
    precision mediump float;

    uniform vec4 uColor;

    void main() {
      gl_FragColor = uColor;
    }
  `,
};
