# Aperçu interactif ALINEO

Cette maquette web autonome matérialise une proposition de structure UX/UI. Elle ne renomme pas LifeAI/PAOS et ne préjuge pas de l’identité finale du produit.

## Lancer localement

Depuis ce répertoire, avec Python 3 :

```sh
python3 -m http.server 4173 --bind 0.0.0.0
```

Ouvrir ensuite `http://localhost:4173`. Aucun paquet ni compilation n’est requis.

## Interactions présentes

- Navigation entre Aujourd’hui, Projets, Calendrier, Focus, Life Core, Habitudes, Activité de l’agent et Paramètres ; la navigation mobile regroupe les autres destinations sous « Plus ».
- Vue Calendrier Année (12 mini-calendriers), Mois, Semaine (24 h × 7 jours) et Jour (frise 24 h), avec navigation de période et sélection d’une date.
- Le repère temporel suit la date locale de l’appareil. Les événements, horaires, disponibilités et fuseaux personnels restent vides et ne sont pas sauvegardés.
- Capture d’intention avec prévisualisation de brouillon **en mémoire de page seulement**. Fermer ou recharger la page efface le texte ; aucun élément n’est créé.
- Bascule entre quelques vues de démonstration, changement d’onglets et messages expliquant ce qui n’est pas actif.
- Mise en page responsive, navigation clavier de base, dialogue natif, liens de saut et préférence de mouvement réduit.

## Limites explicites

- Données fictives : aucune donnée personnelle préremplie ; Life Core reste vide.
- Pas de compte, base, stockage durable, authentification/RLS, API, agent ou modèle d’IA.
- Pas de synchronisation calendrier externe, Composio ou connecteur ; aucune permission n’est demandée. Les vues n’affichent que des dates, sans événement réel ni faux événement.
- Les espaces associés aux Lots 2–5 sont des destinations illustratives ; les interactions de navigation temporelle restent locales et ne créent aucun objet.
- Un contrôle structurel axe-core partiel a été exécuté sous JSDOM. Ce n’est pas un audit WCAG complet : contraste, navigateur réel et test sur appareil restent à vérifier ; aucune suite de test n’est livrée.
