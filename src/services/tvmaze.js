// ── Constantes ────────────────────────────────────────────────────────────────
const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

// ── Buscar serie por nombre y obtener su ID ───────────────────────────────────
export const searchShow = async (name) => {
  const URL = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(name)}`;
  const results = await fetch(URL).then((res) => res.json());
  if (!results.length) return null;
  return results[0].show.id;
};

// ── Obtener datos principales de una serie por su ID ─────────────────────────
export const getShowData = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}`;
  const data = await fetch(URL).then((res) => res.json());

  return {
    name: data.name,
    rating: data.rating,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE,
  };
};

// ── Obtener episodios agrupados por temporada ─────────────────────────────────
export const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const episodes = await fetch(URL).then((res) => res.json());

  const episodeList = episodes.map((episode) => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average,
  }));

  // Agrupa los episodios por número de temporada: { 1: [...], 2: [...], ... }
  const episodesBySeason = episodeList.reduce((acc, episode) => {
    const season = episode.season;
    if (!acc[season]) acc[season] = [];
    acc[season].push(episode);
    return acc;
  }, {});
  return episodesBySeason;
};