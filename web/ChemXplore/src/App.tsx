
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Lock, 
  Trophy, 
  Home, 
  Search, 
  User, 
  Droplet, 
  FlaskConical, 
  CheckCircle, 
  Zap,
  Lightbulb,
  XCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

/**
 * --- TYPES & MOCK DATA ---
 */

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
  progress: number;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
    id: 'reaction-types',
    title: 'Reaction Types',
    description: 'Solve atomic logic puzzles to synthesize new compounds.',
    icon: 'atom',
    color: 'bg-blue-500',
    status: ModuleStatus.IN_PROGRESS, 
    progress: 0
  },
  {
    id: 'solution-properties',
    title: 'Solution Properties',
    description: 'Test conductivity and solubility in the virtual lab.',
    icon: 'zap',
    color: 'bg-orange-500',
    status: ModuleStatus.IN_PROGRESS, 
    progress: 0
  }
];

const QUIZ_DATA: Record<string, Question[]> = {
  'acids-bases': [
    { id: 1, text: "What is the pH of a neutral solution like pure water?", options: ["0", "7", "14", "1"], correctIndex: 1, explanation: "Pure water is neutral, sitting exactly in the middle of the pH scale at 7." },
    { id: 2, text: "Which of these is a characteristic of an ACID?", options: ["Feels slippery", "Tastes bitter", "Tastes sour", "Turns litmus blue"], correctIndex: 2, explanation: "Acids, like lemons and vinegar, are known for their sour taste." },
    { id: 3, text: "What ion do acids release in water?", options: ["OH- (Hydroxide)", "H+ (Hydrogen)", "Na+ (Sodium)", "Cl- (Chloride)"], correctIndex: 1, explanation: "Acids increase the concentration of Hydrogen ions (H+) in a solution." },
    { id: 4, text: "If a solution has a pH of 13, it is:", options: ["Strongly Acidic", "Weakly Acidic", "Neutral", "Strongly Basic"], correctIndex: 3, explanation: "The scale goes to 14. 13 is very high, indicating a strong base." },
    { id: 5, text: "Which common household item is a base?", options: ["Lemon Juice", "Vinegar", "Soap", "Soda"], correctIndex: 2, explanation: "Soap and cleaning products are typically basic (alkaline)." },
    { id: 6, text: "What color does blue litmus paper turn when dipped in acid?", options: ["Red", "Blue", "Green", "Yellow"], correctIndex: 0, explanation: "Acids turn blue litmus paper red." },
    { id: 7, text: "In our simulation, what did the Zogberry bush require?", options: ["Basic soil (pH 10)", "Neutral soil (pH 7)", "Acidic soil (pH 4)", "No soil"], correctIndex: 2, explanation: "The Zogberry thrived in an acidic environment around pH 4." },
    { id: 8, text: "What happens when you mix an equal strength acid and base?", options: ["Explosion", "Neutralization", "Freezing", "Nothing"], correctIndex: 1, explanation: "They neutralize each other, typically forming water and a salt." },
    { id: 9, text: "Which is more acidic: pH 3 or pH 5?", options: ["pH 5", "pH 3", "They are equal", "Depends on temperature"], correctIndex: 1, explanation: "Lower numbers on the pH scale indicate stronger acidity." },
    { id: 10, text: "The pH scale is logarithmic. A change of 1 pH unit means a concentration change of:", options: ["1x", "10x", "100x", "2x"], correctIndex: 1, explanation: "Each step on the pH scale represents a tenfold change in acidity." }
  ],
  'reaction-types': [
    { id: 1, text: "What is the general form of a Synthesis reaction?", options: ["AB → A + B", "A + B → AB", "AB + C → AC + B", "AB + CD → AD + CB"], correctIndex: 1, explanation: "Synthesis combines two reactants into one product." },
    { id: 2, text: "In a Single Replacement reaction, what determines if a metal can replace another?", options: ["Atomic Mass", "Density", "The Activity Series", "Color"], correctIndex: 2, explanation: "A more reactive metal (higher on activity series) replaces a less reactive one." },
    { id: 3, text: "What is the product of Mg + O2?", options: ["MgO", "Mg2O", "MgO2", "Mg+O"], correctIndex: 0, explanation: "Magnesium is +2 and Oxygen is -2, so they form MgO." },
    { id: 4, text: "AB → A + B represents which type of reaction?", options: ["Combustion", "Synthesis", "Decomposition", "Replacement"], correctIndex: 2, explanation: "Decomposition is breaking one compound into pieces." },
    { id: 5, text: "What is always a reactant in a Combustion reaction?", options: ["Carbon", "Nitrogen", "Oxygen", "Hydrogen"], correctIndex: 2, explanation: "Combustion requires Oxygen to burn." },
    { id: 6, text: "If Copper is below Magnesium on the activity series, will Cu + MgSO4 react?", options: ["Yes", "No", "Only if heated", "Maybe"], correctIndex: 1, explanation: "No, because Copper is less reactive than Magnesium, it cannot kick it out." },
    { id: 7, text: "What are the starting substances in a reaction called?", options: ["Products", "Catalysts", "Reactants", "Yields"], correctIndex: 2, explanation: "Reactants are on the left side of the arrow." },
    { id: 8, text: "What does the arrow '→' mean in a chemical equation?", options: ["Equals", "Yields/Produces", "Destroys", "Subtracts"], correctIndex: 1, explanation: "It indicates the direction of change, meaning 'yields'." },
    { id: 9, text: "Which type of reaction involves ions swapping partners (AB + CD → AD + CB)?", options: ["Single Replacement", "Double Replacement", "Synthesis", "Combustion"], correctIndex: 1, explanation: "Two compounds exchange ions in a double replacement reaction." },
    { id: 10, text: "In the simulation, we used Hydrogen and Oxygen to make:", options: ["Salt", "Water", "Gold", "Acid"], correctIndex: 1, explanation: "H2 + O2 → H2O (Water)." }
  ],
  'solution-properties': [
    { id: 1, text: "What is the 'Solute' in a solution?", options: ["The liquid part", "The substance being dissolved", "The container", "The heat source"], correctIndex: 1, explanation: "The solute (like salt) is dissolved into the solvent (like water)." },
    { id: 2, text: "Which of these conducted electricity in our simulation?", options: ["Sugar Water", "Salt Water", "Oil", "Pure Water"], correctIndex: 1, explanation: "Salt dissolves into ions (electrolytes) which conduct electricity." },
    { id: 3, text: "What do we call a substance that conducts electricity when dissolved?", options: ["Insulator", "Electrolyte", "Non-electrolyte", "Metal"], correctIndex: 1, explanation: "Electrolytes separate into charged ions that allow current to flow." },
    { id: 4, text: "Why didn't oil mix with the water?", options: ["Oil is too heavy", "Oil is polar", "Oil is non-polar", "Water is non-polar"], correctIndex: 2, explanation: "Water is polar and oil is non-polar. 'Like dissolves like'." },
    { id: 5, text: "What happens to Sugar molecules in water?", options: ["They break into ions", "They stay as whole molecules", "They explode", "They turn into salt"], correctIndex: 1, explanation: "Sugar dissolves but does not dissociate into ions, so it doesn't conduct." },
    { id: 6, text: "Which phrase best describes solubility?", options: ["Opposites attract", "Like dissolves like", "Heavy sinks", "Hot dissolves cold"], correctIndex: 1, explanation: "Polar dissolves polar; non-polar dissolves non-polar." },
    { id: 7, text: "Water is known as the:", options: ["Universal Solvent", "Universal Solute", "Universal Acid", "Universal Base"], correctIndex: 0, explanation: "Water dissolves more substances than any other liquid." },
    { id: 8, text: "If a lightbulb glows brightly during a test, the solution is a:", options: ["Weak electrolyte", "Non-electrolyte", "Strong electrolyte", "Insulator"], correctIndex: 2, explanation: "Bright light means lots of ions moving charge effectively." },
    { id: 9, text: "Is pure distilled water a good conductor?", options: ["Yes", "No", "Sometimes", "Only when cold"], correctIndex: 1, explanation: "Without dissolved ions, pure water is actually a poor conductor." },
    { id: 10, text: "Saturation involves:", options: ["Mixing two liquids", "Dissolving the maximum amount of solute", "Heating a liquid", "Freezing a liquid"], correctIndex: 1, explanation: "A saturated solution holds the max amount of solute possible at that temperature." }
  ]
};

