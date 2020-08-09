// the class is responsible for loadin audio defaultTileSet
// TODO: make audio sprites
import { get } from '../../util';

export default class AudioManager implements AudioManager {
  private context: AudioContext;
  private buffer: AudioBuffer;
  private isAlreadyPlaying: boolean;
  private gainNode: GainNode;
  private source: AudioBufferSourceNode;
  private params: PlayParams;
  private pausedTime: number = 0;

  constructor(
    context: AudioContext,
    private defaultVolume: number = 1,
  ) {
    this.context = context;
    // An intermediate node to help control the volume
    this.gainNode = this.context.createGain();
  }

  public async loadAsset(url: string): Promise<void> {
    return get(url, 'arrayBuffer').then(response => this.decodeAudioData(response));
  }

  public play({
    isSimultaneous = false,
    volume = this.defaultVolume,
    loop = false,
    startTime = 0,
  } = <PlayParams>{}) {
    if (this.isAlreadyPlaying && !isSimultaneous) return;
    this.params = {
      isSimultaneous,
      volume,
      loop,
      startTime
    };
    this.isAlreadyPlaying = true;

    // AudioBufferSourceNode - is single use entity. It can be played only once.
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;

    this.source.addEventListener('ended', () => {
      this.isAlreadyPlaying = false;
    });

    this.gainNode.gain.value = volume;
    this.gainNode.connect(this.context.destination);

    this.source.connect(this.gainNode);

    // the source needs seconds
    this.source.start(0, startTime / 1000);
    this.params.startTime = startTime;
    this.source.loop = loop;
  }

  // Unlike play(), resume() reproduces sound from the moment it stopped.
  public resume(params?: PlayParams): void {
    this.params = { ...this.params, ...params };
    this.pausedTime = this.pausedTime ? this.pausedTime : Date.now();
    this.params.startTime = Date.now() - this.pausedTime;
    this.play(this.params);
  }

  // Pausing actually stops the sound, but also saves the timestep it was stopped.
  public pause(): void {
    this.source.stop();
    this.pausedTime = Date.now() - this.params.startTime;
  }

  private decodeAudioData(data: ArrayBuffer) {
    this.context.decodeAudioData(data, buffer => {
      this.buffer = buffer;
    });
  }
}
