export default {
  vertexShaderSource: `
    #define maxTiles 144

    attribute vec2 aTextureCoord;

    uniform vec2 uResolution;
    uniform vec2 uTranslation;
    uniform vec2 uScale;
    uniform mat3 uTextureMatrix[maxTiles];
    uniform int uTilesAmount;

    varying vec2 vTextureCoord;

    int index = 0;

    void main() {
      vec2 scaledPosition = aTextureCoord * uScale;
      vec2 position = scaledPosition;
      vec2 clipSpace = ((position / uResolution) * 2.0) - 1.0;

      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

      // vTextureCoord = (uTextureMatrix[gl_VertexID] * vec3(aTextureCoord, 1)).xy;
      vTextureCoord = (vec3(aTextureCoord, 1)).xy;

      ++index;
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
