/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Skull, 
  Terminal, 
  AlertTriangle, 
  Zap, 
  Coins, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

// --- Components ---

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$¥€£';
    const fontSize = 16;
    const columns = width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Randomly choose between neon green and cyber gold
        ctx.fillStyle = Math.random() > 0.9 ? '#ffd700' : '#39ff14';
        ctx.font = `${fontSize}px Share Tech Mono`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="custom-cursor"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        borderColor: isPointer ? '#ff003c' : '#ffd700'
      }}
    />
  );
};

const Beep = () => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.05);
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [isShaking, setIsShaking] = useState(false);
  const [formData, setFormData] = useState({
    targetCost: 150000000,
    currentSavings: 10000000,
    salary: 8000000,
    expenses: 4000000,
    targetMonths: 12
  });

  const [results, setResults] = useState<any>(null);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const calculate = () => {
    Beep();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    if (window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }

    const monthlySaving = formData.salary - formData.expenses;
    const totalNeeded = formData.targetCost - formData.currentSavings;
    const monthsNeeded = monthlySaving > 0 ? Math.ceil(totalNeeded / monthlySaving) : Infinity;
    const gap = totalNeeded;
    const isEnough = monthsNeeded <= formData.targetMonths;

    const breakdown = [
      { item: 'Venue & Dekor', cost: formData.targetCost * 0.3 },
      { item: 'Catering (Makan Terus)', cost: formData.targetCost * 0.4 },
      { item: 'Gaun & MUA (Biar Glowing)', cost: formData.targetCost * 0.1 },
      { item: 'Seserahan & Mahar', cost: formData.targetCost * 0.1 },
      { item: 'Dokumentasi (Prewed dll)', cost: formData.targetCost * 0.05 },
      { item: 'Lain-lain (Tak Terduga)', cost: formData.targetCost * 0.05 },
    ];

    const roastingMessages = [
      "Bro, lu mau nikah atau mau simulasi kemiskinan? Kurangnya jauh banget!",
      "Mending tunda dulu deh, daripada resepsi pake kerupuk doang.",
      "Gaji segitu, gaya selangit. Turunin dikit gengsinya, nikah di KUA aja!",
      "Cukup kok... buat beli souvenirnya doang tapi.",
      "Wih, dikit lagi! Jual ginjal satu mungkin cukup.",
      "Semangat! Masih ada 100 tahun lagi buat nabung.",
      "Lu serius mau nikah bulan depan? Malaikat maut aja bingung liat tabungan lu."
    ];

    const successMessages = [
      "Gokil! Lu udah siap tempur. Gas pol!",
      "Tabungan aman, mental aman, tinggal nyari jodohnya aja (kalo ada).",
      "Wih, sultan mah bebas. Nikah besok juga bisa!",
      "Mantap bro, tabungan lu lebih tebel dari dosa-dosa lu."
    ];

    const message = isEnough 
      ? successMessages[Math.floor(Math.random() * successMessages.length)]
      : roastingMessages[Math.floor(Math.random() * roastingMessages.length)];

    setResults({
      monthsNeeded,
      gap,
      isEnough,
      breakdown,
      message,
      monthlySaving
    });

    setTimeout(() => {
      setStep('result');
    }, 800);
  };

  const progress = Math.min(100, Math.max(0, (formData.currentSavings / formData.targetCost) * 100));

  return (
    <div className={`min-h-screen bg-black text-neon-green p-4 md:p-8 selection:bg-cyber-gold selection:text-black ${isShaking ? 'shake' : ''}`}>
      <MatrixBackground />
      <CustomCursor />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold glitch mb-4 tracking-tighter"
            data-text="NIKAH SIMULATOR"
          >
            LO MAU NIKAH?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-cyber-gold text-lg md:text-xl"
          >
            Hitung Dulu Nasib Lu, Bro! 💀
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {step === 'input' ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-8 bg-black/80 border-2 border-neon-green p-6 md:p-10 rounded-none shadow-[0_0_20px_rgba(57,255,20,0.3)]"
            >
              {/* Countdown Mock */}
              <div className="flex justify-between items-center border-b border-neon-green/30 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyber-gold" />
                  <span className="text-xs uppercase tracking-widest">Countdown Akad</span>
                </div>
                <div className="text-xl font-bold text-cyber-red animate-pulse">
                  {formData.targetMonths * 30} HARI LAGI
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span>Level Tabungan Lu</span>
                  <span className={progress > 80 ? 'text-neon-green' : progress > 40 ? 'text-cyber-gold' : 'text-cyber-red'}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 w-full bg-gray-900 border border-neon-green/50 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${progress > 80 ? 'bg-neon-green' : progress > 40 ? 'bg-cyber-gold' : 'bg-cyber-red'}`}
                  />
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase flex items-center gap-2">
                    <Heart className="w-4 h-4 text-cyber-red" /> Biaya Nikah Impian
                  </label>
                  <input 
                    type="number" 
                    value={formData.targetCost}
                    onChange={(e) => {
                      setFormData({...formData, targetCost: Number(e.target.value)});
                      Beep();
                    }}
                    className="w-full bg-black border-b-2 border-neon-green p-2 focus:outline-none focus:border-cyber-gold transition-colors text-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase flex items-center gap-2">
                    <Coins className="w-4 h-4 text-cyber-gold" /> Tabungan Saat Ini
                  </label>
                  <input 
                    type="number" 
                    value={formData.currentSavings}
                    onChange={(e) => {
                      setFormData({...formData, currentSavings: Number(e.target.value)});
                      Beep();
                    }}
                    className="w-full bg-black border-b-2 border-neon-green p-2 focus:outline-none focus:border-cyber-gold transition-colors text-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-neon-green" /> Gaji Bulanan
                  </label>
                  <input 
                    type="number" 
                    value={formData.salary}
                    onChange={(e) => {
                      setFormData({...formData, salary: Number(e.target.value)});
                      Beep();
                    }}
                    className="w-full bg-black border-b-2 border-neon-green p-2 focus:outline-none focus:border-cyber-gold transition-colors text-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase flex items-center gap-2">
                    <Skull className="w-4 h-4 text-cyber-red" /> Pengeluaran Bulanan
                  </label>
                  <input 
                    type="number" 
                    value={formData.expenses}
                    onChange={(e) => {
                      setFormData({...formData, expenses: Number(e.target.value)});
                      Beep();
                    }}
                    className="w-full bg-black border-b-2 border-neon-green p-2 focus:outline-none focus:border-cyber-gold transition-colors text-xl"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs uppercase flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyber-gold" /> Target Nikah (Bulan Lagi)
                  </label>
                  <input 
                    type="number" 
                    value={formData.targetMonths}
                    onChange={(e) => {
                      setFormData({...formData, targetMonths: Number(e.target.value)});
                      Beep();
                    }}
                    className="w-full bg-black border-b-2 border-neon-green p-2 focus:outline-none focus:border-cyber-gold transition-colors text-xl"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(57,255,20,0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={calculate}
                className="w-full bg-neon-green text-black font-bold py-4 text-xl flex items-center justify-center gap-3 glitch group"
                data-text="⚡ HITUNG NASIB TABUNGAN NIKAH LU ⚡"
              >
                <Zap className="w-6 h-6 group-hover:animate-bounce" />
                HITUNG NASIB TABUNGAN NIKAH LU
                <Zap className="w-6 h-6 group-hover:animate-bounce" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="result-screen"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 bg-black/90 border-2 border-cyber-gold p-6 md:p-10 rounded-none shadow-[0_0_30px_rgba(255,215,0,0.2)]"
            >
              <div className="text-center space-y-4">
                <h2 className={`text-3xl font-bold uppercase ${results.isEnough ? 'text-neon-green' : 'text-cyber-red'}`}>
                  {results.isEnough ? 'SIAP AKAD!' : 'WAKE UP BRO!'}
                </h2>
                <p className="text-xl italic text-white">"{results.message}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 border border-neon-green/30">
                  <div className="text-xs uppercase text-neon-green/70">Kekurangan Dana</div>
                  <div className="text-2xl font-bold text-cyber-red">
                    {results.gap > 0 ? formatIDR(results.gap) : 'LUNAS!'}
                  </div>
                </div>
                <div className="bg-gray-900/50 p-4 border border-neon-green/30">
                  <div className="text-xs uppercase text-neon-green/70">Waktu Nabung Lagi</div>
                  <div className="text-2xl font-bold text-cyber-gold">
                    {results.monthsNeeded === Infinity ? 'Kiamat Dulu' : `${results.monthsNeeded} Bulan`}
                  </div>
                </div>
              </div>

              {/* Terminal Log */}
              <div className="bg-black border border-neon-green/50 p-4 font-mono text-sm space-y-1 overflow-hidden">
                <div className="flex items-center gap-2 text-neon-green mb-2">
                  <Terminal className="w-4 h-4" />
                  <span>BREAKDOWN_COST_LOG.EXE</span>
                </div>
                {results.breakdown.map((item: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex justify-between border-b border-neon-green/10 py-1"
                  >
                    <span className="text-neon-green/80">{`> ${item.item}`}</span>
                    <span className="text-cyber-gold">{formatIDR(item.cost)}</span>
                  </motion.div>
                ))}
                <div className="pt-2 text-xs text-neon-green/40 animate-pulse">
                  [SYSTEM] Analyzing financial stability... FAILED.
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => {
                    Beep();
                    setStep('input');
                  }}
                  className="flex-1 border-2 border-neon-green text-neon-green py-3 flex items-center justify-center gap-2 hover:bg-neon-green hover:text-black transition-all"
                >
                  <RefreshCw className="w-5 h-5" /> COBA LAGI
                </button>
                <button
                  onClick={() => {
                    Beep();
                    alert("Gak ada tombol share bro, mending lanjut kerja!");
                  }}
                  className="flex-1 bg-cyber-gold text-black py-3 font-bold flex items-center justify-center gap-2 hover:bg-white transition-all"
                >
                  SHARE KE CALON (BERANI?) <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="text-[10px] text-center text-gray-600 italic">
                * Ini cuma simulasi doang bro. Realitanya lebih mahal, lebih ribet, dan mertua lebih galak 😂
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-[10px] tracking-widest text-neon-green/30 uppercase">
          System Status: <span className="text-neon-green">Online</span> | 
          Security: <span className="text-cyber-red">Breached</span> | 
          Wallet: <span className="text-cyber-red">Empty</span>
        </footer>
      </div>
    </div>
  );
}
