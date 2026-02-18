const axios = require("axios");

async function geocodeBirthLocation({ city, state, country }) {
  const query = [city, state, country].filter(Boolean).join(", ");
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: { q: query, format: "json", limit: 1 },
      headers: { "User-Agent": "geoSync/1.0 (your@email.com)" },
    },
  );
  if (!response.data.length)
    throw new Error(`Could not geocode location: ${query}`);
  const { lat, lon } = response.data[0];
  return { lat: parseFloat(lat), lng: parseFloat(lon) };
}

module.exports = { geocodeBirthLocation };
