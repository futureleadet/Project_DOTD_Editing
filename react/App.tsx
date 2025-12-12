import React, { useState, useEffect, useRef } from 'react';
import { PageView, User, FeedItem, GenerationResult } from './types';
import { analyzeFashionImage } from './services/geminiService';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  UserIcon, 
  PlusIcon,
  ArrowLeftIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// --- COMPONENTS DEFINED IN-FILE FOR SIMPLICITY AS REQUESTED ---

// 1. Navigation Bar
const Navbar = ({ 
  currentView, 
  setView, 
  isLoggedIn 
}: { 
  currentView: PageView; 
  setView: (v: PageView) => void; 
  isLoggedIn: boolean 
}) => {
  const navItemClass = (view: PageView) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === view ? 'text-black font-bold' : 'text-gray-400'}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50 px-4 pb-safe">
      <button onClick={() => setView(PageView.HOME)} className={navItemClass(PageView.HOME)}>
        <HomeIcon className="w-6 h-6" />
        <span className="text-[10px]">Home</span>
      </button>
      <button onClick={() => setView(PageView.FEED)} className={navItemClass(PageView.FEED)}>
        <MagnifyingGlassIcon className="w-6 h-6" />
        <span className="text-[10px]">Feed</span>
      </button>
      
      {/* Generate Button - Floating Action Style */}
      <div className="relative -top-5">
        <button 
          onClick={() => setView(PageView.GENERATE)}
          className="bg-black text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <button 
        onClick={() => setView(isLoggedIn ? PageView.MY_PAGE : PageView.LOGIN)} 
        className={navItemClass(PageView.MY_PAGE)}
      >
        <UserIcon className="w-6 h-6" />
        <span className="text-[10px]">{isLoggedIn ? 'My Page' : 'Login'}</span>
      </button>
      
      {/* Logout simulation for demo */}
      {isLoggedIn && (
         <button onClick={() => setView(PageView.LOGIN)} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400">
           <span className="text-[10px] font-mono">Exit</span>
         </button>
      )}
    </div>
  );
};

// 2. Home Page
const HomePage = ({ setView }: { setView: (v: PageView) => void }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'sense' | 'trendy'>('daily');

  const tabContent = {
    daily: {
      title: "Stage 1 — Minimal / Daily",
      desc: "Basic, Kwan-kku, Soft",
      img: "https://picsum.photos/seed/daily/600/800",
      color: "bg-gray-100"
    },
    sense: {
      title: "Stage 2 — Balanced / Sense",
      desc: "Natural, Stylish, Kkuk-kkuk",
      img: "https://picsum.photos/seed/sense/600/800",
      color: "bg-stone-100"
    },
    trendy: {
      title: "Stage 3 — Statement / Trendy",
      desc: "Impact, Unique, High-Fashion",
      img: "https://picsum.photos/seed/trendy/600/800",
      color: "bg-zinc-200"
    }
  };

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="px-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tighter">DOTD.</h1>
        <div className="text-xs font-medium text-gray-500 border rounded-full px-3 py-1">
          BETA v1.0
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-gray-100 mb-6">
        {['daily', 'sense', 'trendy'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab ? 'text-black' : 'text-gray-400'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black mx-auto w-1/2" />
            )}
          </button>
        ))}
      </div>

      {/* Main Visual (GIF Simulation) */}
      <div className="px-4 mb-10">
        <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm ${tabContent[activeTab].color} group`}>
          <img 
            src={tabContent[activeTab].img} 
            alt={activeTab} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <p className="text-white/80 text-xs mb-1 uppercase tracking-widest font-semibold">{tabContent[activeTab].desc}</p>
            <h2 className="text-white text-2xl font-bold">{tabContent[activeTab].title}</h2>
          </div>
        </div>
        
        <button 
          onClick={() => setView(PageView.GENERATE)}
          className="w-full bg-black text-white mt-4 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <span>Generate Outfit</span>
          <ArrowDownTrayIcon className="w-5 h-5 -rotate-90" />
        </button>
      </div>

      {/* Staff Picks (Horizontal Scroll) */}
      <div className="mb-8">
        <div className="px-4 mb-4 flex justify-between items-end">
          <h3 className="font-bold text-lg">Staff Picks</h3>
          <span className="text-xs text-gray-400 cursor-pointer">View All</span>
        </div>
        <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-32 md:w-40 flex flex-col gap-2">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-200">
                <img src={`https://picsum.photos/seed/staff${i}/300/400`} className="w-full h-full object-cover" alt="Staff Pick"/>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-300 overflow-hidden">
                  <img src={`https://picsum.photos/seed/avatar${i}/100`} alt="avatar" />
                </div>
                <span className="text-xs font-medium truncate">Stylist_{i}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Feed Page
