export default {
  vertexShaderSource: `
    #define maxTextures 144

    attribute vec2 aPosition;

    uniform vec2 uTextureCoord[maxTextures];
    uniform vec2 uResolution;
    uniform vec2 uTranslation;
    uniform vec2 uScale;
    uniform mat3 uTextureMatrix[maxTextures];
    uniform int uTilesAmount;
    uniform sampler2D uTexture;

    varying vec4 vTexture;

    void main() {
      // Scale the position
      vec2 scaledPosition = aPosition * uScale;

      // Add in the translation.
      vec2 position = scaledPosition;

      // convert the position from pixels to clipspace
      vec2 clipSpace = ((position / uResolution) * 2.0) - 1.0;

      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

      for (int i = 0; i < maxTextures; ++i) {
        if (i <= uTilesAmount) {
          vTexture += texture2D(uTexture, (uTextureMatrix[i] * vec3(uTextureCoord[i], 1)).xy);
          // vTexture += texture2D(uTexture, aTextureCoord);
        } else {
          vTexture += vec4(0);
        }
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
