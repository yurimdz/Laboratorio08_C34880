// ── Componente: cabecera con datos de la serie ────────────────────────────────
export const createHeaderHTML = (show) => `
  <img class="poster" src="${show.image}" alt="Poster de ${show.name}" />
  <div class="show-info">
    <h1>${show.name}</h1>
    <p class="rating">
      Valoración
      <span class="rating-badge">⭐ ${show.rating?.average ?? "N/A"}</span>
    </p>
  </div>
`;

// ── Componente: un episodio individual ────────────────────────────────────────
export const createEpisodeHTML = (episode) => {
  const ratingClass = episode.rating ? `rating-${Math.round(episode.rating)}` : "rating-0";
  return `<div class="episode episode-${episode.number} ${ratingClass}" title="Ep. ${episode.number} · ${episode.rating ?? 'sin rating'}">${episode.number}</div>`;
};

// ── Componente: una temporada completa ────────────────────────────────────────
export const createSeasonHTML = (data, number) => `
  <article class="season">
    <header class="season-header">T${number}</header>
    ${data.map(createEpisodeHTML).join("")}
  </article>
`;