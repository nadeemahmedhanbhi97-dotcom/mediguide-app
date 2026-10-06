import React, { useState } from 'react';

export default function HealthChatbot({ scannedMedicine }: { scannedMedicine?: string }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: scannedMedicine 
        ? `Aapne ${scannedMedicine} scan ki hai. Is dawa ke bare mein aap koi bhi sawal pooch sakte hain!`
        : 'Assalam-o-Alaikum! Main MediGuide AI Assistant hoon. Aap apni kisi bhi dawa ya rog ke bare mein sawal pooch sakte hain.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Voice Recognition Handler
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapka browser voice recognition support nahi karta. Google Chrome use karein.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
    };
    recognition.start();
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input,
          context: scannedMedicine ? `Context Medicine: ${scannedMedicine}` : ''
        }),
      });
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev, 
        { sender: 'ai', text: data.reply || 'Mujhe is waqt jawabh nahi mil saka.' }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev, 
        { sender: 'ai', text: 'Server error. Apni Gemini API Key aur network check karein.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-3 border-b pb-2">
        <span className="text-xl">🤖</span>
        <h3 className="font-bold text-gray-800">MediGuide AI Health Assistant</h3>
      </div>
      
      <div className="h-64 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
              msg.sender === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-400 animate-pulse">AI Soch raha hai...</div>}
      </div>

      <div className="flex gap-2 mt-3">
        <input 
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-emerald-500"
          placeholder="Sawal likhein ya mic se bolein..."
          aria-label="Ask a health question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          type="button"
          onClick={handleVoiceInput}
          className="bg-gray-100 border text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-200"
          title="Voice Search"
          aria-label="Start voice search"
        >
          🎤
        </button>
        <button 
          type="button"
          onClick={handleSendMessage}
          aria-label="Send health question"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
