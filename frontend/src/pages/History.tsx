import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

interface Prediction {
  id: number;
  prediction: string;
  tumorType: string | null;
  confidence: number;
  createdAt: string;
}

function History() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/predictions').then((res) => {
      setPredictions(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-slate-500 text-sm">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-xl font-semibold text-[#0F172A] mb-1">History</h1>
      <p className="text-slate-500 text-sm mb-8">All your past scans</p>

      {predictions.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded p-8 text-center text-slate-400 text-sm">
          No scans yet — upload your first MRI to get started.
        </div>
      ) : (
        <div className="border border-slate-200 rounded overflow-hidden">
          {predictions.map((p, i) => {
            const isTumor = p.prediction === 'Tumor Detected';
            return (
              <Link
                key={p.id}
                to={`/results/${p.id}`}
                className={`flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50 transition ${
                  i !== 0 ? 'border-t border-slate-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {isTumor ? (
                    <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
                  )}
                  <div>
                    <span className="text-[#0F172A] font-medium">{p.prediction}</span>
                    {p.tumorType && (
                      <span className="text-slate-500 ml-2 capitalize">— {p.tumorType}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-xs text-slate-500">
                    {(p.confidence * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default History;