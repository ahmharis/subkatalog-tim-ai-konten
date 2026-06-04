export default async function handler(req, res) {
  // Hanya menerima metode GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { email, deviceId } = req.query;

  // Mengambil rahasia dari Environment Variable Vercel (Khusus Proyek Sub Katalog)
  const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!GAS_URL) {
    return res.status(500).json({ success: false, message: 'Sistem Error: URL GAS belum disetel di pengaturan Vercel.' });
  }

  try {
    // Meneruskan request dari Vercel ke Google Apps Script Server 2
    const targetUrl = `${GAS_URL}?action=login&email=${encodeURIComponent(email)}&deviceId=${encodeURIComponent(deviceId)}`;
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
        throw new Error("Google Script menolak permintaan.");
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal terhubung ke Database Google Server 2.' });
  }
}
