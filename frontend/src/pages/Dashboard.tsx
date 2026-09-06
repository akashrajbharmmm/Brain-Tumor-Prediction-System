import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

interface Prediction {
  id: number;
  prediction: string;
  tumorType: string | null;
  confidence: number;
  createdAt: string;
}

interface Stats {
  totalScans: number;
  tumorDetected: number;
  noTumor: number;
  recentPredictions: Prediction[];
}

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500 text-sm">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-xl font-semibold text-[#0F172A] mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Overview of your scan activity</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
            <Activity size={14} />
            Total Scans
          </div>
          <div className="font-mono text-3xl text-[#0F172A]">{stats?.totalScans ?? 0}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 text-amber-700 text-xs mb-3">
            <AlertTriangle size={14} />
            Tumor Detected
          </div>
          <div className="font-mono text-3xl text-[#0F172A]">{stats?.tumorDetected ?? 0}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 text-teal-700 text-xs mb-3">
            <CheckCircle2 size={14} />
            No Tumor
          </div>
          <div className="font-mono text-3xl text-[#0F172A]">{stats?.noTumor ?? 0}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[#0F172A]">Recent Predictions</h2>
        <Link to="/history" className="text-xs text-teal-700 font-medium">View all</Link>
      </div>

      {stats?.recentPredictions.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded p-8 text-center text-slate-400 text-sm">
          No scans yet — upload your first MRI to get started.
        </div>
      ) : (
        <div className="border border-slate-200 rounded overflow-hidden">
          {stats?.recentPredictions.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                i !== 0 ? 'border-t border-slate-200' : ''
              }`}
            >
              <div>
                <span className="text-[#0F172A] font-medium">{p.prediction}</span>
                {p.tumorType && (
                  <span className="text-slate-500 ml-2 capitalize">— {p.tumorType}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-slate-500">
                  {(p.confidence * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;