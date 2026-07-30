const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

async function generateQRCodes() {
  const schoolUrl = 'https://hsa-rosy-theta.vercel.app';
  const publicDir = path.join(__dirname, '../public');
  const artifactDir = 'C:\\Users\\joema\\.gemini\\antigravity\\brain\\45b1d1f7-e9c9-46ba-82f3-4b74a08ef7db';

  // 1. Digital Brand QR Code (Indigo Accent + Dark BG)
  const digitalPathPublic = path.join(publicDir, 'leaselink_school_qr.png');
  const digitalPathArtifact = path.join(artifactDir, 'leaselink_school_qr.png');
  await QRCode.toFile(digitalPathPublic, schoolUrl, {
    width: 1200,
    margin: 2,
    color: {
      dark: '#6366f1',  // Indigo accent
      light: '#090d16'  // Dark background
    },
    errorCorrectionLevel: 'H'
  });
  fs.copyFileSync(digitalPathPublic, digitalPathArtifact);
  console.log('Generated digital school QR code:', digitalPathPublic);

  // 2. High Contrast B&W Printable QR Code
  const printPathPublic = path.join(publicDir, 'leaselink_school_qr_print.png');
  const printPathArtifact = path.join(artifactDir, 'leaselink_school_qr_print.png');
  await QRCode.toFile(printPathPublic, schoolUrl, {
    width: 1200,
    margin: 2,
    color: {
      dark: '#000000',  // Pure black
      light: '#ffffff'  // Pure white
    },
    errorCorrectionLevel: 'H'
  });
  fs.copyFileSync(printPathPublic, printPathArtifact);
  console.log('Generated printable school QR code:', printPathPublic);
}

generateQRCodes().catch(err => {
  console.error('Error generating QR codes:', err);
  process.exit(1);
});
