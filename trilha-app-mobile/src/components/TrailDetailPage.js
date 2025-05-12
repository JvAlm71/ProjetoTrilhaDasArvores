import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './../App.css'; 

// Dados de exemplo para as trilhas e árvores
const trailsMasterData = {
  1: { 
    id: 1,
    name: "Trilha das Gigantes", 
    fullDescription: "Esta trilha leva você a um encontro com as árvores mais majestosas e antigas da ESALQ. Prepare-se para se maravilhar com a grandiosidade da natureza e aprender sobre a história viva que essas árvores representam.",
    mapImage: "https://via.placeholder.com/800x400.png?text=Mapa+Trilha+Gigantes",
    points: [
      { id: "gig1", name: "Jequitibá-Rosa Centenário", qrId: "QR001", treeInfoKey: "jequitiba" },
      { id: "gig2", name: "Paineira Imponente", qrId: "QR002", treeInfoKey: "paineira" },
      { id: "gig3", name: "Figueira Matriarca", qrId: "QR003", treeInfoKey: "figueira" },
    ] 
  },
  2: { 
    id: 2,
    name: "Trilha das Flores Nativas", 
    fullDescription: "Um percurso encantador que destaca a beleza e a diversidade das plantas floríferas nativas da região. Ideal para observadores de pássaros e amantes de botânica.",
    mapImage: "https://via.placeholder.com/800x400.png?text=Mapa+Trilha+Flores",
    points: [
      { id: "flo1", name: "Ipê Amarelo Radiante", qrId: "QR004", treeInfoKey: "ipe_amarelo" },
      { id: "flo2", name: "Manacá-da-Serra Perfumado", qrId: "QR005", treeInfoKey: "manaca" },
    ]
  },
   3: {
    id: 3,
    name: "Trilha do Pequeno Explorador",
    fullDescription: "Uma aventura divertida e educativa para todas as idades, especialmente para crianças. Descubra curiosidades sobre as árvores de forma lúdica.",
    mapImage: "https://via.placeholder.com/800x400.png?text=Mapa+Trilha+Explorador",
    points: [
        { id: "exp1", name: "Quaresmeira Colorida", qrId: "QR006", treeInfoKey: "quaresmeira" },
        { id: "exp2", name: "Embaúba Prateada", qrId: "QR007", treeInfoKey: "embauba" },
    ]
  }
};

const treeDetailsData = {
  jequitiba: { name: "Jequitibá-Rosa", scientificName: "Cariniana legalis", details: "Uma das maiores árvores da flora brasileira, conhecida por sua longevidade e madeira nobre. Pode atingir alturas impressionantes.", audio: "audio_jequitiba.mp3" },
  paineira: { name: "Paineira", scientificName: "Ceiba speciosa", details: "Caracteriza-se pelo tronco esverdeado com espinhos e pelas painas que envolvem suas sementes, parecendo algodão.", audio: "audio_paineira.mp3" },
  figueira: { name: "Figueira", scientificName: "Ficus spp.", details: "Gênero com muitas espécies, famosas por suas raízes aéreas e frutos que alimentam a fauna local.", audio: "audio_figueira.mp3" },
  ipe_amarelo: { name: "Ipê Amarelo", scientificName: "Handroanthus albus", details: "Símbolo do Brasil, encanta com sua floração amarela vibrante durante o inverno e primavera.", audio: "audio_ipe.mp3" },
  manaca: { name: "Manacá-da-Serra", scientificName: "Tibouchina mutabilis", details: "Arbusto ou arvoreta que exibe flores que mudam de cor, do branco ao roxo, simultaneamente.", audio: "audio_manaca.mp3" },
  quaresmeira: { name: "Quaresmeira", scientificName: "Tibouchina granulosa", details: "Árvore ornamental de floração roxa intensa, muito comum na arborização urbana.", audio: "audio_quaresmeira.mp3" },
  embauba: { name: "Embaúba", scientificName: "Cecropia spp.", details: "Árvore pioneira, de crescimento rápido, facilmente reconhecível por suas folhas grandes e prateadas na face inferior.", audio: "audio_embauba.mp3" },
};

function TrailDetailPage() {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [scannedTreeInfo, setScannedTreeInfo] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const trailData = trailsMasterData[id];
    setTrail(trailData);
    setCurrentPoint(null); // Reset point on trail change
    setScannedTreeInfo(null);
    setShowChatbot(false);
    setChatMessages([]);
  }, [id]);

  const handleScanQrCode = (point) => {
    // SIMULAÇÃO: Em um app real, aqui ocorreria a leitura do QR Code.
    // O qrId do ponto seria usado para buscar a informação da árvore.
    alert(`QR Code "${point.qrId}" para "${point.name}" escaneado! (Simulação)`);
    const treeInfo = treeDetailsData[point.treeInfoKey];
    if (!treeInfo) {
      alert(`Informações para "${point.name}" não encontradas.`);
      setCurrentPoint(point); // Still mark the point as selected
      setScannedTreeInfo(null); // Ensure info is cleared
      setShowChatbot(false);
      setChatMessages([]);
      return;
    }
    setCurrentPoint(point);
    setScannedTreeInfo(treeInfo);
    setShowChatbot(false); // Reset chat
    setChatMessages([]);
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

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !scannedTreeInfo) return;

    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    
    // SIMULAÇÃO de resposta do Chatbot
    setTimeout(() => {
      const botResponse = { sender: 'bot', text: `Entendido. Sobre "${chatInput}" referente a ${scannedTreeInfo.name}: esta é uma resposta simulada. Em um app real, eu buscaria informações relevantes.` };
      setChatMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
    setChatInput('');
  };

  if (!trail) {
    return <div className="page-container loading">Carregando detalhes da trilha...</div>;
  }

  return (
    <div className="page-container trail-detail-page">
      <Link to="/trilhas" className="btn btn-back">‹ Voltar para Trilhas</Link>
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
              <button onClick={() => handleScanQrCode(point)} className="btn btn-secondary btn-small">
                Escanear QR
              </button>
            </li>
          ))}
        </ul>
      </section>

      {scannedTreeInfo && (
        <section className="card tree-info-section">
          <h3>Informações sobre: {scannedTreeInfo.name}</h3>
          <p><strong>Nome Científico:</strong> <em>{scannedTreeInfo.scientificName}</em></p>
          <p>{scannedTreeInfo.details}</p>
          
          <h4><span role="img" aria-label="headphone">🎧</span> Audioguia (Simulado)</h4>
          <audio controls src={`/audio/${scannedTreeInfo.audio}`} className="audioplayer">
            Seu navegador não suporta o elemento de áudio. (Arquivo: {scannedTreeInfo.audio})
          </audio>
          <p className="simulation-note">(Nota: A funcionalidade de audioguia e os arquivos de áudio são simulados. Adicione os arquivos em `public/audio/`)</p>

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