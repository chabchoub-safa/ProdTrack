

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import jsQR from 'jsqr';

export const startQrScanner = async (
  _elementId: string,
  onResult: (text: string) => void
) => {
  const photo = await Camera.getPhoto({
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
    quality: 100,          // ✅ qualité max pour mieux détecter
    allowEditing: false,
    correctOrientation: true, // ✅ corrige l'orientation
    width: 1280,           // ✅ résolution suffisante
    height: 720,
  });

  if (!photo.dataUrl) throw new Error("Pas de photo");

  const qrResult = await decodeQrFromDataUrl(photo.dataUrl);

  if (qrResult) {
    onResult(qrResult);
  } else {
    // ✅ Au lieu de planter, on retourne une erreur claire
    throw new Error("Aucun QR code détecté — Réessaie en centrant bien le QR");
  }
};

export const stopQrScanner = async () => {};

const decodeQrFromDataUrl = (dataUrl: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      // ✅ Essai 1 : image normale
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let code = jsQR(imageData.data, canvas.width, canvas.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) return resolve(code.data);

      // ✅ Essai 2 : image inversée (QR sombre sur fond clair)
      code = jsQR(imageData.data, canvas.width, canvas.height, {
        inversionAttempts: "onlyInvert",
      });

      if (code) return resolve(code.data);

      // ✅ Essai 3 : recadrer le centre de l'image (zoom sur QR)
      const cx = Math.floor(canvas.width * 0.25);
      const cy = Math.floor(canvas.height * 0.25);
      const cw = Math.floor(canvas.width * 0.5);
      const ch = Math.floor(canvas.height * 0.5);

      imageData = ctx.getImageData(cx, cy, cw, ch);
      code = jsQR(imageData.data, cw, ch, {
        inversionAttempts: "attemptBoth",
      });

      resolve(code ? code.data : null);
    };
    img.src = dataUrl;
  });
};