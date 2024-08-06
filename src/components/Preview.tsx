import React, { useState, useEffect } from 'react';
import { transform } from '@babel/standalone';
interface PreviewProps {
  code: string;
  onElementSelect: (selector: string) => void;
}

const Preview: React.FC<PreviewProps> = ({ code, onElementSelect }) => {
  const [jsxElement, setJsxElement] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    try {
      const transformedCode = transform(code, {
        presets: ['react', 'es2015'],
      }).code;
      // replace "use strict"; with empty string
      const newstr = transformedCode?.replace(/"use strict";/g, '');
      const Component = new Function('React', 'useState', `${newstr}; return Page;`)(React, React.useState);
      console.log(Component)
      setJsxElement(<Component />);
    } catch (error) {
      console.error('Error transforming code:', error);
      setJsxElement(<div>Error rendering component</div>);
    }
  }, [code]);

  return (
    <div className="w-full h-full">
      {jsxElement}
    </div>
  );
};

export default Preview;