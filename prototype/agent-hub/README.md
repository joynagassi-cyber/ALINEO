# Prototype visuel — Agent Hub

Maquette statique indépendante, créée à partir de la capture d’écran fournie comme référence visuelle. Elle ne remplace pas `prototype/alineo/` et ne déclare pas que le hub est ALINEO, PAOS ou LifeAI.

## Lancer localement

Depuis ce dossier, avec Python 3 :

```sh
python3 -m http.server 4174 --bind 0.0.0.0
```

Ouvrir ensuite `http://localhost:4174`. Aucun paquet, compilation, compte ou service externe n’est requis.

## Direction visuelle

- coque sombre, rail latéral compact, lueur bleu-cyan et orbe abstraite au-dessus du chat central ;
- raccourcis vers connecteurs, progression et insights ;
- composition responsive et états vides sans métrique, événement ou réponse d’IA inventés.

Le glyphe du rail et l’orbe sont des éléments CSS provisoires ; aucun asset OpenDuet n’est intégré. L’asset exact et sa licence restent à vérifier. Le thème sombre représente seulement cette maquette ; aucun thème par défaut de production n’est décidé.

## Interactions et limites

- Navigation locale entre Chat, Connecteurs, Progression, Insights et Activité ;
- le formulaire ne transmet ni n’enregistre les messages ; il affiche un statut honnête de maquette hors ligne ;
- Gmail, Google Calendar, Google Workspace et TickTick sont présentés comme non connectés, avec les opérations et permissions encore à confirmer ;
- aucune donnée, réponse d’agent, connexion OAuth, métrique ou graphique n’est simulé ;
- aucun SDK CopilotKit/A2UI, modèle IA, asset externe, stockage ou API n’est intégré.

Cette maquette est une référence de présentation locale, pas une implémentation du produit ni une validation des APIs, thèmes ou permissions.
