import { Truck, Clock, ShieldCheck, Percent, ChevronRight, Star, Leaf } from 'lucide-react'
import useStore from '../store/useStore'
import ProductCard from './ProductCard'

export default function HomePage() {
  const { categories, setSelectedCategory, getPromoProducts, getFeaturedProducts, setCurrentPage } = useStore()
  const promoProducts = getPromoProducts()
  const featuredProducts = getFeaturedProducts()

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Truck size={16} /> Retrait Drive gratuit en 2h
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              Vos courses en ligne,<br />
              <span className="text-accent-light">prêtes en 2h.</span>
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl">
              Plus de 10 000 produits frais, bio et de qualité. Commandez en ligne et récupérez vos courses au Drive sans attendre.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setSelectedCategory(null); setCurrentPage('catalog') }}
                className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                Faire mes courses
              </button>
              <button
                onClick={() => setCurrentPage('drive')}
                className="px-8 py-3.5 bg-white/15 backdrop-blur text-white font-bold rounded-xl hover:bg-white/25 transition-colors border border-white/30"
              >
                Réserver un créneau
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={24} />, title: 'Drive gratuit', desc: 'Retrait en 2h chrono' },
              { icon: <ShieldCheck size={24} />, title: 'Fraîcheur garantie', desc: 'Produits frais du jour' },
              { icon: <Percent size={24} />, title: 'Prix E.Leclerc', desc: 'Les prix les plus bas' },
              { icon: <Clock size={24} />, title: '7j/7', desc: 'Ouvert tous les jours' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="promo-gradient rounded-2xl p-6 md:p-8 text-white flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Offre de la semaine</p>
            <h3 className="text-2xl md:text-3xl font-black mb-2">Jusqu'à -30% sur les produits laitiers</h3>
            <p className="text-sm opacity-80">Yaourts, fromages, crèmes... Profitez-en avant dimanche !</p>
          </div>
          <button
            onClick={() => setSelectedCategory('cremerie')}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shrink-0"
          >
            En profiter <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Nos rayons</h3>
          <button onClick={() => { setSelectedCategory(null); setCurrentPage('catalog') }} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Tout voir <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="group flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Promo products */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Percent size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Promotions</h3>
              <p className="text-sm text-gray-500">Les meilleures offres du moment</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {promoProducts.slice(0, 10).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Les mieux notés</h3>
              <p className="text-sm text-gray-500">Plébiscités par nos clients</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Bio section */}
      <section className="max-w-7xl mx-auto px-4 mt-12 mb-12">
        <div className="bg-green-50 rounded-2xl p-6 md:p-8 border border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <Leaf size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Rayon Bio & Bien-être</h3>
                <p className="text-sm text-gray-600">Plus de 500 références bio certifiées</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory('bio')}
              className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              Découvrir <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
