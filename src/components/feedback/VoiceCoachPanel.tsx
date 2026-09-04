import React, { useEffect } from 'react';
import { Volume2, VolumeX, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { useVoiceCoach } from '../../hooks/useVoiceCoach';

interface VoiceCoachPanelProps {
  feedbackMessages: string[];
}

export const VoiceCoachPanel: React.FC<VoiceCoachPanelProps> = ({ feedbackMessages }) => {
  const { isEnabled, toggleVoice, speak } = useVoiceCoach();

  // Speak top feedback message periodically when voice is enabled
  useEffect(() => {
    if (isEnabled && feedbackMessages.length > 0) {
      const topCorrection = feedbackMessages.find(
        (m) =>
          m.includes('Try') ||
          m.includes('Keep') ||
          m.includes('Align') ||
          m.includes('Adjust') ||
          m.includes('Maintain')
      );
      if (topCorrection) {
        speak(topCorrection);
      } else if (feedbackMessages.length > 0) {
        speak('Posture is optimal.');
      }
    }
  }, [feedbackMessages, isEnabled, speak]);

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/80 shadow-sm space-y-2.5">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-brand-deepGreen/10 text-brand-deepGreen flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-gray-900">AI Coach Feedback</h3>
            <p className="text-[10px] text-gray-400">Real-time posture & movement audio coach</p>
          </div>
        </div>

        {/* Voice Coach Toggle Button */}
        <button
          onClick={() => toggleVoice()}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isEnabled
              ? 'bg-brand-deepGreen text-white shadow-sm border border-brand-cyan/40'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {isEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
              <span>Voice Enabled</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-gray-400" />
              <span>Voice Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Dynamic Feedback Message List */}
      <div className="space-y-1.5">
        {feedbackMessages.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No feedback signals detected yet.</p>
        ) : (
          feedbackMessages.map((msg, i) => {
            const isCorrection =
              msg.includes('Try') ||
              msg.includes('Keep') ||
              msg.includes('Align') ||
              msg.includes('Adjust') ||
              msg.includes('Maintain');
            return (
              <div
                key={i}
                className={`p-2 rounded-xl text-xs flex items-center space-x-2 ${
                  isCorrection
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                }`}
              >
                {isCorrection ? (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
                <span className="font-medium">{msg}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VoiceCoachPanel;
