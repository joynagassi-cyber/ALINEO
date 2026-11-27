# État de l’audit UX/UI mobile/web Alineo

**Date :** 2026-11-23<br>
**Périmètre :** application Expo sous `apps/openfuse/apps/mobile/`, revue statique guidée par [`UX_UI_PLAYBOOK_CROSSWALK.md`](UX_UI_PLAYBOOK_CROSSWALK.md) et les deux playbooks fournis.<br>
**Statut global :** corrections implémentées et validations automatisées partielles ; aucune conformité WCAG ni validation de rendu réel n’est revendiquée.

## Améliorations apportées

- **Navigation responsive** — sidebar graphite compacte de 236 px sur desktop avec sections personnelles, espace de travail, conversations, ordinateur et notifications ; sur mobile, en-tête compact avec hamburger, drawer de navigation et barre basse Chat/Activité/Idées/Projets/Plus. Les conversations restent une feuille distincte de la navigation. Le drawer ferme sur Escape, gère le focus clavier sur le web, respecte `prefers-reduced-motion` et revient au déclencheur lorsqu’aucune autre feuille ne s’ouvre ; ces comportements doivent encore être éprouvés dans un vrai navigateur/lecteur d’écran.
- **MicOrb flottante** — l’orbe OpenDuet déjà intégrée au produit devient un raccourci persistant vers l’état en direct : réponse du chat, tâches actives, étapes, demandes de validation, derniers résultats et notifications. Son expression suit les états d’écoute, de travail, de revue et de fin ; une feuille d’activité compacte s’ouvre au clic, avec accès aux détails ou à Activity. L’emplacement tient compte du chat, de la barre basse et des confirmations toast.
- **Espacement des pages** — largeur maximale et marges latérales distinctes selon le breakpoint, contenu centré dans la zone principale sans sidebar sur mobile, respirations adaptées pour les pages de contenu et le chat.
- **Shell et états** — thème graphite sombre, panneau de travail flottant avec contour fin et fil d’Ariane, historique contextuel des sections (retour vers l’origine, avec repli sûr), titres/descriptions de page, région principale nommée, états de focus, erreurs de workspace avec nouvelle tentative et annonces de statut/toast. Le bouton de fermeture du toast a une cible de 44 × 44.
- **Composants accessibles** — tokens de couleur partagés, champs avec label associé, indication requis, aide et erreur sous le champ, états d’erreur/chargement/état vide, focus visible, dialogue nommé et prise en compte du mouvement réduit. Les labels web utilisent un vrai élément `label`; les champs natifs conservent un nom accessible.
- **Mail et calendrier** — recherche réutilisée, filtres sélectionnés, états de chargement/erreur/réessai des brouillons et calendriers, états vides avec action, labels/hints sur les commandes, validation email associée aux champs, calendrier en lecture seule expliqué et sélecteur de jours défilant avec dates annoncées.
- **Autres écrans** — URL du navigateur labellisée, sessions et fichiers nommés, actions de liste accessibles, états de tâches/notifications/objets de suivi distinguant chargement, vide et erreur ; libellés de Goal/Tracking clarifiés.
- **Chat et détails** — entrée de conversation labellisée, suggestions d’entrée orientées vers les parcours réels, état occupé/désactivé du bouton d’envoi annoncé, erreur de formulaire email conservée par champ plutôt qu’effacée lorsqu’un autre champ est modifié.
- **Lisibilité** — textes d’interface qui étaient codés à 8–11 px relevés à au moins 12 px dans les zones examinées ; couleurs de focus et de texte secondaire à faible contraste corrigées. Les ratios de la palette partagée ont des tests dédiés.
- **Mouvement** — l’animation de la MicOrb réagit aussi aux changements de préférence « réduire les animations » pendant la session, avec retrait du listener au démontage.

## Vérifications réalisées

| Contrôle | Résultat | Portée de la preuve |
|---|---|---|
| TypeScript mobile (`apps/mobile`, `tsc --noEmit`) | **Réussi** | Types de l’ensemble de l’application mobile/web Expo. |
| TypeScript OpenFUSE (`apps/openfuse`, `tsc --noEmit`) | **Réussi** | Types du projet principal et des paquets inclus par sa configuration. |
| Biome (lot UX ciblé et intégration MicOrb) | **Réussi** | Formatage/imports et règles statiques sur les fichiers de ce lot ; les cinq fichiers de l’intégration MicOrb ont été reformatés et vérifiés, pas l’ensemble du dépôt. |
| Tests mobiles (`apps/mobile/test/*.test.ts`) | **38/38 réussis** | Inclut les tests de palette/contraste, dates, API, navigation de conversation, MicOrb et actions Jev. |
| Export Expo Web après l’intégration MicOrb flottante | **Réussi** | Bundle compilé dans `apps/mobile/dist/web` ; l’export confirme la compilation, pas le rendu ou l’interaction dans un navigateur. |
| Aperçu Web unique | **Réussi, en cours** | Un seul aperçu exposé sur le port 4184 ; page, bundle du shell mis à jour, `/api/health`, création de session `sample` et `/api/workspace` répondent HTTP 200 via le proxy de même origine. Le backend API sur 8787 n’est pas un deuxième aperçu. |

La suite complète backend + mobile lancée ensemble n’a pas terminé dans le plafond de 180 secondes et un processus de test a été interrompu (`SIGKILL`). Elle n’est donc **pas déclarée réussie**. Les 38 tests mobiles ont ensuite été exécutés seuls et ont tous réussi.

## À vérifier avant toute déclaration de conformité

- Parcours au clavier dans le navigateur : vérifier le piège Tab/Shift+Tab du drawer, Escape, activation, focus après changement de section, fermeture et restitution du focus après feuille/dialogue ; lecteurs d’écran web et annonce des erreurs. Le comportement est implémenté mais n’a pas encore été exercé manuellement.
- Rendu visuel et responsive réel aux largeurs 320–1920 px, zoom texte/navigateur à 200 %, absence de débordement/décalage, clavier virtuel et rotation sur appareil. L’export réussi n’est pas une capture ou un test visuel.
- NVDA/VoiceOver/TalkBack sur appareils/navigateurs cibles, fonctionnement des rôles/états RN Web et natifs, cible tactile réellement utilisable et comportement des champs de date.
- Contraste de toutes les combinaisons réellement rendues, y compris couleurs codées localement, contenu agentique, états désactivés et captures d’écran. Les tests actuels ne couvrent que les tokens partagés et quelques paires d’accent/erreur/focus.
- Réduction du mouvement et couleurs forcées dans un navigateur réel ; test natif iOS/Android et parcours réels de dialogue.
- Chat CopilotKit, authentification, permissions et actions réelles de bout en bout ; le contrôle d’aperçu n’a confirmé que l’API locale en mode `sample`.
- Réexécution de la suite complète de tests backend dans des conditions où elle peut terminer, idéalement par lots si nécessaire.

Les corrections sont donc **écrites et compilées**, mais clavier, lecteur d’écran, rendu/zoom/responsive, contraste intégral et flux de bout en bout restent **à vérifier**. Aucun test utilisateur, audit Lighthouse, audit WCAG complet ou essai sur appareil n’a été réalisé dans ce lot.
