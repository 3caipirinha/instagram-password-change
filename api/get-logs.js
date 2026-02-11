import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Permetti solo richieste GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Recupera gli ultimi 10 ID dalla lista
    const logIds = await kv.lrange('password-changes-list', 0, 9);

    if (!logIds || logIds.length === 0) {
      return res.status(200).json({ 
        logs: [],
        message: 'No password changes logged yet'
      });
    }

    // Recupera i dati completi per ogni ID
    const logs = await Promise.all(
      logIds.map(async (id) => {
        const data = await kv.get(id);
        return data;
      })
    );

    return res.status(200).json({ 
      logs: logs.filter(log => log !== null),
      total: logs.length
    });

  } catch (error) {
    console.error('Error retrieving logs:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve logs',
      details: error.message 
    });
  }
}
