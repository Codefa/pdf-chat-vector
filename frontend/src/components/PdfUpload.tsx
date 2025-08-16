import React, { useState } from 'react';

const PdfUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    console.log('Uploading PDF:', file, title);
    if (!file || !title) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', title);

    await fetch('http://localhost:5000/api/pdf/upload', { method: 'POST', body: formData });
    setLoading(false);
    setFile(null); setTitle('');
    alert('Uploaded!');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Upload PDF</h1>
      <input
        type="text"
        className="input mb-2 w-full border p-2"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="PDF Title"
      />
      <input
        type="file"
        accept=".pdf"
        className="input mb-2 w-full border p-2"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        className="btn bg-blue-600 text-white p-2 rounded w-full"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default PdfUpload;