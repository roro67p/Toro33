// ── Navigation entre pages ──────────────────────────────
var PAGE_MAP = { menus:0, evenements:1, surprises:2, ardoise:3, galerie:4, livreor:5, trouver:6 };

function showPage(name) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById('page-' + name).classList.add('active');
    var btns = document.querySelectorAll('.nav-btn');
    if (btns[PAGE_MAP[name]] !== undefined) btns[PAGE_MAP[name]].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (name === 'ardoise') loadArdoiseSite();
    if (name === 'galerie') renderGalerie();
    if (name === 'livreor') renderLivreOr();
}

// ── Onglets menus ────────────────────────────────────────
function showTab(tabId, btn) {
    var container = btn.closest('.tabs-container');
    container.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    container.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

// ── Événements ───────────────────────────────────────────
function showEvent(slug) {
    document.querySelectorAll('.events-grid').forEach(function(g) { g.style.display = 'none'; });
    document.querySelectorAll('.event-detail').forEach(function(d) { d.style.display = 'none'; });
    var detail = document.getElementById('event-' + slug);
    if (detail) { detail.style.display = 'block'; detail.scrollIntoView({ behavior:'smooth', block:'start' }); }
}
function closeEvent(slug) {
    document.getElementById('event-' + slug).style.display = 'none';
    document.querySelectorAll('.events-grid').forEach(function(g) { g.style.display = ''; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════
//  ARDOISE DU JOUR
// ════════════════════════════════════════════════
function loadArdoiseSite() {
    var el = document.getElementById('ardoise-site-content');
    if (!el) return;
    var data = {};
    try { var v = localStorage.getItem('romu_ardoise'); if (v) data = JSON.parse(v); } catch(e) {}

    var today = new Date().toISOString().slice(0,10);
    var isToday = data.date === today;

    if (!data.plat && !data.entree && !data.dessert) {
        el.innerHTML = '<div class="ardoise-empty"><div style="font-size:3rem">🍽️</div><p>L\'ardoise du jour n\'est pas encore disponible.</p><p style="font-size:0.9rem;opacity:0.6">Revenez un peu plus tard, le chef est en cuisine !</p></div>';
        return;
    }
    el.innerHTML =
        '<div class="ardoise-display">' +
        '<div class="ardoise-display-header">' +
            '<div class="ardoise-chalk-title">Ardoise du jour</div>' +
            (isToday ? '<div class="ardoise-today-badge">Aujourd\'hui</div>' : '') +
        '</div>' +
        (data.entree  ? '<div class="ardoise-line"><span class="ardoise-course">Entrée</span><span class="ardoise-dish">' + data.entree  + '</span></div>' : '') +
        (data.plat    ? '<div class="ardoise-line"><span class="ardoise-course">Plat</span><span class="ardoise-dish">'   + data.plat    + '</span></div>' : '') +
        (data.dessert ? '<div class="ardoise-line"><span class="ardoise-course">Dessert</span><span class="ardoise-dish">'+ data.dessert + '</span></div>' : '') +
        (data.prix    ? '<div class="ardoise-prix">' + data.prix + '€</div>' : '') +
        (data.message ? '<div class="ardoise-chef-msg">💬 ' + data.message + '</div>' : '') +
        '</div>';
}

// ════════════════════════════════════════════════
//  GALERIE
// ════════════════════════════════════════════════
var GALERIE_ITEMS = [
    { cat:'plats',    img:'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=500&q=80', titre:'Côte de bœuf Wagyu', desc:'La pièce maîtresse du Menu Wow' },
    { cat:'plats',    img:'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80', titre:'Dos de cabillaud', desc:'Croustillant, fondant, parfait' },
    { cat:'plats',    img:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80', titre:'Fondant au chocolat', desc:'Le cœur coulant qui fait soupirer' },
    { cat:'plats',    img:'https://images.unsplash.com/photo-1525164286253-04e68b9d94c6?w=500&q=80', titre:'Homard thermidor', desc:'Pour les grandes occasions' },
    { cat:'plats',    img:'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80', titre:'Carpaccio de bœuf', desc:'Finesse et fraîcheur' },
    { cat:'plats',    img:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80', titre:'Paris-Brest revisité', desc:'Praliné noisette, caramel' },
    { cat:'soirees',  img:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80', titre:'Soirée Match', desc:'Quand le foot s\'invite au bistrot' },
    { cat:'soirees',  img:'https://images.unsplash.com/photo-1571266028243-d220c6a7a0cf?w=500&q=80', titre:'Soirée Disco', desc:'Les 70s sont de retour' },
    { cat:'soirees',  img:'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=500&q=80', titre:'Soirée Bowling', desc:'Strike & dîner, la formule gagnante' },
    { cat:'soirees',  img:'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&q=80', titre:'Soirée Madame Pedrosa', desc:'Une soirée comme elle seule sait les faire' },
    { cat:'ambiance', img:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80', titre:'La cave à vins', desc:'Nos sélections confidentielles' },
    { cat:'ambiance', img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', titre:'En salle', desc:'L\'atmosphère chaleureuse de Chez Romu' },
    { cat:'ambiance', img:'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80', titre:'En cuisine', desc:'Romu aux commandes' },
    { cat:'ambiance', img:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80', titre:'La terrasse', desc:'Les beaux soirs d\'été' },
];

var currentGalerieFilter = 'tous';

function filterGalerie(cat, btn) {
    currentGalerieFilter = cat;
    document.querySelectorAll('.gal-filter').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderGalerie();
}

function renderGalerie() {
    var grid = document.getElementById('galerie-grid');
    if (!grid) return;
    var items = currentGalerieFilter === 'tous'
        ? GALERIE_ITEMS
        : GALERIE_ITEMS.filter(function(i) { return i.cat === currentGalerieFilter; });
    grid.innerHTML = items.map(function(item) {
        return '<div class="gal-item gal-' + item.cat + '" onclick="openLightbox(\'' + item.img + '\', \'' + item.titre.replace(/'/g,"\\'") + '\', \'' + item.desc.replace(/'/g,"\\'") + '\')">' +
            '<div class="gal-photo">' +
                '<img src="' + item.img + '" alt="' + item.titre + '" loading="lazy">' +
                '<div class="gal-overlay"><span>🔍</span></div>' +
            '</div>' +
            '<div class="gal-info">' +
                '<div class="gal-titre">' + item.titre + '</div>' +
                '<div class="gal-desc">' + item.desc + '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function openLightbox(img, titre, desc) {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    document.getElementById('lb-img').src = img;
    document.getElementById('lb-titre').textContent = titre;
    document.getElementById('lb-desc').textContent = desc;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = '';
}

// ════════════════════════════════════════════════
//  LIVRE D'OR
// ════════════════════════════════════════════════
var lorStars = 5;

function setStars(n) {
    lorStars = n;
    document.querySelectorAll('#lor-stars span').forEach(function(s, i) {
        s.style.color = i < n ? '#C9A84C' : '#ddd';
    });
}

function submitLivreOr() {
    var nom = document.getElementById('lor-nom').value.trim();
    var msg = document.getElementById('lor-message').value.trim();
    if (!nom || !msg) { alert('Merci de remplir votre prénom et votre message !'); return; }
    var messages = [];
    try { var v = localStorage.getItem('romu_livreor'); if (v) messages = JSON.parse(v); } catch(e) {}
    messages.unshift({
        nom: nom,
        msg: msg,
        stars: lorStars,
        date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }),
    });
    try { localStorage.setItem('romu_livreor', JSON.stringify(messages)); } catch(e) {}
    document.getElementById('lor-nom').value = '';
    document.getElementById('lor-message').value = '';
    setStars(5);
    renderLivreOr();
}

function renderLivreOr() {
    var el = document.getElementById('livreor-messages');
    if (!el) return;
    var messages = [];
    try { var v = localStorage.getItem('romu_livreor'); if (v) messages = JSON.parse(v); } catch(e) {}

    // Ajouter quelques messages par défaut si vide
    if (!messages.length) {
        messages = [
            { nom:'Sophie M.', msg:'Une soirée disco inoubliable ! La nourriture était à la hauteur de l\'ambiance — et c\'est dire.', stars:5, date:'15 mars 2024' },
            { nom:'Pierre & Lucie', msg:'On revient tous les mois depuis 3 ans. Chez Romu, c\'est notre adresse secrète préférée.', stars:5, date:'2 mars 2024' },
            { nom:'Jean-Claude', msg:'Le menu surprise m\'a bluffé. J\'aurais jamais commandé ce plat moi-même, et c\'était le meilleur de ma vie.', stars:5, date:'18 février 2024' },
            { nom:'Famille Dubois', msg:'Anniversaire de mariage fêté ici. Romu nous a réservé une surprise… on n\'en dit pas plus 😊', stars:5, date:'5 février 2024' },
        ];
    }

    el.innerHTML = messages.map(function(m) {
        var stars = '';
        for (var i = 0; i < 5; i++) stars += '<span style="color:' + (i < m.stars ? '#C9A84C' : '#ddd') + '">★</span>';
        return '<div class="lor-card">' +
            '<div class="lor-card-header">' +
                '<div class="lor-avatar">' + m.nom.charAt(0).toUpperCase() + '</div>' +
                '<div><div class="lor-nom">' + m.nom + '</div><div class="lor-stars-display">' + stars + '</div></div>' +
                '<div class="lor-date">' + m.date + '</div>' +
            '</div>' +
            '<p class="lor-text">' + m.msg + '</p>' +
        '</div>';
    }).join('');
}

// ── Easter egg Cmd+K ────────────────────────────────────
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        var msgs = [
            "🤫 Psst… demandez la table du fond ce soir.",
            "🍷 Le Pomerol 2018 n'est pas sur la carte. Mais il est là.",
            "🧑‍🍳 Le chef est de bonne humeur aujourd'hui. Osez demander.",
            "🎲 Menu Surprise ce soir : le chef a cuisiné son plat préféré.",
            "✨ La soirée Madame Pedrosa approche… tendez l'oreille.",
        ];
        var msg = msgs[Math.floor(Math.random() * msgs.length)];
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#3D2B1F;color:#F5E6B8;padding:1rem 1.5rem;border-radius:12px;font-size:0.95rem;box-shadow:0 8px 30px rgba(0,0,0,0.3);z-index:9999;max-width:300px;line-height:1.5;border-left:4px solid #C9A84C;';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function() {
            toast.style.transition = 'opacity 0.5s';
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 500);
        }, 4000);
    }
});

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    setStars(5);
    renderGalerie();
    renderLivreOr();
});
