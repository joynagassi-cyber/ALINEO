# Hypothèses réversibles et décisions à confirmer

**Version :** 1.2 · **Date :** 2026-11-23
Les choix marqués « Hypothèse » décrivent le cadrage PAOS historique ; ils ne doivent pas être automatiquement interprétés comme décisions techniques pour l’application ALINEO.

> **Direction actuelle (mise à jour) :** le produit s’appelle Alineo, et non OpenFuse. L’application mobile/web active sous `apps/openfuse/` porte la marque Alineo ; son interface adopte désormais un shell graphite avec sidebar compacte et contenu flottant bordé, plus le logo ruban généré `apps/openfuse/apps/mobile/assets/alineo-flow-mark.png`. Le chemin technique reste conservé pour la provenance ; les anciens écrans artisanaux sous `apps/alineo/` restent rejetés et ne sont pas réactivés. Le mode `sample` reste fictif, sans fournisseur/modèle ou intégration réelle ; le mode live n’est pas prêt pour plusieurs utilisateurs.

## Décisions utilisateur confirmées — 2026-11-23

- **Produit unique : ALINEO.** Le hub agentique connecté est la direction principale du seul produit de ce dépôt ; il ne s’agit pas d’un second produit distinct.
- **Base de réalisation mise à jour :** l’application courante s’appelle Alineo et se trouve dans `apps/openfuse/`. Son socle technique conserve la provenance open-source tracée dans `OPENFUSE_SECURITY_REVIEW.md`; le nom OpenFuse ne doit pas figurer dans l’expérience utilisateur. L’interface précédente sous `apps/alineo/` reste une archive rejetée.
- **Direction visuelle initiale (historique) :** l’identité ivoire/sauge et l’ancien wordmark ont précédé la nouvelle demande de redesign. La direction actuelle utilise le shell graphite, une sidebar compacte, des panneaux flottants bordés et le logo ruban Alineo ; MicOrb reste réservée à l’assistant et les marques Gmail/Google Calendar viennent de `thesvg`. Lucide reste réservé aux commandes générales. La grille historique des 18 dégradés n’est pas reprise.
- **Réconciliation PAOS :** préserver les garde-fous PAOS applicables mais ne pas traiter automatiquement tous les modules ou l’ordre du Lot 1 PAOS comme le périmètre courant. Le décalage avec les connecteurs au cœur du hub est explicité dans [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md).
- **Intégrations :** Gmail, services Google Workspace à sélectionner, Google Calendar et TickTick sont des cibles souhaitées, pas des connexions ou capacités prouvées. APIs, permissions, quotas et plans doivent être vérifiés avant activation.
- **Préférence technique mise à jour :** l’app mobile/web et son serveur sous `apps/openfuse/` constituent la base actuelle d’Alineo. L’archive React/Vite/CopilotKit/A2UI reste sous `apps/alineo/` et n’est pas la base du produit. Aucun fournisseur/modèle ni compte réel n’est choisi.
- **Valeurs personnelles :** Life Core reste vide ; aucune note privée à l’IA, chaîne de pensée privée, donnée, score, préférence, objectif ou résultat inventé.

## Cadre déjà verrouillé par le cahier v0.1

- Produit séparé d’APIOS, avec dépôt, identité, données et déploiement séparés.
- Supabase comme source de vérité ; un orchestrateur avant multi-agent.
- Planner déterministe indépendant du LLM ; Life Core protégé ; confirmation humaine pour l’externe.
- Web avant Android/Windows ; React/Vite recommandé ; si A2UI est retenu, il est consultatif et les écritures passent par des tools contrôlés.

## Hypothèses de travail (réversibles, non approuvées)

