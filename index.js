import { searchShow, getShowData, getEpisodeList } from "../services/tvmaze.js";
import { createHeaderHTML, createSeasonHTML } from "../components/shows.js";

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