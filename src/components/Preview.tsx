import React, { useState, useEffect } from 'react';
import { transform } from '@babel/standalone';
import { ChatbotUIContext } from '@/context';
import { useContext } from 'react';

interface PreviewProps {}

const Preview: React.FC<PreviewProps> = () => {
  const [jsxElement, setJsxElement] = useState<React.ReactElement | null>(null);
  const { runningCode } = useContext(ChatbotUIContext);
  useEffect(() => {
    try {
      console.log('runningCode', runningCode);
      const transformedCode = transform(runningCode, {
        presets: ['react', 'es2015'],
      }).code;
      // replace "use strict"; with empty string
      const newstr = transformedCode?.replace(/"use strict";/g, '');
      const Component = new Function('React', 'useState', 'useEffect', `${newstr}; return Page;`)(React, React.useState, React.useEffect, React.useContext);
      setJsxElement(<Component />);
    } catch (error) {
      console.error('Error transforming code:', error);
      setJsxElement(<div className='h-full flex text-center items-center text-lg'>Error rendering component</div>);
    }
  }, [runningCode]);

  return (
    <div className="w-full h-full">
      {jsxElement}
    </div>
  );
};

export default Preview;