import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVoiceCoachOptions {
  initialEnabled?: boolean;
  cooldownMs?: number;
}

interface UseVoiceCoachReturn {
  isEnabled: boolean;
  toggleVoice: (enable?: boolean) => boolean;
  speak: (text: string, force?: boolean) => void;
  stopSpeaking: () => void;
}

export function useVoiceCoach({
  initialEnabled = false,
  cooldownMs = 6000,
}: UseVoiceCoachOptions = {}): UseVoiceCoachReturn {
  const [isEnabled, setIsEnabled] = useState<boolean>(initialEnabled);
  const lastSpokenTimeRef = useRef<number>(0);
  const lastSpokenTextRef = useRef<string>('');

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string, force: boolean = false) => {
      if (!isEnabled && !force) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      const now = Date.now();
      // Avoid repeating exact same cue within 10 seconds unless forced
      if (!force && text === lastSpokenTextRef.current && now - lastSpokenTimeRef.current < 10000) {
        return;
      }

      // Check minimum cooldown
      if (!force && now - lastSpokenTimeRef.current < cooldownMs) {
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;

        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find((v) => v.lang.startsWith('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        lastSpokenTimeRef.current = now;
        lastSpokenTextRef.current = text;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis error:', err);
      }
    },
    [isEnabled, cooldownMs]
  );

  const toggleVoice = useCallback(
    (enable?: boolean): boolean => {
      const nextState = enable !== undefined ? enable : !isEnabled;
      setIsEnabled(nextState);

      if (nextState) {
        speak('Voice coach enabled. Live posture analysis active.', true);
      } else {
        stopSpeaking();
      }

      return nextState;
    },
    [isEnabled, speak, stopSpeaking]
  );

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  return {
    isEnabled,
    toggleVoice,
    speak,
    stopSpeaking,
  };
}
