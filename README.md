# Site SL CONCEPT BTP

Site vitrine de SL CONCEPT BTP — entreprise de gros œuvre, maçonnerie, piscines et clôtures à Pointe-Noire, Guadeloupe.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Tout le site : structure, styles et scripts dans un seul fichier |
| `assets/` | Photos du site (hero + galerie) |
| `favicon.svg` | Icône de l'onglet |
| `robots.txt` | Autorisation d'indexation Google |

## Mise en ligne

**Option 1 — Vercel (recommandé)**
1. vercel.com → *Add New… → Project* → importer ce dépôt.
2. Framework Preset : *Other*. Aucun réglage de build.
3. Deploy. Le site est en ligne en moins d'une minute.
4. *Settings → Domains* pour brancher le nom de domaine.

**Option 2 — GitHub Pages**
1. *Settings → Pages*.
2. Source : *Deploy from a branch* → branche `main`, dossier `/ (root)`.
3. Save. Le site est publié sur `https://<compte>.github.io/sl-concept-btp/`.

## À personnaliser

- **Photos** : remplacer les fichiers de `assets/` par de vraies photos de chantier (format paysage, 1400 px de large minimum). Les 4 emplacements gris de la galerie attendent leurs images.
- **Avis clients** : section « Ce qu'en disent nos clients », remplacer les 3 textes d'exemple.
- **Estimateur de budget** : les prix sont regroupés dans l'objet `BAREME` en bas du fichier `index.html`. Chaque ligne contient une fourchette TTC (`bas` / `haut`) par ml ou par m², modifiable directement.
- **Coordonnées** : téléphone, e-mail et adresse apparaissent dans l'en-tête, la section devis et le pied de page.

## Contact

SAS SL CONCEPT BTP — SIREN 984 677 278 — Chemin de la Manioquerie, 97116 Pointe-Noire
0690 27 09 77 — SLconcept-btp@outlook.com
