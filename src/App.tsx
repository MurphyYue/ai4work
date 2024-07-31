import React, { useState } from 'react';
import Chat from './components/Chat';
import Preview from './components/Preview';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('<div>Welcome to the live preview</div>');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const api = 'https://api2.aigcbest.top/v1/chat/completions';
  let controller: AbortController | null = null;

  const handleSend = async (message: string) => {
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
      signal,
    };

    try {
      const response = await fetch(api, requestOptions);
      const reader = response.body?.getReader() || null;
      const decoder = new TextDecoder("utf-8");

      setCode(''); // Clear the code before receiving new content

      while (true) {
        if (reader === null) {
          break;
        }
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value);
        const lines = chunk.split("data: ");
        const parsedLines = lines
          .filter((line) => line !== "" && !line.includes('[DONE]')) // Remove empty lines and "[DONE]"
          .map((line) => {
            try {
              return JSON.parse(line);
            } catch (e) {
              return null;
            }
          })
          .filter(Boolean); // Parse the JSON string

        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            setCode((prevCode) => prevCode + content);
          }
        }
      }

      setChatHistory((prevHistory) => [...prevHistory, message]); // Add user message to chat history
      setSelectedElement(null); // Clear the selection after updating the code

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
    <div className="flex h-screen w-screen">
      <Toaster />
      <div className="w-1/2 border-r h-full">
        <Chat onSend={handleSend} selectedElement={selectedElement} chatHistory={chatHistory} code={code} />
      </div>
      <div className="w-1/2 h-full">
        <Preview code={code} onElementSelect={handleElementSelect} />
      </div>
    </div>
  );
};

export default App;