// the class is responsible for loadin audio defaultTileSet
// TODO: make audio sprites
import { get } from '../../util';

export default class AudioManager implements AudioManager {
  private context: AudioContext;
  private buffer: AudioBuffer;
  private isAlreadyPlaying: boolean;
  private gainNode: GainNode;

  constructor(
    context: AudioContext,
    private defaultVolume: number = 1,
  ) {
    this.context = context;
    this.gainNode = this.context.createGain();
  }

  public async loadAsset(url: string): Promise<void> {
    return get(url, 'arrayBuffer').then(response => this.decodeAudioData(response));
  }

  public play({
    isSimultaneous = false,
    volume = this.defaultVolume,
  } = <PlayParams>{}) {
    if (this.isAlreadyPlaying && !isSimultaneous) return;
    this.isAlreadyPlaying = true;

    // AudioBufferSourceNode - is single use entity. It can be played only once.
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;

    source.addEventListener('ended', () => {
      this.isAlreadyPlaying = false;
    });

    this.gainNode.gain.value = volume;
    this.gainNode.connect(this.context.destination);

    source.connect(this.gainNode);

    source.start();
  }

  private decodeAudioData(data: ArrayBuffer) {
    this.context.decodeAudioData(data, buffer => {
      this.buffer = buffer;
    });
  }
}
