module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  const { prompt, width = 1024, height = 1024 } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'A valid text prompt is required.' });
  }

  try {
    const seed = Math.floor(Math.random() * 99999999);
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

    return res.status(200).json({
      success: true,
      image_url: imageUrl,
      prompt: prompt,
      seed: seed,
      year: new Date().getFullYear()
    });
  } catch (error) {
    console.error('Error generating image in Vercel Serverless:', error);
    return res.status(500).json({ error: 'Failed to generate image.' });
  }
};