| ID | Hypothèse minimale | Pourquoi elle permet d’avancer | Réversibilité / garde-fou |
|---|---|---|---|
| H-01 | **Décision mise à jour :** ALINEO est l’unique produit de ce dépôt ; PAOS reste le nom de la baseline documentaire historique. | L’utilisateur a confirmé l’identité du produit et la direction hub. | Utiliser ALINEO dans l’application ; ne pas reprendre de marque ou asset de la capture ou d’APIOS. |
| H-02 | Lot 1 est un parcours web pour un propriétaire par session, avec `user_id`/RLS dès le début ; pas de tables d’organisation/équipe. | Compatible avec le cahier tout en gardant l’isolation dès la première migration. | Pas de collaboration ni de promesse SaaS ; l’extension multi-tenant exige une décision et des migrations. |
| H-03 | Méthode de connexion et fournisseur IA restent derrière des adaptateurs, non choisis. | Leur sélection n’empêche ni le planner pur ni les tests. | Pas de déploiement réel avant configuration et validation. |
| H-04 | Life Core, horaires et disponibilités sont vides jusqu’à saisie explicite. | La spécification interdit les horaires personnels supposés. | Onboarding indique « à configurer » ; pas de plan automatique avant configuration. |
| H-05 | Pas de journal narratif ni de note privée en Lot 1. | Le stockage local vs cloud n’est pas décidé et la donnée est sensible. | Aucun texte privé n’est collecté ; décision ultérieure peut ajouter un stockage choisi. |
| H-06 | Toutes les écritures internes agentiques et l’application d’un plan exigent une confirmation explicite en Lot 1. | C’est le comportement conservateur quand l’autonomie par défaut n’est pas validée. | Politique réglable plus tard après approbation explicite ; l’externe reste toujours confirmé. |
| H-07 | **Décision mise à jour :** le hub connecté est la direction principale d’ALINEO ; les connecteurs sont au cœur du périmètre souhaité. Cela déroge explicitement à l’exclusion des connecteurs du Lot 1 PAOS sans déclarer les API, scopes ou intégrations prêtes. | L’identité ALINEO est confirmée. La priorité de produit change ; l’activation technique de chaque service reste conditionnée à sa vérification. | Suivre la matrice de `ALINEO_IMPLEMENTATION.md`. Aucun scope OAuth, compte, opération d’écriture ou connecteur actif sans décision et preuve. |
| H-08 | Pas de cible chiffrée de pilote : les indicateurs sont instrumentés et rapportés descriptivement. | Aucun seuil de réussite utilisateur n’est fourni. | Le pilote réel reste bloqué jusqu’à approbation des seuils et de l’objectif 12 mois. |
| H-09 | Tri planner stable, lexicographique, sans poids cachés ; si marge non réglée, 0 est indiqué explicitement. | Rend le planner testable sans fabriquer une fonction de valeur personnelle. | À ajuster par préférence utilisateur après démonstration ; chaque plan expose les règles. |
| H-10 | **Stack active mise à jour :** l’app Alineo (Expo/React Native, Hono et CopilotKit) reprend un socle upstream OpenFuse (commit épinglé dans `OPENFUSE_SECURITY_REVIEW.md`). | Les corrections du fork et le mode local sample avec runtime SSE ne garantissent pas la sécurité de production. | Aucun modèle/provider choisi. Le live reste bloqué avant identité ALINEO, isolation et revue des connecteurs ; l’alpha mono-propriétaire n’est pas multi-tenant. A2UI/Zod 4 demeure uniquement dans l’ancienne interface. |
| H-11 | Hébergement (Cloudflare/Render), stockage documentaire (Supabase Storage ou autre) et version/contrat Composio ne sont pas sélectionnés. Composio reste une voie envisagée pour les connecteurs par utilisateur, sous revue de sécurité/scopes. | Disponibilité, permissions, rétention, isolation, webhooks et garanties d’idempotence doivent être vérifiés. | Aucun secret/OAuth/fichier réel avant choix ; indexation désactivée par défaut. Les contrats internes de `TECHNICAL_DESIGN.md` ne sont pas des noms d’API Composio. |
| H-12 | En Lot 1, toute écriture interne agentique exige confirmation. Les actions internes préautorisées par règle restent une proposition pour une phase ultérieure. | Le nouveau brief évoque une autonomie selon des permissions préalables, sans en définir le périmètre ni l’approbation. | Rien d’autonome n’est activé ; toute future règle doit être limitée, visible, révocable et auditée. |
| H-13 | Focus vise des mécanismes natifs sur Android/Windows quand ils sont supportés ; une alarme précise app suspendue/terminée n’est jamais garantie par défaut. | Les permissions et politiques système affectent la livraison. | Tester sur appareil réel, documenter les limites et fournir un fallback ; pas de promesse avant ces tests. |
| H-14 | Durée estimée et marge d’incertitude restent distinctes ; marge à zéro avec avertissement tant qu’elle n’est pas configurée ou approuvée. | Le brief propose une marge et un exemple chiffré, mais ne fournit pas une valeur personnelle validée. | Ne pas reprendre 45 minutes ou 3 h 30 comme réglage par défaut ; toute proposition de marge montre sa source et sa confiance. |

