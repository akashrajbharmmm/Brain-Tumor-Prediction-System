import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { generateReport } from '../services/generateReport';

interface Prediction {
  id: number;
  prediction: string;
  tumorType: string | null;
  confidence: number;
  heatmapPath: string | null;
  createdAt: string;
}

const ML_API_BASE = 'https://brain-tumor-prediction-system-2-59u0.onrender.com';

function Results() {
  const { id } = useParams();
  const [data, setData] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/predictions/${id}`).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8 text-slate-500 text-sm">Loading...</div>;
  if (!data) return <div className="p-8 text-slate-500 text-sm">Prediction not found</div>;

  const isTumor = data.prediction === 'Tumor Detected';

  const handleDownloadReport = () => {
    generateReport({
      id: data.id,
      prediction: data.prediction,
      tumorType: data.tumorType,
      confidence: data.confidence,
      createdAt: data.createdAt,
      originalImageUrl: `http://localhost:4000/api/predictions/${data.id}/image`,
      heatmapImageUrl: data.heatmapPath ? `${ML_API_BASE}${data.heatmapPath}` : null,
    });
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-[#0F172A] mb-1">Result</h1>
      <p className="text-slate-500 text-sm mb-8">
        Scan #{data.id} — {new Date(data.createdAt).toLocaleString()}
      </p>

      <div className={`border rounded-lg p-6 mb-6 ${isTumor ? 'border-amber-200 bg-amber-50' : 'border-teal-200 bg-teal-50'}`}>
        <div className="flex items-center gap-3 mb-4">
          {isTumor ? (
            <AlertTriangle className="text-amber-700" size={24} />
          ) : (
            <CheckCircle2 className="text-teal-700" size={24} />
          )}
          <div>
            <div className={`font-semibold ${isTumor ? 'text-amber-900' : 'text-teal-900'}`}>
              {data.prediction}
            </div>
            {data.tumorType && (
              <div className="text-sm text-slate-600 capitalize">{data.tumorType}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Confidence:</span>
          <span className="font-mono font-medium text-[#0F172A]">
            {(data.confidence * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      {data.heatmapPath && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-[#0F172A] mb-2">Model Attention (Grad-CAM)</h2>
          <p className="text-xs text-slate-500 mb-3">
            Highlighted regions show where the model focused when making this prediction.
          </p>
          <img
            src={`${ML_API_BASE}${data.heatmapPath}`}
            alt="Grad-CAM heatmap"
            className="rounded-lg border border-slate-200 max-w-sm"
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleDownloadReport}
          className="text-sm text-white font-medium bg-[#0F172A] rounded px-4 py-2 hover:bg-slate-800 transition"
        >
          Download Report
        </button>
        <Link
          to="/upload"
          className="text-sm text-teal-700 font-medium border border-teal-200 rounded px-4 py-2 hover:bg-teal-50 transition"
        >
          Upload another scan
        </Link>
        <Link
          to="/dashboard"
          className="text-sm text-slate-600 font-medium border border-slate-200 rounded px-4 py-2 hover:bg-slate-50 transition"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default Results;