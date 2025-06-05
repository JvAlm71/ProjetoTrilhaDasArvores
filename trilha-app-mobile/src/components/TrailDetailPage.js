import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './../App.css'; 
import { trailTreeMapping } from '../config/trailTreeMapping';
import { getTreeByCode } from '../utils/csvParser';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Replace with your actual API key securely  
// const GEMINI_API_KEY = "YOUR_API_KEY_HERE";


function TrailDetailPage() {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null); // Added
  const [scannedTreeInfo, setScannedTreeInfo] = useState(null); // Added
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  useEffect(() => {
    const trailConfig = trailTreeMapping[id];
    if (trailConfig) {
      // Create trail data with points from real CSV data
      const trailData = {
        id: parseInt(id),
        name: trailConfig.name,
        fullDescription: trailConfig.description,
        mapImage: `https://via.placeholder.com/800x400.png?text=Mapa+${trailConfig.name.replace(/ /g, '+')}`,
        points: trailConfig.trees.map(treeConfig => {
          const treeData = getTreeByCode(treeConfig.csvCode);
          return {
            id: treeConfig.csvCode,
            name: treeData ? treeData.name : 'Árvore não encontrada',
            qrId: treeConfig.qrId,
            csvCode: treeConfig.csvCode,
            treeData: treeData
          };
        })
      };
      setTrail(trailData);
    } else {
      setTrail(null);
    }
    setCurrentPoint(null);
    setScannedTreeInfo(null);
    setShowChatbot(false);
    setChatMessages([]);
  }, [id]);
  const handleScanQrCode = async () => {
    // For now, simulate QR code scanning by showing available QR codes
    const qrCodes = trail.points.map(p => p.qrId).join(', ');
    const selectedQR = prompt(`Simular escaneamento de QR Code.\nCódigos disponíveis: ${qrCodes}\nDigite um código QR:`);
    
    if (selectedQR) {
      const point = trail.points.find((p) => p.qrId === selectedQR);
      if (point && point.treeData) {
        setCurrentPoint(point);
        setScannedTreeInfo(point.treeData);
        setShowChatbot(false);
        setChatMessages([]);
      } else {
        alert('QR Code não encontrado. Tente: ' + qrCodes);
      }
    }
  };

  const handleChatToggle = () => {
    if (!scannedTreeInfo) {
        alert("Por favor, escaneie um QR Code de uma árvore com informações disponíveis primeiro.");
        return;
    }
    setShowChatbot(!showChatbot);
    if (!showChatbot && scannedTreeInfo) { // Opening chat for the first time for this tree
        setChatMessages([{ sender: 'bot', text: `Olá! Você está vendo informações sobre ${scannedTreeInfo.name}. O que gostaria de saber? (Chat simulado)` }]);
    }
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !scannedTreeInfo) return;
  
    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
  
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Você é um guia botânico. Baseando-se na árvore ${scannedTreeInfo.name} (${scannedTreeInfo.scientificName}): ${scannedTreeInfo.details}. Pergunta do visitante: ${chatInput}`
                }
              ]
            }
          ]
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
  
      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui encontrar uma resposta.';
  
      const botResponse = { sender: 'bot', text: botText };
      setChatMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: `Erro ao se comunicar com o chatbot: ${error.message}` };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  
    setChatInput('');
  };
  
  const navigateToTreePage = (treeId) => {
    const point = trail.points.find((point) => point.id === treeId);
    if (point && point.treeData) {
      setCurrentPoint(point);
      setScannedTreeInfo(point.treeData);
      setShowChatbot(false);
      setChatMessages([]);
    } else {
      alert('Informações da árvore não encontradas para este ponto.');
    }
  };

  if (!trail) {
    return <div className="page-container loading">Carregando detalhes da trilha...</div>;
  }
  return (
    <div className="page-container trail-detail-page">
      <Link to="/trilhas" className="btn btn-back">‹ Voltar para Trilhas</Link>
      
      <button 
        onClick={handleScanQrCode} 
        className="btn btn-scan-qr-large"
        style={{ marginTop: '10px', marginBottom: '20px' }}
      >
        📱 Escanear QR Code da Árvore
      </button>

      <h2 className="page-title">{trail.name}</h2>
      <p className="trail-full-description">{trail.fullDescription}</p>

      <section className="card map-section">
        <h3>Mapa da Trilha e Pontos de Interesse</h3>
        <img src={trail.mapImage} alt={`Mapa da ${trail.name}`} className="trail-map-image" />
        <p>Siga os pontos marcados para encontrar os QR Codes e aprender mais:</p>
        <ul className="points-list">
          {trail.points.map(point => (
            <li key={point.id} className={`point-item ${currentPoint?.id === point.id ? 'active' : ''}`}>
              <span>{point.name} ({point.qrId})</span>
              <button onClick={() => navigateToTreePage(point.id)} className="btn btn-secondary btn-small">
                Ver Detalhes
              </button>
            </li>
          ))}
        </ul>
      </section>      {scannedTreeInfo && (
        <section className="card tree-info-section">
          <h3>Informações sobre: {scannedTreeInfo.name}</h3>
          <p><strong>Nome Científico:</strong> <em>{scannedTreeInfo.species}</em></p>
          {scannedTreeInfo.genus && <p><strong>Gênero:</strong> {scannedTreeInfo.genus}</p>}
          
          <div className="tree-measurements">
            <h4>📏 Medidas da Árvore</h4>
            <p><strong>Altura Geral:</strong> {scannedTreeInfo.height}m</p>
            {scannedTreeInfo.firstBranchHeight > 0 && (
              <p><strong>Altura da 1ª Ramificação:</strong> {scannedTreeInfo.firstBranchHeight}m</p>
            )}
            {scannedTreeInfo.crownDiameter > 0 && (
              <p><strong>Diâmetro da Copa:</strong> {scannedTreeInfo.crownDiameter}m</p>
            )}
            {scannedTreeInfo.pap > 0 && (
              <p><strong>PAP (Perímetro à Altura do Peito):</strong> {scannedTreeInfo.pap}m</p>
            )}
          </div>

          {scannedTreeInfo.location && (
            <div className="tree-location">
              <h4>📍 Localização</h4>
              <p>{scannedTreeInfo.location}</p>
              {scannedTreeInfo.latitude !== 0 && scannedTreeInfo.longitude !== 0 && (
                <p><strong>Coordenadas:</strong> {scannedTreeInfo.latitude.toFixed(6)}, {scannedTreeInfo.longitude.toFixed(6)}</p>
              )}
            </div>
          )}

          {scannedTreeInfo.generalCondition !== 'Não informado' && (
            <div className="tree-condition">
              <h4>🌿 Estado Geral</h4>
              <p><strong>Condição:</strong> {scannedTreeInfo.generalCondition}</p>
            </div>
          )}

          {scannedTreeInfo.ecology && scannedTreeInfo.ecology.length > 0 && (
            <div className="tree-ecology">
              <h4>🦋 Ecologia</h4>
              <ul>
                {scannedTreeInfo.ecology.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {scannedTreeInfo.phenology && scannedTreeInfo.phenology.length > 0 && (
            <div className="tree-phenology">
              <h4>🌸 Fenologia</h4>
              <p>Presença de: {scannedTreeInfo.phenology.join(', ')}</p>
            </div>
          )}

          {scannedTreeInfo.observations && (
            <div className="tree-observations">
              <h4>📝 Observações</h4>
              <p>{scannedTreeInfo.observations}</p>
            </div>
          )}
          
          <h4><span role="img" aria-label="headphone">🎧</span> Audioguia (Simulado)</h4>
          <audio controls src={`/audio/audio_${scannedTreeInfo.code}.mp3`} className="audioplayer">
            Seu navegador não suporta o elemento de áudio.
          </audio>
          <p className="simulation-note">(Nota: A funcionalidade de audioguia é simulada. Adicione os arquivos em `public/audio/`)</p>

          <button onClick={handleChatToggle} className="btn btn-chat-toggle">
            {showChatbot ? 'Fechar Chatbot' : `Perguntar sobre ${scannedTreeInfo.name}`}
          </button>
        </section>
      )}

      {showChatbot && scannedTreeInfo && (
        <section className="card chatbot-section">
          <h3><span role="img" aria-label="robot">🤖</span> Chatbot Interativo: {scannedTreeInfo.name}</h3>
          <div className="chat-window">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="chat-input-form">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Digite sua pergunta..."
            />
            <button type="submit" className="btn">Enviar</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default TrailDetailPage;