## Brief fonctionnel PAOS — baseline historique

La spécification PAOS décrit les espaces Today, Projects, Calendar, Focus, Life Core et Habits. Ils restent une référence pour le rapprochement et les garde-fous, mais ne forment pas le catalogue de modules natifs de l’ALINEO hub. Le traitement actif de chacun est indiqué dans [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md). Aucune valeur personnelle n’est dérivée des exemples de ce brief ; Life Core reste vide, et les autorisations d’écriture, objectifs et disponibilités ne sont pas inventés.

## Direction agentique ALINEO confirmée

Le produit ALINEO demeure orienté vers un chat agentique, des connecteurs souhaités et des insights fondés sur des sources vérifiables. **Mise à jour de marque :** l’utilisateur demande maintenant que le nom OpenFuse ne soit plus utilisé comme marque et qu’il soit remplacé par Alineo. L’application active conserve son chemin technique sous `apps/openfuse/` et sa provenance MIT, mais son interface, ses textes et son identité par défaut sont Alineo. L’ancienne UI artisanale et A2UI dans `apps/alineo/` reste rejetée, sans réactivation. Le mode sample demeure fictif, sans fournisseur/modèle ni connecteurs réels. Le live exige toujours des choix de fournisseur, d’identité, de permissions et de traitement des données.

Ce périmètre met explicitement le hub devant le Lot 1 PAOS, qui excluait les connecteurs. L’application comprend un runtime agent local protégé par défaut, mais aucune connexion, API externe, clé de modèle, identité utilisateur de production, permission ou connecteur n’est actif. Aucun thème ou service externe n’est réputé configuré par la décision de périmètre.

## Questions héritées du périmètre natif PAOS — non bloquantes pour le hub ALINEO actuel

Les questions ci-dessous ne s’appliquent que si une fonction PAOS correspondante est explicitement réintroduite. Elles ne doivent pas être posées à l’utilisateur comme prérequis au travail courant sur le hub. Les valeurs restent vides en attendant toute configuration explicite.

1. **Prompt maître :** hors périmètre de la présente conception selon la consigne utilisateur ; ne pas relancer sa recherche ni en demander le fichier. Son absence ne bloque pas ce travail.
2. **Portée et résultat.** Le produit reste-t-il strictement personnel/mono-utilisateur pour le pilote, ou doit-il préparer dès maintenant un SaaS multi-utilisateur ? Quel résultat professionnel principal sur 12 mois doit structurer l’onboarding ?
3. **Life Core.** Le brief propose prière, lecture biblique et jeûne ; confirmer si ces catégories sont souhaitées, puis fournir récurrences, horaires/fuseau, durée et protection. Sans ces paramètres, la configuration reste vide ; aucune pratique n’est seedée.
4. **Notes privées.** Faut-il exclure tout journal narratif (recommandé pour Lot 1), le conserver localement chiffré, ou prévoir un stockage cloud chiffré avec contrôle utilisateur ? Dans tous les cas, confirmer l’exclusion de l’IA par défaut.
5. **Calendar.** Le brief vise Google Calendar et des événements planifiés par l’agent. Confirmer lecture seule d’abord, fournisseur/scopes et si la création ou modification d’événements exige toujours un aperçu/une confirmation ; aucun OAuth n’est activé avant choix.
6. **Autonomie et pilote.** En Lot 1, confirmer toutes les écritures internes ; plus tard, quelles actions réversibles l’agent pourrait-il exécuter selon une règle préapprouvée ? Quels seuils de succès, s’il y en a, seront choisis pour le pilote de 30 jours ?

