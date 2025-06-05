import React, { useState, useRef, useEffect } from 'react';
import './../App.css';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef();

  useEffect(() => {
    if (open) setLogs([{ sender: 'bot', text: 'Olá! Em que posso ajudar sobre árvores?' }]);
  }, [open]);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [logs]);

  const send = async () => {
    if (!input.trim()) return;
    setLogs(prev => [...prev, { sender: 'user', text: input }]);
    const res = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const { response } = await res.json();
    setLogs(prev => [...prev, { sender: 'bot', text: response }]);
    setInput('');
  };

  return (
    <>
      <button
        className="chat-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label="Chat Árvores"
      >🌳 Chat Árvores</button>
      {open && (
        <div className="chat-popup card">
          <div className="chat-header">Chat Árvores</div>
          <div className="chat-body">
            {logs.map((m,i) => (
              <div key={i} className={`chat-message ${m.sender}`}>{m.text}</div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && send()}
              placeholder="Digite sua pergunta..."
            />
            <button onClick={send}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}