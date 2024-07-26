import React, { useState } from 'react';
import Chat from './components/Chat';
import Preview from './components/Preview';

const App: React.FC = () => {
  const [code, setCode] = useState<string | undefined>('<div>Welcome to the live preview</div>');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const api = 'https://api2.aigcbest.top/v1/chat/completions';
  let controller: AbortController | null = null;
  const handleSend = async (message: string) => {
    console.log(import.meta.env.VITE_OPENAI_API_KEY)
    let prompt = `Generate React.js code for: ${message}`;
    if (selectedElement) {
      prompt = `Update the following element (${selectedElement}) based on this description: ${message}. Original code: ${code}`;
    }
    const params = {
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      stream: true,
    };
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`);
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
    myHeaders.append("Content-Type", "application/json");
    controller = new AbortController();
    const signal = controller.signal;
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(params),
      signal
    };
    try {
      const response = await fetch(api, requestOptions);
      const render = response.body?.getReader() || null;
      const decoder = new TextDecoder("utf-8");
      while (true) {
        if (render === null) {
          break;
        }
        const { done, value } = await render.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');
        const parsedLines = lines.map((line) => line.replace(/^data: /,'').trim())
        .filter((line) => line !== '' && line !== '[DONE]')
        .map((line) => JSON.parse(line));
        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delda } = choices[0];
          const { content } = delda;
          if (content) {
            setCode(content);
            setSelectedElement(null); // Clear the selection after updating the code
          }
        }
      }
    } catch (error) {
      if (signal.aborted) {
        setCode('<div>Request aborted</div>');
      } else {
        console.error(error);
        setCode(`<div>Error: ${(error as Error).message}</div>`);
      }
    } finally {
      controller = null;
    }
  };
  const stop = () => {
    // Abort the fetch request by calling abort() on the AbortController instance
    if (controller) {
      controller.abort();
      controller = null;
    }
  };
  const handleElementSelect = (selector: string) => {
    setSelectedElement(selector);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r">
        <Chat onSend={handleSend} selectedElement={selectedElement} />
      </div>
      <div className="w-1/2">
        <Preview code={code} onElementSelect={handleElementSelect} />
      </div>
    </div>
  );
};

export default App;