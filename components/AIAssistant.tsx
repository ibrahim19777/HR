
import React, { useState } from 'react';
import { Send, Sparkles, Wand2, BookOpen } from 'lucide-react';
import { generateJobDescription, explainLaborLaw } from '../services/geminiService';
import { Language, Translation } from '../types';

interface AIAssistantProps {
  lang: Language;
  t: Translation;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ lang, t }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'jd' | 'law'>('jd');

  const handleAIAction = async () => {
    if (!prompt) return;
    setLoading(true);
    let output = '';
    
    if (mode === 'jd') {
      output = await generateJobDescription(prompt, lang);
    } else {
      output = await explainLaborLaw("Arab countries (KSA, UAE, Egypt)", prompt, lang);
    }
    
    setResult(output);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{t.aiAssistant}</h1>
        <p className="text-slate-500 mt-2">Maward AI helps you automate documentation and legal compliance.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setMode('jd')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${mode === 'jd' ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Wand2 size={18} />
            Job Descriptions
          </button>
          <button 
            onClick={() => setMode('law')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${mode === 'law' ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BookOpen size={18} />
            Labor Law Helper
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {mode === 'jd' ? 'What role are you hiring for?' : 'What labor law topic do you need help with?'}
            </label>
            <div className="relative">
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'jd' ? "e.g. Senior Product Designer" : "e.g. End of service benefits in Saudi Arabia"}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
              />
              <button 
                onClick={handleAIAction}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-100"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Send size={20} />}
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">AI Result</span>
                <button 
                  onClick={() => {navigator.clipboard.writeText(result)}}
                  className="text-xs font-bold text-slate-400 hover:text-indigo-600"
                >
                  Copy to Clipboard
                </button>
              </div>
              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
