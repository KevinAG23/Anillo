/**
 * Audio Engine: Romantic Music Box & Celesta Synthesizer
 * Built entirely with Web Audio API for zero-external-dependencies,
 * pristine audio fidelity, and mobile-ready user gesture unlock.
 */

class RomanticAudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.masterGain = null;
    this.timerId = null;
    this.currentNoteIndex = 0;

    // Romantic music box melody (frequencies in Hz and durations in seconds)
    // Melody in key of C/G Major with sweet music box arpeggios
    this.melody = [
      // Phrase 1 (Tender entrance)
      { f: 523.25, d: 0.6 }, // C5
      { f: 659.25, d: 0.4 }, // E5
      { f: 783.99, d: 0.8 }, // G5
      { f: 659.25, d: 0.4 }, // E5
      { f: 880.00, d: 0.7 }, // A5
      { f: 783.99, d: 0.5 }, // G5
      { f: 659.25, d: 0.8 }, // E5

      // Phrase 2 (Sweet romantic descending chime)
      { f: 587.33, d: 0.5 }, // D5
      { f: 659.25, d: 0.5 }, // E5
      { f: 587.33, d: 0.7 }, // D5
      { f: 523.25, d: 1.0 }, // C5

      // Phrase 3 (Dreamy harmonic lift)
      { f: 698.46, d: 0.5 }, // F5
      { f: 880.00, d: 0.5 }, // A5
      { f: 1046.50, d: 0.9 }, // C6
      { f: 987.77, d: 0.5 }, // B5
      { f: 880.00, d: 0.6 }, // A5
      { f: 783.99, d: 1.1 }, // G5

      // Phrase 4 (Warm resolution)
      { f: 659.25, d: 0.5 }, // E5
      { f: 587.33, d: 0.5 }, // D5
      { f: 523.25, d: 0.7 }, // C5
      { f: 587.33, d: 0.6 }, // D5
      { f: 659.25, d: 1.2 }, // E5
      { f: 523.25, d: 1.4 }  // C5 (held)
    ];

    // Background bass/accompaniment notes (sweet music box chimes)
    this.bassChords = [
      261.63, // C4
      329.63, // E4
      392.00, // G4
      220.00, // A3
      261.63, // C4
      349.23, // F4
      196.00, // G3
      246.94  // B3
    ];
    this.bassIndex = 0;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported in this environment', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start() {
    this.init();
    this.resume();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.scheduleNextNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime, 0.05);
    }
    return !this.isMuted;
  }

  // Synthesize an authentic music box tone with metallic bell overtones
  playMusicBoxTone(freq, duration = 0.5, volume = 0.6) {
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const oscMain = this.ctx.createOscillator();
    const oscOvertone = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Fundamental note + octave-and-fifth metallic overtone typical of vintage music box pins
    oscMain.type = 'sine';
    oscMain.frequency.setValueAtTime(freq, now);

    oscOvertone.type = 'triangle';
    oscOvertone.frequency.setValueAtTime(freq * 2.76, now); // Bell inharmonicity

    // High cut to make tone warm and velvety
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);

    // Music Box Pluck Envelope: Instant percussive attack, long crystalline ring
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + 1.2);

    oscMain.connect(filter);
    oscOvertone.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscMain.start(now);
    oscOvertone.start(now);
    oscMain.stop(now + duration + 1.3);
    oscOvertone.stop(now + duration + 1.3);
  }

  scheduleNextNote() {
    if (!this.isPlaying) return;

    const note = this.melody[this.currentNoteIndex];
    this.playMusicBoxTone(note.f, note.d, 0.45);

    // Occasional gentle low chime accompaniment
    if (this.currentNoteIndex % 3 === 0) {
      const bassFreq = this.bassChords[this.bassIndex % this.bassChords.length];
      this.playMusicBoxTone(bassFreq, 1.2, 0.25);
      this.bassIndex++;
    }

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
    const intervalMs = note.d * 900; // Tempo

    this.timerId = setTimeout(() => {
      this.scheduleNextNote();
    }, intervalMs);
  }

  // Sound Effect: Delicate Sparkle/Chime (tapping stars or cards)
  playChime() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const now = this.ctx.currentTime;
    const notes = [1046.50, 1318.51, 1567.98]; // C6, E6, G6 arpeggio
    notes.forEach((f, idx) => {
      setTimeout(() => {
        this.playMusicBoxTone(f, 0.4, 0.35);
      }, idx * 70);
    });
  }

  // Sound Effect: Golden Magic Burst (Gift box opening & ring ascension)
  playMagicBurst() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    notes.forEach((f, idx) => {
      setTimeout(() => {
        this.playMusicBoxTone(f, 0.8, 0.45);
      }, idx * 95);
    });
  }

  // Sound Effect: Romantic Celebration (Declaration answered)
  playCelebration() {
    if (!this.ctx || this.isMuted) return;
    this.resume();
    const chords = [
      [523.25, 659.25, 783.99, 1046.50],
      [587.33, 739.99, 880.00, 1174.66],
      [659.25, 783.99, 1046.50, 1318.51],
      [783.99, 987.77, 1318.51, 1567.98]
    ];
    chords.forEach((chord, cIdx) => {
      setTimeout(() => {
        chord.forEach(f => this.playMusicBoxTone(f, 0.9, 0.3));
      }, cIdx * 320);
    });
  }
}

// Global instance
window.romanticAudio = new RomanticAudioManager();
