// the class is responsible for loadin audio defaultTileSet
// TODO: make audio sprites
import { get } from '../../util';

export default class AudioManager implements AudioManager {
  private context: AudioContext;
  private buffer: AudioBuffer;
  private isAlreadyPlaying: boolean;

  constructor(context: AudioContext) {
    this.context = context;
  }

  public async loadAsset(url: string): Promise<void> {
    return get(url, 'arrayBuffer').then(response => this.decodeAudioData(response));
  }

  public play(simultaneous: boolean = false) {
    if (this.isAlreadyPlaying && !simultaneous) return;
    this.isAlreadyPlaying = true;

    // AudioBufferSourceNode - is single use entity. It can be played only once.
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.context.destination);
    source.addEventListener('ended', () => {
      this.isAlreadyPlaying = false;
    });
    source.start();
  }

  private decodeAudioData(data: ArrayBuffer) {
    this.context.decodeAudioData(data, buffer => {
      this.buffer = buffer;
    });
  }
}
