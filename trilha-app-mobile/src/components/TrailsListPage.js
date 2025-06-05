import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../App.css'; // Certifique-se de que este caminho está correto
import jsQR from 'jsqr';

// Dados de exemplo para as trilhas
const trailsData = [
  { id: 1, name: "Trilha das Gigantes", description: "Descubra as árvores mais antigas e imponentes da ESALQ.", distance: "2.5 km", qrCodes: 7, image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlJTIwdHJhaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" },
  { id: 2, name: "Trilha das Flores Nativas", description: "Um percurso colorido pelas espécies floríferas locais.", distance: "1.8 km", qrCodes: 10, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmF0dXJlJTIwdHJhaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" },
  { id: 3, name: "Trilha do Pequeno Explorador", description: "Ideal para crianças e famílias, com foco em curiosidades.", distance: "1.2 km", qrCodes: 5, image: "https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5hdHVyZSUyMHRyYWlsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" },
];

const TrailsListPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null); // Referência para o elemento <video>
  const streamRef = useRef(null); // Referência para o MediaStream da câmera
  const animationFrameIdRef = useRef(null); // Referência para o ID do requestAnimationFrame
  

  // Função para navegar após detecção do QR Code
  const navigateToTreePage = (qrData) => {
    // Assume que qrData é o ID da trilha. Ajuste conforme a estrutura dos seus dados de QR Code.
    const trailId = parseInt(qrData, 10);
    const trail = trailsData.find((t) => t.id === trailId);

    if (trail) {
      // Navega para a página da trilha.
      // Se o QR Code identificar um PONTO específico, a URL e lógica podem precisar ser diferentes.
      // Ex: window.location.href = `/trilha/${trail.id}/ponto/${qrData}`;
      window.location.href = `/trilha/${trail.id}`;
    } else {
      alert('QR Code não corresponde a nenhuma trilha conhecida.');
    }
    stopScan(); // Para o scanner após a tentativa de navegação
  };

  // Função para parar o scanner e liberar recursos
  const stopScan = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current); // Cancela o loop de escaneamento
      animationFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop()); // Para todas as trilhas (vídeo)
      streamRef.current = null; // Limpa a referência do stream
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null; // Remove o stream do elemento de vídeo
      // Pausa o vídeo e remove a fonte para liberar recursos
      videoRef.current.pause();
      videoRef.current.removeAttribute('src'); // Limpa o atributo src
      videoRef.current.load(); // Reseta o player de vídeo
    }
    setIsScanning(false); // Esconde o overlay do scanner
  };

  // Função que realiza o escaneamento do QR Code recursivamente
  const scanQrCode = () => {
    // Verifica se o scanner ainda deve estar ativo e se o vídeo está pronto
    if (!isScanning || !videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      if (isScanning) { // Só agenda o próximo frame se ainda estiver escaneando
          animationFrameIdRef.current = requestAnimationFrame(scanQrCode);
      }
      return;
    }

    const canvas = document.createElement('canvas');
    // O { willReadFrequently: true } é uma dica de otimização para o getContext
    const canvasContext = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Verifica se as dimensões são válidas antes de desenhar
    if (canvas.width > 0 && canvas.height > 0) {
        canvasContext.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert", // Opção para jsQR, pode tentar "invertFirst" se tiver problemas
        });

        if (code && code.data) { // Verifica se um código foi encontrado e tem dados
            alert(`QR Code detectado: ${code.data}`);
            navigateToTreePage(code.data); // Processa o QR Code
            // stopScan() é chamado dentro de navigateToTreePage, então não precisa aqui.
            return; // Para o loop de escaneamento aqui
        }
    }
    // Se nenhum código foi encontrado ou as dimensões não eram válidas, continua escaneando
    animationFrameIdRef.current = requestAnimationFrame(scanQrCode);
  };

  // Função chamada ao clicar no botão "Escanear QR Code"
  const handleScanQrCode = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Seu navegador não suporta o acesso à câmera.');
      return;
    }

    setIsScanning(true); // Mostra o overlay do scanner

    const constraints = { video: { facingMode: 'environment' } }; // Usa a câmera traseira

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream; // Guarda o stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Evento 'onloadedmetadata' é importante para garantir que as dimensões do vídeo (videoWidth, videoHeight) estejam disponíveis.
        videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(() => {
                 // Só inicia o scanQrCode depois que o vídeo realmente começou a tocar
                animationFrameIdRef.current = requestAnimationFrame(scanQrCode);
            }).catch(playError => {
                console.error("Erro ao tentar tocar o vídeo:", playError);
                alert("Não foi possível iniciar a câmera. Verifique as permissões e tente novamente.");
                stopScan();
            });
        };
        // Adiciona um manipulador de erro para o elemento de vídeo também
        videoRef.current.onerror = () => {
            alert("Ocorreu um erro com o vídeo da câmera. Tente novamente.");
            stopScan();
        };
      }
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error);
      let userMessage = 'Erro ao acessar a câmera: ';
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        userMessage += "Permissão para acessar a câmera foi negada. Verifique as configurações do seu navegador.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        userMessage += "Nenhuma câmera compatível foi encontrada.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        userMessage += "A câmera pode já estar em uso ou houve um problema ao iniciá-la.";
      }
      else {
        userMessage += error.message;
      }
      alert(userMessage);
      stopScan(); // Garante que o scanner seja fechado em caso de erro
    }
  };

  useEffect(() => {
    return () => {
      stopScan(); // Chama stopScan quando o componente for desmontado
    };
  }, []); // O array vazio como segundo argumento significa que este efeito roda apenas ao montar e desmontar o componente

  return (
    <div className="page-container">
      {/* Scanner de QR Code - Modal/Overlay */}
      {isScanning && (
        // Adicionado onClick no overlay para fechar clicando fora da área branca (no fundo escuro)
        <div className="qr-scanner-overlay" onClick={(e) => { if (e.target === e.currentTarget) stopScan();}}>
          <div className="qr-scanner-container">
            {/* `playsInline` é importante para iOS. `muted` e `autoPlay` podem ajudar. */}
            <video ref={videoRef} className="qr-video-element" playsInline muted autoPlay></video>
            <p>Aponte a câmera para o QR Code.</p>
            <button onClick={stopScan} className="btn btn-secondary">Cancelar</button>
          </div>
        </div>
      )}

      <h2 className="page-title">Trilhas Disponíveis</h2>
      <p className="page-subtitle">Escolha uma trilha para iniciar sua jornada de descobertas pela ESALQ.</p>
      <div className="trails-list">
        {trailsData.map(trail => (
          <Link to={`/trilha/${trail.id}`} key={trail.id} className="trail-card-link">
            <div className="trail-card card">
              <img src={trail.image} alt={trail.name} className="trail-card-image" />
              <div className="trail-card-content">
                <h3>{trail.name}</h3>
                <p className="trail-card-description">{trail.description}</p>
                <div className="trail-card-details">
                  <span>📍 {trail.distance}</span>
                  <span>🌳 {trail.qrCodes} QR Codes</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <button onClick={handleScanQrCode} className="btn btn-primary" disabled={isScanning}>
        {isScanning ? 'Escaneando...' : 'Escanear QR Code'}
      </button>
    </div>
  );
};

export default TrailsListPage;