/**
 * --- SHARED COMPONENTS ---
 */

const ProgressCircle: React.FC<{ progress: number; locked: boolean; colorClass: string }> = ({ progress, locked, colorClass }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const strokeColor = colorClass.replace('bg-', 'text-');

  if (locked) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm">
        <Lock size={22} />
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle className="text-gray-200" strokeWidth="4" stroke="currentColor" fill="transparent" r={radius} cx="32" cy="32" />
        <circle className={`${strokeColor} transition-all duration-1000 ease-out drop-shadow-lg`} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="32" cy="32" style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
         {progress === 100 ? <CheckCircle size={20} className="text-green-500 drop-shadow" /> : 
         <Play size={20} fill="currentColor" className={`${strokeColor} drop-shadow`} />}
      </div>
    </div>
  );
};

const Layout: React.FC<{
  children: React.ReactNode;
  title: string;
  xp: number;
  onBack?: () => void;
  currentTab: 'learn' | 'explore' | 'profile';
  onTabChange: (tab: 'learn' | 'explore' | 'profile') => void;
}> = ({ children, xp, currentTab, onTabChange }) => {  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex flex-col font-sans text-slate-900">
        {/* Top Nav Bar for Desktop */}
<nav className="w-full bg-white/80 backdrop-blur-xl shadow-lg border-b border-indigo-100/50 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
  {/* Left: Logo */}
  <div className="flex items-center gap-4">
  <span className="bg-black bg-clip-text text-transparent font-bold text-3xl tracking-tight select-none">ChemXplore</span>  </div>

  {/* Center/Right: Navigation Icons */}
  <div className="flex items-center gap-6">
    <NavIcon
      icon={<Home size={22} />}
      label="Learn"
      active={currentTab === 'learn'}
      onClick={() => onTabChange('learn')}
    />
    <NavIcon
      icon={<Search size={22} />}
      label="Explore"
      active={currentTab === 'explore'}
      onClick={() => onTabChange('explore')}
    />
    <NavIcon
      icon={<User size={22} />}
      label="Profile"
      active={currentTab === 'profile'}
      onClick={() => onTabChange('profile')}
    />
  </div>

  {/* Right: XP Badge */}
  <div className="flex items-center gap-2 bg-amber-50 px-5 py-2.5 rounded-full shadow-lg border-amber-100 shrink-0 transform hover:scale-105 transition-transform">
    <Trophy className="w-5 h-5 text-amber-500 drop-shadow" fill="currentColor" />
    <span className="font-bold text-amber-700 text-base drop-shadow">{xp}</span>
  </div>
</nav>



      <main className="flex-1 w-full max-w-6xl mx-auto px-8 py-8">
        {children}
      </main>

      {/* Optional: Desktop footer */}
      <footer className="w-full bg-white/60 backdrop-blur-sm border-t border-indigo-100/50 px-8 py-6 flex justify-between items-center text-sm text-slate-500 mt-10">
        <span>&copy; {new Date().getFullYear()} ChemXplore</span>
      </footer>
    </div>
  );
};

