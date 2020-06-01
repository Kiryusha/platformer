export default {
  vertexShaderSource: `
    attribute vec4 aPosition;

    void main() {
      gl_Position = aPosition;
    }
  `,
  fragmentShaderSource: `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1, 0, 0.5, 1);
    }
  `,
};