## Décisions techniques aux portes d’implémentation

**Pour la baseline PAOS seulement :** avant L1-01, le framework, le runtime/API, l’hébergeur, la méthode Auth et le transport d’événements restent à fixer ; avant Lot 3, les contrats, scopes OAuth, webhooks et idempotence Calendar/Composio restent à vérifier ; avant Lot 4, stockage, extraction, rétention et citations des documents restent à décider.

**Pour le hub agentique connecté :**

- L’identité est confirmée : ce dépôt contient un produit ALINEO orienté hub. Maintenir le crosswalk explicite avec le backlog PAOS au lieu de fusionner implicitement ses lots.
- L’application Alineo active est sous `apps/openfuse/`; le nom du répertoire et la provenance MIT sont des détails techniques, pas la marque du produit. Le mode sample utilise SSE local sans clé Intelligence ni fournisseur/modèle; le mode live nécessite une intégration d’identité ALINEO et une revue d’isolation/permissions. La base alpha à clé partagée n’est pas multi-tenant.
- Pour chaque fournisseur (Gmail, services Workspace retenus, Calendar, TickTick), confirmer les opérations, API, scopes minimaux, quotas, coûts et conditions du compte gratuit. Aucun fournisseur d’orchestration/connecteur n’est encore choisi.
- Avant d’envoyer des données à un modèle, sélectionner fournisseur/modèle, coûts, rétention et garanties de traitement ; le chat n’autorise pas l’aspiration automatique de notes privées.
- Définir les métriques/graphiques de progression depuis des données observables ; aucun objectif, score ou seuil n’est présélectionné.
- **Interface :** direction actuelle Alineo : shell graphite, sidebar compacte, contenu flottant bordé et logo ruban généré. Les icônes `thesvg` restent propres à Gmail et Google Calendar et la MicOrb à l’assistant. Ne pas réactiver le shell artisanal rejeté sous `apps/alineo/` ni réintroduire sa grille de 18 dégradés.

## État courant des décisions

- **Produit :** ALINEO reste l’unique produit ; son nom et sa présentation dans l’application sont désormais Alineo.
- **Réalisation :** `apps/openfuse/` contient l’app active issue du commit épinglé dans la revue de sécurité. OpenFuse n’est conservé que comme référence à l’origine technique ; `apps/alineo/` reste l’ancienne app React/Vite/A2UI rejetée.
- **Mode courant :** l’aperçu Alineo utilise le mode `sample` local, runtime SSE et données fictives ; aucun fournisseur/modèle, compte OAuth ou connecteur live n’est configuré. Les Rich Threads distants sont désactivés sans clé Intelligence.
- **Sécurité :** l’API locale est loopback-only; l’aperçu passe par un proxy même origine. Le mode live utilise encore un modèle à propriétaire unique par clé partagée et ne prouve pas l’isolation multi-tenant. Ne pas exposer avant une identité ALINEO et une revue d’isolation, permissions et réseau.
- **À vérifier avant activation/déploiement :** implémenter et tester identité/session/CSRF/révocation, choisir fournisseur/modèle et rétention, vérifier licences/compatibilité, chaque API et scope OAuth, coût/quota/plan gratuit, stockage et opérations d’écriture. Aucun connecteur ou fournisseur n’est activé.
- **PAOS :** les documents existants restent utiles comme historique, backlog et garde-fous ; le déplacement explicite de priorité vers le hub est détaillé dans `ALINEO_IMPLEMENTATION.md`.
- **Prompt maître :** il reste hors périmètre selon la consigne précédente ; ne pas relancer sa recherche. Son absence ne bloque pas la réalisation de l’application réelle.
