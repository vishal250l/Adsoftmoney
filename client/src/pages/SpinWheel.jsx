import { useEffect, useState, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { spinAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SEGMENTS = [
  { label: '0', coins: 0, color: '#374151' },
  { label: '0.2🪙', coins: 0.2, color: '#1d4ed8' },
  { label: '0.5🪙', coins: 0.5, color: '#0891b2' },
  { label: '0🪙', coins: 0, color: '#374151' },
  { label: '1🪙', coins: 1, color: '#7c3aed' },
  { label: '0.5🪙', coins: 0.5, color: '#0891b2' },
  { label: '0.2🪙', coins: 0.2, color: '#1d4ed8' },
  { label: '0🪙', coins: 0, color: '#374151' },
];
const TOTAL = SEGMENTS.length;
const SEG_ANGLE = 360 / TOTAL;

export default function SpinWheel() {
  const [status, setStatus] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const { updateUser } = useAuth();
  const currentRotation = useRef(0);

  useEffect(() => {
    spinAPI.getStatus().then(({ data }) => setStatus(data));
  }, []);

  const handleSpin = async () => {
    if (spinning || (status && status.spinsLeft <= 0)) return;
    setSpinning(true);
    setResult(null);
    try {
      const { data } = await spinAPI.spin();
      // Animate to a random full spins + land on correct segment
      const rewardCoins = data.reward;
      const segIdx = SEGMENTS.findIndex(s => s.coins === rewardCoins);
      const targetAngle = segIdx * SEG_ANGLE + SEG_ANGLE / 2;
      const fullSpins = 5 + Math.floor(Math.random() * 3);
      const newRotation = currentRotation.current + fullSpins * 360 + (360 - targetAngle - (currentRotation.current % 360));
      currentRotation.current = newRotation;
      setRotation(newRotation);

      setTimeout(() => {
        setResult(data);
        if (data.reward > 0) updateUser({ coinBalance: data.newBalance });
        setStatus(prev => ({ ...prev, spinsLeft: data.spinsLeft }));
        setHistory(h => [{ reward: data.reward, time: new Date() }, ...h.slice(0, 4)]);
        setSpinning(false);
        if (data.reward > 0) toast.success(data.message);
        else toast('Better luck next time! 😅', { icon: '🎰' });
      }, 4000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Spin failed');
      setSpinning(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto space-y-6 animate-slide-up">
        <div>
          <h2 className="font-display text-2xl font-bold dark:text-white">Spin Wheel</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Spin for a chance to win up to 1 coin</p>
        </div>

        {/* Spins left */}
        <div className="flex items-center justify-between card dark:bg-gray-900 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-500">Spins Available Today</p>
            <div className="flex gap-1 mt-1">
              {[1,2,3].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-base ${i <= (status?.spinsLeft || 0) ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                  🎰
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-purple-500">{status?.spinsLeft ?? '-'}</p>
            <p className="text-xs text-gray-400">of 3 remaining</p>
          </div>
        </div>

        {/* Wheel */}
        <div className="card dark:bg-gray-900 dark:border-gray-800 flex flex-col items-center py-8">
          <div className="relative">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10">
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-400" />
            </div>
            {/* Wheel SVG */}
            <svg width="260" height="260" viewBox="0 0 260 260"
              style={{ transition: spinning ? 'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none', transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}>
              {SEGMENTS.map((seg, i) => {
                const startAngle = (i * SEG_ANGLE - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * SEG_ANGLE - 90) * (Math.PI / 180);
                const r = 120, cx = 130, cy = 130;
                const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
                const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
                const mx = cx + (r * 0.65) * Math.cos((startAngle + endAngle) / 2);
                const my = cy + (r * 0.65) * Math.sin((startAngle + endAngle) / 2);
                return (
                  <g key={i}>
                    <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill={seg.color} stroke="#1f2937" strokeWidth="2" />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="600">{seg.label}</text>
                  </g>
                );
              })}
              <circle cx="130" cy="130" r="16" fill="#1f2937" stroke="#374151" strokeWidth="2" />
              <circle cx="130" cy="130" r="8" fill="#00baf2" />
            </svg>
          </div>

          {/* Result */}
          {result && (
            <div className={`mt-4 px-6 py-3 rounded-2xl text-center ${result.reward > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
              <p className={`font-display text-xl font-bold ${result.reward > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                {result.reward > 0 ? `🎉 +${result.reward} coins!` : 'No coins this time'}
              </p>
            </div>
          )}

          <button onClick={handleSpin} disabled={spinning || (status?.spinsLeft === 0)}
            className={`mt-5 px-10 py-3 rounded-2xl font-display font-bold text-lg transition-all
              ${spinning || status?.spinsLeft === 0
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'}`}>
            {spinning ? '🌀 Spinning...' : status?.spinsLeft === 0 ? '😴 No spins left' : '🎰 SPIN!'}
          </button>
          {status?.spinsLeft === 0 && <p className="text-xs text-gray-400 mt-2">Spins reset at midnight</p>}
        </div>

        {/* Rewards legend */}
        <div className="card dark:bg-gray-900 dark:border-gray-800">
          <p className="font-semibold text-sm dark:text-white mb-3">Possible Rewards</p>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: 'No coins', prob: '37.5%', color: 'bg-gray-100 dark:bg-gray-800 text-gray-500' },
              { label: '0.2 coins', prob: '25%', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' },
              { label: '0.5 coins', prob: '25%', color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-500' },
              { label: '1 coin', prob: '12.5%', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500' }].map(r => (
              <div key={r.label} className={`${r.color} rounded-xl px-3 py-2 flex justify-between items-center`}>
                <span className="text-xs font-medium">🪙 {r.label}</span>
                <span className="text-xs opacity-70">{r.prob}</span>
              </div>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className="card dark:bg-gray-900 dark:border-gray-800">
            <p className="font-semibold text-sm dark:text-white mb-3">This Session</p>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{h.time.toLocaleTimeString()}</span>
                  <span className={h.reward > 0 ? 'text-green-500 font-medium' : 'text-gray-400'}>{h.reward > 0 ? `+${h.reward} 🪙` : 'No reward'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
