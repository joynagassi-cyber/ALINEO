# Alineo — ancienne interface (archive rejetée)

> Cette réalisation React/Vite artisanale est conservée uniquement pour l’historique et ne constitue pas le design accepté. Ne pas la réactiver ni la présenter comme l’application active. L’app mobile/web Alineo actuelle se trouve sous [`../openfuse/`](../openfuse/).

Cette archive contient l’ancienne application web et ses expériences de prototype. Elle reste distincte de l’interface mobile/web actuelle ; ne pas y poursuivre le travail de rebranding.

## Développement local

Prérequis : Node.js `^20.19.0 || >=22.12.0` et npm.

```sh
npm install
cp .env.example .env
# Laisser COPILOT_MODEL et les clés vides tant qu'aucun fournisseur n'a été choisi.
npm run dev
```

`npm run dev` lance deux processus : Vite sur `0.0.0.0:4180` et le runtime CopilotKit sur `127.0.0.1:8200`. Vite relaie `/api/copilotkit` au runtime sur le serveur : le navigateur n’appelle ni `localhost` ni un service tiers directement.

### Fournisseur de modèle

ALINEO ne choisit pas de fournisseur et n’embarque aucune clé. Les exemples ci-dessous décrivent uniquement le format : ils ne constituent pas un choix. Ne renseignez `COPILOT_MODEL` et **la clé correspondante** qu’après décision explicite sur le fournisseur/modèle et ses conditions de traitement.

```dotenv
COPILOT_MODEL=google/gemini-2.5-flash
GOOGLE_API_KEY=…
```

Les fournisseurs actuellement pris en charge par la configuration sont OpenAI (`OPENAI_API_KEY`), Anthropic (`ANTHROPIC_API_KEY`), Google Gemini (`GOOGLE_API_KEY`) et MiniMax (`MINIMAX_API_KEY`). Les identifiants de modèle acceptent la forme `fournisseur/modèle`. Ne mettez jamais de secret dans une variable `VITE_*` : ces variables sont publiques.

Sans modèle ou clé valide, le serveur répond avec un état explicite. Même avec une configuration de modèle, l’état reste `auth-required` tant qu’un adaptateur d’identité côté serveur n’est pas fourni à `createRuntimeApp` : le dépôt n’en inclut volontairement aucun, et les routes CopilotKit ne sont pas montées. Aucun message ne part donc avec la configuration actuelle. L’adaptateur futur doit vérifier une vraie session/token ALINEO, produire un identifiant stable de serveur et traiter CSRF, expiration et révocation ; ne jamais utiliser un `user-id` envoyé par le navigateur. Les tests utilisent uniquement un résolveur factice et ne valent pas authentification réelle ni preuve d’isolation multi-utilisateur.

La télémétrie CopilotKit est désactivée par défaut ; définissez `COPILOTKIT_TELEMETRY_DISABLED=false` pour y consentir explicitement. Lorsque modèle, clé et adaptateur serveur seront tous configurés, le runtime v2 utilisera `BuiltInAgent`, un runner en mémoire, `identifyUser` et un prompt français qui rappelle l’absence de connecteurs et interdit d’inventer données ou actions. La présence d’une clé ne garantit ni l’accès au modèle, ni le quota, ni son fonctionnement : les erreurs du fournisseur restent possibles.

### A2UI

Le chat utilise le renderer A2UI intégré à CopilotKit v2, avec le catalogue standard `basicCatalog` d’A2UI v0.9. Le catalogue active le rendu de surfaces structurées reçues de l’agent ; il ne connecte aucune donnée ALINEO et n’accorde pas de droit d’écriture ni de connecteur externe. Le patch local `patches/@a2ui+web_core+0.15.0.patch` adapte uniquement l’introspection des schémas `ZodPipe` à Zod 4 (version auditée `4.6.7`) afin d’éviter l’accès à la classe `ZodEffects` supprimée. Le sélecteur des 18 dégradés, le mode clair/sombre et l’orbe ALINEO sont conservés ; les couleurs du chat et des composants A2UI héritent du thème choisi.

## Construction et contrôles

```sh
npm audit
npm run typecheck
npm test
npm run build
```

`npm run build` crée le site Vite dans `dist/` et compile le runtime Node dans `dist-server/`. Après un build, `npm run start:runtime` charge `.env`, mais le serveur reste obligatoirement lié à `127.0.0.1`; tout autre `COPILOT_RUNTIME_HOST` provoque un arrêt. Ne configurez pas de reverse proxy public vers ce runtime : aucune authentification de production n’est encore fournie et l’activation est bloquée. `COPILOT_ALLOWED_ORIGINS` ne contrôle que CORS, pas l’identité ni la protection CSRF.

Les dépendances sont verrouillées par `package-lock.json`. Les overrides de `package.json` fixent les avis traités lors de la revue du fork OpenFuse (Zod, Hono Node Server, undici, busboy, KaTeX, graphql-scalars, esbuild et Streamdown). `patch-package` réapplique à l’installation un changement d’une fonction A2UI pour la compatibilité Zod 4. Le contrôle courant est reproductible avec `npm audit`; un résultat sans avis concerne uniquement les versions du lockfile et ne constitue pas une preuve de sécurité générale.

**Avant toute exposition ou activation réelle :** implémenter et tester un fournisseur de session/identité ALINEO côté serveur, CSRF et révocation, limites de charge/débit, isolation vérifiable, configuration réseau privée/TLS et observabilité sans secrets. Une clé de modèle seule ne rend pas le chat disponible.

## État produit

- React + Vite + TypeScript avec navigation applicative réelle et sélecteur d’apparence des 18 dégradés fournis, chacun disponible en mode clair ou sombre.
- Parcours Chat, Connecteurs, Progression, Insights et Activité avec états vides véridiques. Aucun connecteur externe n’est configuré ou appelé.
- Le code CopilotKit v2/A2UI est intégré mais le chat reste désactivé : le dépôt ne fournit ni fournisseur/modèle choisi ni adaptateur d’identité serveur. La configuration de clés seule ne suffit pas et les routes répondent avec un état bloqué.
- Pas de compte utilisateur, d’historique persistant ou de connexions OAuth. Si un adaptateur validé est ajouté plus tard, les fils du runtime actuel utiliseront un runner en mémoire et disparaîtront au redémarrage ; aucune isolation multi-tenant n’est revendiquée.
- Le repère du chat reprend la `MicOrb` du dépôt distinct CopilotKit/OpenDuet : deux yeux dont le regard se déplace et qui clignent, dessinés sur canvas. L’adaptation est attribuée sous MIT dans `third-party-licenses/OpenDuet-MIT-LICENSE.txt`, respecte `prefers-reduced-motion` et reprend la palette sélectionnée. Seul l’état décoratif `idle` est utilisé ; aucun runtime ni application OpenBot n’est intégré.
- Le choix palette + mode est stocké localement dans le navigateur (`localStorage`), sans compte ni transmission à un service. Le contraste de l’accent reste testé sur les 18 palettes en clair et sombre.

Ce dépôt contient toujours des documents PAOS et deux prototypes historiques ; `docs/ALINEO_IMPLEMENTATION.md` définit la source de vérité pour le produit ALINEO.
