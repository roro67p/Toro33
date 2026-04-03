import { create } from 'zustand'

const CATEGORIES = [
  { id: 'fruits-legumes', name: 'Fruits & Légumes', icon: '🥬', color: '#22c55e' },
  { id: 'boucherie', name: 'Boucherie & Volaille', icon: '🥩', color: '#ef4444' },
  { id: 'poissonnerie', name: 'Poissonnerie', icon: '🐟', color: '#3b82f6' },
  { id: 'boulangerie', name: 'Boulangerie & Pâtisserie', icon: '🥖', color: '#f59e0b' },
  { id: 'cremerie', name: 'Crèmerie & Fromages', icon: '🧀', color: '#fbbf24' },
  { id: 'epicerie', name: 'Épicerie', icon: '🫘', color: '#a855f7' },
  { id: 'boissons', name: 'Boissons', icon: '🥤', color: '#06b6d4' },
  { id: 'surgeles', name: 'Surgelés', icon: '🧊', color: '#60a5fa' },
  { id: 'hygiene', name: 'Hygiène & Beauté', icon: '🧴', color: '#ec4899' },
  { id: 'entretien', name: 'Entretien & Maison', icon: '🧹', color: '#14b8a6' },
  { id: 'bebe', name: 'Bébé', icon: '🍼', color: '#f472b6' },
  { id: 'bio', name: 'Bio & Bien-être', icon: '🌿', color: '#84cc16' },
]

