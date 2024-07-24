import React, { useState } from 'react';
import Chat from './components/Chat';
import Preview from './components/Preview';
import OpenAI from 'openai';

const App: React.FC = () => {
  const [code, setCode] = useState('<div>Welcome to the live preview</div>');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });

  const handleSend = async (message: string) => {
    let prompt = `Generate React.js code for: ${message}`;
    if (selectedElement) {
      prompt = `Update the following element (${selectedElement}) based on this description: ${message}. Original code: ${code}`;
    }
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    };
    const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);

    const generatedCode = response.data.choices[0].text.trim();
    setCode(generatedCode);
    setSelectedElement(null);  // Clear the selection after updating the code
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