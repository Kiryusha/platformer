export default {
  vertexShaderSource: `
    attribute vec2 aPosition;
    attribute vec2 aTextureCoord;

    uniform vec2 uResolution;
    uniform vec2 uTranslation;
    uniform vec2 uRotation;
    uniform vec2 uScale;

    uniform mat4 uTextureMatrix;

    varying vec2 vTextureCoord;

    void main() {
      // Scale the position
      vec2 scaledPosition = aPosition * uScale;

      // Rotate the position
      vec2 rotatedPosition = vec2(
        scaledPosition.x * uRotation.y + scaledPosition.y * uRotation.x,
        scaledPosition.y * uRotation.y - scaledPosition.x * uRotation.x
      );

      // Add in the translation.
      vec2 position = rotatedPosition + uTranslation;

      // convert the position from pixels to clipspace
      vec2 clipSpace = ((position / uResolution) * 2.0) - 1.0;

      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

      vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0, 1)).xy;
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
