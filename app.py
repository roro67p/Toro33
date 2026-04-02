from flask import Flask, render_template

app = Flask(__name__)

MENUS = {
    "gourmand": {
        "nom": "Menu Gourmand",
        "prix": "35€",
        "emoji": "🍽️",
        "description": "L'expérience culinaire complète pour les amoureux de la bonne table.",
        "entrees": [
            {"nom": "Velouté de potimarron", "detail": "crème fraîche, noisettes grillées"},
            {"nom": "Terrine de campagne maison", "detail": "cornichons, pain de campagne grillé"},
            {"nom": "Carpaccio de bœuf", "detail": "parmesan, roquette, câpres"},
        ],
        "plats": [
            {"nom": "Filet de bœuf sauce bordelaise", "detail": "gratin dauphinois, haricots verts"},
            {"nom": "Dos de cabillaud en croûte d'herbes", "detail": "écrasé de pommes de terre, beurre citronné"},
            {"nom": "Risotto aux cèpes et truffe", "detail": "parmesan affiné 24 mois"},
        ],
        "desserts": [
            {"nom": "Fondant au chocolat", "detail": "cœur coulant, glace vanille Bourbon"},
            {"nom": "Crème brûlée à la vanille", "detail": "tuile amande"},
            {"nom": "Tarte tatin", "detail": "crème chantilly maison"},
        ],
    },
    "surprise": {
        "nom": "Menu Surprise",
        "prix": "28€",
        "emoji": "🎲",
        "description": "Laissez-vous guider par les inspirations du chef… vous ne savez pas ce qui vous attend !",
        "entrees": [
            {"nom": "???", "detail": "Le chef a ses secrets"},
            {"nom": "???", "detail": "Peut-être quelque chose d'inattendu"},
            {"nom": "???", "detail": "Fermez les yeux et faites confiance"},
        ],
        "plats": [
            {"nom": "???", "detail": "Un plat mystère vous attend"},
            {"nom": "???", "detail": "Saison, humeur, inspiration..."},
        ],
        "desserts": [
            {"nom": "???", "detail": "La surprise finale"},
        ],
    },
    "wow": {
        "nom": "Menu Wow",
        "prix": "55€",
        "emoji": "🤩",
        "description": "Le summum de l'expérience Chez Romu. Réservé aux grandes occasions (ou aux mercredis qui s'ennuient).",
        "entrees": [
            {"nom": "Foie gras poêlé", "detail": "chutney de figues, brioche toastée"},
            {"nom": "Huîtres Gillardeau N°3", "detail": "mignonette échalotes-vinaigre"},
            {"nom": "Tartare de thon rouge", "detail": "avocat, sésame, sauce ponzu"},
        ],
        "plats": [
            {"nom": "Homard thermidor", "detail": "gratin de légumes du moment"},
            {"nom": "Côte de bœuf Wagyu (pour 2)", "detail": "sauce béarnaise, frites maison"},
            {"nom": "Saint-Jacques poêlées", "detail": "purée de topinambour, émulsion aux truffes"},
        ],
        "desserts": [
            {"nom": "Soufflé au Grand Marnier", "detail": "à commander en début de repas, évidemment"},
            {"nom": "Chariot de fromages affinés", "detail": "confiture maison, pain aux noix"},
            {"nom": "Paris-Brest revisité", "detail": "praliné noisette, éclats de caramel"},
        ],
    },
}

BOISSONS = [
    {
        "nom": "Eau du Robinet Pétillante",
        "prix": "0€",
        "emoji": "💧",
        "description": (
            "Notre cuvée exclusive, directement tirée des entrailles de la montagne parisienne "
            "(alias le réseau municipal). Pétillante grâce à notre technologie de pointe : "
            "une gazéification artisanale réalisée à la main par notre sommelier avec une paille "
            "et beaucoup de conviction. Notes de calcaire, légère finale de chlore assumée. "
            "Accord mets parfait avec tout le menu — et surtout, avec votre porte-monnaie."
        ),
        "accord": "Se marie avec : n'importe quoi. Vraiment.",
        "badge": "Cuvée Prestige",
    },
    {
        "nom": "Vin Rouge de la Maison",
        "prix": "18€ / bouteille",
        "emoji": "🍷",
        "description": "Sélection du chef. Convivial et sans chichis.",
        "accord": "Idéal avec les viandes et les longues soirées.",
        "badge": None,
    },
    {
        "nom": "Vin Blanc de la Maison",
        "prix": "18€ / bouteille",
        "emoji": "🥂",
        "description": "Frais, léger, parfait pour les beaux jours.",
        "accord": "Accord parfait avec les poissons et fruits de mer.",
        "badge": None,
    },
    {
        "nom": "Bière Artisanale Locale",
        "prix": "6€",
        "emoji": "🍺",
        "description": "Brassée à deux pas d'ici, par des gens biens.",
        "accord": "Pour les matchs, le bowling, et les grandes occasions.",
        "badge": None,
    },
]

