# Direction produit — hub agentique connecté

**Version :** 0.1<br>
**Date :** 2026-11-23<br>
**Statut actuel :** l’application mobile/web active est Alineo sous `apps/openfuse/`. Le nom OpenFuse n’est plus la marque du produit ; il est conservé uniquement pour la provenance technique/licence. La direction visuelle la plus récente adopte le graphite sombre, une navigation latérale compacte et un panneau de contenu flottant bordé, à partir de la référence partagée ; le logo produit est le ruban fluide `apps/openfuse/apps/mobile/assets/alineo-flow-mark.png`. Les marques Gmail et Google Calendar viennent de `thesvg`, et la MicOrb demeure le symbole de l’assistant. L’ancienne interface artisanale dans `apps/alineo/` reste rejetée et n’est pas réactivée. Le mode sample est fictif et local ; aucun fournisseur/modèle ni compte externe n’est configuré.<br>
**Identité :** l’utilisateur a confirmé un produit unique ALINEO dans ce dépôt. La direction hub de ce document est la principale direction produit ALINEO ; le rapprochement avec les lots PAOS est explicité dans [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md).

> **Historique des décisions d’interface :** l’application active conserve le socle mobile/web de provenance OpenFuse mais est maintenant rebrandée Alineo. Les sections §5.1–5.3 décrivent l’ancienne UI artisanale dans `apps/alineo/` et son historique visuel ; elles ne prescrivent pas sa réactivation.

## 1. Décision de périmètre exprimée

L’intention est de **ne pas reconstruire plusieurs outils de productivité**. L’application doit surtout réunir dans un seul endroit :

1. un chat agentique ;
2. des connecteurs vers des outils déjà utilisés ;
3. une vue de progression issue de données réelles ;
4. des insights et graphiques qui aident à décider.

Les tâches, calendriers, listes et autres objets restent d’abord dans leurs services d’origine. L’application est une couche de conversation, d’orchestration et de lecture transversale, pas un second TickTick ou un clone de Google Workspace.

Cette note décrit la direction principale du produit ALINEO et révise explicitement la priorité de livraison par rapport au Lot 1 PAOS : le hub connecté est au centre d’ALINEO, alors que ce lot excluait les connecteurs. L’application active sous `apps/openfuse/` porte désormais la marque Alineo ; sa provenance open-source est consignée dans la revue technique, sans faire d’OpenFuse une marque de produit. Le shell artisanal de `apps/alineo/` reste historique et rejeté. Le mode sample est local et sans provider/modèle ; cette décision de base ne valide aucun connecteur ni scope et ne déplace pas silencieusement les six espaces PAOS. La matrice de réconciliation est dans [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md).

## 2. Fonctionnalités du hub — périmètre réduit

| ID | Capacité à construire | Comportement attendu et limites |
|---|---|---|
| **HUB-01** | **Chat agentique central** | L’interface courante est le chat Alineo. En mode sample, un agent local et des données fictives s’affichent sans modèle/provider ni service Intelligence. Le mode live et les écritures restent fermés tant que l’identité serveur, les permissions et le fournisseur ne sont pas décidés et testés. A2UI appartient uniquement à l’ancien scaffold `apps/alineo/`; il n’est pas la direction visuelle active. |
| **HUB-02** | **Connecteurs et contrôle d’accès** | Connecter/déconnecter un service, expliquer les permissions demandées, distinguer lecture et écriture, afficher l’état de connexion et les erreurs. Le fournisseur externe reste la source de vérité de ses données ; le hub n’en duplique que le minimum techniquement nécessaire, avec rétention à décider. Les opérations disponibles dépendent des API, scopes, comptes et conditions réels de chaque service. |
| **HUB-03** | **Progression** | Rassembler des faits observables provenant des services effectivement connectés. Chaque valeur affiche sa période, sa source et, si nécessaire, ses limites. Aucune progression, réalisation ou disponibilité n’est inventée à partir d’une connexion absente ou d’un texte ambigu. |
| **HUB-04** | **Insights et graphiques d’aide à la décision** | Afficher des tendances/comparaisons seulement quand des données réelles suffisantes existent et que la définition du calcul est explicable. Tout objectif, seuil, score ou priorité personnelle manquant reste non configuré ; aucun score caché ou quota par défaut. Les graphiques servent la décision et ne remplacent pas le choix de l’utilisateur. |
| **HUB-05** | **Activité et approbation** | Rendre visible ce que l’agent a réellement lu, proposé, appelé, modifié ou n’a pas pu faire. Au démarrage, toute écriture déclenchée par l’agent ou action externe doit présenter un aperçu et demander l’approbation explicite de l’utilisateur. Pas de chaîne de pensée privée, de faux événement ou de succès déclaré sans preuve. |

