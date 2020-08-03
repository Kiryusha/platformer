// the class is responsible for loadin audio defaultTileSet
// TODO: make audio sprites
import { get } from '../../util';

export default class AudioManager implements AudioManager {
  private buffer: AudioBuffer;
  private context: AudioContext;
  private isAlreadyPlaying: boolean;

  constructor() {
    this.context = new AudioContext();
  }

  public async loadAsset(url: string): Promise<void> {
    return get(url, 'arrayBuffer').then(response => this.decodeAudioData(response));
  }

  public play() {
    if (this.isAlreadyPlaying) return;
    this.isAlreadyPlaying = true;

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