const FeedPage = ({ onReport }: { onReport: () => void }) => {
  const [filter, setFilter] = useState<'popular' | 'latest'>('popular');
  const [subFilter, setSubFilter] = useState('All');

  const feedItems = Array.from({ length: 12 }).map((_, i) => ({
    id: i.toString(),
    height: i % 2 === 0 ? 'h-64' : 'h-48', // Masonry variation
    image: `https://picsum.photos/seed/feed${i}/400/${i % 2 === 0 ? 600 : 400}`,
    likes: Math.floor(Math.random() * 500)
  }));

  return (
    <div className="pb-20 pt-4 px-2">
      {/* Header Filters */}
      <div className="sticky top-0 bg-white z-10 py-2 mb-4">
        <div className="flex gap-4 mb-4 px-2 border-b border-gray-100 pb-2">
          <button 
            onClick={() => setFilter('popular')}
            className={`text-lg font-bold ${filter === 'popular' ? 'text-black' : 'text-gray-300'}`}
          >
            Popular
          </button>
          <button 
            onClick={() => setFilter('latest')}
            className={`text-lg font-bold ${filter === 'latest' ? 'text-black' : 'text-gray-300'}`}
          >
            Latest
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
          {['All', 'General', 'Basic', 'Stylish', 'Unique'].map(tag => (
            <button
              key={tag}
              onClick={() => setSubFilter(tag)}
              className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap border ${
                subFilter === tag ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Feed */}
      <div className="columns-2 gap-2 space-y-2">
        {feedItems.map((item) => (
          <div key={item.id} className="break-inside-avoid relative group rounded-lg overflow-hidden">
            <img src={item.image} alt="Feed" className="w-full h-auto object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-2 left-2 text-white text-xs font-bold drop-shadow-md flex items-center gap-1">
               <span className="opacity-0 group-hover:opacity-100 transition-opacity">♥ {item.likes}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onReport(); }}
              className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-black/20 rounded-full backdrop-blur-sm"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Generate Page
const GeneratePage = ({ onGenerate }: { onGenerate: (file: File, prompt: string) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 pt-6 h-screen flex flex-col bg-white">
      <h2 className="text-2xl font-bold mb-6">Create DOTD</h2>
      
      {/* Prompt Input */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">My Style Request</label>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="ex. Going to a cafe in Hannam-dong, need a 'Kwan-kku' vibe..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none h-24"
        />
      </div>

      {/* Image Upload Area */}
      <div className="flex-1 mb-6">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">My Photo</label>
        <div className={`border-2 border-dashed border-gray-200 rounded-xl h-full max-h-[400px] flex flex-col items-center justify-center relative overflow-hidden transition-all ${!preview ? 'bg-gray-50' : 'bg-white'}`}>
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-400">
                <PlusIcon className="w-6 h-6" />
              </div>
              <p className="text-gray-500 text-sm">Tap to upload your photo</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </div>
      </div>

      {/* AI Caution & Action */}
      <div className="mt-auto pb-24">
         <p className="text-[10px] text-gray-400 text-center mb-3">
           AI generated results may vary. Please review terms of service regarding content.
         </p>
         <button 
           disabled={!selectedFile}
           onClick={() => selectedFile && onGenerate(selectedFile, prompt)}
           className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
             selectedFile ? 'bg-black text-white shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
           }`}
         >
           Generate Analysis
         </button>
      </div>
    </div>
  );
};

// 5. Loading Page
const LoadingPage = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 99) {
          clearInterval(interval);
          return 99;
        }
        return p + Math.floor(Math.random() * 5) + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-8" />
      <h2 className="text-2xl font-bold mb-2 animate-pulse">Analyzing Style...</h2>
      <p className="text-gray-400 text-sm mb-8">Consulting with AI Stylist</p>
      <div className="w-full max-w-xs h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-black transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs font-mono">{percent}%</p>
    </div>
  );
};

// 6. Result Page
const ResultPage = ({ 
  result, 
  onRetry, 
  onFeedUpload 
}: { 
  result: GenerationResult | null; 
  onRetry: () => void; 
  onFeedUpload: () => void;
}) => {
  if (!result) return null;

  return (
    <div className="min-h-screen bg-white pb-24 animate-fade-in">
      {/* Image Result */}
      <div className="relative w-full aspect-[3/4] bg-gray-100">
        <img src={result.imageUrl} alt="Generated Outfit" className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-gray-200">
          <span className="text-xs font-black tracking-widest">DOTD GENERATED</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 -mt-6 bg-white rounded-t-3xl relative z-10 shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)]">
        
        {/* Header Actions */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Style Analysis</h1>
            <p className="text-xs text-gray-500">Based on your upload</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50">
               <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50">
               <ShareIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {result.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Analysis Text */}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-bold text-sm mb-2">✨ Stylist's Note</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{result.analysis}</p>
          </div>
          
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
             <h3 className="font-bold text-sm mb-2 text-stone-800">💡 Recommendation</h3>
             <p className="text-sm text-stone-600 leading-relaxed">{result.recommendation}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onRetry}
            className="py-3 border border-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-50"
          >
            Recreate
          </button>
          <button 
            onClick={onFeedUpload}
            className="py-3 bg-black text-white rounded-xl font-semibold text-sm hover:opacity-90 shadow-lg shadow-gray-200"
          >
            Upload to Feed
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. Login Page
const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="h-screen bg-white flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-black mb-2 tracking-tighter">DOTD.</h1>
        <p className="text-gray-500 mb-12">Discover your daily outfit AI.</p>
        
        <button 
          onClick={onLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-3 mb-4 hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>
        
        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
          <input 
             type="email" 
             placeholder="Email address" 
             className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
          />
          <input 
             type="password" 
             placeholder="Password" 
             className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
          />
          
          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center gap-2 text-gray-500">
              <input type="checkbox" className="rounded border-gray-300" />
              Keep me logged in
            </label>
            <span className="text-gray-400">Forgot password?</span>
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white py-4 rounded-lg font-bold text-sm mt-4 hover:opacity-90"
          >
            Log In
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-400 mt-8">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

// 8. My Page
const MyPage = ({ user, setView }: { user: User, setView: (v: PageView) => void }) => {
  return (
    <div className="pb-20 pt-6 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">My Profile</h2>
        <button className="p-2" onClick={() => {/* Settings */}}>
           <div className="w-1 h-1 bg-black rounded-full shadow-[5px_0_0_0_#000,-5px_0_0_0_#000]"></div>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-lg">
           <img src={user.avatar} alt="Me" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{user.name}</h3>
          <p className="text-xs text-gray-500">@{user.id} • Fashion Enthusiast</p>
          <div className="flex gap-4 mt-3">
             <div className="text-center">
                <span className="block font-bold text-sm">124</span>
                <span className="text-[10px] text-gray-400">Followers</span>
             </div>
             <div className="text-center">
                <span className="block font-bold text-sm">42</span>
                <span className="text-[10px] text-gray-400">Following</span>
             </div>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-100 flex gap-6">
        <button className="pb-2 border-b-2 border-black font-bold text-sm">My DOTD</button>
        <button className="pb-2 border-b-2 border-transparent text-gray-400 text-sm">Likes</button>
      </div>

      <div className="grid grid-cols-3 gap-1">
         {[1,2,3,4,5,6].map(i => (
           <div key={i} className="aspect-square bg-gray-100 relative">
             <img src={`https://picsum.photos/seed/my${i}/200`} className="w-full h-full object-cover" alt="gallery"/>
           </div>
         ))}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentView, setView] = useState<PageView>(PageView.HOME);
  const [user, setUser] = useState<User>({
    id: 'guest',
    name: 'Guest User',
    avatar: 'https://picsum.photos/seed/guest/100',
    isLoggedIn: false
  });
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);

  const handleLogin = () => {
    setUser({
      id: 'fashionista_kr',
      name: 'Min-ji Kim',
      avatar: 'https://picsum.photos/seed/minji/100',
      isLoggedIn: true
    });
    setView(PageView.HOME);
  };

  const handleGenerate = async (file: File, prompt: string) => {
    setView(PageView.LOADING);
    
    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      
      try {
        const analysis = await analyzeFashionImage(base64, prompt);
        
        // Simulating the "Generated Image" by just using the uploaded one or a placeholder
        // In a real app, this would come from the Image Generation API
        // For aesthetics, we use the original image or a "styled" placeholder
        const resultImage = reader.result as string; 

        setGenerationResult({
          imageUrl: resultImage,
          analysis: analysis.analysis,
          recommendation: analysis.recommendation,
          tags: analysis.tags
        });
        setView(PageView.RESULT);
      } catch (err) {
        console.error(err);
        setView(PageView.GENERATE); // Fallback
      }
    };
  };

  // Report Modal
  const ReportModal = () => (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-4 text-red-600">
           <ExclamationTriangleIcon className="w-6 h-6" />
           <h3 className="font-bold text-lg">Report Content</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Why are you reporting this post?</p>
        <div className="space-y-2 mb-6">
           {['Offensive/Hate Speech', 'Unauthorized Use of Likeness', 'Spam/Misleading', 'Other'].map(reason => (
             <button 
               key={reason} 
               onClick={() => { setReportModalOpen(false); alert('Report Submitted'); }}
               className="w-full text-left p-3 rounded-lg border border-gray-100 hover:bg-gray-50 text-sm font-medium"
             >
               {reason}
             </button>
           ))}
        </div>
        <button onClick={() => setReportModalOpen(false)} className="w-full py-3 bg-gray-100 rounded-xl font-bold text-sm">Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative shadow-2xl overflow-hidden">
      {/* View Routing */}
      {currentView === PageView.HOME && <HomePage setView={setView} />}
      {currentView === PageView.FEED && <FeedPage onReport={() => setReportModalOpen(true)} />}
      {currentView === PageView.GENERATE && <GeneratePage onGenerate={handleGenerate} />}
      {currentView === PageView.LOADING && <LoadingPage />}
      {currentView === PageView.RESULT && <ResultPage result={generationResult} onRetry={() => setView(PageView.GENERATE)} onFeedUpload={() => {alert('Uploaded!'); setView(PageView.FEED)}} />}
      {currentView === PageView.LOGIN && <LoginPage onLogin={handleLogin} />}
      {currentView === PageView.MY_PAGE && <MyPage user={user} setView={setView} />}

      {/* Global Navbar (Only show on main navigation pages) */}
      {(currentView === PageView.HOME || currentView === PageView.FEED || currentView === PageView.MY_PAGE) && (
        <Navbar currentView={currentView} setView={setView} isLoggedIn={user.isLoggedIn} />
      )}

      {/* Modals */}
      {reportModalOpen && <ReportModal />}
    </div>
  );
}
