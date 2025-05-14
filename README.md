# JustStreamIt

Bienvenue dans JustStreamIt, une application front-end de streaming de films responsive. Ce projet a pour objectif d’afficher dynamiquement des films et leurs détails à partir d’une API maison (OCMovies-API), selon plusieurs catégories et classements.

## Table des matières

- Maquettes
- Fonctionnalités
- Technologies
- Installation
- Utilisation
- Architecture de l’interface
- API et données
- Contraintes techniques

## Maquettes

Les maquettes se trouvent sur Figma :

Zones principales :

Meilleur film : affiche l’image, le titre, le résumé et un bouton "Détails" du film ayant la meilleure note IMDB toutes catégories confondues.

Films les mieux notés : liste des autres films classés par note IMDB.

Catégorie 1, Catégorie 2, Autres : blocs dédiés aux films les mieux notés par catégorie.

Menu déroulant ou liste HTML pour sélectionner n’importe quelle catégorie.

Bouton "Voir plus" pour charger les films cachés selon la taille d’écran.

Vous êtes libre de choisir vos propres catégories pour Catégorie 1 et 2.

## Fonctionnalités

Affichage dynamique des films via requêtes fetch vers l’API.

Zone "Meilleur film" : mise en avant du top film IMDB.

Listings par catégorie : trois blocs de catégories personnalisés, plus un bloc générique qui se met à jour via un menu ou une liste.

Fenêtre modale de détails : affiche image, titre, genres, date de sortie, classification, score IMDB, réalisateur, acteurs, durée, pays, box-office et synopsis.

Responsive Web Design :

Mobile : 2 films visibles par catégorie (4 cachés).

Tablette : 4 films visibles (2 cachés).

Desktop : 6 films visibles.

Films cachés dévoilés grâce au bouton Voir plus.

## Technologies

HTML5 & CSS3

Vanilla JavaScript (ES6+)

CSS Framework : Bootstrap ou Tailwind CSS

Requêtes HTTP : API fetch native

Interdits : tout autre framework JS (React, Angular, VueJS) ou CSS non listé, plugins/modules additionnels.

## Installation

Clonez ce dépôt :

    git clone git@github.com:Caroleloop/oc_python_6.git

Clonez le dépôt de l'API :

    git clone git@github.com:OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git

Suivez les instructions du fichier README.md du dépôt OCMovies API GitHub Repository pour installer et démarrer le serveur de l'API.

Après avoir démarré le serveur de l'API, vous pouvez ouvrir index.html dans un navigateur web moderne.

## Utilisation

Les films correspondants sont chargés et affichés automatiquement.

Cliquez sur le bouton Détails pour ouvrir la fenêtre modale avec les informations complètes.

Utilisez Voir plus pour afficher les films cachés selon votre écran.

Sélectionnez une catégorie dans le menu déroulant pour afficher les films de cette catégorie.

## Auteurs

- **Carole Roch** _alias_ [@Caroleloop](https://github.com/Caroleloop)
