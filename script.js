document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:8000/api/v1/";
  const apiUrlscore = apiUrl + "titles/?sort_by=-imdb_score";

  fetch(apiUrlscore)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur HTTP : " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      data.results.sort((a, b) => b.imdb_score - a.imdb_score);
      const meilleurFilm = data.results[0];

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
    })
    .catch((error) => {
      console.error("Une erreur est survenue :", error);
    });

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
