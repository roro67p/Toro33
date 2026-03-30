export const DEFAULT_DATA = {
  restaurant: {
    name: "Le Comptoir",
    tagline: "Cuisine française authentique",
    description: "Un restaurant chaleureux au cœur de la ville, où chaque repas devient un souvenir. Produits frais, recettes traditionnelles et accueil sincère.",
    address: "12 Rue des Gastronomes, 69001 Lyon",
    phone: "04 72 00 00 00",
    email: "contact@lecomptoir.fr",
    hours: [
      { day: "Lundi", lunch: "Fermé", dinner: "Fermé", closed: true },
      { day: "Mardi", lunch: "12h00 - 14h30", dinner: "19h00 - 22h30", closed: false },
      { day: "Mercredi", lunch: "12h00 - 14h30", dinner: "19h00 - 22h30", closed: false },
      { day: "Jeudi", lunch: "12h00 - 14h30", dinner: "19h00 - 22h30", closed: false },
      { day: "Vendredi", lunch: "12h00 - 14h30", dinner: "19h00 - 23h00", closed: false },
      { day: "Samedi", lunch: "12h00 - 15h00", dinner: "19h00 - 23h00", closed: false },
      { day: "Dimanche", lunch: "12h00 - 15h00", dinner: "Fermé", closed: false }
    ],
    socialMedia: { facebook: "#", instagram: "#", tripadvisor: "#" }
  },
  adminPassword: "admin123",
  menuCategories: [
    {
      id: "cat1", name: "Entrées", icon: "🥗",
      items: [
        { id: "e1", name: "Salade lyonnaise", description: "Frisée, lardons, œuf poché, croûtons", price: 12.50, available: true },
        { id: "e2", name: "Terrine maison", description: "Terrine de campagne, cornichons, pain grillé", price: 9.00, available: true },
        { id: "e3", name: "Velouté de saison", description: "Velouté du moment selon arrivage", price: 8.50, available: true },
        { id: "e4", name: "Escargots de Bourgogne", description: "6 escargots, beurre persillé", price: 14.00, available: true }
      ]
    },
    {
      id: "cat2", name: "Plats", icon: "🍽️",
      items: [
        { id: "p1", name: "Bœuf bourguignon", description: "Bœuf braisé au vin rouge, carottes, champignons, pommes vapeur", price: 22.00, available: true },
        { id: "p2", name: "Quenelles de brochet", description: "Quenelles maison, sauce Nantua", price: 19.50, available: true },
        { id: "p3", name: "Côte de cochon fermier", description: "Côte de porc, sauce moutarde à l'ancienne, gratin dauphinois", price: 21.00, available: true },
        { id: "p4", name: "Filet de sole meunière", description: "Sole, beurre citronné, haricots verts", price: 24.00, available: true },
        { id: "p5", name: "Risotto aux champignons", description: "Risotto crémeux, champignons des bois, parmesan (végétarien)", price: 17.00, available: true }
      ]
    },
    {
      id: "cat3", name: "Desserts", icon: "🍮",
      items: [
        { id: "d1", name: "Tarte Tatin maison", description: "Pommes caramélisées, pâte feuilletée, crème fraîche", price: 9.00, available: true },
        { id: "d2", name: "Île flottante", description: "Meringue pochée, crème anglaise, pralin", price: 8.00, available: true },
        { id: "d3", name: "Fondant au chocolat", description: "Fondant coulant, glace vanille", price: 9.50, available: true },
        { id: "d4", name: "Plateau de fromages", description: "Sélection de 4 fromages, noix, raisins", price: 12.00, available: true }
      ]
    },
    {
      id: "cat4", name: "Formules", icon: "📋",
      items: [
        { id: "f1", name: "Formule Déjeuner", description: "Entrée + Plat ou Plat + Dessert", price: 22.00, available: true },
        { id: "f2", name: "Formule Complète", description: "Entrée + Plat + Dessert", price: 28.00, available: true },
        { id: "f3", name: "Menu Gastronomique", description: "4 plats + accord mets & vins", price: 55.00, available: true }
      ]
    }
  ],
  drinkCategories: [
    {
      id: "dc1", name: "Vins rouges", icon: "🍷",
      items: [
        { id: "vr1", name: "Côtes du Rhône", description: "Domaine local, fruité et rond", price_glass: 6.00, price_bottle: 22.00, available: true },
        { id: "vr2", name: "Bordeaux Saint-Émilion", description: "Grand vin de garde, tanins élégants", price_glass: null, price_bottle: 45.00, available: true },
        { id: "vr3", name: "Bourgogne Pinot Noir", description: "Souple et parfumé, accord parfait avec le bœuf", price_glass: 9.00, price_bottle: 35.00, available: true }
      ]
    },
    {
      id: "dc2", name: "Vins blancs", icon: "🥂",
      items: [
        { id: "vb1", name: "Mâcon Blanc", description: "Chardonnay minéral, idéal avec le poisson", price_glass: 6.50, price_bottle: 24.00, available: true },
        { id: "vb2", name: "Sancerre", description: "Sauvignon pur, notes d'agrumes", price_glass: 10.00, price_bottle: 42.00, available: true }
      ]
    },
    {
      id: "dc3", name: "Softs & Eaux", icon: "💧",
      items: [
        { id: "s1", name: "Eau minérale", description: "Evian ou Badoit 75cl", price_glass: null, price_bottle: 5.00, available: true },
        { id: "s2", name: "Limonade maison", description: "Citron pressé, sirop, eau pétillante", price_glass: 4.50, price_bottle: null, available: true },
        { id: "s3", name: "Jus de fruits frais", description: "Orange, pomme ou raisin", price_glass: 5.00, price_bottle: null, available: true },
        { id: "s4", name: "Coca-Cola", description: "33cl", price_glass: 4.00, price_bottle: null, available: true }
      ]
    },
    {
      id: "dc4", name: "Cocktails & Apéritifs", icon: "🍹",
      items: [
        { id: "c1", name: "Kir Royal", description: "Champagne, crème de cassis", price_glass: 9.00, price_bottle: null, available: true },
        { id: "c2", name: "Spritz", description: "Aperol, Prosecco, eau pétillante", price_glass: 9.00, price_bottle: null, available: true },
        { id: "c3", name: "Cocktail maison", description: "Création du bar, demandez à notre équipe", price_glass: 11.00, price_bottle: null, available: true }
      ]
    }
  ],
  events: [
    { id: "ev1", title: "Soirée Jazz & Gastronomie", date: "2026-04-12", time: "19h30", description: "Un quartet de jazz accompagne votre dîner gastronomique. Réservation obligatoire. Menu spécial 55€ par personne.", emoji: "🎷", seats: 40, seatsLeft: 12, price: 55 },
    { id: "ev2", title: "Dîner des Vignerons", date: "2026-04-25", time: "19h00", description: "Rencontrez nos vignerons partenaires et dégustez leurs cuvées en accord avec notre menu du soir.", emoji: "🍷", seats: 30, seatsLeft: 8, price: 65 },
    { id: "ev3", title: "Brunch Dominical", date: "2026-05-03", time: "11h00", description: "Brunch fait maison tous les dimanches de mai. Pain frais, charcuteries, œufs, fromages, jus de fruits.", emoji: "🥐", seats: 50, seatsLeft: 20, price: 28 },
    { id: "ev4", title: "Soirée Truffes & Champagne", date: "2026-05-17", time: "20h00", description: "Une soirée d'exception autour de la truffe noire du Périgord, accompagnée de nos meilleures cuvées de Champagne.", emoji: "✨", seats: 20, seatsLeft: 5, price: 95 }
  ],
  reservations: [
    { id: "res1", name: "Martin Dupont", phone: "06 12 34 56 78", email: "martin@email.fr", date: "2026-03-30", time: "19h30", guests: 4, notes: "Allergie aux noix", status: "confirmed", createdAt: "2026-03-28" },
    { id: "res2", name: "Sophie Bernard", phone: "06 98 76 54 32", email: "sophie@email.fr", date: "2026-03-30", time: "20h00", guests: 2, notes: "Anniversaire de mariage", status: "confirmed", createdAt: "2026-03-27" },
    { id: "res3", name: "Famille Leclerc", phone: "04 72 11 22 33", email: "leclerc@email.fr", date: "2026-03-31", time: "12h30", guests: 6, notes: "", status: "pending", createdAt: "2026-03-28" },
    { id: "res4", name: "Thomas Roux", phone: "07 55 44 33 22", email: "thomas@email.fr", date: "2026-04-01", time: "19h00", guests: 3, notes: "Végétarien", status: "pending", createdAt: "2026-03-29" },
    { id: "res5", name: "Claire Morel", phone: "06 33 22 11 00", email: "claire@email.fr", date: "2026-04-05", time: "20h30", guests: 2, notes: "", status: "confirmed", createdAt: "2026-03-25" }
  ]
}
