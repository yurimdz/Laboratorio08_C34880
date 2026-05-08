// ── services/tvmaze.js ────────────────────────────────────────────────────────
const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

const searchShow = async (name) => {
  const URL = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(name)}`;
  const results = await fetch(URL).then((res) => res.json());
  if (!results.length) return null;
  return results[0].show.id;
};

const getShowData = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}`;
  const data = await fetch(URL).then((res) => res.json());
  return {
    name: data.name,
    rating: data.rating,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE,
  };
};

const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const episodes = await fetch(URL).then((res) => res.json());
  const episodeList = episodes.map((episode) => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average,
  }));
  return episodeList.reduce((acc, episode) => {
    const season = episode.season;
    if (!acc[season]) acc[season] = [];
    acc[season].push(episode);
    return acc;
  }, {});
};

// ── components/shows.js ───────────────────────────────────────────────────────
const createHeaderHTML = (show) => `
  <img class="poster" src="${show.image}" alt="Poster de ${show.name}" />
  <div class="show-info">
    <h1>${show.name}</h1>
    <p class="rating">
      Valoración
      <span class="rating-badge">⭐ ${show.rating?.average ?? "N/A"}</span>
    </p>
  </div>
`;

const createEpisodeHTML = (episode) => {
  const ratingClass = episode.rating ? `rating-${Math.round(episode.rating)}` : "rating-0";
  return `<div class="episode episode-${episode.number} ${ratingClass}" title="Ep. ${episode.number} · ${episode.rating ?? 'sin rating'}">${episode.number}</div>`;
};

const createSeasonHTML = (data, number) => `
  <article class="season">
    <header class="season-header">T${number}</header>
    ${data.map(createEpisodeHTML).join("")}
  </article>
`;

// ── index.js ──────────────────────────────────────────────────────────────────
const $form = document.querySelector(".search-form");
const $input = document.querySelector(".search-input");
const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");

const renderShow = async (id) => {
  const show = await getShowData(id);
  const seasons = await getEpisodeList(id);
  $header.setHTMLUnsafe(createHeaderHTML(show));
  const list = Object.values(seasons).map((season, index) =>
    createSeasonHTML(season, index + 1)
  );
  $episodes.setHTMLUnsafe(list.join(""));
};

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $input.value.trim();
  if (!name) return;
  $header.innerHTML = "<p>Buscando...</p>";
  $episodes.innerHTML = "";
  const id = await searchShow(name);
  if (!id) {
    $header.innerHTML = "<p>No se encontró ninguna serie.</p>";
    return;
  }
  await renderShow(id);
});