### 2.1 Ce que cette direction ne demande pas de reconstruire

Tant que les services existants répondent au besoin, ne pas construire un gestionnaire natif complet de tâches, projets, objectifs, calendrier, habitudes, sessions Focus, messagerie, documents ou stockage de fichiers. Ces domaines peuvent être interrogés/affichés par le hub à partir des connecteurs autorisés ; ils ne deviennent pas automatiquement des modules avec une seconde base CRUD.

Aucune fonction de facturation, de réseau social, de marketplace, de collaboration d’équipe ou de suite bureautique n’est déduite de cette direction.

## 3. Connecteurs visés

Les services ci-dessous sont les cibles nommées par l’utilisateur, pas des intégrations déjà disponibles dans le dépôt.

| Service visé | Statut de la demande | Points à confirmer avant connexion |
|---|---|---|
| **Gmail** | Cible explicite | Actions nécessaires (lecture/recherche, brouillon, envoi ?), scopes minimaux, consentement, limites API et rétention. Aucun envoi autonome n’est supposé. |
| **Google Workspace** | Cible explicite, périmètre large | Confirmer les services précis concernés (par exemple Drive, Docs, Sheets ou Slides) et les opérations utiles pour chacun ; ne pas interpréter « Workspace » comme une autorisation générale à tout lire/écrire. |
| **Google Calendar** | Cible explicite | Lecture, création/modification éventuelle, scopes, traitement des événements privés, provenance et règles de confirmation à définir. |
| **TickTick** | Cible explicite | Vérifier l’API/voie d’intégration disponible, les permissions, les limites et la compatibilité avec le compte/plafond gratuit visé. Aucune capacité particulière n’est garantie par ce document. |
| **Autres outils de productivité avec offre gratuite** | Critère de sélection souhaité, services non nommés | Ajouter seulement après choix explicite et vérification de l’API, du coût total, des quotas, de la confidentialité et de la fiabilité. Une offre gratuite n’implique pas automatiquement un accès API gratuit ou autorisé. |

Les sources, versions d’API, fournisseurs d’orchestration des connecteurs, scopes OAuth, quotas et modèles de stockage restent à choisir. Les comptes/applications connectés à Arena ne sont pas les connecteurs du produit : aucun accès Gmail, Google Workspace, Calendar ou TickTick n’a été utilisé ni connecté par ce document.

## 4. Architecture préférée, sans prétendre qu’elle est déjà validée

- **Base courante :** l’application Alineo utilise le socle technique MIT dont la provenance est épinglée dans `OPENFUSE_SECURITY_REVIEW.md`; son identité visible est Alineo. En sample, CopilotKit SSE et le backend fictif restent locaux ; aucune clé Intelligence ou de modèle n’est requise. En live, l’identité, la rétention, le fournisseur/modèle et le transport restent à choisir/implémenter.
- **Rendu A2UI :** composants déclaratifs autorisés, validation serveur des actions, limite explicite par connecteur et utilisateur ; aucune UI générée ne peut écrire directement dans un service.
- **Connecteurs :** adapter chaque service derrière un contrat interne ; ne pas exposer de clé secrète dans le navigateur. Le fournisseur réel décide des opérations disponibles.
- **Source de vérité :** par défaut, les données continuent de vivre dans leurs outils d’origine. Toute copie/cache/index dans le hub nécessite une justification, une permission, une rétention et un mécanisme de suppression documentés.
- **Résultats :** séparer données observées, calculs, estimations et suggestions. Une proposition ne doit jamais être présentée comme une action appliquée.

L’application courante est Alineo sous `apps/openfuse/`. En mode sample, elle utilise un runtime SSE local et aucune clé CPK ; les Rich Threads distants sont désactivés. L’aperçu local ne configure aucun modèle, compte Google, OAuth, worker navigateur ou connecteur de données. La télémétrie runtime CopilotKit reste activée par défaut (désactivation via `COPILOTKIT_TELEMETRY_DISABLED=true` ou `DO_NOT_TRACK=1`) ; elle ne constitue pas une intégration de données. Le mode live hérité reste fondé sur une clé partagée à propriétaire unique et ne garantit pas l’isolation multi-tenant. Voir [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md) et [`OPENFUSE_SECURITY_REVIEW.md`](OPENFUSE_SECURITY_REVIEW.md) pour la provenance et les limites.

## 5. Historique visuel de l’ancienne interface et provenance du repère animé

