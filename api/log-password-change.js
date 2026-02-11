import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Permetti solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timestamp, passwordLength } = req.body;

    // Genera un ID univoco per questo log
    const logId = `password-change:${Date.now()}`;

    // Dati da salvare (SENZA password in chiaro per sicurezza!)
    const logEntry = {
      id: logId,
      timestamp,
      passwordLength,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    // Salva nel KV store
    await kv.set(logId, logEntry);

    // Aggiungi anche a una lista di tutti i log (opzionale, utile per recuperarli)
    await kv.lpush('password-changes-list', logId);

    return res.status(200).json({ 
      success: true, 
      message: 'Password change logged successfully',
      logId 
    });

  } catch (error) {
    console.error('Error logging password change:', error);
    return res.status(500).json({ 
      error: 'Failed to log password change',
      details: error.message 
    });
  }
}
