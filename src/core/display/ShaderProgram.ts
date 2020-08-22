// the class is responsible for all the work with WebGL shaders
export default class {
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  program: WebGLProgram;
  aPosition: number;
  aTextureCoord: number;
  uResolution: WebGLUniformLocation;
  uColor: WebGLUniformLocation;
  uTranslation: WebGLUniformLocation;
  uScale: WebGLUniformLocation;
  uTexture: WebGLUniformLocation;
  positionBuffer: WebGLBuffer;
  textureCoordBuffer: WebGLBuffer;
  uTextureMatrix: WebGLUniformLocation;
  uTilesAmount: WebGLUniformLocation;
  uTextureCoord: WebGLUniformLocation;
  tileCoords: any[];

  constructor(
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    type: string,
    width?: number,
    height?: number,
    tileSize?: number,
  ) {
    this.vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.compileProgram(gl);

    switch (type) {
      case 'rectangle':
        this.aPosition = gl.getAttribLocation(this.program, 'aPosition');
        this.uResolution = gl.getUniformLocation(this.program, 'uResolution');
        this.uColor = gl.getUniformLocation(this.program, 'uColor');
        break;

      case 'image':
        this.aPosition = gl.getAttribLocation(this.program, 'aPosition');
        this.aTextureCoord = gl.getAttribLocation(this.program, 'aTextureCoord');

        this.uResolution = gl.getUniformLocation(this.program, 'uResolution');
        this.uTranslation = gl.getUniformLocation(this.program, 'uTranslation');
        this.uScale = gl.getUniformLocation(this.program, 'uScale');
        this.uTextureMatrix = gl.getUniformLocation(this.program, 'uTextureMatrix');

        this.positionBuffer = gl.createBuffer();
        this.textureCoordBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
            0,  0,
            1,  0,
            0,  1,
            0,  1,
            1,  0,
            1,  1,
          ]),
          gl.STATIC_DRAW,
        );
        break;

      case 'layer':
        this.aPosition = gl.getAttribLocation(this.program, 'aPosition');

        this.uResolution = gl.getUniformLocation(this.program, 'uResolution');
        this.uTranslation = gl.getUniformLocation(this.program, 'uTranslation');
        this.uScale = gl.getUniformLocation(this.program, 'uScale');
        this.uTextureMatrix = gl.getUniformLocation(this.program, 'uTextureMatrix');
        this.uTilesAmount = gl.getUniformLocation(this.program, 'uTilesAmount');
        this.uTextureCoord = gl.getUniformLocation(this.program, 'uTextureCoord');

        this.positionBuffer = gl.createBuffer();

        const tilesInRow = width / tileSize;
        const tilesInColumn = height / tileSize;
        this.tileCoords = [];

        for (let y = 0; y < tilesInColumn; y += 1) {
          for (let x = 0; x < tilesInRow; x += 1) {
            gl.uniform2f(this.uTextureCoord, (x * tileSize) / width, (y * tileSize) / height);
            // this.tileCoords.push([
            //   (x * tileSize) / width,
            //   (y * tileSize) / height,
            //
            //   ((x * tileSize) + tileSize) / width,
            //   (y * tileSize) / height,
            //
            //   (x * tileSize) / width,
            //   ((y * tileSize) + tileSize) / height,
            //
            //   (x * tileSize) / width,
            //   ((y * tileSize) + tileSize) / height,
            //
            //   ((x * tileSize) + tileSize) / width,
            //   (y * tileSize) / height,
            //
            //   ((x * tileSize) + tileSize) / width,
            //   ((y * tileSize) + tileSize) / height,
            // ]);
          }
        }



        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
            0,  0,
            1,  0,
            0,  1,
            0,  1,
            1,  0,
            1,  1,
          ]),
          gl.STATIC_DRAW,
        );
    }
  }

  private compileShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string,
  ): WebGLShader {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  private compileProgram(
    gl: WebGLRenderingContext,
  ): WebGLProgram {
    let program = gl.createProgram();

    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      program = null;
      throw new Error(gl.getProgramInfoLog(program));
    }

    return program;
  }
}
