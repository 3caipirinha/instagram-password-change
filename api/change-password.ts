import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Accetta solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validazione base
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Le password non coincidono' });
    }

    // Genera un ID unico per questo cambio password
    const changeId = `pwd_change_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    // Crea hash delle password per sicurezza (NON salvare in chiaro!)
    const hashPassword = (pwd: string) => 
      crypto.createHash('sha256').update(pwd).digest('hex').substring(0, 16);

    // Dati da salvare
    const logEntry = {
      id: changeId,
      timestamp: new Date().toISOString(),
      currentPasswordHash: hashPassword(currentPassword), // Solo hash, non password in chiaro
      newPasswordHash: hashPassword(newPassword),
      confirmPasswordHash: hashPassword(confirmPassword),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
    };

    // Salva in Vercel KV
    await kv.set(changeId, log