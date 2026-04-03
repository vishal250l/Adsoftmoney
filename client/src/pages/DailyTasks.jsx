import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TASK_ICONS = { daily_login: '🌅', watch_ad: '▶️', invite_friend: '👥', complete_profile: '👤' };
const TASK_COLORS = { daily_login: 'from-yellow-400 to-orange-500', watch_ad: 'from-primary-500 to-blue-600', invite_friend: 'from-purple-500 to-pink-600', complete_profile: 'from-green-500 to-emerald-600' };
const TASK_DESC = { daily_login: 'Automatically credited on login', watch_ad: 'Watch at least 1 ad today', invite_friend: 'Refer a friend using your code', complete_profile: 'Add your phone number in Profile' };

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState('');
  const { updateUser } = useAuth();

  const fetchTasks = () => {
    tasksAPI.getTasks().then(({ data }) => setTasks(data.tasks)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchTasks(); }, []);

  const handleClaim = async (taskKey) => {
    setClaiming(taskKey);
    try {
      const { data } = await tasksAPI.completeTask(taskKey);
      toast.success(data.message);
      updateUser({ coinBalance: data.newBalance });
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setClaiming(''); }
  };

  const completed = tasks.filter(t => t.completed).length;
  const totalCoins = tasks.reduce((s, t) => s + t.coins, 0);
  const earnedCoins = tasks.filter(t => t.completed).reduce((s, t) => s + t.coins, 0);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        <div>
          <h2 className="font-display text-2xl font-bold dark:text-white">Daily Tasks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Complete tasks to earn coins every day</p>
        </div>

        {/* Progress card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-primary-100 text-sm">Today's Progress</p>
              <p className="font-display text-3xl font-bold mt-0.5">{completed}/{tasks.length} tasks</p>
            </div>
            <div className="text-right">
              <p className="text-primary-100 text-xs">Coins earned today</p>
              <p className="font-bold text-2xl">🪙 {earnedCoins.toFixed(1)}</p>
              <p className="text-primary-100 text-xs">of {totalCoins} possible</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div className="bg-white rounded-full h-2.5 transition-all duration-700" style={{ width: tasks.length ? `${(completed / tasks.length) * 100}%` : '0%' }} />
          </div>
          {completed === tasks.length && tasks.length > 0 && (
            <p className="text-white text-sm font-semibold mt-2">🎉 All tasks done! Come back tomorrow for more.</p>
          )}
        </div>

        {/* Tasks list */}
        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="card skeleton h-24" />)}</div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.key} className={`card dark:bg-gray-900 dark:border-gray-800 transition-all ${task.completed ? 'opacity-70' : 'hover:shadow-md'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${TASK_COLORS[task.key]} flex items-center justify-center text-2xl shrink-0`}>
                    {TASK_ICONS[task.key]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-sm dark:text-white ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>{task.label}</p>
                      <span className="text-xs font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-full">+{task.coins} 🪙</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{TASK_DESC[task.key]}</p>
                  </div>
                  <div className="shrink-0">
                    {task.completed ? (
                      <span className="flex items-center gap-1 text-green-500 text-sm font-medium"><span>✅</span> Done</span>
                    ) : task.key === 'daily_login' ? (
                      <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">Auto on login</span>
                    ) : (
                      <button onClick={() => handleClaim(task.key)} disabled={claiming === task.key}
                        className="btn-primary text-xs py-2 px-4 rounded-xl">
                        {claiming === task.key ? '...' : 'Claim'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card dark:bg-gray-900 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">ℹ️ How Daily Tasks Work</p>
          <p className="text-xs text-blue-500 dark:text-blue-500 leading-relaxed">Tasks reset every day at midnight. Login bonus is credited automatically when you sign in. Complete all 4 tasks to earn maximum daily coins!</p>
        </div>
      </div>
    </AppLayout>
  );
}
