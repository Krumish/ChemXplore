import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Lock, 
  Trophy, 
  Menu, 
  ArrowLeft, 
  Home, 
  Search, 
  User, 
  Droplet, 
  FlaskConical, 
  CheckCircle, 
  AlertCircle, 
  RefreshCcw,
  ChevronRight
} from 'lucide-react';

/* --- MOCK DATA & TYPES ---*/

const ModuleStatus = {
  LOCKED: 'LOCKED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const;

type ModuleStatus = (typeof ModuleStatus)[keyof typeof ModuleStatus];

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string; 
  status: ModuleStatus;
  progress: number; // 0-100
}

const INITIAL_MODULES: Module[] = [
  {
    id: 'acids-bases',
    title: 'Acids & Bases',
    description: 'Master the pH scale and save the alien garden.',
    icon: 'flask',
    color: 'bg-purple-500',
    status: ModuleStatus.IN_PROGRESS,
    progress: 35
  },
  {
    id: 'atomic-structure',
    title: 'Atomic Structure',
    description: 'Build atoms from protons, neutrons, and electrons.',
    icon: 'atom',
    color: 'bg-blue-500',
    status: ModuleStatus.LOCKED,
    progress: 0
  },
  {
    id: 'chemical-reactions',
    title: 'Chemical Reactions',
    description: 'Mix volatile compounds safely.',
    icon: 'zap',
    color: 'bg-orange-500',
    status: ModuleStatus.LOCKED,
    progress: 0
  }
];

/* --- SHARED COMPONENTS ---*/

// Circular Progress
const ProgressCircle: React.FC<{ progress: number; locked: boolean; colorClass: string }> = ({ progress, locked, colorClass }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const strokeColor = colorClass.replace('bg-', 'text-');

  if (locked) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
        <Lock size={18} />
      </div>
    );
  }

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Background Icon Wrapper */}
      <div className={`absolute inset-0 rounded-full opacity-10 ${colorClass}`}></div>
      
      <svg className="w-full h-full transform -rotate-90">
        {/* Track */}
        <circle
          className="text-gray-200"
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
        />
        {/* Indicator */}
        <circle
          className={`${strokeColor} transition-all duration-1000 ease-out`}
          strokeWidth="3"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
          style={{ 
            strokeDasharray: circumference, 
            strokeDashoffset: strokeDashoffset 
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
         {progress === 100 ? (
           <CheckCircle size={16} className="text-green-500" />
         ) : (
           <Play size={16} fill="currentColor" className={strokeColor} />
         )}
      </div>
    </div>
  );
};

// Visual pH Meter
const PHMeter: React.FC<{ current: number; target: number }> = ({ current, target }) => {
  const minPh = 0;
  const maxPh = 14;
  const range = maxPh - minPh;
  
  // Calculate marker position
  const currentPos = (current / range) * 100;

  // Calculate target zone 
  const targetStart = Math.max(0, target - 1.5);
  const targetEnd = Math.min(14, target + 1.5);
  const targetLeft = (targetStart / range) * 100;
  const targetWidth = ((targetEnd - targetStart) / range) * 100;

  return (
    <div className="w-full mb-6 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="flex justify-between items-end mb-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Soil Acidity Meter</p>
        <p className="font-mono text-lg font-bold text-gray-900">pH {current.toFixed(1)}</p>
      </div>
      
      {/* pH Scale Bar */}
      <div className="relative h-6 w-full rounded-full overflow-hidden bg-gray-100 inner-shadow">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            background: 'linear-gradient(to right, #ef4444 0%, #22c55e 50%, #a855f7 100%)'
          }}
        />
        
        {/* Target Zone Highlight */}
        <div 
          className="absolute h-full border-y-2 border-white/50 bg-white/20 backdrop-blur-[1px] shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ left: `${targetLeft}%`, width: `${targetWidth}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white"></div>
        </div>
        
        {/* Current pH Marker Needle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-gray-900 shadow-lg transition-all duration-300 ease-out z-10"
          style={{ left: `${currentPos}%` }}
        >
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rounded-full shadow-md"></div>
        </div>
      </div>

      <div className="flex justify-between mt-2 text-[10px] font-semibold text-gray-400">
        <span>0 (Acid)</span>
        <span>7 (Neutral)</span>
        <span>14 (Base)</span>
      </div>
    </div>
  );
};

// Layout Component
const Layout: React.FC<{ 
  children: React.ReactNode; 
  title: string; 
  xp: number; 
  onBack?: () => void;
}> = ({ children, title, xp, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center font-sans text-slate-900">
      <div className="w-full max-w-md bg-white shadow-2xl min-h-screen relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition active:scale-90">
                <ArrowLeft className="w-6 h-6 text-slate-700" />
              </button>
            ) : (
              <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition active:scale-90">
                <Menu className="w-6 h-6 text-slate-700" />
              </button>
            )}
            <h1 className="font-bold text-xl text-slate-900 tracking-tight">{title}</h1>
          </div>

            {/* XP Badge */}
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500" fill="currentColor" />
            <span className="font-bold text-amber-700 text-sm">{xp}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>

        {/* Bottom Nav (Only if not in sub-view) */}
        {!onBack && (
          <nav className="border-t border-gray-100 bg-white px-6 py-2 flex justify-between items-center pb-6 safe-area-pb">
            <NavIcon active icon={<Home size={24} />} label="Learn" />
            <NavIcon icon={<Search size={24} />} label="Explore" />
            <NavIcon icon={<User size={24} />} label="Profile" />
          </nav>
        )}
      </div>
    </div>
  );
};

