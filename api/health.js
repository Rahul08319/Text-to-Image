module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const currentYear = new Date().getFullYear();
  res.status(200).json({
    status: 'healthy',
    system: 'Apple Design Text-to-Image AI Studio',
    currentYear: currentYear,
    timestamp: new Date().toISOString()
  });
};
