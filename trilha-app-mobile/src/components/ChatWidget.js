import React, { useState, useRef, useEffect } from 'react';
import './../App.css';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef();

  useEffect(() => {
    if (open) {
      setLogs([{ sender: 'bot', text: 'Olá! Em que posso ajudar sobre árvores?' }]);
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Função que tenta extrair o texto de dentro de content=' ... '
  // e converte caracteres especiais corretamente.
  const parseServerResponse = (rawResponse) => {
    // Expressão regular que captura o trecho entre content='...'
    const match = rawResponse.match(/content='([^']*)'/);
    if (match && match[1]) {
      try {
        // Decodifica unicode (\u00e1 etc.) convertendo em string JSON
        // e, em seguida, parseando novamente.
        return JSON.parse(`"${match[1].replace(/\\'/g, "'")}"`);
      } catch (err) {
        // Se falhar, devolve mesmo sem conversão
        return match[1];
      }
    }
    // Se não houver content=, retornamos a string toda
    return rawResponse;
  };

  const send = async () => {
    if (!input.trim()) return;
    // Insere mensagem do usuário no log
    setLogs(prev => [...prev, { sender: 'user', text: input }]);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const { response } = await res.json();

      // Extrai somente o conteúdo de dentro de content='...'
      const formattedResponse = parseServerResponse(response);

      // Insere mensagem do bot no log
      setLogs(prev => [...prev, { sender: 'bot', text: formattedResponse }]);
    } catch (error) {
      setLogs(prev => [...prev, { sender: 'bot', text: `Erro: ${error.message}` }]);
    }

    setInput('');
  };

  return (
    <>
      <button
        className="chat-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label="Chat Árvores"
      >
        🌳 Chat Árvores
      </button>

      {open && (
        <div className="chat-popup card">
          <div className="chat-header">Chat Árvores</div>
          <div className="chat-body">
            {logs.map((m, i) => (
              <div key={i} className={`chat-message ${m.sender}`}>
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Digite sua pergunta..."
            />
            <button onClick={send}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}