export class AudioPlayer {
  public audio: HTMLAudioElement;
  private context: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;
  private trebleFilter: BiquadFilterNode | null = null;
  public analyser: AnalyserNode | null = null;
  public initialized = false;

  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous'; // Important if playing distant URLs
  }

  // Must be called after user interaction to unlock Web Audio API
  public initAudioContext() {
    if (this.initialized) return;
    
    // Fallback for Webkit
    const AudContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudContext) return;
    
    this.context = new AudContext();
    this.source = this.context.createMediaElementSource(this.audio);

    // Create simple EQ filters
    this.bassFilter = this.context.createBiquadFilter();
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.value = 200;
    
    this.trebleFilter = this.context.createBiquadFilter();
    this.trebleFilter.type = 'highshelf';
    this.trebleFilter.frequency.value = 3000;

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 256;

    // Connect node chain
    this.source.connect(this.bassFilter);
    this.bassFilter.connect(this.trebleFilter);
    this.trebleFilter.connect(this.analyser);
    this.analyser.connect(this.context.destination);
    
    this.initialized = true;
  }

  public setBass(gain: number) {
    if (this.bassFilter) this.bassFilter.gain.value = gain; // -15 to 15
  }

  public setTreble(gain: number) {
    if (this.trebleFilter) this.trebleFilter.gain.value = gain; // -15 to 15
  }

  public play() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
    return this.audio.play();
  }

  public pause() {
    this.audio.pause();
  }

  public setSrc(src: string) {
    this.audio.src = src;
    this.audio.load();
  }
}

export const playerInstance = new AudioPlayer();
