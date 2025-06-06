export default async function handler(req, res) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

  if (!token || !businessAccountId) {
    return res.status(500).json({ error: 'Missing WhatsApp credentials in environment variables.' });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${businessAccountId}/message_templates`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Failed to fetch templates' });
    }
    // Return only the template names and their display names
    const templates = (data.data || []).map(t => ({
      name: t.name,
      display_name: t.display_name || t.name,
    }));
    return res.status(200).json({ templates });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch templates from WhatsApp API.' });
  }
} 