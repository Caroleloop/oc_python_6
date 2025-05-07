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

document.addEventListener("DOMContentLoaded", () => {
  const allMoviesUrl =
    "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";

  recupererTousLesFilms(allMoviesUrl)
    .then((films) => {
      console.log("Nombre total de films récupérés :", films.length);
      console.log("Films :", films);

      //Film le mieux noté
      const meilleurFilm = films[0];
      document.getElementById("image-meilleur-film").src =
        meilleurFilm.image_url;
      document.querySelector(".titre-film").textContent = meilleurFilm.title;

      fetch(meilleurFilm.url)
        .then((res) => res.json())
        .then((details) => {
          document.getElementById("resume-meilleur-film").textContent =
            details.description;
        });

      document
        .querySelector(".bouton-details-meilleur-film")
        .addEventListener("click", () => {
          ouvrirModale(meilleurFilm);
        });

      //Films les mieux notés
      const filmsMieuxNotes = films.slice(1, 9);
      const ul = document.getElementById("films-mieux-notes");
      ul.innerHTML = ""; // Nettoyer d'abord

      filmsMieuxNotes.forEach((film) => {
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
    })

    .catch((error) => {
      console.error("Une erreur est survenue :", error);
    });

  //Modale
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

        document.getElementById("modale").classList.remove("modale-cachee");
      });
  }

  document.querySelector(".fermer-modale").addEventListener("click", () => {
    document.getElementById("modale").classList.add("modale-cachee");
  });
});
