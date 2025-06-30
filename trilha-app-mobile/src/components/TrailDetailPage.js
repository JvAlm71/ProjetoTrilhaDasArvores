import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './../App.css';
import jsQR from 'jsqr';
import { trailTreeMapping } from '../config/trailTreeMapping';
import { getTreeByCode } from '../utils/csvParser';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
function TrailDetailPage() {
  const { id } = useParams(); // id will be a string e.g. "1", "2"
  const [trail, setTrail] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [scannedTreeInfo, setScannedTreeInfo] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [mapHtmlFile, setMapHtmlFile] = useState(''); // Initialize as empty or a loading state
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const trailConfig = trailTreeMapping[id]; // id from useParams is a string
    if (trailConfig) {
      const trailData = {
        id: parseInt(id), // Keep this if you use integer IDs elsewhere
        name: trailConfig.name,
        fullDescription: trailConfig.description,
        points: trailConfig.trees.map(treeConfig => {
          const treeData = getTreeByCode(treeConfig.csvCode);
          return {
            id: treeConfig.csvCode, // This is the tree's ID/code
            name: treeData ? treeData.name : 'Árvore não encontrada',
            qrId: treeConfig.qrId,
            csvCode: treeConfig.csvCode,
            treeData: treeData
          };
        })
      };
      setTrail(trailData);

      // Set the mapHtmlFile based on the trail's id from the URL
      setMapHtmlFile(`/trail_map_${id}.html`);

    } else {
      setTrail(null);
      setMapHtmlFile(''); // Or a path to a "map not found" html
    }
    // Reset states when ID changes
    setCurrentPoint(null);
    setScannedTreeInfo(null);
    setShowChatbot(false);
    setChatMessages([]);
  }, [id]); 


   const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !scannedTreeInfo) return;

    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    setChatInput('');


    if (!GEMINI_API_KEY) {
        const botResponse = { sender: 'bot', text: "Erro: API Key do Gemini não configurada corretamente." };
        setChatMessages((prevMessages) => [...prevMessages, botResponse]);
        console.error("GEMINI_API_KEY is not set. Please set REACT_APP_GEMINI_API_KEY in your .env file.");
        return;
    }

    try {
      const promptText = `Você é um guia botânico interativo e amigável. As informações disponíveis sobre a árvore são: Nome: ${scannedTreeInfo.name}, Nome Científico: ${scannedTreeInfo.species || scannedTreeInfo.scientificName}, Detalhes adicionais: ${scannedTreeInfo.details || scannedTreeInfo.observations || 'N/A'}. Responda à seguinte pergunta do visitante sobre esta árvore, de forma concisa e informativa: ${chatInput}`;
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(`Erro na API (${response.status}): ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar uma resposta no momento.';
      const botResponse = { sender: 'bot', text: botText };
      setChatMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Chatbot communication error:", error);
      const errorMessage = { sender: 'bot', text: `Erro ao se comunicar com o chatbot: ${error.message}` };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };
  
  const handleScanQrCode = async () => {
    setCameraActive(true);

    // Wait for the camera and canvas elements to render
    setTimeout(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!canvas || !video) {
        alert('Camera or canvas element is not properly initialized.');
        setCameraActive(false);
        return;
      }

      const canvasContext = canvas.getContext('2d');

      try {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.setAttribute('playsinline', '');
        video.play();

        const scan = () => {
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
              alert(`QR Code detected: ${code.data}`);
              stopStream(stream);
              processQrCode(code.data);
            }
          }
          requestAnimationFrame(scan);
        };

        scan();
      } catch (error) {
        alert('Error accessing camera: ' + error.message);
        setCameraActive(false);
      }

      const stopStream = (stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setCameraActive(false);
      };

      const processQrCode = (data) => {
        const point = trail.points.find((p) => p.qrId === data);
        if (point && point.treeData) {
          setCurrentPoint(point);
          setScannedTreeInfo(point.treeData);
          setShowChatbot(false);
          setChatMessages([]);
        } else {
          alert('QR Code não corresponde a nenhum ponto conhecido ou dados da árvore não encontrados.');
        }
      };
    }, 100); // Delay to ensure elements are rendered
  };

  const handleChatToggle = () => {
    if (!scannedTreeInfo) {
        alert("Por favor, escaneie um QR Code de uma árvore com informações disponíveis primeiro.");
        return;
    }
    setShowChatbot(!showChatbot);
    if (!showChatbot && scannedTreeInfo) { // Opening chat for the first time for this tree
        setChatMessages([{ sender: 'bot', text: `Olá! Você está vendo informações sobre ${scannedTreeInfo.name}. O que gostaria de saber?` }]);
    }
  }
  
  const navigateToTreePage = (treeId) => {
    if (!trail) return;
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
    return <div className="page-container loading">Carregando detalhes da trilha... Ou trilha não encontrada.</div>;
  }
  // Make sure mapHtmlFile is set before rendering iframe, or provide a fallback.
  // The iframe src must not be empty if you want to avoid an attempt to load from the current page's URL.
  if (!mapHtmlFile && trail) {
      // This case should ideally be handled if trail exists but map file name couldn't be formed
      // or if you want a placeholder while the specific map name is being determined.
      // For now, if trail exists, mapHtmlFile should be set.
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

      {cameraActive && (
        <div className="camera-container">
          <video ref={videoRef} className="camera-feed" />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {trail && (
        <>
          <h2 className="page-title">{trail.name}</h2>
          <p className="trail-fullDescription">{trail.fullDescription}</p>

          <section className="card map-section">
            <h3>Mapa da Trilha e Pontos de Interesse</h3>
            {mapHtmlFile ? (
              <iframe
                src={mapHtmlFile}
                width="100%"
                height="450"
                style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                title={`Mapa da ${trail.name}`}
                loading="lazy"
              >
                Seu navegador não suporta iframes. O mapa para esta trilha pode não estar disponível.
                Você pode tentar acessá-lo <a href={mapHtmlFile} target="_blank" rel="noopener noreferrer">aqui</a>.
              </iframe>
            ) : (
              <p>Carregando mapa ou mapa não disponível...</p> // Fallback if mapHtmlFile is not yet set
            )}
            <p style={{marginTop: '10px'}}>Siga os pontos marcados para encontrar os QR Codes e aprender mais:</p>
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
          </section>
        </>
      )}

      {/* ... (Rest of your JSX for tree info and chatbot) ... */}
      {scannedTreeInfo && (
        <section className="card tree-info-section">
          <h3>Informações sobre: {scannedTreeInfo.name}</h3>
          <p><strong>Nome Científico:</strong> <em>{scannedTreeInfo.species || scannedTreeInfo.scientificName}</em></p>
          {scannedTreeInfo.genus && <p><strong>Gênero:</strong> {scannedTreeInfo.genus}</p>}
          
          <div className="tree-measurements">
            <h4>📏 Medidas da Árvore</h4>
            <p><strong>Altura Geral:</strong> {scannedTreeInfo.height || 'N/A'}m</p>
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
              {scannedTreeInfo.latitude && scannedTreeInfo.longitude &&
               scannedTreeInfo.latitude !== 0 && scannedTreeInfo.longitude !== 0 && (
                <p><strong>Coordenadas:</strong> {Number(scannedTreeInfo.latitude).toFixed(6)}, {Number(scannedTreeInfo.longitude).toFixed(6)}</p>
              )}
            </div>
          )}

          {scannedTreeInfo.generalCondition && scannedTreeInfo.generalCondition !== 'Não informado' && (
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
              aria-label="Pergunta para o chatbot"
            />
            <button type="submit" className="btn">Enviar</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default TrailDetailPage;