/**
 * --- NAVICON & TAB STATE ---
 */

const NavIcon = ({
  icon,
  label,
  active,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold transform
      ${active ? 'text-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md scale-105' : 'text-gray-500 hover:text-indigo-500 hover:bg-white/50 hover:scale-105'}
       ${className || ''}
    `}
    style={{ minWidth: 80 }}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);  


/**
 * --- QUIZ VIEW COMPONENT ---
 */

const QuizView: React.FC<{ moduleId: string; onComplete: (score: number) => void }> = ({ moduleId, onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const questions = QUIZ_DATA[moduleId];

  if (!questions) return <div>Quiz not found for this module.</div>;

  const currentQ = questions[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    if (index === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(i => i + 1);
    } else {
      onComplete(score + (selectedOption === currentQ.correctIndex ? 0 : 0)); // Score is already updated
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-300" 
          style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col">
        <div className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Question {currentQIndex + 1} of {questions.length}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
          {currentQ.text}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex justify-between items-center ";
            
            if (showFeedback) {
              if (idx === currentQ.correctIndex) {
                btnClass += "bg-green-50 border-green-500 text-green-800";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-50 border-red-500 text-red-800";
              } else {
                btnClass += "border-slate-100 text-slate-400 opacity-60";
              }
            } else {
              btnClass += "bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700 active:scale-[0.99]";
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleOptionClick(idx)}
                disabled={showFeedback}
                className={btnClass}
              >
                <span>{option}</span>
                {showFeedback && idx === currentQ.correctIndex && <CheckCircle size={20} className="text-green-600" />}
                {showFeedback && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle size={20} className="text-red-600" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        {showFeedback && (
          <div className="mt-auto pt-6 animate-in fade-in slide-in-from-bottom-4">
            <div className={`p-4 rounded-xl mb-4 ${selectedOption === currentQ.correctIndex ? 'bg-green-100' : 'bg-indigo-50'}`}>
              <div className="flex items-start gap-3">
                <HelpCircle className={`w-5 h-5 mt-0.5 ${selectedOption === currentQ.correctIndex ? 'text-green-700' : 'text-indigo-700'}`} />
                <div>
                  <span className={`block font-bold mb-1 ${selectedOption === currentQ.correctIndex ? 'text-green-800' : 'text-indigo-900'}`}>
                    {selectedOption === currentQ.correctIndex ? 'Correct!' : 'Explanation:'}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={nextQuestion}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              {currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * --- MODULE 1: ACIDS & BASES SIM ---
 */

const PHMeter: React.FC<{ current: number; target: number }> = ({ current, target }) => {
  const range = 14;
  const currentPos = (current / range) * 100;
  const targetLeft = (Math.max(0, target - 1.5) / range) * 100;
  const targetWidth = ((Math.min(14, target + 1.5) - Math.max(0, target - 1.5)) / range) * 100;

  return (
    <div className="w-full mb-6 p-4 rounded-lg bg-white shadow-xl border border-gray-100">
      <div className="flex justify-between items-end mb-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">pH Meter</p>
        <p className="font-mono text-lg font-bold text-gray-900">pH {current.toFixed(1)}</p>
      </div>
      <div className="relative h-6 w-full rounded-full overflow-hidden bg-gray-100 inner-shadow">
        <div className="absolute inset-0 opacity-80" style={{ background: 'linear-gradient(to right, #ef4444 0%, #22c55e 50%, #a855f7 100%)' }} />
        <div className="absolute h-full border-y-2 border-white/50 bg-white/20 backdrop-blur-[1px]" style={{ left: `${targetLeft}%`, width: `${targetWidth}%` }}>
           <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[4px] border-t-white"></div>
        </div>
        <div className="absolute top-0 bottom-0 w-1 bg-gray-900 shadow-lg transition-all duration-300 ease-out z-10" style={{ left: `${currentPos}%` }}></div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-semibold text-gray-400">
        <span>0 (Acid)</span><span>7 (Neutral)</span><span>14 (Base)</span>
      </div>
    </div>
  );
};

const AlienGardenSim: React.FC<{ onComplete: () => void; addXp: (amount: number) => void }> = ({ onComplete, addXp }) => {
  const [ph, setPh] = useState(7);
  const targetPh = 4;
  const [liquidColor, setLiquidColor] = useState('#22c55e');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [simComplete, setSimComplete] = useState(false);

  useEffect(() => {
    if (ph < 6) setLiquidColor('#ef4444');
    else if (ph > 8) setLiquidColor('#a855f7');
    else setLiquidColor('#22c55e');
  }, [ph]);

  const modifyPh = (amount: number) => {
    if (simComplete) return;
    setPh(prev => Math.min(14, Math.max(0, parseFloat((prev + amount).toFixed(1)))));
    setFeedback(null);
  };

  const checkResults = () => {
    const dist = Math.abs(ph - targetPh);
    if (dist <= 1) {
      setSimComplete(true);
      setFeedback("Perfect! The Zogberry thrives in this acidic environment.");
      addXp(50);
    } else {
      setFeedback(ph > targetPh ? "Too basic! The leaves are wilting." : "Too acidic! Roots are burning.");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center h-full pb-20">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Mission: Grow the Zogberry</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-[280px] mx-auto">
          Adjust the soil to <strong>pH {targetPh}</strong>. Zogberries love acid!
        </p>
      </div>
      <PHMeter current={ph} target={targetPh} />
      <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-3xl overflow-hidden shadow-xl mb-6 border-[6px] border-slate-800">
        <div className="absolute bottom-0 w-full transition-colors duration-700 ease-in-out" style={{ height: '50%', backgroundColor: liquidColor, opacity: 0.8 }} />
        <div className="absolute inset-0 flex items-center justify-center pt-12">
           <div className={`text-8xl transition-all duration-500 ${simComplete ? 'scale-125' : Math.abs(ph - targetPh) > 3 ? 'grayscale opacity-50' : 'scale-100'}`}>
             {simComplete ? '🌺' : Math.abs(ph - targetPh) > 3 ? '🥀' : '🌱'}
           </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <button onClick={() => modifyPh(-1)} disabled={simComplete} className="flex flex-col items-center p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition active:scale-95">
          <Droplet className="w-6 h-6 text-red-500 mb-1" />
          <span className="font-bold text-red-900">Add Acid</span>
          <span className="text-[10px] text-red-600 font-medium bg-red-100 px-2 py-0.5 rounded-full mt-1">-1 pH</span>
        </button>
        <button onClick={() => modifyPh(1)} disabled={simComplete} className="flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-100 transition active:scale-95">
          <FlaskConical className="w-6 h-6 text-purple-500 mb-1" />
          <span className="font-bold text-purple-900">Add Base</span>
          <span className="text-[10px] text-purple-600 font-medium bg-purple-100 px-2 py-0.5 rounded-full mt-1">+1 pH</span>
        </button>
      </div>
      <button onClick={simComplete ? onComplete : checkResults} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition flex items-center justify-center gap-2 ${simComplete ? 'bg-green-600 text-white' : 'bg-slate-900 text-white'}`}>
        {simComplete ? 'Next: Take Quiz' : 'Check Growth'} <ChevronRight size={20} />
      </button>
      {feedback && <p className="mt-4 text-center font-medium text-slate-700 bg-white p-3 rounded-lg shadow-xl border border-gray-100">{feedback}</p>}
    </div>
  );
};

