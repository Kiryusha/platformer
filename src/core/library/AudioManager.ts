// the class is responsible for loadin audio defaultTileSet
// TODO: make audio sprites
export default class AudioManager implements AudioManager {
  public audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  public async loadAsset(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.audio.addEventListener('loadeddata', () => resolve());
      this.audio.addEventListener('error', err => reject(err));
      this.audio.src = url;
    });
  }
}
