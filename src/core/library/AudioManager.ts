// the class is responsible for loadin audio defaultTileSet
// TODO: make audio sprites
import { get } from '../../util';

export default class AudioManager implements AudioManager {
  private context: AudioContext;
  private buffer: AudioBuffer;
  private isAlreadyPlaying: boolean;
  private gainNode: GainNode;
  private source: AudioBufferSourceNode;

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
    loop = false,
  } = <PlayParams>{}) {
    if (this.isAlreadyPlaying && !isSimultaneous) return;
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

    this.source.start();
    this.source.loop = loop;
  }

  public stop() {
    this.source.stop();
  }

  private decodeAudioData(data: ArrayBuffer) {
    this.context.decodeAudioData(data, buffer => {
      this.buffer = buffer;
    });
  }
}
