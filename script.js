async function recupererTousLesFilms(url) {
  let tousLesFilms = [];

  while (tousLesFilms.length <= 11) {
    try {
      const reponse = await fetch(url);
      const data = await reponse.json();

      // Ajoute les résultats de cette page
      tousLesFilms = tousLesFilms.concat(data.results);

      // Passe à l'URL suivante (ou null s'il n'y en a plus)
      url = data.next;
    } catch (erreur) {
      console.error("Erreur lors de la récupération des films :", erreur);
      break;
    }
  }

  return tousLesFilms;
}

function afficherFilmsDansListe(films, elementId) {
  const ul = document.getElementById(elementId);
  if (!ul) {
    console.error(`Élément avec l'ID "${elementId}" introuvable.`);
    return;
  }

  ul.innerHTML = "";

  films.forEach((film) => {
    const li = document.createElement("li");
    li.classList.add("film");

    const img = document.createElement("img");
    img.src = film.image_url;
    img.alt = `Affiche de ${film.title}`;

    const titre = document.createElement("h3");
    titre.classList.add("titre-film");
    titre.textContent = film.title;

    const bouton = document.createElement("button");
    bouton.classList.add("bouton-details");
    bouton.setAttribute("aria-label", `Voir les détails de ${film.title}`);
    bouton.textContent = "Détails";
    bouton.addEventListener("click", () => ouvrirModale(film));

    li.appendChild(img);
    li.appendChild(titre);
    li.appendChild(bouton);
    ul.appendChild(li);
  });
}

////
document.addEventListener("DOMContentLoaded", async () => {
  const allMoviesUrl =
    "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
  const comedyUrl =
    "http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score";
  const fantasyUrl =
    "http://localhost:8000/api/v1/titles/?genre=Fantasy&sort_by=-imdb_score";

  try {
    // Récupère tous les films
    const films = await recupererTousLesFilms(allMoviesUrl);

    // Meilleur film
    const meilleurFilm = films[0];
    document.getElementById("image-meilleur-film").src = meilleurFilm.image_url;
    document.querySelector(".titre-film").textContent = meilleurFilm.title;

    // Récupérer les détails du meilleur film
    const details = await fetch(meilleurFilm.url).then((res) => res.json());
    document.getElementById("resume-meilleur-film").textContent =
      details.description;

    // Films les mieux notés
    afficherFilmsDansListe(films.slice(1, 7), "films-mieux-notes");

    // Récupérer les films de comédie
    const filmsComedies = await recupererTousLesFilms(comedyUrl);
    afficherFilmsDansListe(filmsComedies.slice(0, 6), "categorie-comedies");

    // Récupérer les films de fantasy
    const filmsFantasy = await recupererTousLesFilms(fantasyUrl);
    afficherFilmsDansListe(filmsFantasy.slice(0, 6), "categorie-fantasy");

    // Bouton pour ouvrir la modale
    document
      .querySelector(".bouton-details-meilleur-film")
      .addEventListener("click", () => ouvrirModale(meilleurFilm));
  } catch (error) {
    console.error("Une erreur est survenue :", error);
  }

  //Fonction pour ouvrir la modale
  function ouvrirModale(film) {
    fetch(film.url)
      .then((res) => res.json())
      .then((details) => {
        document.getElementById("modale-image").src = details.image_url;
        document.getElementById("modale-titre").textContent = details.title;
        document.getElementById("modale-genres").textContent =
          details.genres?.join(", ") || "N/A";
        document.getElementById("modale-date").textContent =
          details.release_date;
        document.getElementById("modale-classement").textContent =
          details.rating;
        document.getElementById("modale-score").textContent =
          details.imdb_score;
        document.getElementById("modale-realisateur").textContent =
          details.director;
        document.getElementById("modale-acteurs").textContent =
          details.actors?.join(", ") || "N/A";
        document.getElementById("modale-duree").textContent = details.duration;
        document.getElementById("modale-pays").textContent = details.country;
        document.getElementById("modale-boxoffice").textContent =
          details.box_office || "N/A";
        document.getElementById("modale-description").textContent =
          details.description;

        // Affiche la modale
        document.getElementById("modale").classList.remove("modale-cachee");
      });
  }
  // Fermeture de la modale
  document.querySelector(".fermer-modale").addEventListener("click", () => {
    document.getElementById("modale").classList.add("modale-cachee");
  });
});