const NavIcon = ({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <button className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${active ? 'text-indigo-600' : 'text-gray-400 hover:bg-gray-50'}`}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);


/*--- SIMULATION MODULE --- */

const AlienGardenSim: React.FC<{ onComplete: () => void; addXp: (amount: number) => void }> = ({ onComplete, addXp }) => {
  const [ph, setPh] = useState(7);
  const targetPh = 4; // Zogberry needs acidic soil
  const [liquidColor, setLiquidColor] = useState('#22c55e');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [simComplete, setSimComplete] = useState(false);
  const [plantState, setPlantState] = useState<'happy'|'sad'|'neutral'>('neutral');

  // React to pH changes
  useEffect(() => {
    // Visual color logic
    if (ph < 6) setLiquidColor('#ef4444'); // Acid/Red
    else if (ph > 8) setLiquidColor('#a855f7'); // Base/Purple
    else setLiquidColor('#22c55e'); // Neutral/Green

    // Plant state logic (visual only)
    const dist = Math.abs(ph - targetPh);
    if (dist <= 1.5) setPlantState('happy');
    else if (dist > 3) setPlantState('sad');
    else setPlantState('neutral');

  }, [ph]);

  const modifyPh = (amount: number) => {
    if (simComplete) return;
    setPh(prev => {
      const newVal = prev + amount;
      return Math.min(14, Math.max(0, parseFloat(newVal.toFixed(1))));
    });
    setFeedback(null); // Clear old feedback on change
  };

  const checkResults = () => {
    if (analyzing || simComplete) return;
    setAnalyzing(true);
    
    // Feedback
    setTimeout(() => {
      setAnalyzing(false);
      const dist = Math.abs(ph - targetPh);

      if (dist <= 1) {
        setSimComplete(true);
        setFeedback("Perfect! The soil is acidic enough for the Zogberry to thrive. Good job!");
        addXp(50);
      } else if (ph > targetPh) {
        setFeedback("The soil is too basic. The leaves are turning purple! Try adding some acid.");
      } else {
        setFeedback("Whoa, too acidic! The roots are burning. Add some base to neutralize.");
      }
    }, 1200);
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-full pb-20">
      
      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-2">
          Simulation Active
        </div>
        <h3 className="text-xl font-bold text-gray-900">Mission: Grow the Zogberry</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-[280px] mx-auto">
          Adjust the soil to <strong>pH {targetPh}</strong>. Zogberries love acid!
        </p>
      </div>

      {/* NEW: pH Meter Component */}
      <PHMeter current={ph} target={targetPh} />

      {/* Main Simulation Viewport */}
      <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-3xl overflow-hidden shadow-xl mb-6 border-[6px] border-slate-800 ring-1 ring-white/20">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Liquid */}
        <div 
          className="absolute bottom-0 w-full transition-colors duration-700 ease-in-out"
          style={{ height: '40%', backgroundColor: liquidColor, opacity: 0.8 }}
        >
          {/* Bubbles */}
          <div className="absolute top-2 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-6 right-1/3 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-150"></div>
        </div>

        {/* Plant Container */}
        <div className="absolute inset-0 flex items-center justify-center pt-12">
           <div 
             className={`text-7xl transition-all duration-500 ${
               plantState === 'happy' ? 'scale-125 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 
               plantState === 'sad' ? 'scale-75 opacity-70 grayscale' : 'scale-100'
             }`}
           >
             {simComplete ? '🌺' : plantState === 'sad' ? '🥀' : '🌱'}
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <button 
          onClick={() => modifyPh(-1)}
          disabled={simComplete}
          className="group relative overflow-hidden flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-2xl active:scale-95 transition border border-red-100"
        >
          <div className="bg-white p-2.5 rounded-full mb-2 shadow-sm group-hover:scale-110 transition">
            <Droplet className="w-5 h-5 text-red-500" fill="currentColor" />
          </div>
          <span className="font-bold text-red-900">Add Acid</span>
          <span className="text-[10px] text-red-600 font-medium bg-red-100 px-2 py-0.5 rounded-full mt-1">-1 pH</span>
        </button>

        <button 
          onClick={() => modifyPh(1)}
          disabled={simComplete}
          className="group relative overflow-hidden flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl active:scale-95 transition border border-purple-100"
        >
           <div className="bg-white p-2.5 rounded-full mb-2 shadow-sm group-hover:scale-110 transition">
            <FlaskConical className="w-5 h-5 text-purple-500" fill="currentColor" />
          </div>
          <span className="font-bold text-purple-900">Add Base</span>
          <span className="text-[10px] text-purple-600 font-medium bg-purple-100 px-2 py-0.5 rounded-full mt-1">+1 pH</span>
        </button>
      </div>

      {/* Feedback / Action Button */}
      <div className="w-full">
        {!feedback ? (
           <button 
           onClick={checkResults}
           disabled={analyzing}
           className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 active:scale-95 transition flex items-center justify-center gap-3"
         >
           {analyzing ? (
             <>
               <RefreshCcw className="animate-spin w-5 h-5" /> Analyzing Soil...
             </>
           ) : (
             'Check Growth'
           )}
         </button>
        ) : (
          <div className={`p-5 rounded-2xl border-l-4 ${simComplete ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'} shadow-sm animate-in fade-in slide-in-from-bottom-4`}>
            <div className="flex items-start gap-3">
              {simComplete ? <CheckCircle className="text-green-600 w-6 h-6 shrink-0 mt-0.5" /> : <AlertCircle className="text-orange-600 w-6 h-6 shrink-0 mt-0.5" />}
              <div>
                <h4 className={`font-bold text-sm uppercase tracking-wide mb-1 ${simComplete ? 'text-green-800' : 'text-orange-800'}`}>
                  {simComplete ? 'Experiment Success' : 'Analysis Result'}
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  "{feedback}"
                </p>
                {simComplete ? (
                   <button onClick={onComplete} className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700 transition">
                     Complete Module
                   </button>
                ) : (
                  <button onClick={() => setFeedback(null)} className="text-sm font-bold text-orange-700 hover:text-orange-800 hover:underline flex items-center gap-1">
                    <RefreshCcw className="w-3 h-3" /> Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * --- MAIN APP COMPONENT ---
 */

const App = () => {
  // Simple State Management
  const [view, setView] = useState<'home' | 'module-intro' | 'module-sim' | 'module-done'>('home');
  const [xp, setXp] = useState(1250);
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);

  const activeModule = modules.find(m => m.id === 'acids-bases')!;

  // Handlers
  const handleStartModule = () => {
    setView('module-intro');
  };

  const startSimulation = () => {
    setView('module-sim');
  };

  const completeSimulation = () => {
    setView('module-done');
    // Update Module Data
    setModules(prev => prev.map(m => 
      m.id === 'acids-bases' ? { ...m, status: ModuleStatus.COMPLETED, progress: 100 } : m
    ));
  };

  const goHome = () => {
    setView('home');
  };

  const handleAddXp = (amount: number) => {
    setXp(prev => prev + amount);
  };

  // --- RENDER VIEWS ---

  if (view === 'home') {
    return (
      <Layout title="ChemXplore" xp={xp}>
        <div className="p-6 space-y-6 pb-24">
          
          {/* Welcome Card */}
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
              <p className="text-indigo-100 mb-6 text-sm">Ready to master Chemical Reactions?</p>
              
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                <span>Level 4</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-indigo-900/40 rounded-full h-3 mb-2 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full rounded-full w-[85%] shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Module List */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-bold text-slate-900">Chemistry Track</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">3 Modules</span>
            </div>
            
            <div className="space-y-4">
              {modules.map((module) => {
                const isLocked = module.status === ModuleStatus.LOCKED;
                return (
                  <button 
                    key={module.id} 
                    onClick={() => !isLocked && handleStartModule()}
                    disabled={isLocked}
                    className={`w-full text-left relative overflow-hidden rounded-2xl border transition-all duration-300 group ${
                      isLocked 
                        ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed' 
                        : 'bg-white border-indigo-50 shadow-sm hover:shadow-lg hover:border-indigo-100 hover:-translate-y-1'
                    }`}
                  >
                    <div className="p-5 flex items-center gap-5">
                      {/* Improved Progress Circle */}
                      <div className="flex-shrink-0">
                        <ProgressCircle 
                          progress={module.progress} 
                          locked={isLocked} 
                          colorClass={module.color} 
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-bold text-lg ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                            {module.title}
                          </h4>
                          {!isLocked && (
                             <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 pr-4">{module.description}</p>
                      </div>
                    </div>
                    {/* Status Bar Indicator at bottom */}
                    {!isLocked && (
                      <div className="h-1 w-full bg-indigo-50">
                        <div 
                          className={`h-full ${module.color}`} 
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // --- MODULE INTRO ---
  if (view === 'module-intro') {
    return (
      <Layout title={activeModule.title} xp={xp} onBack={goHome}>
        <div className="p-6 flex flex-col h-full justify-center min-h-[80vh]">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden">
            <div className="w-24 h-24 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
              <span className="text-5xl">🍋</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Acids & Bases</h2>
            <div className="space-y-4 text-slate-600 mb-8 leading-relaxed text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
               <p>🔬 <strong>Concept:</strong> Just like hot and cold, chemicals have a scale called pH.</p>
               <p>📉 <strong>Acids</strong> (pH &lt; 7) are sour like lemons.</p>
               <p>📈 <strong>Bases</strong> (pH &gt; 7) are slippery like soap.</p>
               <p>💧 <strong>Water</strong> is neutral at pH 7.</p>
            </div>

            <button 
              onClick={startSimulation}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition flex items-center justify-center gap-2"
            >
              Start Experiment <Play size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // --- MODULE SIMULATION ---
  if (view === 'module-sim') {
    return (
      <Layout title="Lab: pH Balance" xp={xp} onBack={goHome}>
        <AlienGardenSim onComplete={completeSimulation} addXp={handleAddXp} />
      </Layout>
    );
  }

  // --- MODULE COMPLETED ---
  if (view === 'module-done') {
    return (
      <Layout title="Module Complete" xp={xp} onBack={goHome}>
        <div className="p-8 flex flex-col h-full justify-center text-center items-center min-h-[80vh]">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full"></div>
            <div className="text-8xl relative z-10 animate-bounce">🏆</div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Excellent Work!</h2>
          <p className="text-slate-500 mb-8 max-w-xs">You've mastered the basics of pH balance and saved the garden.</p>
          
          <div className="bg-slate-50 p-6 rounded-2xl w-full mb-8 border border-slate-100">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-600">Total XP Gained</span>
                <span className="text-lg font-bold text-amber-600">+50 XP</span>
             </div>
             <div className="w-full bg-slate-200 rounded-full h-2">
               <div className="bg-amber-500 h-2 rounded-full w-full"></div>
             </div>
          </div>

          <button 
            onClick={goHome}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-slate-800 active:scale-95 transition"
          >
            Return to Path
          </button>
        </div>
      </Layout>
    );
  }
  
  return null;
};

export default App;