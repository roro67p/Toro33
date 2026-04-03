import { MapPin, Phone, Mail, Clock, Globe, Camera, MessageCircle, CreditCard, Truck, ShieldCheck, Headphones } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Top bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={20} />, title: 'Drive gratuit', desc: 'Retrait en 2h' },
              { icon: <CreditCard size={20} />, title: 'Paiement sécurisé', desc: 'CB, PayPal, Chèques' },
              { icon: <ShieldCheck size={20} />, title: 'Qualité garantie', desc: 'Satisfait ou remboursé' },
              { icon: <Headphones size={20} />, title: 'Service client', desc: 'Du lundi au samedi' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-primary">{item.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-black text-lg">F</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">FreshDrive</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Supermarché en ligne</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Votre supermarché en ligne avec retrait Drive. Plus de 10 000 produits frais, bio et de qualité au meilleur prix.
            </p>
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Globe size={16} />
              </span>
              <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Camera size={16} />
              </span>
              <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <MessageCircle size={16} />
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Nos services</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Drive & Retrait</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Livraison à domicile</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Carte de fidélité</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Promotions</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Catalogue en ligne</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Qui sommes-nous</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Nos engagements</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">CGV</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Politique de confidentialité</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Mentions légales</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-primary shrink-0" />
                15 Av. Jean Jaurès, 31000 Toulouse
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary shrink-0" />
                05 61 00 00 00
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-primary shrink-0" />
                contact@freshdrive.fr
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-primary shrink-0" />
                Lun-Sam 8h-20h, Dim 9h-13h
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; 2025 FreshDrive. Tous droits réservés.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
            <span>CB</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