const PRODUCTS = [
  // Fruits & Légumes
  { id: 1, name: 'Bananes', category: 'fruits-legumes', price: 1.89, priceUnit: 'kg', image: '🍌', rating: 4.5, reviews: 234, promo: null, bio: false, origin: "Côte d'Ivoire", description: 'Bananes mûres à point, idéales pour le petit-déjeuner.' },
  { id: 2, name: 'Pommes Golden', category: 'fruits-legumes', price: 2.49, priceUnit: 'kg', image: '🍎', rating: 4.3, reviews: 189, promo: null, bio: false, origin: 'France', description: 'Pommes Golden croquantes et sucrées, origine France.' },
  { id: 3, name: 'Tomates grappe', category: 'fruits-legumes', price: 2.99, priceUnit: 'kg', image: '🍅', rating: 4.7, reviews: 312, promo: { type: 'percentage', value: 20 }, bio: false, origin: 'France', description: 'Tomates grappe bien rouges et parfumées.' },
  { id: 4, name: 'Salade Batavia', category: 'fruits-legumes', price: 0.99, priceUnit: 'pièce', image: '🥬', rating: 4.1, reviews: 87, promo: null, bio: false, origin: 'France', description: 'Salade Batavia fraîche et croquante.' },
  { id: 5, name: 'Carottes', category: 'fruits-legumes', price: 1.29, priceUnit: 'kg', image: '🥕', rating: 4.4, reviews: 156, promo: null, bio: false, origin: 'France', description: 'Carottes de pleine terre, lavées et prêtes à cuisiner.' },
  { id: 6, name: 'Avocats mûrs à point', category: 'fruits-legumes', price: 1.99, priceUnit: 'pièce', image: '🥑', rating: 4.6, reviews: 278, promo: { type: 'percentage', value: 15 }, bio: false, origin: 'Pérou', description: 'Avocats Hass mûrs à point, prêts à consommer.' },
  { id: 7, name: 'Fraises Gariguette', category: 'fruits-legumes', price: 4.49, priceUnit: 'barquette 250g', image: '🍓', rating: 4.8, reviews: 421, promo: null, bio: false, origin: 'France', description: 'Fraises Gariguette, variété précoce au goût exceptionnel.' },
  { id: 8, name: 'Citrons jaunes Bio', category: 'fruits-legumes', price: 2.99, priceUnit: 'filet 500g', image: '🍋', rating: 4.2, reviews: 98, promo: null, bio: true, origin: 'Espagne', description: 'Citrons jaunes biologiques, non traités après récolte.' },

  // Boucherie & Volaille
  { id: 10, name: 'Steaks hachés 5% MG', category: 'boucherie', price: 5.49, priceUnit: 'x4 (400g)', image: '🥩', rating: 4.5, reviews: 345, promo: null, bio: false, origin: 'France', description: 'Steaks hachés pur bœuf, 5% de matière grasse.' },
  { id: 11, name: 'Filets de poulet', category: 'boucherie', price: 8.99, priceUnit: 'kg', image: '🍗', rating: 4.6, reviews: 287, promo: { type: 'percentage', value: 10 }, bio: false, origin: 'France', description: 'Filets de poulet fermier, élevé en plein air.' },
  { id: 12, name: 'Côtes de porc', category: 'boucherie', price: 6.99, priceUnit: 'kg', image: '🥩', rating: 4.3, reviews: 178, promo: null, bio: false, origin: 'France', description: 'Côtes de porc première qualité.' },
  { id: 13, name: 'Saucisses de Toulouse', category: 'boucherie', price: 7.49, priceUnit: 'kg', image: '🌭', rating: 4.4, reviews: 213, promo: null, bio: false, origin: 'France', description: 'Saucisses de Toulouse traditionnelles, chair fine.' },
  { id: 14, name: 'Rôti de bœuf', category: 'boucherie', price: 19.90, priceUnit: 'kg', image: '🥩', rating: 4.7, reviews: 156, promo: { type: 'percentage', value: 15 }, bio: false, origin: 'France', description: 'Rôti de bœuf tendre et savoureux, idéal pour le dimanche.' },

  // Poissonnerie
  { id: 20, name: 'Saumon frais', category: 'poissonnerie', price: 16.90, priceUnit: 'kg', image: '🐟', rating: 4.5, reviews: 198, promo: null, bio: false, origin: 'Norvège', description: "Pavé de saumon frais de l'Atlantique." },
  { id: 21, name: 'Crevettes roses cuites', category: 'poissonnerie', price: 9.99, priceUnit: '500g', image: '🦐', rating: 4.4, reviews: 167, promo: { type: 'percentage', value: 25 }, bio: false, origin: 'Madagascar', description: 'Crevettes roses cuites et décortiquées.' },
  { id: 22, name: 'Cabillaud frais', category: 'poissonnerie', price: 14.90, priceUnit: 'kg', image: '🐟', rating: 4.6, reviews: 134, promo: null, bio: false, origin: 'Atlantique Nord', description: 'Dos de cabillaud frais, chair ferme et blanche.' },

  // Boulangerie & Pâtisserie
  { id: 30, name: 'Baguette Tradition', category: 'boulangerie', price: 1.29, priceUnit: 'pièce', image: '🥖', rating: 4.8, reviews: 567, promo: null, bio: false, origin: 'France', description: 'Baguette tradition française, croustillante et moelleuse.' },
  { id: 31, name: 'Croissants pur beurre', category: 'boulangerie', price: 3.99, priceUnit: 'x6', image: '🥐', rating: 4.7, reviews: 432, promo: null, bio: false, origin: 'France', description: 'Croissants pur beurre, feuilletés et dorés.' },
  { id: 32, name: 'Pain de mie complet', category: 'boulangerie', price: 1.69, priceUnit: 'pièce', image: '🍞', rating: 4.2, reviews: 234, promo: null, bio: false, origin: 'France', description: 'Pain de mie complet, moelleux et nutritif.' },
  { id: 33, name: 'Tarte aux pommes', category: 'boulangerie', price: 6.90, priceUnit: 'pièce', image: '🥧', rating: 4.6, reviews: 189, promo: { type: 'percentage', value: 10 }, bio: false, origin: 'France', description: 'Tarte aux pommes maison, pâte feuilletée.' },

  // Crèmerie & Fromages
  { id: 40, name: 'Lait demi-écrémé', category: 'cremerie', price: 0.99, priceUnit: '1L', image: '🥛', rating: 4.3, reviews: 456, promo: null, bio: false, origin: 'France', description: 'Lait demi-écrémé UHT, stérilisé.' },
  { id: 41, name: 'Comté AOP 12 mois', category: 'cremerie', price: 16.90, priceUnit: 'kg', image: '🧀', rating: 4.9, reviews: 345, promo: null, bio: false, origin: 'Jura, France', description: 'Comté AOP affiné 12 mois, goût fruité et noisette.' },
  { id: 42, name: 'Yaourts nature', category: 'cremerie', price: 2.29, priceUnit: 'x12', image: '🥛', rating: 4.1, reviews: 278, promo: { type: 'percentage', value: 30 }, bio: false, origin: 'France', description: 'Yaourts nature au lait entier, onctueux.' },
  { id: 43, name: 'Beurre doux', category: 'cremerie', price: 2.19, priceUnit: '250g', image: '🧈', rating: 4.5, reviews: 312, promo: null, bio: false, origin: 'Bretagne, France', description: 'Beurre doux de baratte, tradition bretonne.' },
  { id: 44, name: 'Crème fraîche épaisse', category: 'cremerie', price: 1.49, priceUnit: '20cl', image: '🥛', rating: 4.3, reviews: 198, promo: null, bio: false, origin: 'France', description: 'Crème fraîche épaisse 30% MG.' },

  // Épicerie
  { id: 50, name: 'Pâtes Penne Rigate', category: 'epicerie', price: 1.39, priceUnit: '500g', image: '🍝', rating: 4.4, reviews: 567, promo: null, bio: false, origin: 'Italie', description: 'Penne Rigate de qualité supérieure, blé dur.' },
  { id: 51, name: 'Riz Basmati', category: 'epicerie', price: 2.79, priceUnit: '1kg', image: '🍚', rating: 4.5, reviews: 345, promo: null, bio: false, origin: 'Inde', description: 'Riz Basmati long grain, parfumé et léger.' },
  { id: 52, name: "Huile d'olive vierge extra", category: 'epicerie', price: 5.99, priceUnit: '75cl', image: '🫒', rating: 4.7, reviews: 289, promo: { type: 'percentage', value: 20 }, bio: false, origin: 'Espagne', description: "Huile d'olive vierge extra, première pression à froid." },
  { id: 53, name: 'Nutella', category: 'epicerie', price: 4.79, priceUnit: '750g', image: '🍫', rating: 4.6, reviews: 678, promo: null, bio: false, origin: 'Italie', description: 'Pâte à tartiner aux noisettes et cacao.' },
  { id: 54, name: 'Céréales Miel Pops', category: 'epicerie', price: 3.29, priceUnit: '400g', image: '🥣', rating: 4.2, reviews: 234, promo: null, bio: false, origin: 'France', description: 'Céréales soufflées au miel pour le petit-déjeuner.' },

  // Boissons
  { id: 60, name: 'Eau minérale Evian', category: 'boissons', price: 3.99, priceUnit: 'x6 1.5L', image: '💧', rating: 4.3, reviews: 456, promo: null, bio: false, origin: 'France', description: 'Eau minérale naturelle des Alpes.' },
  { id: 61, name: 'Coca-Cola', category: 'boissons', price: 1.89, priceUnit: '1.5L', image: '🥤', rating: 4.5, reviews: 567, promo: { type: 'percentage', value: 15 }, bio: false, origin: 'France', description: 'Coca-Cola original taste.' },
  { id: 62, name: "Jus d'orange pressé", category: 'boissons', price: 2.99, priceUnit: '1L', image: '🍊', rating: 4.6, reviews: 345, promo: null, bio: false, origin: 'Brésil', description: "Pur jus d'orange, sans sucres ajoutés." },
  { id: 63, name: 'Café moulu Arabica', category: 'boissons', price: 4.49, priceUnit: '250g', image: '☕', rating: 4.7, reviews: 289, promo: null, bio: false, origin: 'Colombie', description: 'Café moulu 100% Arabica, torréfaction douce.' },
  { id: 64, name: 'Bière blonde 1664', category: 'boissons', price: 5.49, priceUnit: 'x6 25cl', image: '🍺', rating: 4.2, reviews: 234, promo: { type: 'percentage', value: 20 }, bio: false, origin: 'France', description: 'Bière blonde Kronenbourg 1664, brassée en Alsace.' },

  // Surgelés
  { id: 70, name: 'Pizzas 4 Fromages', category: 'surgeles', price: 3.49, priceUnit: 'x3', image: '🍕', rating: 4.3, reviews: 345, promo: null, bio: false, origin: 'France', description: 'Pizzas surgelées 4 fromages, pâte fine et croustillante.' },
  { id: 71, name: 'Glace Vanille Häagen-Dazs', category: 'surgeles', price: 5.99, priceUnit: '460ml', image: '🍦', rating: 4.8, reviews: 456, promo: { type: 'percentage', value: 25 }, bio: false, origin: 'France', description: 'Crème glacée vanille de Madagascar.' },
  { id: 72, name: 'Poêlée de légumes', category: 'surgeles', price: 2.99, priceUnit: '750g', image: '🥘', rating: 4.1, reviews: 178, promo: null, bio: false, origin: 'France', description: 'Poêlée de légumes du soleil, prête à cuisiner.' },
  { id: 73, name: 'Nuggets de poulet', category: 'surgeles', price: 4.29, priceUnit: '500g', image: '🍗', rating: 4.4, reviews: 289, promo: null, bio: false, origin: 'France', description: 'Nuggets de poulet croustillants, viande française.' },

  // Hygiène & Beauté
  { id: 80, name: 'Gel douche Nivea', category: 'hygiene', price: 2.99, priceUnit: '500ml', image: '🧴', rating: 4.4, reviews: 234, promo: null, bio: false, origin: 'Allemagne', description: 'Gel douche hydratant, peaux sensibles.' },
  { id: 81, name: 'Shampoing Elsève', category: 'hygiene', price: 3.49, priceUnit: '300ml', image: '🧴', rating: 4.3, reviews: 189, promo: { type: 'percentage', value: 30 }, bio: false, origin: 'France', description: 'Shampoing réparateur pour cheveux abîmés.' },
  { id: 82, name: 'Dentifrice Colgate', category: 'hygiene', price: 2.29, priceUnit: '75ml', image: '🪥', rating: 4.5, reviews: 345, promo: null, bio: false, origin: 'France', description: 'Dentifrice protection complète, triple action.' },
  { id: 83, name: 'Papier toilette Lotus', category: 'hygiene', price: 4.99, priceUnit: 'x12 rouleaux', image: '🧻', rating: 4.2, reviews: 456, promo: null, bio: false, origin: 'France', description: 'Papier toilette ultra doux, 3 plis.' },

  // Entretien & Maison
  { id: 90, name: 'Lessive liquide Skip', category: 'entretien', price: 8.99, priceUnit: '37 lavages', image: '🧹', rating: 4.3, reviews: 234, promo: { type: 'percentage', value: 25 }, bio: false, origin: 'France', description: 'Lessive liquide active en eau froide.' },
  { id: 91, name: 'Liquide vaisselle Fairy', category: 'entretien', price: 1.99, priceUnit: '500ml', image: '🧽', rating: 4.5, reviews: 189, promo: null, bio: false, origin: 'France', description: 'Liquide vaisselle ultra dégraissant.' },

  // Bio & Bien-être
  { id: 100, name: 'Granola Bio aux fruits', category: 'bio', price: 3.99, priceUnit: '350g', image: '🌾', rating: 4.6, reviews: 167, promo: null, bio: true, origin: 'France', description: 'Granola croquant bio aux fruits rouges.' },
  { id: 101, name: "Lait d'avoine Bio", category: 'bio', price: 2.49, priceUnit: '1L', image: '🥛', rating: 4.5, reviews: 234, promo: null, bio: true, origin: 'France', description: "Boisson à l'avoine bio, sans sucres ajoutés." },
  { id: 102, name: 'Quinoa Bio', category: 'bio', price: 3.79, priceUnit: '400g', image: '🌾', rating: 4.4, reviews: 145, promo: { type: 'percentage', value: 10 }, bio: true, origin: 'Bolivie', description: 'Quinoa blanc bio, riche en protéines.' },

  // Bébé
  { id: 110, name: 'Couches Pampers T4', category: 'bebe', price: 12.99, priceUnit: 'x42', image: '🍼', rating: 4.7, reviews: 567, promo: { type: 'percentage', value: 20 }, bio: false, origin: 'Allemagne', description: 'Couches Pampers Baby-Dry, 12h au sec.' },
  { id: 111, name: 'Petits pots légumes', category: 'bebe', price: 2.29, priceUnit: 'x4', image: '🥗', rating: 4.3, reviews: 189, promo: null, bio: true, origin: 'France', description: 'Petits pots bio légumes variés, dès 6 mois.' },
]