### 5.1 Repère animé OpenDuet/OpenBot

Une première inspection de [`CopilotKit/OpenBot`](https://github.com/CopilotKit/OpenBot), commit `bdb6280d8c621fc44c05663f6b62ae1020a0d2c8`, avait trouvé que son `AgentOrb` utilisé par le skin OpenDuet n’a pas de visage. Cette observation ne concernait pas le dépôt distinct [`CopilotKit/OpenDuet`](https://github.com/CopilotKit/OpenDuet), que l’utilisateur a explicitement demandé de rechercher. Son `MicOrb`, au commit `55f1ef113584e748bc2abb7c0d8d97753e9748db`, dessine bien deux yeux animés : le regard se déplace, les yeux clignent et sourient. La logique React est dans [`mic-orb.tsx`](https://github.com/CopilotKit/OpenDuet/blob/55f1ef113584e748bc2abb7c0d8d97753e9748db/openbot/app/src/components/duet/mic-orb.tsx), le canvas et le rendu des yeux dans [`mic-orb-draw.ts`](https://github.com/CopilotKit/OpenDuet/blob/55f1ef113584e748bc2abb7c0d8d97753e9748db/openbot/app/src/components/duet/mic-orb-draw.ts).

L’ancienne app `apps/alineo/` conserve une première adaptation de la `MicOrb`. L’application Alineo active reprend séparément ce repère dans `apps/openfuse/apps/mobile/src/mic-orb.tsx` avec son moteur canvas, un rendu SVG natif et le favicon Ocean. L’orbe reste le symbole de l’assistant, pas le logo du produit; ses états indiquent l’activité des tâches et non une capture audio. L’attribution au commit OpenDuet, la licence MIT et le code sont conservés dans l’application active. Cette adoption ne réactive ni l’ancien shell, ni sa grille de 18 dégradés, ni A2UI.

### 5.2 Grille de 18 dégradés et choix d’apparence — ancien shell uniquement

**Décision visuelle précédente :** l’image fournie avait servi à ajouter un sélecteur de 18 palettes clair/sombre à l’ancienne interface. Cette réalisation artisanale reste rejetée et sa grille n’est pas reprise dans Alineo. Le tableau ci-dessous, y compris les références de palette ivoire/sauge, est conservé uniquement comme historique de l’ancienne app ; la direction active est le shell graphite décrit en tête du document.

| # | Nom dans ALINEO | Couleurs représentatives du dégradé |
|---:|---|---|
| 1 | Lagune | `#75D0D3` · `#BADCC3` · `#DBA380` |
| 2 | Corail solaire | `#DD528D` · `#FF8A7A` · `#FBAF51` |
| 3 | Verre de mer | `#1C7883` · `#A9BDBB` · `#EC7356` |
| 4 | Prune ardente | `#3D1667` · `#DF3562` · `#FEB97E` |
| 5 | Orchidée | `#5809B0` · `#C78DC7` · `#F496A6` |
| 6 | Coucher de soleil | `#393F73` · `#FB743A` · `#E83123` |
| 7 | Forêt dorée | `#113035` · `#A7CB8E` · `#F3A42E` |
| 8 | Mangue | `#F8BF54` · `#EB5544` · `#9020A6` |
| 9 | Baie électrique | `#FB485E` · `#C4659F` · `#7D8AFC` |
| 10 | Menthe électrique | `#47FDCC` · `#9877A6` · `#D31181` |
| 11 | Prune velours | `#5A0C4A` · `#E28EB0` · `#6A49BE` |
| 12 | Aurore | `#6DECDD` · `#A787F4` · `#EE7A6D` |
| 13 | Ciel lilas | `#4FBCF4` · `#B05AD5` · `#F0B6E8` |
| 14 | Lagon bleu | `#2950B9` · `#559ADD` · `#905DC4` |
| 15 | Baie velours | `#F27796` · `#AC5C99` · `#623E96` |
| 16 | Turquoise pop | `#4DC3F5` · `#42FECB` · `#980CD1` |
| 17 | Menthe iris | `#54E5D6` · `#A786F7` · `#6A47C9` |
| 18 | Mimosa framboise | `#FBCE13` · `#EA7295` · `#861FA4` |

Le thème conserve l’architecture sombre déjà conçue, mais l’utilisateur peut choisir la variante claire depuis le même sélecteur. Dans les deux modes, les couleurs du dégradé restent celles de la palette ; l’accent utilisé pour le texte et les contrôles est ajusté pour conserver le contraste avec la surface principale. Les tests automatisés couvrent le contraste de cet accent et du texte sur ses boutons pour les 18 palettes dans les deux modes (seuil testé : 4,5:1). Ils ne remplacent pas un audit WCAG complet des contrastes, états, tailles, appareils et technologies d’assistance.

### 5.3 Référence visuelle de l’ancienne application ALINEO

Le rail compact et le sélecteur de thème décrits ci-dessus restent propres à l’ancienne app [`apps/alineo/`](../apps/alineo/). La MicOrb est reprise séparément dans l’application Alineo active comme repère de l’assistant ; cela ne réactive pas le shell artisanal rejeté. [`prototype/agent-hub/`](../prototype/agent-hub/README.md) reste historique. La base courante demeure l’interface Alineo sous `apps/openfuse/`.

## 6. Critères minimaux d’acceptation du hub

1. Une demande n’accède qu’aux connecteurs explicitement autorisés pour l’utilisateur courant.
2. Une fonction absente d’un fournisseur, une permission manquante ou un quota dépassé produit un état d’erreur honnête ; le hub ne simule pas le résultat.
3. Toute réponse/insight issu d’un connecteur expose au minimum sa source et sa période ; les calculs et limites sont consultables.
4. Aucune cible, préférence, métrique, durée, score ou donnée personnelle n’est présupposé. Une information manquante reste « à confirmer ».
5. Toute écriture externe est montrée dans un aperçu puis approuvée explicitement avant l’appel ; une incertitude sur le résultat est indiquée comme telle.
6. L’utilisateur peut inspecter, révoquer et déconnecter un connecteur ; les secrets restent côté serveur.
7. Les messages de conversation volontairement envoyés au modèle sont distingués des notes/journaux privés : aucune note privée n’est aspirée automatiquement depuis les connecteurs ni envoyée au modèle par défaut.
8. Les états vide, chargement, erreur, succès, permissions refusées et service déconnecté sont spécifiés ; aucun KPI, graphique ou événement factice dans l’état vide.
9. L’interface active est Alineo : shell graphite, sidebar compacte, panneau de contenu flottant bordé et logo ruban fluide. Ne pas réactiver le sélecteur de 18 dégradés ou le shell artisanal rejeté. Conserver les exigences d’accessibilité, de clavier, de mouvement réduit et d’états vides véridiques lors de toute adaptation.

## 7. Décisions à garder ouvertes

- Le lien produit est confirmé : un seul produit ALINEO dans ce dépôt. Le hub est la direction principale ; consulter `ALINEO_IMPLEMENTATION.md` pour les capacités PAOS explicitement reportées ou gardées comme contraintes.
- Confirmer les opérations exactes attendues pour Gmail, Google Workspace, Google Calendar et TickTick, et les services Workspace à inclure.
- Vérifier connecteurs/API, droits d’usage, quotas et coût réel des offres gratuites avant de bâtir les intégrations.
- Choisir les sources et définitions des premières mesures/graphiques de progression ; aucun objectif ou score n’est fourni.
- **Décision de marque et d’interface actuelle :** le produit et l’interface s’appellent Alineo ; le nom OpenFuse est réservé à l’attribution de provenance technique. Le shell graphite, le contenu flottant bordé et le logo ruban généré sont actifs ; les marques `thesvg` restent propres aux connecteurs et la MicOrb à l’assistant. La grille des 18 dégradés et le shell artisanal sous `apps/alineo/` ne sont pas réactivés.
- L’intégration active de la `MicOrb` est dans `apps/openfuse/apps/mobile/` avec son attribution MIT. L’intégration CopilotKit/A2UI `1.90.2` reste propre à l’ancienne app. Les limites live/mono-propriétaire du socle hérité et sa revue sont détaillées dans `OPENFUSE_SECURITY_REVIEW.md`.
- Fixer la politique de stockage/cache/rétention des données agrégées et des conversations.

## 8. État de réalisation

L’application courante est Alineo sous `apps/openfuse/`; l’ancienne UI `apps/alineo/` et `prototype/agent-hub/` sont historiques. L’aperçu local utilise des données fictives, un runtime SSE sans modèle/provider ou clé Intelligence, et aucun OAuth ou connecteur live. L’API reste loopback-only derrière le proxy de prévisualisation. Le mode live hérité demeure mono-propriétaire et n’est pas prêt pour plusieurs utilisateurs. Les API, permissions, quotas, coûts et conditions des offres doivent être vérifiés avant toute intégration ; citer un service ne promet aucune capacité ni gratuité. Voir `ALINEO_IMPLEMENTATION.md` et `OPENFUSE_SECURITY_REVIEW.md` pour la provenance, l’état et les limites.
