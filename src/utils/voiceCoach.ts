// Voice Coach using Web SpeechSynthesis API

class VoiceCoach {
  private enabled: boolean = false;
  private lastSpokenTime: number = 0;
  private lastSpokenText: string = '';
  private cooldownMs: number = 6000; // 6 seconds minimum between speech outputs

  public toggleVoice(enable?: boolean): boolean {
    if (enable !== undefined) {
      this.enabled = enable;
    } else {
      this.enabled = !this.enabled;
    }

    if (this.enabled) {
      this.speak('Voice coach enabled. Live posture analysis active.', true);
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
    return this.enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public speak(text: string, force: boolean = false): void {
    if (!this.enabled && !force) return;
    if (!('speechSynthesis' in window)) return;

    const now = Date.now();
    // Avoid repeating exact same feedback within 10 seconds unless forced
    if (!force && text === this.lastSpokenText && now - this.lastSpokenTime < 10000) {
      return;
    }

    // Cooldown check
    if (!force && now - this.lastSpokenTime < this.cooldownMs) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      this.lastSpokenTime = now;
      this.lastSpokenText = text;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
    }
  }
}

export const voiceCoach = new VoiceCoach();
