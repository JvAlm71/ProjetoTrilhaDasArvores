import React, { useRef, useState } from 'react';
import jsQR from 'jsqr';

export default function QrCodeScanner({ onScan, onClose, active }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  React.useEffect(() => {
    if (!active) return;
    let stream;
    let stop = false;
    const startCamera = async () => {
      setScanning(true);
      setError(null);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute('playsinline', '');
        video.play();
        scan();
      } catch (err) {
        setError('Erro ao acessar a câmera: ' + err.message);
        setScanning(false);
      }
    };
    const scan = () => {
      if (stop) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          stopCamera();
          onScan(code.data);
          return;
        }
      }
      requestAnimationFrame(scan);
    };
    const stopCamera = () => {
      stop = true;
      setScanning(false);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      if (onClose) onClose();
    };
    if (active) startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line
  }, [active]);

  if (!active) return null;

  return (
    <div className="camera-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div style={{ position: 'relative', width: '100%', maxWidth: 400, minHeight: 250, background: '#000' }}>
        <video
          ref={videoRef}
          className="camera-feed"
          style={{ width: '100%', maxWidth: 400, minHeight: 250, objectFit: 'cover', borderRadius: 8, border: '2px solid #28a745', background: '#000' }}
          autoPlay
          playsInline
        />
        {/* Optionally, you can overlay a frame or guide here */}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button className="btn" onClick={onClose} disabled={!scanning} style={{ marginTop: 12 }}>Fechar câmera</button>
    </div>
  );
}
