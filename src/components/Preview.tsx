import React, { useEffect, useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';

interface PreviewProps {
  code?: string;
}

export default function Preview({ code = '' }: PreviewProps) {
  const [renderedHtml, setRenderedHtml] = useState('');

  useEffect(() => {
    setRenderedHtml(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="min-h-screen bg-gray-50">
          <div class="p-4">
            <pre class="whitespace-pre-wrap font-mono text-sm">${code}</pre>
          </div>
        </body>
      </html>
    `);
  }, [code]);

  return (
    <div className="h-full flex flex-col bg-[#1E1E2E]">
      <div className="border-b border-[#2A2A3C] p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play size={16} className="text-green-400" />
          <span className="text-sm text-gray-300">Preview</span>
        </div>
        <button className="p-1 hover:bg-[#2A2A3C] rounded">
          <RefreshCw size={16} className="text-gray-400" />
        </button>
      </div>
      <div className="flex-1 bg-white">
        <iframe
          title="Template Preview"
          className="w-full h-full border-none"
          srcDoc={renderedHtml}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}