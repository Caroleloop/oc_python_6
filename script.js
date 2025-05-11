// Récupérer tous les films
async function recupererTousLesFilms(url) {
  let tousLesFilms = [];

  while (tousLesFilms.length <= 11) {
    try {
      const reponse = await fetch(url);
      const data = await reponse.json();

      // Ajoute les résultats de cette page
      for (const filmPartiel of data.results) {
        try {
          const res = await fetch(filmPartiel.url);
          const filmComplet = await res.json();
          tousLesFilms.push(filmComplet);
        } catch (err) {
          console.error("Erreur en récupérant les détails d’un film :", err);
        }
      }

      // Passe à l'URL suivante (ou null s'il n'y en a plus)
      url = data.next;
    } catch (erreur) {
      console.error("Erreur lors de la récupération des films :", erreur);
      break;
    }
  }

  return tousLesFilms;
}

// Fonction pour récupérer tous les genres
async function recupererTousLesGenres(url) {
  let tousLesGenres = [];

  while (url) {
    try {
      const reponse = await fetch(url);
      const data = await reponse.json();

      tousLesGenres = tousLesGenres.concat(data.results);
      url = data.next; // Prochaine page
    } catch (erreur) {
      console.error("Erreur lors de la récupération des genres :", erreur);
      break;
    }
  }

  return tousLesGenres;
}

// Remplit dynamiquement le menu déroulant avec les genres
async function remplirSelectGenres() {
  const genres = await recupererTousLesGenres(
    "http://localhost:8000/api/v1/genres/"
  );
  const selectCategorie = document.getElementById("select-categorie");

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.name;
    option.textContent = genre.name;
    selectCategorie.appendChild(option);
  });
}

// Fonction pour afficher les films dans une liste
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

    // Ajoute une image par défaut si l'image est introuvable
    img.onerror = function () {
      img.src = "images/image1_1.png";
    };

    // Créer l'overlay
    const overlay = document.createElement("div");
    overlay.classList.add("film-overlay");

    const titre = document.createElement("h3");
    titre.classList.add("titre-film_liste");
    titre.textContent = film.title;

    const bouton = document.createElement("button");
    bouton.classList.add("bouton-details");
    bouton.setAttribute("aria-label", `Voir les détails de ${film.title}`);
    bouton.textContent = "Détails";
    bouton.addEventListener("click", () => ouvrirModale(film));

    overlay.appendChild(titre);
    overlay.appendChild(bouton);

    li.appendChild(img);
    li.appendChild(overlay);
    ul.appendChild(li);
  });
}

//Fonction pour ouvrir la modale
function ouvrirModale(film) {
  console.log("Film passé à ouvrirModale :", film);
  const modale = document.getElementById("modale");
  modale.classList.remove("modale-cachee");
  modale.classList.add("modale");

  if (!film.url) {
    console.error("film.url est indéfini !");
    return;
  }

  const imageModale = document.getElementById("modale-image");
  imageModale.src = film.image_url;
  imageModale.onerror = () => {
    imageModale.src = "images/image1 1.png";
  };

  console.log("Affichage de la modale pour :", film);

  document.getElementById("modale-image").src = film.image_url;
  document.getElementById("modale-titre").textContent = film.title;
  document.getElementById("modale-genres").textContent =
    film.genres?.join(", ") || "N/A";
  document.getElementById("modale-date").textContent = film.date_published;
  document.getElementById("modale-classement").textContent =
    film.rated || "N/A";
  document.getElementById("modale-score").textContent = film.avg_vote || "N/A";
  document.getElementById("modale-realisateur").textContent =
    film.directors?.join(", ") || "N/A";
  document.getElementById("modale-acteurs").textContent =
    film.actors?.join(", ") || "N/A";
  document.getElementById("modale-duree").textContent = film.duration + " min";
  document.getElementById("modale-pays").textContent =
    film.countries?.join(", ") || "N/A";
  document.getElementById("modale-boxoffice").textContent =
    film.worldwide_gross_income || "N/A";
  document.getElementById("modale-description").textContent =
    film.long_description || film.description || "Pas de description.";

  // Affiche la modale
  document.getElementById("modale").classList.remove("modale-cachee");
}

// fonction pour fermeture de la modale
function fermerModale() {
  const modale = document.getElementById("modale");
  modale.classList.remove("modale");
  modale.classList.add("modale-cachee");
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

    //Bouton "Détails" du meilleur film
    document
      .getElementById("bouton-details-meilleur-film")
      .addEventListener("click", () => {
        ouvrirModale(meilleurFilm);
      });
    // Fermer la modale
    document
      .getElementById("fermer-modale")
      .addEventListener("click", fermerModale);

    // Films les mieux notés
    afficherFilmsDansListe(films.slice(1, 7), "films-mieux-notes");

    // Récupérer les films de comédie
    const filmsComedies = await recupererTousLesFilms(comedyUrl);
    afficherFilmsDansListe(filmsComedies.slice(0, 6), "categorie-comedies");

    // Récupérer les films de fantasy
    const filmsFantasy = await recupererTousLesFilms(fantasyUrl);
    afficherFilmsDansListe(filmsFantasy.slice(0, 6), "categorie-fantasy");

    // Remplit le select avec les catégories
    await remplirSelectGenres();
    const selectCategorie = document.getElementById("select-categorie");

    // Lorsqu'une catégorie est sélectionnée
    selectCategorie.addEventListener("change", async (event) => {
      const categorieChoisie = event.target.value;
      if (!categorieChoisie) return;

      const url = `http://localhost:8000/api/v1/titles/?genre=${categorieChoisie}&sort_by=-imdb_score`;
      const filmsCategorie = await recupererTousLesFilms(url);

      afficherFilmsDansListe(
        filmsCategorie.slice(0, 6),
        "liste-autres-categories"
      );
    });
  } catch (erreur) {
    console.error("Erreur lors du chargement initial :", erreur);
  }
});