const DRIVE_SLOTS = (() => {
  const slots = []
  const today = new Date()
  for (let d = 0; d < 7; d++) {
    const date = new Date(today)
    date.setDate(today.getDate() + d)
    const daySlots = []
    const hours = d === 0
      ? [14, 15, 16, 17, 18, 19]
      : [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    for (const h of hours) {
      daySlots.push({
        id: `${date.toISOString().split('T')[0]}-${h}`,
        date: date.toISOString().split('T')[0],
        hour: h,
        label: `${h}h00 - ${h + 1}h00`,
        available: Math.random() > 0.2,
      })
    }
    slots.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
      dayDate: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
      slots: daySlots,
    })
  }
  return slots
})()

const useStore = create((set, get) => ({
  // Navigation
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),

  // Categories
  categories: CATEGORIES,
  selectedCategory: null,
  setSelectedCategory: (cat) => set({ selectedCategory: cat, currentPage: 'catalog' }),

  // Products
  products: PRODUCTS,
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery } = get()
    let filtered = products
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    return filtered
  },

  getPromoProducts: () => {
    return get().products.filter(p => p.promo)
  },

  getFeaturedProducts: () => {
    return get().products.filter(p => p.rating >= 4.5).slice(0, 8)
  },

  // Cart
  cart: [],
  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),

  addToCart: (product) => {
    const cart = get().cart
    const existing = cart.find(item => item.product.id === product.id)
    if (existing) {
      set({
        cart: cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      })
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] })
    }
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(item => item.product.id !== productId) })
  },

  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    set({
      cart: get().cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })
  },

  getCartTotal: () => {
    return get().cart.reduce((total, item) => {
      const price = item.product.promo
        ? item.product.price * (1 - item.product.promo.value / 100)
        : item.product.price
      return total + price * item.quantity
    }, 0)
  },

  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0)
  },

  clearCart: () => set({ cart: [] }),

  // Drive
  driveSlots: DRIVE_SLOTS,
  selectedSlot: null,
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  // Auth
  authModal: false,
  authMode: 'login',
  setAuthModal: (open, mode = 'login') => set({ authModal: open, authMode: mode }),
  user: null,
  login: (email, name) => set({ user: { email, name, loyaltyPoints: 2450 }, authModal: false }),
  logout: () => set({ user: null }),

  // Order
  orderConfirmed: false,
  confirmOrder: () => {
    const { cart, selectedSlot, user } = get()
    if (cart.length > 0 && selectedSlot && user) {
      set({ orderConfirmed: true, cart: [], selectedSlot: null, currentPage: 'confirmation' })
    }
  },
  resetOrder: () => set({ orderConfirmed: false }),
}))

export default useStore
