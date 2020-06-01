// the class is responsible for all the work with WebGL shaders
export default class {
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  program: WebGLProgram;

  constructor(
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
  ) {
    this.vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.compileProgram(gl);
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
