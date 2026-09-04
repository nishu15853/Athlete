import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, MessageSquare, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { voiceCoach } from '../../utils/voiceCoach';

interface VoiceCoachPanelProps {
  feedbackMessages: string[];
}

export const VoiceCoachPanel: React.FC<VoiceCoachPanelProps> = ({ feedbackMessages }) => {
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);

  const toggleVoice = () => {
    const newState = voiceCoach.toggleVoice();
    setVoiceEnabled(newState);
  };

  // Speak top feedback message periodically when voice is enabled
  useEffect(() => {
    if (voiceEnabled && feedbackMessages.length > 0) {
      const topCorrection = feedbackMessages.find(m => m.includes('Try') || m.includes('Keep') || m.includes('Align') || m.includes('Adjust'));
      if (topCorrection) {
        voiceCoach.speak(topCorrection);
      } else if (feedbackMessages.length > 0) {
        voiceCoach.speak('Posture is optimal.');
      }
    }
  }, [feedbackMessages, voiceEnabled]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-brand-deepGreen/10 text-brand-deepGreen flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">AI Coach Feedback</h3>
            <p className="text-[11px] text-gray-400">Real-time posture & movement audio coach</p>
          </div>
        </div>

        {/* Voice Coach Toggle Button */}
        <button
          onClick={toggleVoice}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            voiceEnabled
              ? 'bg-brand-deepGreen text-white shadow-glow-green border border-brand-cyan/40'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {voiceEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-brand-cyan animate-pulse" />
              <span>🔊 Voice Coach Enabled</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-gray-400" />
              <span>🔇 Enable Voice Coach</span>
            </>
          )}
        </button>
      </div>

      {/* Real-Time Spoken & Displayed Feedback Items */}
      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
        {feedbackMessages.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-400 bg-brand-bgLight rounded-2xl">
            Stand in front of the camera to receive live AI coaching feedback.
          </div>
        ) : (
          feedbackMessages.map((msg, index) => {
            const isWarning = msg.startsWith('Try') || msg.startsWith('Your') || msg.startsWith('Adjust') || msg.startsWith('Slight') || msg.startsWith('Maintain');
            return (
              <div
                key={index}
                className={`p-3 rounded-2xl text-xs font-semibold flex items-start space-x-2.5 transition-all ${
                  isWarning
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                }`}
              >
                {isWarning ? (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{msg}</span>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