/**
 * --- MODULE 2: REACTION TYPES SIM ---
 */

interface AtomData { id: string; symbol: string; color: string; activity: number; name: string }

const ReactionTypesSim: React.FC<{ onComplete: () => void; addXp: (amount: number) => void }> = ({ onComplete, addXp }) => {
  const [level, setLevel] = useState<1 | 2>(1);
  const [selectedAtom, setSelectedAtom] = useState<AtomData | null>(null);
  const [slots, setSlots] = useState<{ [key: string]: AtomData | null }>({ left1: null, left2: null, product: null });
  const [message, setMessage] = useState("Drag atoms to the reaction slots.");

  const H: AtomData = { id: 'H', symbol: 'H', color: 'bg-white border-slate-300 text-slate-700', activity: 1, name: 'Hydrogen' };
  const O: AtomData = { id: 'O', symbol: 'O', color: 'bg-red-100 border-red-300 text-red-700', activity: 2, name: 'Oxygen' };
  const Cu: AtomData = { id: 'Cu', symbol: 'Cu', color: 'bg-orange-100 border-orange-300 text-orange-700', activity: 3, name: 'Copper' }; 
  const Mg: AtomData = { id: 'Mg', symbol: 'Mg', color: 'bg-blue-100 border-blue-300 text-blue-700', activity: 8, name: 'Magnesium' }; 

  const inventory = level === 1 ? [H, H, O] : [Mg, Cu];

  useEffect(() => {
    if (level === 1 && slots.left1?.symbol === 'H' && slots.left2?.symbol === 'H') {
      setMessage("Two Hydrogens... now add Oxygen!");
    }
  }, [slots, level]);

  const handleSlotClick = (slotId: string) => {
    if (!selectedAtom) return;
    
    if (level === 2 && slotId === 'compound') {
      const compoundMetal = Cu; 
      if (selectedAtom.activity > compoundMetal.activity) {
        setMessage(`Reaction Success! ${selectedAtom.name} is more reactive.`);
        setSlots(prev => ({ ...prev, product: selectedAtom })); 
        setTimeout(() => {
            onComplete();
            addXp(75);
        }, 1500);
      } else {
        setMessage("Reaction Failed. Not reactive enough.");
        setSelectedAtom(null);
      }
      return;
    }

    setSlots(prev => {
        const newSlots = { ...prev, [slotId]: selectedAtom };
        if (level === 1 && newSlots.left1?.symbol === 'H' && newSlots.left2?.symbol === 'H' && newSlots.product?.symbol === 'O') {
            setTimeout(() => {
                setLevel(2);
                setSlots({ left1: null, left2: null, product: null });
                setMessage("Synthesis Complete! Level 2: Single Replacement.");
                setSelectedAtom(null);
            }, 1000);
            return newSlots;
        }
        return newSlots;
    });
    setSelectedAtom(null);
  };

  return (
    <div className="p-6 flex flex-col h-full bg-slate-50">
      <div className="mb-6">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">
            Level {level}: {level === 1 ? 'Synthesis' : 'Single Replacement'}
        </span>
        <h3 className="text-xl font-bold text-gray-900">The Atom Factory</h3>
        <p className="text-sm text-gray-500 mt-1 h-10">{message}</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 mb-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 bg-slate-200 text-slate-600 text-[10px] px-2 rounded-full font-bold">REACTION CHAMBER</div>
        
        <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2 items-center">
                {level === 1 ? (
                    <>
                        <div onClick={() => handleSlotClick('left1')} className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                            {slots.left1 ? <span className={`font-bold text-xl ${slots.left1.color.split(' ')[2]}`}>{slots.left1.symbol}</span> : <span className="text-slate-300">+</span>}
                        </div>
                        <div onClick={() => handleSlotClick('left2')} className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                             {slots.left2 ? <span className={`font-bold text-xl ${slots.left2.color.split(' ')[2]}`}>{slots.left2.symbol}</span> : <span className="text-slate-300">+</span>}
                        </div>
                    </>
                ) : (
                    <div onClick={() => handleSlotClick('compound')} className="w-20 h-20 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-center relative">
                        <span className="text-sm font-bold text-blue-800">CuSO₄</span>
                        <div className="absolute -bottom-6 text-[10px] text-blue-400 font-bold">Target</div>
                    </div>
                )}
            </div>

            <div className="text-slate-400 font-bold text-2xl">→</div>

            <div className="flex flex-col items-center">
                 {level === 1 ? (
                    <div onClick={() => handleSlotClick('product')} className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                         {slots.product ? <span className={`font-bold text-xl ${slots.product.color.split(' ')[2]}`}>{slots.product.symbol}</span> : <span className="text-slate-300">Product</span>}
                    </div>
                 ) : (
                    <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50">
                        {slots.product ? (
                            <div className="text-center">
                                <span className={`font-bold text-xl block ${slots.product.color.split(' ')[2]}`}>{slots.product.symbol}SO₄</span>
                                <span className="text-[10px] text-slate-400">+ Cu</span>
                            </div>
                        ) : <span className="text-slate-300">?</span>}
                    </div>
                 )}
            </div>
        </div>
      </div>

      <div className="bg-slate-200 rounded-lg p-4 flex gap-4 overflow-x-auto justify-center">
        {inventory.map((atom, idx) => (
            <button
                key={idx}
                onClick={() => setSelectedAtom(atom)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center font-bold text-lg border-2 transition transform active:scale-90 ${atom.color} ${selectedAtom === atom ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110' : ''}`}
            >
                {atom.symbol}
            </button>
        ))}
      </div>
    </div>
  );
};

/**
 * --- MODULE 3: SOLUTION PROPERTIES SIM ---
 */

const SolutionPropertiesSim: React.FC<{ onComplete: () => void; addXp: (amount: number) => void }> = ({ onComplete, addXp }) => {
  const [solute, setSolute] = useState<'salt' | 'sugar' | 'oil' | null>(null);
  const [isMixed, setIsMixed] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleMix = () => {
    if (!solute) return;
    setIsMixed(true);
    
    setTimeout(() => {
        if (solute === 'salt') {
            setLightOn(true); 
        } else {
            setLightOn(false); 
        }
        setShowResult(true);
        if (solute === 'salt') addXp(20);
    }, 1500);
  };

  const reset = () => {
    setIsMixed(false);
    setLightOn(false);
    setShowResult(false);
    setSolute(null);
  };

  return (
    <div className="p-6 flex flex-col h-full bg-slate-900 text-white">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="text-yellow-400" fill="currentColor" /> Conductivity Lab
        </h3>
        <p className="text-sm text-slate-400">Determine which solute is an electrolyte.</p>
      </div>

      <div className="flex-1 bg-slate-800 rounded-3xl p-6 relative border border-slate-700 flex flex-col items-center justify-center mb-6">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <Lightbulb 
                size={48} 
                className={`transition-all duration-300 ${lightOn ? 'text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]' : 'text-slate-600'}`} 
                fill={lightOn ? "currentColor" : "none"}
            />
            <div className="w-32 h-2 bg-slate-700 mt-2 rounded-full relative">
                 <div className="absolute top-0 left-0 w-1/2 h-full border-b-2 border-slate-500 rounded-full"></div>
                 <div className="absolute top-2 left-4 w-1 h-12 bg-slate-600"></div>
                 <div className="absolute top-2 right-4 w-1 h-12 bg-slate-600"></div>
            </div>
        </div>

        <div className="mt-24 w-40 h-48 border-x-4 border-b-4 border-white/20 rounded-b-3xl relative overflow-hidden backdrop-blur-sm">
            <div className="absolute bottom-0 w-full h-3/4 bg-blue-500/20 transition-all"></div>
            <div className="absolute top-0 left-8 w-2 h-32 bg-slate-400 rounded-b-lg"></div>
            <div className="absolute top-0 right-8 w-2 h-32 bg-slate-400 rounded-b-lg"></div>
            {isMixed && (
                <div className="absolute inset-0 pt-16 px-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                            key={i}
                            className={`absolute w-3 h-3 rounded-full transition-all duration-[2000ms] ${
                                solute === 'salt' ? 'bg-white animate-pulse' : 
                                solute === 'sugar' ? 'bg-pink-200' : 'bg-yellow-400'
                            }`}
                            style={{
                                top: isMixed ? (solute === 'oil' ? '25%' : `${Math.random() * 60 + 30}%`) : '10%',
                                left: isMixed ? `${Math.random() * 80 + 10}%` : '50%',
                                opacity: isMixed ? 1 : 0
                            }}
                        >
                            {solute === 'salt' && (
                                <span className="absolute -top-3 left-0 text-[8px] font-bold text-white">{i % 2 === 0 ? '+' : '-'}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {showResult && (
            <div className="absolute bottom-4 bg-black/60 px-4 py-2 rounded-xl backdrop-blur-md">
                <span className={`font-bold ${lightOn ? 'text-green-400' : 'text-red-400'}`}>
                    {lightOn ? 'Circuit Complete! (Electrolyte)' : 'No Conductivity'}
                </span>
            </div>
        )}
      </div>

      {!isMixed ? (
          <div className="grid grid-cols-3 gap-3">
            {['salt', 'sugar', 'oil'].map((s) => (
                <button 
                    key={s}
                    onClick={() => setSolute(s as any)}
                    className={`p-4 rounded-xl font-bold capitalize text-sm transition ${solute === s ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    {s}
                </button>
            ))}
          </div>
      ) : (
          <button onClick={reset} className="w-full py-4 bg-slate-700 rounded-xl font-bold text-white hover:bg-slate-600">
            Reset Experiment
          </button>
      )}

      {!isMixed && (
          <button 
            onClick={handleMix}
            disabled={!solute}
            className="w-full mt-4 py-4 bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/50"
          >
            Mix & Test
          </button>
      )}

      {showResult && solute === 'salt' && (
           <button onClick={onComplete} className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl font-bold animate-pulse">
               Next: Take Quiz
           </button>
      )}
    </div>
  );
};

/**
 * --- MAIN APP COMPONENT ---
 */

const App = () => {
  const [tab, setTab] = useState<'learn' | 'explore' | 'profile'>('learn');
  const [view, setView] = useState<'home' | 'module-intro' | 'module-sim' | 'module-quiz' | 'module-done'>('home');
  const [activeModuleId, setActiveModuleId] = useState<string>('acids-bases');
  const [xp, setXp] = useState(1250);
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [lastQuizScore, setLastQuizScore] = useState(0);
  

  const activeModule = modules.find(m => m.id === activeModuleId)!;

  const handleStartModule = (id: string) => {
    setActiveModuleId(id);
    setView('module-intro');
  };

  const completeSimulation = () => {
    setView('module-quiz');
  };

  const completeQuiz = (score: number) => {
    setLastQuizScore(score);
    // Add quiz score * 10 to XP
    setXp(x => x + (score * 10));
    setModules(prev => prev.map(m => 
      m.id === activeModuleId ? { ...m, status: ModuleStatus.COMPLETED, progress: 100 } : m
    ));
    setView('module-done');
  };

  const renderSimulation = () => {
      switch(activeModuleId) {
          case 'acids-bases': return <AlienGardenSim onComplete={completeSimulation} addXp={setXp} />;
          case 'reaction-types': return <ReactionTypesSim onComplete={completeSimulation} addXp={setXp} />;
          case 'solution-properties': return <SolutionPropertiesSim onComplete={completeSimulation} addXp={setXp} />;
          default: return <div>Module Not Found</div>;
      }
  };

  const renderIntroContent = () => {
      switch(activeModuleId) {
          case 'reaction-types':
              return (
                <>
                  <p>⚛️ <strong>Concept:</strong> Atoms swap partners based on "Activity".</p>
                  <p>🔄 <strong>Rule:</strong> A single element can only kick out another if it is <em>stronger</em> (more reactive).</p>
                </>
              );
          case 'solution-properties':
               return (
                <>
                  <p>⚡ <strong>Electrolytes:</strong> Substances like Salt that split into ions and conduct electricity.</p>
                  <p>🚫 <strong>Non-Electrolytes:</strong> Sugar dissolves but doesn't split. Oil doesn't even dissolve!</p>
                </>
              );
          default:
              return (
                <>
                  <p>🔬 <strong>Concept:</strong> The pH scale measures acidity.</p>
                  <p>📉 <strong>Acids</strong> (pH &lt; 7) are sour.</p>
                  <p>📈 <strong>Bases</strong> (pH &gt; 7) are slippery.</p>
                   <p>💧 <strong>Water</strong> is neutral at pH 7.</p>
                </>
              );
      }
  }

  // --- RENDER VIEWS ---

  if (view === 'home') {
    return (
      <Layout title="ChemXplore" xp={xp} currentTab={tab} onTabChange={setTab}>
        <div className="p-6 space-y-8 pb-24">
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 opacity-10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-3 drop-shadow-lg">Welcome Back!</h2>
              <p className="text-indigo-100 mb-8 text-base">Ready to master Chemical Reactions?</p>
              <div className="w-full bg-indigo-900/40 backdrop-blur-sm rounded-full h-4 mb-3 overflow-hidden border border-white/20">
                <div className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 h-full rounded-full w-[85%] shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 px-1">Chemistry Track</h3>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">3 Modules</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {modules.map((module) => (
                <button key={module.id} onClick={() => module.status !== ModuleStatus.LOCKED && handleStartModule(module.id)} disabled={module.status === ModuleStatus.LOCKED} 
                className={`w-full text-left relative overflow-hidden rounded-2xl border-2 transition-all duration-300 group ${module.status === ModuleStatus.LOCKED ? 'bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200 opacity-70 cursor-not-allowed' : 'bg-white border-transparent shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-200'}`}>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${module.color}`}></div>
                    <div className="p-6 flex items-start gap-4 relative z-10">
                      <div className="flex-shrink-0 mt-1">
                        <ProgressCircle 
                        progress={module.progress} 
                        locked={module.status === ModuleStatus.LOCKED} 
                        colorClass={module.color} />
                      </div>
                      <div className="flex-1">
                        <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 ${module.status === ModuleStatus.LOCKED ? 'bg-gray-200 text-gray-500' : `${module.color} bg-opacity-20`}`}>
                          {module.status === ModuleStatus.LOCKED ? 'LOCKED' : module.progress === 100 ? 'COMPLETED' : 'IN PROGRESS'}
                        </div>
                        <h4 className={`font-bold text-lg mb-2 ${module.status === ModuleStatus.LOCKED ? 'text-slate-400' : 'text-slate-900'}`}>{module.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{module.description}</p>
                        {module.status !== ModuleStatus.LOCKED && module.progress < 100 && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-medium">Progress</span>
                              <span className="font-bold text-indigo-600">{module.progress}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (view === 'module-intro') {
    return (
     <Layout title="ChemXplore" xp={xp} currentTab={tab} onTabChange={setTab}>
        <div className="p-6 flex flex-col h-full justify-center min-h-[80vh]">
          <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 text-center relative overflow-hidden">
            <div className={`w-24 h-24 ${activeModule.color.replace('bg-', 'bg-opacity-20 bg-')} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3`}>
               <div className={`text-5xl ${activeModule.color.replace('bg-', 'text-')}`}>
                  {activeModule.icon === 'flask' ? '⚗️' : activeModule.icon === 'atom' ? '⚛️' : '⚡'}
               </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{activeModule.title}</h2>
            <div className="space-y-4 text-slate-600 mb-8 leading-relaxed text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
               {renderIntroContent()}
            </div>
            <button onClick={() => setView('module-sim')} className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition flex items-center justify-center gap-2">
              Start Lab 
              <Play size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (view === 'module-sim') {
    return (
     <Layout title="ChemXplore" xp={xp} currentTab={tab} onTabChange={setTab}>
        {renderSimulation()}
      </Layout>
    );
  }

  if (view === 'module-quiz') {
    return (
      <Layout title="ChemXplore" xp={xp} currentTab={tab} onTabChange={setTab}>
        <QuizView moduleId={activeModuleId} onComplete={completeQuiz} />
      </Layout>
    );
  }

  if (view === 'module-done') {
    return (
      <Layout title="ChemXplore" xp={xp} currentTab={tab} onTabChange={setTab}>
        <div className="p-5 flex flex-col h-full justify-center text-center items-center min-h-[80vh]">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full"></div>
            <div className="text-8xl relative z-10 animate-bounce">🏆</div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Module Conquered!</h2>
          <p className="text-slate-500 mb-8 max-w-xs">You've successfully mastered {activeModule.title}.</p>
          
          {/* Quiz Score Summary */}
          <div className="w-full bg-slate-50 rounded-lg p-6 border border-slate-100 mb-6">
             <div className="flex justify-between items-center mb-2">
               <span className="font-bold text-slate-500 text-sm uppercase">Quiz Score</span>
               <span className={`font-bold text-xl ${lastQuizScore >= 7 ? 'text-green-600' : 'text-orange-500'}`}>
                 {lastQuizScore}/10
               </span>
             </div>
             <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
               <div 
                 className={`h-full ${lastQuizScore >= 7 ? 'bg-green-500' : 'bg-orange-500'}`} 
                 style={{ width: `${(lastQuizScore / 10) * 100}%` }}
               ></div>
             </div>
             <p className="mt-2 text-xs text-slate-400">
               {lastQuizScore >= 7 ? 'Great job! You really know your stuff.' : 'Review the lessons and try again to improve.'}
             </p>
          </div>

          <button onClick={() => setView('home')} className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold text-lg shadow-xl hover:bg-slate-800 active:scale-95 transition">Return to Path</button>
        </div>
      </Layout>
    );
  }

  return null;
};

export default App;