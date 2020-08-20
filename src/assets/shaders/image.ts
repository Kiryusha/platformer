export default {
  vertexShaderSource: `
    attribute vec2 aPosition;

    uniform vec2 uResolution;
    uniform vec2 uTranslation;
    uniform vec2 uScale;

    uniform mat3 uTextureMatrix;

    varying vec2 vTextureCoord;

    void main() {
      // Scale the position
      vec2 scaledPosition = aPosition * uScale;

      // Add in the translation.
      vec2 position = scaledPosition + uTranslation;

      // convert the position from pixels to clipspace
      vec2 clipSpace = ((position / uResolution) * 2.0) - 1.0;

      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

      vTextureCoord = (uTextureMatrix * vec3(aPosition, 1)).xy;
    }
  `,
  fragmentShaderSource: `
    precision mediump float;

    uniform sampler2D uTexture;

    varying vec2 vTextureCoord;

    void main() {
      gl_FragColor = texture2D(uTexture, vTextureCoord);
    }
  `,
};
