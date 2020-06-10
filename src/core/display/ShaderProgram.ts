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
  uRotation: WebGLUniformLocation;
  uScale: WebGLUniformLocation;
  uTexture: WebGLUniformLocation;
  positionBuffer: WebGLBuffer;
  textureCoordBuffer: WebGLBuffer;
  uTextureStart: WebGLUniformLocation;
  uTextureEnd: WebGLUniformLocation;
  uTextureMatrix: WebGLUniformLocation;
    uMatrix: WebGLUniformLocation;

  constructor(
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    type: string,
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
        this.uRotation = gl.getUniformLocation(this.program, 'uRotation');
        this.uScale = gl.getUniformLocation(this.program, 'uScale');
        this.uTexture = gl.getUniformLocation(this.program, 'uTexture');
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

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
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
          gl.STREAM_DRAW
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
