import { useState } from 'react'
import { Heart, Star, Award, Users, ChefHat, MapPin } from 'lucide-react'

const TIMELINE = [
  {
    year: '2008',
    icon: '🏠',
    title: 'Les débuts — la cuisine de maman',
    text: 'Tout commence dans la cuisine familiale de Romuald, 19 ans. Sa mère lui apprend les bases : la sauce secrète, le pain brioché maison, et surtout — l\'amour du bon produit. Les voisins sonnent à la porte pour goûter ses burgers du dimanche.',
    color: '#F59E0B',
  },
  {
    year: '2011',
    icon: '🍔',
    title: 'Le premier food truck',
    text: 'Avec 3 000€ d\'économies et un vieux camion Citroën retapé, Romuald lance son premier food truck sur le marché de la place des Tapis. La queue s\'étend jusqu\'à l\'église dès le deuxième week-end.',
    color: '#10B981',
  },
  {
    year: '2014',
    icon: '📍',
    title: 'L\'adresse fixe',
    text: 'Le food truck laisse place à un vrai restaurant, rue de la Paix. 24 couverts, une déco industrielle chaleureuse, et une ardoise qui change chaque semaine. Les critiques locaux parlent d\'eux pour la première fois.',
    color: '#818CF8',
  },
  {
    year: '2017',
    icon: '⭐',
    title: 'La consécration',
    text: 'Le Guide Lyonnais du Burger couronne Chez Romu "Meilleur burger artisanal de la région". Ce soir-là, Romuald pleure dans sa cuisine. C\'est la validation de 9 ans de travail. La liste d\'attente atteint 2 heures le week-end.',
    color: '#E11D48',
  },
  {
    year: '2020',
    icon: '💪',
    title: 'La résilience',
    text: 'Comme tout le monde, Chez Romu traverse la crise. Mais l\'équipe innove : click & collect, livraison à vélo, burger-kits à assembler chez soi. La communauté répond présente. On survit. On grandit même.',
    color: '#06B6D4',
  },
  {
    year: '2023',
    icon: '🚀',
    title: 'La nouvelle ère',
    text: 'Rénovation complète, menu digital, programme fidélité, et l\'arrivée du légendaire Romu Burger — rillettes maison, sardines de l\'Atlantique et gratin dauphinois. Une recette folle qui divise... et qui conquiert. Aujourd\'hui, c\'est notre plat signature.',
    color: '#F59E0B',
  },
]

const VALUES = [
  { icon: '🥩', title: 'Produits locaux', text: 'Viande du Beaujolais, légumes du marché Saint-Antoine, pain de la boulangerie Dupuis à 200m d\'ici.' },
  { icon: '👨‍🍳', title: 'Tout fait maison', text: 'Sauces, pickles, mayo, ketchup — rien ne vient d\'une usine. Chaque préparation est faite le matin même.' },
  { icon: '❤️', title: 'Une vraie équipe', text: '11 personnes, certaines là depuis le début. Chez Romu c\'est une famille avant d\'être un restaurant.' },
  { icon: '🌱', title: 'Engagé durable', text: 'Emballages compostables, invendus donnés à l\'association Resto du Cœur chaque soir, zéro plastique à usage unique.' },
]

export default function NotrHistoire() {
  const [activeYear, setActiveYear] = useState(null)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', paddingBottom: '60px' }}>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #1a0a00 0%, #0F172A 50%, #1a0812 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, #F59E0B22 0%, transparent 60%), radial-gradient(circle at 80% 50%, #E11D4822 0%, transparent 60%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', backgroundColor: '#422006', marginBottom: '20px' }}>
            <Heart size={13} color="#F59E0B" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#F59E0B' }}>Notre Histoire</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: 'white', margin: '0 0 16px', lineHeight: 1.1 }}>
            De la cuisine de maman<br />
            <span style={{ color: '#E11D48' }}>au restaurant du quartier</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
            Chez Romu, c'est 15 ans de passion, de galères surmontées, et d'une obsession simple : vous faire le meilleur burger que vous ayez jamais mangé.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', flexWrap: 'wrap' }}>
            {[['15', 'ans d\'histoire'], ['11', 'personnes formidables'], ['+200', 'burgers/jour'], ['1', 'recette secrète']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#E11D48' }}>{n}</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

        {/* Timeline */}
        <div style={{ marginTop: '60px', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '8px', textAlign: 'center' }}>Notre parcours</h2>
          <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px', marginBottom: '40px' }}>Cliquez sur une année pour en savoir plus</p>

          <div style={{ position: 'relative' }}>
            {/* Ligne verticale */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', backgroundColor: '#1F2937', transform: 'translateX(-50%)' }} />

            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0
              const isActive = activeYear === item.year
              return (
                <div key={item.year} style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', marginBottom: '32px', position: 'relative' }}>
                  {/* Dot central */}
                  <div
                    onClick={() => setActiveYear(isActive ? null : item.year)}
                    style={{
                      position: 'absolute', left: '50%', top: '24px', transform: 'translate(-50%, -50%)',
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: isActive ? item.color : '#1F2937',
                      border: `2px solid ${item.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', cursor: 'pointer', zIndex: 2,
                      boxShadow: isActive ? `0 0 20px ${item.color}66` : 'none',
                      transition: 'all 0.3s ease',
                    }}>
                    {item.icon}
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setActiveYear(isActive ? null : item.year)}
                    style={{
                      width: 'calc(50% - 40px)',
                      marginLeft: isLeft ? 0 : undefined,
                      marginRight: isLeft ? undefined : 0,
                      backgroundColor: '#1F2937',
                      borderRadius: '16px',
                      border: `1px solid ${isActive ? item.color : '#374151'}`,
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? `0 0 30px ${item.color}33` : 'none',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '22px', fontWeight: 900, color: item.color }}>{item.year}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: isActive ? '10px' : 0 }}>{item.title}</div>
                    {isActive && (
                      <div style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6, borderTop: `1px solid ${item.color}44`, paddingTop: '10px', marginTop: '4px' }}>
                        {item.text}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Romuald */}
        <div style={{ backgroundColor: '#1F2937', borderRadius: '20px', border: '1px solid #374151', padding: '36px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0 }}>
              👨‍🍳
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '11px', color: '#E11D48', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Le fondateur</div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: '0 0 12px' }}>Romuald Chassagne</h3>
              <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7, margin: 0 }}>
                "J'ai grandi dans une famille où la table était sacrée. Mon grand-père était boucher, ma mère cuisinait à merveille. Le burger pour moi, c'est pas du fast-food — c'est de la gastronomie populaire. Un plat qu'on mange avec les mains mais qu'on prépare avec autant de soin qu'un plat étoilé."
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['Beaujolais de naissance', 'Autodidacte', '15 ans de métier'].map(tag => (
                  <span key={tag} style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: '#111827', border: '1px solid #374151', fontSize: '12px', color: '#9CA3AF' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Valeurs */}
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '20px', textAlign: 'center' }}>Nos valeurs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {VALUES.map(v => (
            <div key={v.title} style={{ backgroundColor: '#1F2937', borderRadius: '16px', border: '1px solid #374151', padding: '20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{v.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{v.title}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.6 }}>{v.text}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1F2937', borderRadius: '20px', border: '1px solid #374151' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍔</div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>L'histoire continue avec vous</h3>
          <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>Chaque burger commandé fait partie de cette aventure.</p>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>Merci d'être là. 🙏</p>
        </div>
      </div>
    </div>
  )
}
