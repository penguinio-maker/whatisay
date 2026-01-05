import React, { useState, useRef } from 'react';
import { BarChart3, Share2, Download, Copy, X } from 'lucide-react';

const TwitterWordAnalyzer = () => {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const shareCardRef = useRef(null);

  const funnyWords = [
    'bruh', 'wtf', 'lmfao', 'lmao', 'lol', '69', 'gm', 'gn', 
    'hey', 'blocked', 'muted', 'nice one', 'ty', 'tysm', 
    'tyvm', 'lfg', 'bullish', 'banger', 'send it'
  ];

  const handleAnalyze = () => {
    if (!username.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const shuffled = [...funnyWords].sort(() => 0.5 - Math.random());
      const topWords = shuffled.slice(0, 3).map((word, index) => ({
        word,
        count: Math.floor(Math.random() * 300) + (200 - index * 50),
        percentage: Math.floor(Math.random() * 15) + (20 - index * 5)
      }));
      
      topWords.sort((a, b) => b.count - a.count);
      
      setResult({
        topWords
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const downloadImage = async () => {
    const card = shareCardRef.current;
    if (!card) return;

    try {
      const html2canvas = (await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm')).default;
      const canvas = await html2canvas(card, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `${username}-twitter-stats.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const copyImage = async () => {
    const card = shareCardRef.current;
    if (!card) return;

    try {
      const html2canvas = (await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm')).default;
      const canvas = await html2canvas(card, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('Error copying to clipboard:', err);
        }
      });
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl font-bold text-white">𝕏</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
            Your Most Used Words
          </h1>
          <p className="text-gray-600">Discover what you say the most on Twitter</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-blue-100">
          {!result ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                    onKeyPress={handleKeyPress}
                    placeholder="username"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-colors"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!username.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-gray-600 text-sm">@{username}'s top words</p>
              </div>

              <div className="space-y-4">
                {result.topWords.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        index === 0 ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg' :
                        index === 1 ? 'bg-gradient-to-br from-blue-300 to-blue-500 text-white shadow-md' :
                        'bg-gradient-to-br from-blue-200 to-blue-400 text-white shadow'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="text-2xl font-bold text-gray-800">"{item.word}"</span>
                          <span className="text-sm text-gray-500">{item.percentage}%</span>
                        </div>
                        
                        <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div 
                            className={`h-full rounded-lg transition-all duration-1000 ease-out ${
                              index === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                              index === 1 ? 'bg-gradient-to-r from-blue-300 to-blue-500' :
                              'bg-gradient-to-r from-blue-200 to-blue-400'
                            }`}
                            style={{ 
                              width: `${item.percentage * 3}%`,
                              animation: 'slideIn 1s ease-out'
                            }}
                          />
                        </div>
                        
                        <div className="mt-1 text-sm text-gray-600">
                          <span className="font-semibold">{item.count} times</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                <p className="text-gray-600 text-sm mb-1">Total analyzed</p>
                <p className="text-3xl font-bold text-blue-600">
                  {result.topWords.reduce((sum, item) => sum + item.count, 0)} words
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share Results
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setUsername('');
                  }}
                  className="px-6 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  New
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          This is a demo version with simulated results
        </p>
        
        <p className="text-center text-sm text-gray-400 mt-2">
          Created by <a href="https://twitter.com/PenguinWeb3" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">@PenguinWeb3</a>
        </p>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Share Your Results</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div ref={shareCardRef} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 mb-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-3 shadow-lg">
                  <span className="text-4xl font-bold text-white">𝕏</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">@{username}'s Top Words</h2>
                <p className="text-sm text-gray-600">on Twitter</p>
              </div>

              <div className="space-y-3 mb-6">
                {result.topWords.map((item, index) => (
                  <div key={index} className="bg-white/70 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-blue-300 to-blue-500 text-white' :
                        'bg-gradient-to-br from-blue-200 to-blue-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-xl font-bold text-gray-800">"{item.word}"</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 pl-11">
                      <span>{item.count} times</span>
                      <span>{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-xs text-gray-500">
                Created with twitter-word-analyzer
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadImage}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={copyImage}
                className="flex-1 bg-white border-2 border-blue-200 text-blue-600 py-3 rounded-xl font-medium hover:border-blue-300 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          from {
            width: 0%;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TwitterWordAnalyzer;
```

---

**9. Файл: `.gitignore`**
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
