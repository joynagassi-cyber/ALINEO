# ALINEO

**ALINEO est l’unique produit de ce dépôt.** L’application active porte la marque Alineo sur le web, iOS et Android. Son socle open-source et sa provenance MIT sont consignés dans la [revue technique](docs/OPENFUSE_SECURITY_REVIEW.md) ; l’identité présentée aux personnes reste exclusivement Alineo. La réalisation artisanale antérieure sous `apps/alineo/` reste historique et rejetée ; elle n’est pas réactivée.

## Application active

Alineo conserve le parcours mobile/web, le chat, l’activité, les idées, les objectifs et les apps. Pour le démarrage local, le mode `sample` utilise un agent local et des exemples explicitement fictifs : aucun fournisseur ou modèle n’est sélectionné, aucun compte Google n’est connecté et le navigateur/ordinateur externe reste désactivé. Sans clé CopilotKit Intelligence, le chat passe par le runtime SSE local et les Rich Threads distants sont désactivés. À part, le runtime CopilotKit peut envoyer ses événements de télémétrie (taux par défaut : 1), étiquetés Alineo ; ils ne signifient pas qu’un connecteur de données est actif. Pour refuser cette télémétrie, définir `COPILOTKIT_TELEMETRY_DISABLED=true` ou `DO_NOT_TRACK=1`.

### Lancer le web local

Prérequis : Node.js `>=22` et pnpm `11.19.0`. Depuis la racine du dépôt :

```sh
cd apps/openfuse
npx --yes pnpm@11.19.0 install --frozen-lockfile
npx --yes pnpm@11.19.0 dev
```

Dans un autre terminal, toujours depuis `apps/openfuse/` :

```sh
npx --yes pnpm@11.19.0 dev:web
```

Le web local s’ouvre sur le port 8081 et l’API sample reste liée à `127.0.0.1:8787`. Le navigateur appelle `/api` sur la même origine; le serveur Metro relaie ces requêtes vers l’API, sans accès navigateur à `localhost`. Les données montrées en mode `sample` sont des exemples, jamais des données ALINEO réelles. Contrôles :

```sh
npx --yes pnpm@11.19.0 typecheck
npx --yes pnpm@11.19.0 build:server
npx --yes pnpm@11.19.0 build:web
```

Le serveur n’est pas prêt pour un déploiement multi-utilisateur : le socle technique actuel utilise un modèle à propriétaire unique par clé partagée. Le mode live reste bloqué sans identité serveur, clé Intelligence, fournisseur/modèle explicitement choisi et revue des connecteurs. Voir [l’état d’implémentation](docs/ALINEO_IMPLEMENTATION.md) et la [revue technique du socle open-source](docs/OPENFUSE_SECURITY_REVIEW.md).

## Source de vérité et documentation

- [Périmètre ALINEO, réconciliation du backlog PAOS et état réel](docs/ALINEO_IMPLEMENTATION.md)
- [Direction fonctionnelle du hub ALINEO](docs/AGENT_HUB_DIRECTION.md)
- [Décisions utilisateur, garde-fous et questions techniques](docs/DECISIONS.md)
- [Cahier PAOS historique et ses exigences](docs/PERSONAL_AGENTIC_OS_SPEC.md)
- [Architecture technique PAOS historique](docs/TECHNICAL_DESIGN.md)
- [Backlog Lot 1 PAOS historique](docs/LOT_1.md)
- [Design ALINEO antérieur / historique](docs/ALINEO_DESIGN.md)
- [Matrice de couverture documentaire](docs/COVERAGE_MATRIX.md)
- [Crosswalk et méthode des playbooks UX/UI](docs/UX_UI_PLAYBOOK_CROSSWALK.md)

Les documents PAOS ne décrivent pas des produits séparés : ils sont traités comme exigences de sûreté et historique de spécification du même produit ALINEO, avec la réconciliation explicite et les déplacements de périmètre consignés dans `docs/ALINEO_IMPLEMENTATION.md`. Les playbooks UX/UI servent de méthode de conception et d’acceptation, pas de liste automatique de fonctionnalités.

## Sécurité et intégrations

Gmail, Google Calendar, navigateur, terminal et autres intégrations ne sont pas connectés en mode local `sample` ; ce mode n’utilise que le jeu fictif fourni. Le socle open-source importé est sous licence MIT et ses corrections de dépendances/compatibilité sont documentées dans la [revue technique](docs/OPENFUSE_SECURITY_REVIEW.md). Cette revue de paquets ne certifie pas l’architecture, ne rend pas le produit multi-tenant et n’autorise pas une exposition publique. Le mode live reste indisponible tant que l’identité serveur, le fournisseur/modèle, les permissions et les garanties d’isolation n’ont pas été décidés et testés. Ne jamais ajouter de secrets réels, notes privées ou données d’utilisateur au dépôt.

Les prototypes historiques sont sous `prototype/`. Ils ne sont ni une preuve d’intégration, ni une source de données de production, ni un déploiement de l’application réelle.
