import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Loader2 } from 'lucide-react';
import api from '../services/api';

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/predictions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/results/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'prediction failed, try again');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-[#0F172A] mb-1">Upload Scan</h1>
      <p className="text-slate-500 text-sm mb-8">Submit a brain MRI for prediction</p>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2 rounded mb-5">
          {error}
        </div>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center cursor-pointer hover:border-teal-500 transition bg-white"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <img src={preview} alt="preview" className="max-h-64 mx-auto rounded" />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <UploadCloud size={32} className="mb-3" />
            <p className="text-sm font-medium text-slate-600">Click to select an MRI image</p>
            <p className="text-xs mt-1">JPG or PNG</p>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-600 truncate">{file.name}</span>
          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            Remove
          </button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="mt-6 w-full bg-[#0D9488] text-white py-2.5 rounded text-sm font-medium hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing...
          </>
        ) : (
          'Run Prediction'
        )}
      </button>
    </div>
  );
}

export default Upload;