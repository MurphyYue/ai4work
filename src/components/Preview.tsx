import React, { useState } from 'react';

interface PreviewProps {
  code: string;
  onElementSelect: (selector: string) => void;
}

const Preview: React.FC<PreviewProps> = ({ code, onElementSelect }) => {
  // const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  const handleElementClick:{ (event: MouseEvent): void } = (event: MouseEvent) => {
    event.preventDefault();
    const element = event.target as HTMLElement;
    // setSelectedElement(element);
    const selector = getSelector(element);
    onElementSelect(selector);
  };

  const getSelector = (element: HTMLElement): string => {
    let selector = element.tagName.toLowerCase();
    if (element.id) {
      selector += `#${element.id}`;
    }
    if (element.className) {
      selector += `.${element.className.split(' ').join('.')}`;
    }
    return selector;
  };

  return (
    <div className="p-4">
      <div>Live Preview (Click to select elements)</div>
      <iframe
        srcDoc={code}
        title="preview"
        className="w-full h-full border"
        onLoad={(e) => {
          const iframe = e.target as HTMLIFrameElement;
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            doc.body.addEventListener('click', handleElementClick);
          }
        }}
      />
    </div>
  );
};

export default Preview;