EVENEMENTS = [
    {
        "slug": "foot",
        "nom": "Foot Chez Romu",
        "emoji": "⚽",
        "sous_titre": "Les grandes soirées matchs",
        "description": (
            "Chaque soir de match, Chez Romu se transforme en antre des supporters. "
            "Grand écran, ambiance electrique, bières fraîches et sandwichs maison. "
            "On crie, on chante, on se retrouve. Le foot c'est bien, mais le foot avec "
            "les potes Chez Romu, c'est mieux."
        ),
        "details": [
            "Grand écran Full HD",
            "Happy hour pendant la première mi-temps",
            "Menu spécial match à 15€",
            "Réservation conseillée pour les grands matchs",
        ],
        "prochain": "Prochains matchs affichés sur place et sur notre ardoise",
        "couleur": "green",
    },
    {
        "slug": "bowling",
        "nom": "Soirée Bowling",
        "emoji": "🎳",
        "sous_titre": "Strike & Dîner",
        "description": (
            "La formule idéale pour les soirées entre amis ou en équipe. On part tous ensemble "
            "au bowling du coin, on revient Chez Romu pour un repas bien mérité après "
            "toutes ces strikes ratées (ou réussies). Bonne humeur garantie, "
            "score non garanti."
        ),
        "details": [
            "Départ en groupe depuis le restaurant",
            "2 parties de bowling incluses",
            "Retour au restaurant pour le dîner",
            "Menu convivial à prix groupé",
            "À partir de 6 personnes",
        ],
        "prochain": "Tous les premiers vendredis du mois — inscription au restaurant",
        "couleur": "orange",
    },
    {
        "slug": "disco",
        "nom": "Soirée Disco",
        "emoji": "🕺",
        "sous_titre": "Dancefloor & Bonne Bouffe",
        "description": (
            "Les années 70 reviennent Chez Romu ! Vinyles, boule à facettes, platform shoes "
            "optionnelles. On dîne, on digère, on danse. Le chef cuisine en rythme, "
            "le serveur sert en glissant, et la caisse enregistreuse fait le son. "
            "Ambiance garantie ou remboursé (non remboursé)."
        ),
        "details": [
            "Tenue disco encouragée (mais pas obligatoire)",
            "Playlist 100% vinyle des 70s-80s",
            "Cocktails rétro de la maison",
            "Dîner + soirée dansante",
            "Réservation obligatoire",
        ],
        "prochain": "Un samedi par mois — guettez l'ardoise et les réseaux !",
        "couleur": "purple",
    },
    {
        "slug": "madame-pedrosa",
        "nom": "Soirée Madame Pedrosa",
        "emoji": "🌸",
        "sous_titre": "Une soirée… particulière",
        "description": (
            "Madame Pedrosa, c'est une habituée. Une figure. Une légende locale. "
            "Une fois par trimestre, on lui réserve la salle, on prépare ses plats préférés, "
            "et on invite ses amis — et les amis de ses amis — pour une soirée qui lui ressemble : "
            "chaleureuse, colorée, et pleine de surprises délicates. "
            "On ne vous en dit pas plus. Ceux qui connaissent, connaissent."
        ),
        "details": [
            "Sur invitation ou par le bouche-à-oreille",
            "Menu et ambiance selon les envies de Madame",
            "Atmosphère intimiste et bienveillante",
            "Chaque soirée est unique",
        ],
        "prochain": "Les dates circulent discrètement... tendez l'oreille.",
        "couleur": "pink",
    },
]

SURPRISES = [
    {
        "titre": "La Table Mystère",
        "emoji": "🪄",
        "description": (
            "Une fois par semaine, une table est réservée… pour personne. "
            "Si vous arrivez à l'improviste et que le chef est d'humeur, "
            "vous pourriez avoir droit à un repas entier dont vous ne connaîtrez "
            "ni les plats, ni le prix, ni la durée. Juste la confiance."
        ),
    },
    {
        "titre": "Le Mot du Chef",
        "emoji": "📝",
        "description": (
            "À chaque addition, le chef glisse un petit mot manuscrit. "
            "Parfois une blague, parfois un conseil de vie, parfois une recette secrète. "
            "Parfois juste 'merci'. Ces mots-là valent plus que le repas."
        ),
    },
    {
        "titre": "L'Ardoise Invisible",
        "emoji": "🖊️",
        "description": (
            "Il y a toujours au moins un plat du jour qui n'est écrit nulle part. "
            "Il faut le demander. Il faut oser. Ceux qui osent mangent souvent "
            "le meilleur plat de la semaine."
        ),
    },
    {
        "titre": "La Bouteille Surprise",
        "emoji": "🍾",
        "description": (
            "Commandez 'une surprise à boire' et laissez le sommelier choisir. "
            "Budget fixé à l'avance, surprise garantie. "
            "On a déjà sorti un Pétrus. On a aussi sorti de l'eau pétillante du robinet. "
            "C'est ça, la vie."
        ),
    },
    {
        "titre": "Le Dessert Fantôme",
        "emoji": "👻",
        "description": (
            "Si vous terminez votre repas sans commander de dessert, "
            "il arrive parfois qu'un petit quelque chose apparaisse quand même. "
            "Le chef n'aime pas que les gens repartent sans douceur. "
            "C'est sa façon à lui de dire au revoir."
        ),
    },
    {
        "titre": "La Soirée Sans Téléphone",
        "emoji": "📵",
        "description": (
            "Une fois par an, Romu organise un dîner où les téléphones sont gentiment "
            "confisqués à l'entrée et rendus avec le café. "
            "Les gens se parlent. Vraiment. C'est assez bluffant."
        ),
    },
]


@app.route("/")
def index():
    return render_template("index.html", menus=MENUS, boissons=BOISSONS, active="menus")


@app.route("/evenements")
def evenements():
    return render_template("evenements.html", evenements=EVENEMENTS, active="evenements")


@app.route("/evenements/<slug>")
def evenement_detail(slug):
    evt = next((e for e in EVENEMENTS if e["slug"] == slug), None)
    if not evt:
        return render_template("404.html"), 404
    return render_template("evenement_detail.html", evt=evt, active="evenements")


@app.route("/surprises")
def surprises():
    return render_template("surprises.html", surprises=SURPRISES, active="surprises")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
