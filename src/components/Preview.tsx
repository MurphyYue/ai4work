import React, { useEffect } from 'react';

interface PreviewProps {
  code: string;
  onElementSelect: (selector: string) => void;
}

const Preview: React.FC<PreviewProps> = ({ code, onElementSelect }) => {
  useEffect(() => {
    // Render the code within a sandboxed environment
    const iframe = document.getElementById('preview-frame') as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.document.open();
      iframe.contentWindow?.document.write(code);
      iframe.contentWindow?.document.close();
    }
  }, [code]);

  return (
    <div className="w-full h-full">
      <iframe id="preview-frame" className="w-full h-full border-0"></iframe>
    </div>
  );
};

export default Preview;