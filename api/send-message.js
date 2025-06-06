export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const { phone, template } = req.body;

  if (!token || !phoneNumberId) {
    return res.status(500).json({ error: 'Missing WhatsApp credentials in environment variables.' });
  }
  if (!phone || !template) {
    return res.status(400).json({ error: 'Missing phone or template in request body.' });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'template',
          template: {
            name: template,
            language: { code: 'en_US' },
          },
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Failed to send message' });
    }
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send message via WhatsApp API.' });
  }
} 