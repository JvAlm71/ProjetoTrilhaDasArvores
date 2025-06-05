import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../App.css'; // Certifique-se de que este caminho está correto
import jsQR from 'jsqr';

// Dados de exemplo para as trilhas
const trailsData = [
  {
    id: 1,
    name: "Trilha de Árvores Medicinais",
    description: "Explore espécies medicinais e conheça a diversidade botânica da ESALQ.",
    distance: "1.27 km",
    qrCodes: 21,
    image: "/esalq.jpg" 
  },
];

const TrailsListPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  

  const navigateToTreePage = (qrData) => {
    console.log("Navegando com os dados do QR Code:", qrData);
    const trailId = parseInt(qrData, 10);
    const trail = trailsData.find((t) => t.id === trailId);

    if (trail) {
      window.location.href = `/trilha/${trail.id}`;
    } else {
      alert('QR Code não corresponde a nenhuma trilha conhecida.');
    }
    stopScan();
  };

  const stopScan = () => {
    console.log("Parando o scanner...");
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    setIsScanning(false);
    console.log("Scanner parado.");
  };

  const scanQrCode = () => {
    if (!isScanning || !videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      // console.log("Scanner não está pronto ou vídeo não tem dados suficientes."); // Log opcional para não poluir muito
      if (isScanning) {
          animationFrameIdRef.current = requestAnimationFrame(scanQrCode);
      }
      return;
    }

    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Log para verificar as dimensões
    // Removido o log daqui para evitar poluição excessiva, pois é chamado em loop.
    // Se precisar, descomente a linha abaixo:
    // console.log(`Dimensões do Canvas para scan: Largura=${canvas.width}, Altura=${canvas.height}`);


    if (canvas.width > 0 && canvas.height > 0) {
        try {
            canvasContext.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert", 
            });

            if (code && code.data) {
                console.log("QR Code DETECTADO:", code.data); // Log importante!
                alert(`QR Code detectado: ${code.data}`); // Usar alert para teste imediato
                navigateToTreePage(code.data); 
                return; 
            }
            // else {
                // console.log("Nenhum QR Code detectado neste frame."); // Log opcional
            // }
        } catch (error) {
            console.error("Erro durante o processamento da imagem com jsQR:", error);
            // Considerar se quer parar o scan ou apenas logar e continuar
        }
    } else {
        // Log apenas se as dimensões mudarem para inválidas ou na primeira vez
        if (animationFrameIdRef.current % 100 === 0) { // Log a cada 100 frames para não poluir
            console.warn(`Dimensões do canvas inválidas para processamento: L=${canvas.width}, H=${canvas.height}`);
        }
    }
    
    if (isScanning) { // Garante que só continue se ainda estiver escaneando
        animationFrameIdRef.current = requestAnimationFrame(scanQrCode);
    }
  };

  const handleScanQrCode = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Seu navegador não suporta o acesso à câmera.');
      return;
    }

    setIsScanning(true); 
    console.log("Tentando acessar a câmera...");

    const constraints = { video: { facingMode: 'environment' } }; 

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream; 

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
            console.log(`Metadados do vídeo carregados. Dimensões nativas: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}. Tentando tocar o vídeo...`);
            videoRef.current.play().then(() => {
                console.log("Vídeo tocando. Iniciando escaneamento de QR Code.");
                // Limpa qualquer frame de animação anterior antes de iniciar um novo
                if (animationFrameIdRef.current) {
                    cancelAnimationFrame(animationFrameIdRef.current);
                }
                animationFrameIdRef.current = requestAnimationFrame(scanQrCode);
            }).catch(playError => {
                console.error("Erro ao tentar tocar o vídeo:", playError);
                alert("Não foi possível iniciar a câmera. Verifique as permissões e tente novamente.");
                stopScan();
            });
        };
        videoRef.current.onerror = () => {
            console.error("Ocorreu um erro com o elemento de vídeo da câmera.");
            alert("Ocorreu um erro com o vídeo da câmera. Tente novamente.");
            stopScan();
        };
      }
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error.name, error.message);
      let userMessage = 'Erro ao acessar a câmera: ';
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        userMessage += "Permissão para acessar a câmera foi negada. Verifique as configurações do seu navegador.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        userMessage += "Nenhuma câmera compatível foi encontrada.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        userMessage += "A câmera pode já estar em uso ou houve um problema ao iniciá-la.";
      } else {
        userMessage += error.message; // Mantenha apenas a mensagem de erro para outros casos
      }
      alert(userMessage);
      stopScan(); 
    }
  };

  useEffect(() => {
    return () => {
      console.log("Componente TrailsListPage desmontando. Parando o scanner.");
      stopScan(); 
    };
  }, []);

  return (
    <div className="page-container">
      {isScanning && (
        <div className="qr-scanner-overlay" onClick={(e) => { if (e.target === e.currentTarget) stopScan();}}>
          <div className="qr-scanner-container">
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