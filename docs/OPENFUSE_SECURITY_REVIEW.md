# Revue du fork de sécurité OpenFuse

**Revue technique amont et historique (23 novembre 2026) :** le code upstream OpenFuse a été corrigé et évalué au niveau des dépendances, du typage, des builds et des tests exécutés par lots ; cette page conserve ce nom uniquement pour identifier sa provenance. **Mise à jour de marque :** l’application dans `apps/openfuse/` est maintenant Alineo, sans OpenFuse comme marque dans son expérience utilisateur. Le suivi d’adoption et les validations antérieures figurent à la fin du document ; elles ne valident pas automatiquement les changements de rebranding. La revue automatisée ne lève pas les limites d’architecture ci-dessous et ne constitue pas une autorisation de déploiement multi-utilisateur.

## Base et reproduction

- Dépôt amont : `CopilotKit/openfuse`
- Révision amont testée : `67580f16059d9c10111db00768e8a235d06cafdc`
- Patch local vérifié : [`patches/openfuse-security-fork.patch`](patches/openfuse-security-fork.patch)
- SHA-256 : `2e86d95f51b3d27439aa18aa2cc454bdbdbdd9ea84c948863d49d48f7c696da5`

Pour reproduire sur une copie propre :

```sh
git clone https://github.com/CopilotKit/openfuse.git
cd openfuse
git checkout 67580f16059d9c10111db00768e8a235d06cafdc
git apply /chemin/vers/LifeAI/docs/patches/openfuse-security-fork.patch
npx --yes pnpm@11.19.0 install --frozen-lockfile
npx --yes pnpm@11.19.0 audit
npx --yes pnpm@11.19.0 peers check
npx --yes pnpm@11.19.0 typecheck
npx --yes pnpm@11.19.0 build:server
npx --yes pnpm@11.19.0 build:web
npx --yes pnpm@11.19.0 lint
```

## Corrections du fork

- Passage de CopilotKit Runtime/Core/React Native à `1.90.2`, d’AG-UI Client/Core à `1.0.5`, d’E2B Desktop à `2.5.0` et de Zod à `4.6.7`. `@copilotkit/aimock` reste en `1.48.1` : la version `1.90.2` n’existe pas sur npm.
- Mise à niveau du serveur Hono à `@hono/node-server 2.1.11`; ajout des overrides pnpm issus de `audit --fix=override` et mise à jour du lockfile. L’audit npm complet de l’arbre de dépendances retourne **0 avis** au moment de la validation.
- Alignement de `lucide-react-native` sur `0.577.0`, qui déclare le support de React 19; `pnpm peers check` ne signale plus de peer manquant.
- Adaptation à AG-UI 1.x : les schémas sont importés depuis `@ag-ui/core/schemas`, les renderers React Native emploient `parameters` et n’envoient pas les anciennes options `description`, et les tests ne transmettent plus directement du contenu multimodal à `JSON.parse`.
- Configuration Biome alignée sur la version installée `2.5.15`.

## Vérifications exécutées

| Vérification | Résultat |
| --- | --- |
| Installation `--frozen-lockfile` | Réussie |
| `pnpm audit` (arbre complet) | 0 critique / élevé / modéré / faible |
| `pnpm peers check` | Aucun problème de peer |
| `pnpm typecheck` | Réussi, serveur et mobile |
| `pnpm build:server` | Réussi |
| `pnpm build:web` | Réussi, export Expo Web |
| `pnpm lint` | Réussi, 178 fichiers |
| Tests | **523 succès observés en exécution par fichiers et shards** : 478 tests des autres fichiers, 25 tests du fichier navigateur, 20 tests Jev |

La suite monolithique n’a pas été stable dans le conteneur à mémoire limitée : le fichier navigateur a approché la limite cgroup d’environ 4 Go et un lancement global a produit un `SIGKILL` dans `conversation-jev.test.ts`. Les deux suites lourdes ont donc été séparées en shards; chaque shard a réussi. Le test de disponibilité navigateur qui avait échoué sous pression mémoire a également réussi isolément. Ce résultat ne doit pas être présenté comme une exécution monolithique entièrement verte.

## Limites de sécurité qui restent ouvertes

Un audit de paquets à zéro avis **ne prouve pas** que l’application est sûre pour des utilisateurs hostiles ou une exposition Internet. La documentation de sécurité OpenFuse décrit un modèle à propriétaire unique par clé partagée et ne fournit pas une authentification/autorisation multi-tenant garantissant l’isolation d’utilisateurs. Elle indique aussi que le navigateur/Docker ne constituent pas une frontière de sécurité pour des tenants hostiles et que l’environnement E2B peut disposer d’une sortie réseau et de ports publics.

Avant toute migration de ces capacités dans ALINEO, il faut donc soit les limiter explicitement à un environnement local à utilisateur unique, soit concevoir et tester une identité serveur ALINEO, l’isolation des données, les permissions par action, la révocation, les limites réseau et le modèle d’exploitation. Les secrets de test du fork ne sont pas des clés réelles. Aucun fournisseur ni modèle n’a été sélectionné.

## Décision initiale de périmètre

À la fin de la revue de sécurité, le patch était seulement un artefact reproductible : aucune fonctionnalité OpenFuse n’avait alors été importée. La tranche antérieure avait repris des garde-fous pertinents dans `apps/alineo/` (overrides de dépendances, compatibilité A2UI/Zod 4, refus des binds non-loopback et des requêtes sans identité) sans adopter l’application OpenFuse. Cette décision a été révisée après le retour explicite de l’utilisateur sur l’interface.

## Suivi de provenance et d’adoption technique dans Alineo

- La base OpenFuse épinglée au commit `67580f16059d9c10111db00768e8a235d06cafdc` est maintenant copiée sous [`apps/openfuse/`](../apps/openfuse/). La licence MIT et le patch de revue sont conservés; aucun dépôt Git imbriqué ni `node_modules` n’est inclus.
- Le mode local `sample` peut fonctionner sans clé CPK : il utilise `CopilotSseRuntime` avec identité propriétaire locale, données fictives, et désactive les Rich Threads distants. Le mode live continue d’exiger une clé Intelligence côté serveur.
- Dans l’aperçu courant, aucun fournisseur/modèle, compte Google, navigateur worker, ordinateur, recherche web ou clé réelle n’est configuré. L’API reste liée à `127.0.0.1` et le navigateur passe par un proxy même origine.
- Vérifications de l’adoption initiale (antérieures au rebranding Alineo) : installation verrouillée, build Expo Web, build/typage serveur, `pnpm typecheck` et 16 tests ciblés réussis. Les contrôles du rebranding sont consignés dans [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md). Cette adoption ne certifie pas l’app pour l’Internet ou le multi-tenant.

L’alpha OpenFuse utilise en live un modèle à propriétaire unique par clé partagée; avant toute exposition, il faut concevoir et tester l’identité ALINEO, l’isolation, les permissions, la révocation et les limites réseau. Aucun fournisseur/modèle n’a été choisi.
