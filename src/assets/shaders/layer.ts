export default {
  vertexShaderSource: `
    attribute vec2 aPosition;
    attribute vec2 aTextureCoord;

    uniform vec2 uResolution;
    uniform vec2 uTranslation;
    uniform vec2 uScale;

    uniform int uTilesAmount;

    #define numTextures 144

    uniform mat3 uTextureMatrix[numTextures];

    varying vec4 vTexture;

    uniform sampler2D uTexture;

    void main() {
      // Scale the position
      vec2 scaledPosition = aPosition * uScale;

      // Add in the translation.
      vec2 position = scaledPosition;

      // convert the position from pixels to clipspace
      vec2 clipSpace = ((position / uResolution) * 2.0) - 1.0;

      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

      for (int i = 0; i < numTextures; ++i) {
        vTexture += vec4(0);
      }
    }
  `,
  fragmentShaderSource: `
    precision mediump float;

    varying vec4 vTexture;

    void main() {
      gl_FragColor = vTexture;
    }
  `,
};
