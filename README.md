# 🍽️ Chez Romu — Site Web du Restaurant

Site web convivial style bistrot pour le restaurant **Chez Romu**, développé avec Flask (Python).

## Lancement rapide (Mac)

### 1. Prérequis
- Python 3.9+ installé (`python3 --version`)
- pip disponible

### 2. Installation des dépendances

```bash
pip install -r requirements.txt
```

ou avec un environnement virtuel (recommandé) :

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Lancer le serveur

```bash
python app.py
```

Le site est accessible à : **http://localhost:5000**

---

## Structure du projet

```
Toro33/
├── app.py               # Application Flask principale
├── requirements.txt     # Dépendances Python
├── templates/           # Pages HTML (Jinja2)
│   ├── base.html        # Template de base (header, nav, footer)
│   ├── index.html       # Page Menus & Boissons
│   ├── evenements.html  # Liste des événements
│   ├── evenement_detail.html  # Détail d'un événement
│   ├── surprises.html   # Page Surprises
│   └── 404.html         # Page d'erreur
└── static/
    ├── css/style.css    # Styles (design bistrot)
    └── js/main.js       # JavaScript (tabs, animations)
```

## Pages du site

| URL | Contenu |
|-----|---------|
| `/` | Menus (Gourmand, Surprise, Wow) + Boissons |
| `/evenements` | Grille des 4 événements |
| `/evenements/foot` | Soirées matchs |
| `/evenements/bowling` | Soirée Bowling |
| `/evenements/disco` | Soirée Disco |
| `/evenements/madame-pedrosa` | Soirée Madame Pedrosa |
| `/surprises` | Les surprises de la maison |

## Easter egg

Appuyez sur `Cmd+K` sur n'importe quelle page pour recevoir un message secret du chef.