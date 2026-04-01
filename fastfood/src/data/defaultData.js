export const DEFAULT_DATA = {
  restaurant: {
    name: "BurgerStop",
    tagline: "Vite. Bon. Généreux.",
    description: "Le meilleur fast-food de la ville — burgers généreux, frites croustillantes et service rapide depuis 2015.",
    address: "45 Avenue de la République, 69003 Lyon",
    phone: "04 78 00 00 00",
    email: "contact@burgerstop.fr",
    hours: [
      { day: "Lundi",    open: "11h00", close: "22h30", closed: false },
      { day: "Mardi",    open: "11h00", close: "22h30", closed: false },
      { day: "Mercredi", open: "11h00", close: "22h30", closed: false },
      { day: "Jeudi",    open: "11h00", close: "22h30", closed: false },
      { day: "Vendredi", open: "11h00", close: "23h30", closed: false },
      { day: "Samedi",   open: "11h00", close: "23h30", closed: false },
      { day: "Dimanche", open: "12h00", close: "22h00", closed: false },
    ],
    socialMedia: { facebook: "#", instagram: "#", tiktok: "#" },
  },
  adminPassword: "admin123",

  menuCategories: [
    {
      id: "cat_burgers", name: "Burgers", icon: "🍔",
      items: [
        { id: "b1", name: "Classic Burger",    description: "Steak haché, cheddar, salade, tomate, oignon, sauce maison",        price: 8.90,  available: true, badge: "populaire", allergens: "Gluten, Lait, Oeuf",  image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "b2", name: "Double Smash",      description: "Double steak écrasé, double cheddar, pickles, sauce smash",          price: 11.90, available: true, badge: "signature", allergens: "Gluten, Lait, Oeuf",  image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "b3", name: "Chicken Crispy",    description: "Filet de poulet pané, coleslaw, cornichons, sauce BBQ",              price: 9.50,  available: true, badge: "nouveau",   allergens: "Gluten, Lait, Oeuf",  image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "b4", name: "Bacon Cheese",      description: "Steak haché, bacon croustillant, cheddar fondu, sauce fromagère",    price: 10.90, available: true, badge: null,        allergens: "Gluten, Lait",         image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "b5", name: "Veggie Burger",     description: "Galette végétale, avocat, roquette, tomate, sauce tahini",           price: 9.20,  available: true, badge: "veggie",    allergens: "Gluten, Sésame",       image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "b6", name: "Spicy Burger",      description: "Steak haché, jalapeños, oignons caramélisés, sauce piquante maison", price: 10.50, available: true, badge: "épicé",     allergens: "Gluten, Lait",         image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&h=300&auto=format&fit=crop&q=80" },
      ]
    },
    {
      id: "cat_accomp", name: "Accompagnements", icon: "🍟",
      items: [
        { id: "a1", name: "Frites Maison",   description: "Frites fraîches coupées à la main, sel de mer",          price: 3.50, available: true, badge: "populaire", allergens: "—",            image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "a2", name: "Nuggets x6",      description: "6 nuggets de poulet dorés, sauce au choix",              price: 4.50, available: true, badge: null,        allergens: "Gluten, Oeuf",  image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "a3", name: "Nuggets x12",     description: "12 nuggets de poulet dorés, 2 sauces au choix",          price: 7.90, available: true, badge: null,        allergens: "Gluten, Oeuf",  image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "a4", name: "Onion Rings",     description: "Rondelles d'oignon panées et croustillantes",            price: 3.90, available: true, badge: null,        allergens: "Gluten, Lait",  image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "a5", name: "Frites Cheese",   description: "Frites maison nappées de sauce cheddar fondu",           price: 4.90, available: true, badge: "coup coeur", allergens: "Gluten, Lait", image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "a6", name: "Coleslaw",        description: "Salade crémeuse de chou blanc et carotte",               price: 2.50, available: true, badge: null,        allergens: "Oeuf, Moutarde",image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&auto=format&fit=crop&q=80" },
      ]
    },
    {
      id: "cat_desserts", name: "Desserts", icon: "🍦",
      items: [
        { id: "d1", name: "Sundae Vanille",  description: "Glace vanille onctueuse, sauce caramel",              price: 2.90, available: true, badge: null,        allergens: "Lait",          image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "d2", name: "Sundae Chocolat", description: "Glace vanille, sauce chocolat noir, éclats pralin",   price: 3.20, available: true, badge: "populaire", allergens: "Lait, Gluten",  image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "d3", name: "Cookie Maison",   description: "Cookie double chocolat cuit à la commande",           price: 2.50, available: true, badge: "nouveau",   allergens: "Gluten, Oeuf, Lait", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "d4", name: "Apple Pie",       description: "Chausson aux pommes tiède, sucre cannelle",           price: 2.20, available: true, badge: null,        allergens: "Gluten, Lait",  image: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=500&h=300&auto=format&fit=crop&q=80" },
      ]
    },
  ],

  drinkCategories: [
    {
      id: "dcat_sodas", name: "Sodas & Soft", icon: "🥤",
      items: [
        { id: "s1", name: "Coca-Cola",     description: "Classique, servi bien frais",   priceSm: 2.50, priceMd: 3.20, priceLg: 3.90, available: true, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "s2", name: "Sprite",        description: "Citron-citron vert pétillant",  priceSm: 2.50, priceMd: 3.20, priceLg: 3.90, available: true, image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "s3", name: "Fanta Orange",  description: "Orange pétillant et fruité",    priceSm: 2.50, priceMd: 3.20, priceLg: 3.90, available: true, image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "s4", name: "Ice Tea Pêche", description: "Thé glacé pêche maison",        priceSm: 2.80, priceMd: 3.50, priceLg: 4.20, available: true, image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&h=300&auto=format&fit=crop&q=80" },
      ]
    },
    {
      id: "dcat_shakes", name: "Milkshakes", icon: "🥛",
      items: [
        { id: "mk1", name: "Shake Vanille",  description: "Lait entier, glace vanille bourbon",    priceSm: 4.50, priceMd: 5.50, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "mk2", name: "Shake Chocolat", description: "Cacao intense, lait, crème fouettée",   priceSm: 4.50, priceMd: 5.50, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "mk3", name: "Shake Fraise",   description: "Fraises fraîches, lait, glace",         priceSm: 4.80, priceMd: 5.80, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "mk4", name: "Shake Caramel",  description: "Caramel beurre salé, vanille, chantilly",priceSm: 4.80, priceMd: 5.80, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&h=300&auto=format&fit=crop&q=80" },
      ]
    },
    {
      id: "dcat_jus", name: "Jus & Eau", icon: "🧃",
      items: [
        { id: "j1", name: "Jus Orange Pressé", description: "Oranges fraîches pressées",    priceSm: 3.50, priceMd: 4.50, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "j2", name: "Eau Plate 50cl",    description: "Eau minérale naturelle",        priceSm: 1.50, priceMd: null, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "j3", name: "Eau Gazeuse 50cl",  description: "Eau pétillante",                priceSm: 1.80, priceMd: null, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=500&h=300&auto=format&fit=crop&q=80" },
      ]
    },
    {
      id: "dcat_hot", name: "Boissons Chaudes", icon: "☕",
      items: [
        { id: "h1", name: "Café Expresso",  description: "Court et intense",         priceSm: 1.80, priceMd: null, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "h2", name: "Café Allongé",   description: "Long, doux et parfumé",    priceSm: 2.20, priceMd: null, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=300&auto=format&fit=crop&q=80" },
        { id: "h3", name: "Chocolat Chaud", description: "Lait entier, cacao valrhona", priceSm: 3.20, priceMd: null, priceLg: null, available: true, image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&h=300&auto=format&fit=crop&q=80" },
      ]
    },
  ],

  formules: [
    { id: "f1", name: "Menu Classic",  description: "1 Classic Burger + Frites Maison + Soda au choix",      price: 13.90, originalPrice: 15.90, badge: "populaire", available: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&auto=format&fit=crop&q=80" },
    { id: "f2", name: "Menu Double",   description: "1 Double Smash + Frites Maison + Soda au choix",         price: 16.90, originalPrice: 18.60, badge: "signature", available: true, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=300&auto=format&fit=crop&q=80" },
    { id: "f3", name: "Menu Chicken",  description: "1 Chicken Crispy + Frites Maison + Soda au choix",       price: 14.50, originalPrice: 16.20, badge: null,        available: true, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=300&auto=format&fit=crop&q=80" },
    { id: "f4", name: "Menu Kids",     description: "4 Nuggets + Petites Frites + Soda + 1 Sundae",           price: 8.90,  originalPrice: 11.10, badge: "enfants",   available: true, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=300&auto=format&fit=crop&q=80" },
    { id: "f5", name: "Menu Family",   description: "2 Burgers + 2 Frites + 2 Sodas + 2 Sundaes",            price: 32.00, originalPrice: 38.00, badge: "famille",   available: true, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=300&auto=format&fit=crop&q=80" },
    { id: "f6", name: "Menu Veggie",   description: "1 Veggie Burger + Coleslaw + Jus d'Orange",              price: 13.50, originalPrice: 15.20, badge: "veggie",    available: true, image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&h=300&auto=format&fit=crop&q=80" },
  ],

  stock: [
    { id: "stk1",  name: "Steaks hachés 150g",  category: "Viande",     quantity: 120, unit: "pcs",   minThreshold: 30,  costPerUnit: 1.20, lastUpdated: "2026-03-31" },
    { id: "stk2",  name: "Pains à burger",       category: "Boulangerie",quantity: 200, unit: "pcs",   minThreshold: 50,  costPerUnit: 0.35, lastUpdated: "2026-03-31" },
    { id: "stk3",  name: "Filets de poulet",     category: "Viande",     quantity: 80,  unit: "pcs",   minThreshold: 20,  costPerUnit: 1.80, lastUpdated: "2026-03-31" },
    { id: "stk4",  name: "Frites 2.5kg",         category: "Épicerie",   quantity: 15,  unit: "sacs",  minThreshold: 5,   costPerUnit: 4.50, lastUpdated: "2026-03-31" },
    { id: "stk5",  name: "Nuggets poulet",       category: "Viande",     quantity: 300, unit: "pcs",   minThreshold: 100, costPerUnit: 0.45, lastUpdated: "2026-03-31" },
    { id: "stk6",  name: "Cheddar tranches",     category: "Crémerie",   quantity: 400, unit: "pcs",   minThreshold: 100, costPerUnit: 0.15, lastUpdated: "2026-03-31" },
    { id: "stk7",  name: "Laitue iceberg",       category: "Légumes",    quantity: 12,  unit: "têtes", minThreshold: 4,   costPerUnit: 1.20, lastUpdated: "2026-03-31" },
    { id: "stk8",  name: "Tomates",              category: "Légumes",    quantity: 8,   unit: "kg",    minThreshold: 3,   costPerUnit: 2.50, lastUpdated: "2026-03-31" },
    { id: "stk9",  name: "Sauce maison 1L",      category: "Sauces",     quantity: 5,   unit: "L",     minThreshold: 2,   costPerUnit: 3.00, lastUpdated: "2026-03-31" },
    { id: "stk10", name: "Bacon tranches",       category: "Viande",     quantity: 3,   unit: "kg",    minThreshold: 2,   costPerUnit: 8.00, lastUpdated: "2026-03-31" },
    { id: "stk11", name: "Coca-Cola 1.5L",       category: "Boissons",   quantity: 48,  unit: "btls",  minThreshold: 12,  costPerUnit: 1.20, lastUpdated: "2026-03-31" },
    { id: "stk12", name: "Glace vanille 5L",     category: "Crémerie",   quantity: 4,   unit: "bacs",  minThreshold: 2,   costPerUnit: 9.00, lastUpdated: "2026-03-31" },
  ],

  suppliers: [
    { id: "sup1", name: "Métro Lyon",          contact: "Thierry Lambert",  phone: "04 72 11 22 33", email: "tlyon@metro.fr",               category: "Généraliste" },
    { id: "sup2", name: "Boulangerie Dupont",  contact: "Marc Dupont",      phone: "04 78 33 44 55", email: "marc@boulangerie-dupont.fr",   category: "Boulangerie" },
    { id: "sup3", name: "McCain Foodservice",  contact: "Julie Morel",      phone: "03 20 11 22 33", email: "j.morel@mccain.fr",            category: "Épicerie" },
    { id: "sup4", name: "Bigard Pro",          contact: "Patrick Renard",   phone: "02 96 44 55 66", email: "p.renard@bigard.fr",           category: "Viande" },
    { id: "sup5", name: "Coca-Cola FEMSA",     contact: "Sophie Klein",     phone: "01 44 00 11 22", email: "s.klein@cocacola.fr",          category: "Boissons" },
    { id: "sup6", name: "Lactalis Pro",        contact: "Nathalie Caron",   phone: "02 43 59 00 11", email: "n.caron@lactalis.fr",          category: "Crémerie" },
  ],

  supplierCatalog: [
    { id: "ci1",  supplierId: "sup1", name: "Steak haché 150g (x50)",     unit: "carton", price: 58.00, category: "Viande" },
    { id: "ci2",  supplierId: "sup1", name: "Filet de poulet IQF (1kg)",  unit: "kg",     price: 6.50,  category: "Viande" },
    { id: "ci3",  supplierId: "sup1", name: "Laitue iceberg",             unit: "pièce",  price: 1.20,  category: "Légumes" },
    { id: "ci4",  supplierId: "sup1", name: "Tomates rondes (5kg)",       unit: "caisse", price: 12.00, category: "Légumes" },
    { id: "ci5",  supplierId: "sup1", name: "Oignons jaunes (10kg)",      unit: "sac",    price: 8.50,  category: "Légumes" },
    { id: "ci6",  supplierId: "sup1", name: "Sauce burger maison (1L)",   unit: "bidon",  price: 4.20,  category: "Sauces" },
    { id: "ci7",  supplierId: "sup1", name: "Sauce BBQ (1L)",             unit: "bidon",  price: 3.80,  category: "Sauces" },
    { id: "ci8",  supplierId: "sup1", name: "Mayonnaise (1L)",            unit: "bidon",  price: 3.50,  category: "Sauces" },
    { id: "ci9",  supplierId: "sup2", name: "Bun classique x50",          unit: "carton", price: 17.50, category: "Boulangerie" },
    { id: "ci10", supplierId: "sup2", name: "Bun brioché x50",            unit: "carton", price: 22.00, category: "Boulangerie" },
    { id: "ci11", supplierId: "sup3", name: "Frites McCain 2.5kg",        unit: "sac",    price: 4.50,  category: "Épicerie" },
    { id: "ci12", supplierId: "sup3", name: "Onion Rings 1kg",            unit: "sac",    price: 5.20,  category: "Épicerie" },
    { id: "ci13", supplierId: "sup4", name: "Steak haché 150g Premium (x30)", unit: "carton", price: 45.00, category: "Viande" },
    { id: "ci14", supplierId: "sup4", name: "Bacon fumé tranché 1kg",     unit: "kg",     price: 9.50,  category: "Viande" },
    { id: "ci15", supplierId: "sup4", name: "Nuggets poulet x100",        unit: "carton", price: 38.00, category: "Viande" },
    { id: "ci16", supplierId: "sup5", name: "Coca-Cola 1.5L x12",         unit: "pack",   price: 13.20, category: "Boissons" },
    { id: "ci17", supplierId: "sup5", name: "Sprite 1.5L x12",            unit: "pack",   price: 13.20, category: "Boissons" },
    { id: "ci18", supplierId: "sup5", name: "Fanta Orange 1.5L x12",      unit: "pack",   price: 13.20, category: "Boissons" },
    { id: "ci19", supplierId: "sup6", name: "Cheddar tranches x200",      unit: "boite",  price: 28.00, category: "Crémerie" },
    { id: "ci20", supplierId: "sup6", name: "Glace vanille 5L",           unit: "bac",    price: 9.00,  category: "Crémerie" },
    { id: "ci21", supplierId: "sup6", name: "Lait entier 1L x12",         unit: "pack",   price: 9.60,  category: "Crémerie" },
    { id: "ci22", supplierId: "sup6", name: "Creme fouettee 1L",          unit: "bidon",  price: 5.50,  category: "Crémerie" },
  ],

  purchaseOrders: [
    { id: "po1", supplierId: "sup4", supplierName: "Bigard Pro", items: [{ catalogId: "ci15", name: "Nuggets poulet x100", quantity: 3, unit: "carton", price: 38.00 }], total: 114.00, status: "received", createdAt: "2026-03-28", note: "" },
  ],

  customerOrders: [],

  caisse: [
    { id: "ca1", date: "2026-03-25", revenue: 1240.50, covers: 98,  note: "Journée normale" },
    { id: "ca2", date: "2026-03-26", revenue: 1580.00, covers: 132, note: "Mercredi chargé" },
    { id: "ca3", date: "2026-03-27", revenue: 2100.00, covers: 175, note: "Soirée foot" },
    { id: "ca4", date: "2026-03-28", revenue: 1890.00, covers: 158, note: "" },
    { id: "ca5", date: "2026-03-29", revenue: 2350.00, covers: 196, note: "Weekend" },
    { id: "ca6", date: "2026-03-30", revenue: 2180.00, covers: 181, note: "Weekend" },
    { id: "ca7", date: "2026-03-31", revenue: 1650.00, covers: 138, note: "Lundi" },
  ],

  reviews: [
    { id: "rev1", name: "Maxime T.",  rating: 5, comment: "Les meilleurs burgers de Lyon ! Le Double Smash est incroyable, les frites toujours croustillantes. Service ultra rapide.", date: "2026-03-20", approved: true,  reply: "Merci Maxime, on adore t'accueillir !" },
    { id: "rev2", name: "Lea M.",     rating: 5, comment: "Le Menu Classic a 13,90 c'est une valeur sure. Burger genereux, frites bien dorees et service souriant.", date: "2026-03-22", approved: true,  reply: null },
    { id: "rev3", name: "Julien B.",  rating: 4, comment: "Tres bon Chicken Crispy ! Petit bemol sur l'attente un vendredi soir mais ca vaut le coup.", date: "2026-03-25", approved: true,  reply: "Merci Julien ! Le vendredi on est a fond." },
    { id: "rev4", name: "Sarah K.",   rating: 5, comment: "Le Veggie Burger m'a bluffee ! Enfin un fast-food qui pense aux vegetariens. Coleslaw delicieux.", date: "2026-03-28", approved: true,  reply: null },
    { id: "rev5", name: "Antoine D.", rating: 4, comment: "Super concept, j'adore les Frites Cheese. Je viens chaque semaine maintenant !", date: "2026-03-30", approved: true,  reply: null },
  ],

  reservations: [],
}
