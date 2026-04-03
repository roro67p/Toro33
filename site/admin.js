// ═══════════════════════════════════════════════
//  CHEZ ROMU — Espace Pro (admin.js)
//  Données stockées dans localStorage
// ═══════════════════════════════════════════════

// ── Données par défaut ──────────────────────────
var defaultMenus = {
    gourmand: {
        nom: "Menu Gourmand", prix: 35, emoji: "🍽️",
        items: [
            { cat: "Entrée", nom: "Velouté de potimarron" },
            { cat: "Entrée", nom: "Terrine de campagne maison" },
            { cat: "Entrée", nom: "Carpaccio de bœuf" },
            { cat: "Plat",   nom: "Filet de bœuf sauce bordelaise" },
            { cat: "Plat",   nom: "Dos de cabillaud en croûte d'herbes" },
            { cat: "Plat",   nom: "Risotto aux cèpes et truffe" },
            { cat: "Dessert",nom: "Fondant au chocolat" },
            { cat: "Dessert",nom: "Crème brûlée à la vanille" },
            { cat: "Dessert",nom: "Tarte tatin" },
        ]
    },
    surprise: {
        nom: "Menu Surprise", prix: 28, emoji: "🎲",
        items: [
            { cat: "Entrée", nom: "???" },
            { cat: "Plat",   nom: "???" },
            { cat: "Dessert",nom: "???" },
        ]
    },
    wow: {
        nom: "Menu Wow", prix: 55, emoji: "🤩",
        items: [
            { cat: "Entrée", nom: "Foie gras poêlé" },
            { cat: "Entrée", nom: "Huîtres Gillardeau N°3" },
            { cat: "Entrée", nom: "Tartare de thon rouge" },
            { cat: "Plat",   nom: "Homard thermidor" },
            { cat: "Plat",   nom: "Côte de bœuf Wagyu" },
            { cat: "Plat",   nom: "Saint-Jacques poêlées" },
            { cat: "Dessert",nom: "Soufflé au Grand Marnier" },
            { cat: "Dessert",nom: "Chariot de fromages affinés" },
            { cat: "Dessert",nom: "Paris-Brest revisité" },
        ]
    }
};

var defaultStock = [
    { id: 1, nom: "Beurre", cat: "Produits laitiers", qte: 8, unit: "kg", seuil: 2 },
    { id: 2, nom: "Filet de bœuf", cat: "Viandes", qte: 3, unit: "kg", seuil: 2 },
    { id: 3, nom: "Vin rouge maison", cat: "Boissons", qte: 24, unit: "bouteilles", seuil: 6 },
    { id: 4, nom: "Vin blanc maison", cat: "Boissons", qte: 12, unit: "bouteilles", seuil: 6 },
    { id: 5, nom: "Bières artisanales", cat: "Boissons", qte: 1, unit: "boîtes", seuil: 3 },
    { id: 6, nom: "Crème fraîche", cat: "Produits laitiers", qte: 5, unit: "kg", seuil: 2 },
    { id: 7, nom: "Cabillaud", cat: "Poissons", qte: 2, unit: "kg", seuil: 1 },
];

var defaultEvents = [
    { id: 1, nom: "Soirée Match — Ligue des Champions", date: todayStr(3), heure: "20:45", capa: 40, desc: "Grand match européen, réservation recommandée." },
    { id: 2, nom: "Soirée Bowling", date: todayStr(5), heure: "19:00", capa: 20, desc: "Départ du restaurant, 2 parties incluses + dîner." },
];

function todayStr(offset) {
    var d = new Date();
    d.setDate(d.getDate() + (offset || 0));
    return d.toISOString().slice(0, 10);
}

// ── Storage helpers ─────────────────────────────
function load(key, def) {
    try { var v = localStorage.getItem('romu_' + key); return v ? JSON.parse(v) : def; }
    catch(e) { return def; }
}
function save(key, val) {
    try { localStorage.setItem('romu_' + key, JSON.stringify(val)); } catch(e) {}
}

// ── State ───────────────────────────────────────
var commandes    = load('commandes', []);
var reservations = load('reservations', []);
var menus        = load('menus', defaultMenus);
var stock        = load('stock', defaultStock);
var events       = load('events', defaultEvents);
var nextCmdId    = load('nextCmdId', 1);
var nextResaId   = load('nextResaId', 1);
var nextStockId  = load('nextStockId', 100);
var nextEvtId    = load('nextEvtId', 10);

// ── Init ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Date
    var now = new Date();
    document.getElementById('adminDate').textContent =
        now.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

    // Date par défaut réservation
    document.getElementById('resa-date').value = todayStr();
    document.getElementById('filter-date-resa').value = todayStr();

    // Charger les notes
    ['note-jour','note-courses','note-messages','note-objectifs'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = load(id, '');
    });
    var cdn = document.getElementById('chef-note-dash');
    if (cdn) cdn.value = load('note-jour', '');

    // Planning semaine courante
    var ps = document.getElementById('planning-semaine');
    if (ps) ps.value = todayStr();

    renderAll();
});

function renderAll() {
    updateStats();
    renderDashCommandes();
    renderDashResa();
    renderCommandes();
    renderReservations();
    renderMenus();
    renderStock();
    renderEvents();
    loadArdoise();
    renderPlanning();
    renderStats('semaine');
}

// ── Navigation ──────────────────────────────────
var sectionTitles = {
    dashboard: '📊 Tableau de bord',
    commandes: '📋 Commandes',
    reservations: '🗓️ Réservations',
    menus: '🍴 Menus',
    evenements: '🎉 Événements',
    ardoise: '🍽️ Ardoise du jour',
    planning: '👨‍🍳 Planning staff',
    stats: '📈 Statistiques',
    stock: '📦 Stock & Boissons',
    notes: '📝 Notes du chef',
};

function showSection(name) {
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.snav-btn').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById('section-' + name).classList.add('active');
    document.getElementById('sectionTitle').textContent = sectionTitles[name] || name;
    var btns = document.querySelectorAll('.snav-btn');
    var idx = Object.keys(sectionTitles).indexOf(name);
    if (btns[idx]) btns[idx].classList.add('active');
    // close sidebar on mobile
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ── Stats ───────────────────────────────────────
function updateStats() {
    var today = todayStr();
    var todayCmds = commandes.filter(function(c) { return c.date === today; });
    var todayResa = reservations.filter(function(r) { return r.date === today; });
    var couverts  = todayResa.reduce(function(a, r) { return a + (parseInt(r.pers) || 0); }, 0);
    var ca        = todayCmds.reduce(function(a, c) { return a + (parseFloat(c.total) || 0); }, 0);

    document.getElementById('stat-commandes').textContent   = todayCmds.length;
    document.getElementById('stat-reservations').textContent = todayResa.length;
    document.getElementById('stat-couverts').textContent    = couverts;
    document.getElementById('stat-ca').textContent          = ca.toFixed(0) + '€';
}

// ── Dashboard mini-lists ────────────────────────
function renderDashCommandes() {
    var el = document.getElementById('dash-commandes-list');
    var recent = commandes.slice(-4).reverse();
    if (!recent.length) { el.innerHTML = '<div class="mini-empty">Aucune commande aujourd\'hui</div>'; return; }
    el.innerHTML = recent.map(function(c) {
        return '<div class="mini-item"><span>Table ' + c.table + ' — ' + c.menus + '</span><span>' + statusBadge(c.statut) + '</span></div>';
    }).join('');
}

function renderDashResa() {
    var el = document.getElementById('dash-resa-list');
    var today = document.getElementById('filter-date-resa').value || todayStr();
    var list = reservations.filter(function(r) { return r.date === today; }).slice(0, 4);
    if (!list.length) { el.innerHTML = '<div class="mini-empty">Aucune réservation ce soir</div>'; return; }
    el.innerHTML = list.map(function(r) {
        return '<div class="mini-item"><span>' + r.nom + ' — ' + r.pers + ' pers. à ' + r.heure + '</span><span>' + statusBadge(r.statut) + '</span></div>';
    }).join('');
}

// ── Commandes ───────────────────────────────────
function renderCommandes() {
    var filter = document.getElementById('filter-commandes').value;
    var list = filter === 'all' ? commandes : commandes.filter(function(c) { return c.statut === filter; });
    var tbody = document.getElementById('commandes-tbody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#999;font-style:italic">Aucune commande</td></tr>';
        return;
    }
    tbody.innerHTML = list.slice().reverse().map(function(c) {
        return '<tr>' +
            '<td><strong>Table ' + c.table + '</strong></td>' +
            '<td>' + c.menus + '</td>' +
            '<td>' + c.pers + '</td>' +
            '<td><strong>' + (c.total || '—') + '€</strong></td>' +
            '<td>' + statusBadge(c.statut) + '</td>' +
            '<td>' + c.heure + '</td>' +
            '<td><div class="action-btns">' +
                statBtn(c.id, 'commande') +
                '<button class="btn-icon danger" onclick="deleteItem(\'commande\',' + c.id + ')">🗑️</button>' +
            '</div></td>' +
        '</tr>';
    }).join('');
}

function statBtn(id, type) {
    var statuts = type === 'commande'
        ? ['en_cours','servie','payee']
        : ['attente','confirmee','annulee'];
    return '<button class="btn-icon" onclick="cycleStatus(\'' + type + '\',' + id + ')" title="Changer statut">🔄</button>';
}

function cycleStatus(type, id) {
    if (type === 'commande') {
        var ordre = ['en_cours','servie','payee'];
        var c = commandes.find(function(x) { return x.id === id; });
        if (!c) return;
        c.statut = ordre[(ordre.indexOf(c.statut) + 1) % ordre.length];
        save('commandes', commandes);
    } else {
        var ordre2 = ['attente','confirmee','annulee'];
        var r = reservations.find(function(x) { return x.id === id; });
        if (!r) return;
        r.statut = ordre2[(ordre2.indexOf(r.statut) + 1) % ordre2.length];
        save('reservations', reservations);
    }
    renderAll();
    toast('Statut mis à jour ✓');
}

function deleteItem(type, id) {
    if (!confirm('Supprimer cet élément ?')) return;
    if (type === 'commande') {
        commandes = commandes.filter(function(c) { return c.id !== id; });
        save('commandes', commandes);
    } else if (type === 'reservation') {
        reservations = reservations.filter(function(r) { return r.id !== id; });
        save('reservations', reservations);
    } else if (type === 'stock') {
        stock = stock.filter(function(s) { return s.id !== id; });
        save('stock', stock);
    } else if (type === 'event') {
        events = events.filter(function(e) { return e.id !== id; });
        save('events', events);
    }
    renderAll();
    toast('Supprimé ✓');
}

function openCommandeModal(id) {
    document.getElementById('cmd-table').value = '';
    document.getElementById('cmd-pers').value = '';
    document.getElementById('cmd-extras').value = '';
    document.getElementById('cmd-total').value = '';
    document.getElementById('cmd-note').value = '';
    document.querySelectorAll('.cmd-menu').forEach(function(cb) { cb.checked = false; });
    document.getElementById('modal-commande').style.display = 'flex';
}

function saveCommande() {
    var table = document.getElementById('cmd-table').value.trim();
    if (!table) { toast('⚠️ Numéro de table requis'); return; }
    var selected = [];
    document.querySelectorAll('.cmd-menu:checked').forEach(function(cb) { selected.push(cb.value); });
    var c = {
        id: nextCmdId++,
        table: table,
        pers: document.getElementById('cmd-pers').value || '?',
        menus: selected.length ? selected.join(', ') : document.getElementById('cmd-extras').value || '—',
        total: document.getElementById('cmd-total').value || 0,
        note: document.getElementById('cmd-note').value,
        statut: 'en_cours',
        date: todayStr(),
        heure: new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }),
    };
    commandes.push(c);
    save('commandes', commandes);
    save('nextCmdId', nextCmdId);
    closeModal('modal-commande');
    renderAll();
    toast('✓ Commande table ' + table + ' enregistrée');
}

// ── Réservations ────────────────────────────────
function renderReservations() {
    var filterDate = document.getElementById('filter-date-resa').value;
    var list = filterDate
        ? reservations.filter(function(r) { return r.date === filterDate; })
        : reservations;
    var tbody = document.getElementById('reservations-tbody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:#999;font-style:italic">Aucune réservation</td></tr>';
        return;
    }
    tbody.innerHTML = list.slice().sort(function(a,b) { return a.heure.localeCompare(b.heure); }).map(function(r) {
        return '<tr>' +
            '<td><strong>' + r.nom + '</strong></td>' +
            '<td>' + r.pers + ' pers.</td>' +
            '<td>' + formatDate(r.date) + '</td>' +
            '<td>' + r.heure + '</td>' +
            '<td>' + (r.tel || '—') + '</td>' +
            '<td>' + (r.note || '—') + '</td>' +
            '<td>' + statusBadge(r.statut) + '</td>' +
            '<td><div class="action-btns">' +
                statBtn(r.id, 'reservation') +
                '<button class="btn-icon danger" onclick="deleteItem(\'reservation\',' + r.id + ')">🗑️</button>' +
            '</div></td>' +
        '</tr>';
    }).join('');
}

function openResaModal() {
    document.getElementById('resa-nom').value = '';
    document.getElementById('resa-tel').value = '';
    document.getElementById('resa-date').value = todayStr();
    document.getElementById('resa-heure').value = '19:30';
    document.getElementById('resa-pers').value = '';
    document.getElementById('resa-note').value = '';
    document.getElementById('modal-resa').style.display = 'flex';
}

function saveReservation() {
    var nom = document.getElementById('resa-nom').value.trim();
    if (!nom) { toast('⚠️ Nom du client requis'); return; }
    var r = {
        id: nextResaId++,
        nom: nom,
        tel: document.getElementById('resa-tel').value,
        date: document.getElementById('resa-date').value,
        heure: document.getElementById('resa-heure').value,
        pers: document.getElementById('resa-pers').value || 2,
        note: document.getElementById('resa-note').value,
        statut: 'confirmee',
    };
    reservations.push(r);
    save('reservations', reservations);
    save('nextResaId', nextResaId);
    closeModal('modal-resa');
    renderAll();
    toast('✓ Réservation de ' + nom + ' enregistrée');
}

// ── Menus ───────────────────────────────────────
function renderMenus() {
    var grid = document.getElementById('menus-admin-grid');
    grid.innerHTML = Object.keys(menus).map(function(key) {
        var m = menus[key];
        return '<div class="menu-admin-card">' +
            '<div class="menu-admin-card-header">' +
                '<h3>' + m.emoji + ' ' + m.nom + '</h3>' +
                '<input type="number" class="menu-price-input" value="' + m.prix + '" onchange="updateMenuPrice(\'' + key + '\', this.value)" title="Prix"> €' +
            '</div>' +
            '<div class="menu-admin-body">' +
                '<div class="menu-admin-items">' +
                m.items.map(function(item, i) {
                    return '<div class="menu-item-row">' +
                        '<span class="item-cat">' + item.cat + '</span>' +
                        '<input type="text" value="' + item.nom + '" onchange="updateMenuItem(\'' + key + '\',' + i + ', this.value)">' +
                    '</div>';
                }).join('') +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function updateMenuPrice(key, val) {
    menus[key].prix = parseFloat(val) || menus[key].prix;
    save('menus', menus);
    toast('Prix mis à jour ✓');
}

function updateMenuItem(key, idx, val) {
    menus[key].items[idx].nom = val;
    save('menus', menus);
    toast('Menu mis à jour ✓');
}

// ── Stock ───────────────────────────────────────
function renderStock() {
    var tbody = document.getElementById('stock-tbody');
    if (!stock.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#999">Aucun article</td></tr>';
        return;
    }
    tbody.innerHTML = stock.map(function(s) {
        var etat = s.qte <= 0 ? 'rupture' : s.qte <= s.seuil ? 'low' : 'ok';
        var etatLabel = etat === 'rupture' ? '🔴 Rupture' : etat === 'low' ? '🟠 Stock faible' : '🟢 OK';
        return '<tr>' +
            '<td><strong>' + s.nom + '</strong></td>' +
            '<td>' + s.cat + '</td>' +
            '<td><input type="number" value="' + s.qte + '" min="0" style="width:60px;border:1px solid #ddd;border-radius:6px;padding:3px 6px;font-size:0.88rem" onchange="updateQte(' + s.id + ', this.value)"></td>' +
            '<td>' + s.unit + '</td>' +
            '<td>' + s.seuil + '</td>' +
            '<td><span class="badge badge-' + etat + '">' + etatLabel + '</span></td>' +
            '<td><button class="btn-icon danger" onclick="deleteItem(\'stock\',' + s.id + ')">🗑️</button></td>' +
        '</tr>';
    }).join('');
}

function updateQte(id, val) {
    var item = stock.find(function(s) { return s.id === id; });
    if (item) { item.qte = parseFloat(val) || 0; save('stock', stock); renderStock(); toast('Stock mis à jour ✓'); }
}

function openStockModal() { document.getElementById('modal-stock').style.display = 'flex'; }

function saveStock() {
    var nom = document.getElementById('stock-nom').value.trim();
    if (!nom) { toast('⚠️ Nom de l\'article requis'); return; }
    stock.push({
        id: nextStockId++,
        nom: nom,
        cat: document.getElementById('stock-cat').value,
        qte: parseFloat(document.getElementById('stock-qte').value) || 0,
        unit: document.getElementById('stock-unit').value,
        seuil: parseFloat(document.getElementById('stock-seuil').value) || 0,
    });
    save('stock', stock);
    save('nextStockId', nextStockId);
    document.getElementById('stock-nom').value = '';
    document.getElementById('stock-qte').value = '';
    closeModal('modal-stock');
    renderStock();
    toast('✓ Article ajouté');
}

// ── Événements ──────────────────────────────────
function renderEvents() {
    var grid = document.getElementById('events-admin-grid');
    if (!events.length) {
        grid.innerHTML = '<p style="color:#999;font-style:italic">Aucun événement programmé.</p>';
        return;
    }
    grid.innerHTML = events.map(function(e) {
        return '<div class="event-admin-card">' +
            '<h3>🎉 ' + e.nom + '</h3>' +
            '<div class="event-admin-meta">📅 ' + formatDate(e.date) + ' à ' + e.heure + ' · Capacité : ' + (e.capa || '?') + ' pers.</div>' +
            '<p class="event-admin-desc">' + (e.desc || '') + '</p>' +
            '<div class="event-admin-footer">' +
                '<button class="btn-icon danger" onclick="deleteItem(\'event\',' + e.id + ')">🗑️ Supprimer</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function openEvtModal() {
    document.getElementById('evt-nom').value = '';
    document.getElementById('evt-date').value = todayStr();
    document.getElementById('evt-heure').value = '19:00';
    document.getElementById('evt-capa').value = '';
    document.getElementById('evt-desc').value = '';
    document.getElementById('modal-evt').style.display = 'flex';
}

function saveEvt() {
    var nom = document.getElementById('evt-nom').value.trim();
    if (!nom) { toast('⚠️ Nom de l\'événement requis'); return; }
    events.push({
        id: nextEvtId++,
        nom: nom,
        date: document.getElementById('evt-date').value,
        heure: document.getElementById('evt-heure').value,
        capa: document.getElementById('evt-capa').value,
        desc: document.getElementById('evt-desc').value,
    });
    save('events', events);
    save('nextEvtId', nextEvtId);
    closeModal('modal-evt');
    renderEvents();
    toast('✓ Événement créé');
}

// ── Notes ───────────────────────────────────────
function saveNote(id) {
    var el = document.getElementById(id);
    if (el) save(id, el.value);
}
function saveChefNote() {
    var el = document.getElementById('chef-note-dash');
    if (el) {
        save('note-jour', el.value);
        var noteJour = document.getElementById('note-jour');
        if (noteJour) noteJour.value = el.value;
    }
}

// ── Modals ──────────────────────────────────────
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
});

// ── Export ──────────────────────────────────────
function exportData() {
    var data = {
        commandes: commandes,
        reservations: reservations,
        stock: stock,
        events: events,
        exportDate: new Date().toISOString(),
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chez-romu-export-' + todayStr() + '.json';
    a.click();
    toast('✓ Export téléchargé');
}

// ── Helpers ─────────────────────────────────────
function statusBadge(statut) {
    var labels = {
        en_cours: 'En cours', servie: 'Servie', payee: 'Payée',
        confirmee: 'Confirmée', annulee: 'Annulée', attente: 'En attente',
    };
    return '<span class="badge badge-' + statut + '">' + (labels[statut] || statut) + '</span>';
}

function formatDate(str) {
    if (!str) return '—';
    var d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(toast._t);
    toast._t = setTimeout(function() { el.style.display = 'none'; }, 3000);
}

// ════════════════════════════════════════════════
//  ARDOISE DU JOUR
// ════════════════════════════════════════════════
function saveArdoise() {
    var data = {
        entree:  document.getElementById('ardoise-entree').value,
        plat:    document.getElementById('ardoise-plat').value,
        dessert: document.getElementById('ardoise-dessert').value,
        prix:    document.getElementById('ardoise-prix').value,
        message: document.getElementById('ardoise-message').value,
        date:    todayStr(),
    };
    save('ardoise', data);
    updateArdoisePreview(data);
}

function loadArdoise() {
    var data = load('ardoise', {});
    if (document.getElementById('ardoise-entree')) {
        document.getElementById('ardoise-entree').value  = data.entree  || '';
        document.getElementById('ardoise-plat').value    = data.plat    || '';
        document.getElementById('ardoise-dessert').value = data.dessert || '';
        document.getElementById('ardoise-prix').value    = data.prix    || '';
        document.getElementById('ardoise-message').value = data.message || '';
        updateArdoisePreview(data);
    }
}

function updateArdoisePreview(data) {
    var el = document.getElementById('preview-card');
    if (!el) return;
    el.innerHTML =
        '<div class="preview-date">📅 ' + formatDate(data.date || todayStr()) + '</div>' +
        (data.entree  ? '<div class="preview-row"><span class="preview-cat">Entrée</span><span>' + data.entree  + '</span></div>' : '') +
        (data.plat    ? '<div class="preview-row"><span class="preview-cat">Plat</span><span>'   + data.plat    + '</span></div>' : '') +
        (data.dessert ? '<div class="preview-row"><span class="preview-cat">Dessert</span><span>'+ data.dessert + '</span></div>' : '') +
        (data.prix    ? '<div class="preview-prix">' + data.prix + '€ / pers.</div>' : '') +
        (data.message ? '<div class="preview-message">💬 ' + data.message + '</div>' : '');
}

// ════════════════════════════════════════════════
//  PLANNING STAFF
// ════════════════════════════════════════════════
var planning = load('planning', []);
var nextPlanId = load('nextPlanId', 1);

var JOURS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
var ROLE_COLORS = {
    'Chef': '#8B1A1A',
    'Second de cuisine': '#C0392B',
    'Serveur': '#1565c0',
    'Barman': '#6a1b9a',
    'Plongeur': '#2e7d32',
    'Hôte / Hôtesse': '#e65100',
};

function renderPlanning() {
    var grid = document.getElementById('planning-grid');
    if (!grid) return;
    grid.innerHTML = JOURS.map(function(jour, idx) {
        var slots = planning.filter(function(p) { return p.jour == idx; });
        return '<div class="planning-day">' +
            '<div class="planning-day-header">' + jour + '</div>' +
            '<div class="planning-day-slots">' +
            (slots.length ? slots.map(function(s) {
                var col = ROLE_COLORS[s.role] || '#666';
                return '<div class="planning-slot" style="border-left-color:' + col + '">' +
                    '<div class="slot-name">' + s.nom + '</div>' +
                    '<div class="slot-role" style="color:' + col + '">' + s.role + '</div>' +
                    '<div class="slot-time">⏰ ' + s.debut + ' – ' + s.fin + '</div>' +
                    '<button class="slot-del" onclick="deletePlanSlot(' + s.id + ')">✕</button>' +
                '</div>';
            }).join('') : '<div class="slot-empty">—</div>') +
            '</div></div>';
    }).join('');
}

function openPlanningModal() {
    document.getElementById('planning-nom').value = '';
    document.getElementById('modal-planning').style.display = 'flex';
}

function savePlanning() {
    var nom = document.getElementById('planning-nom').value.trim();
    if (!nom) { toast('⚠️ Prénom requis'); return; }
    planning.push({
        id:    nextPlanId++,
        nom:   nom,
        role:  document.getElementById('planning-role').value,
        jour:  parseInt(document.getElementById('planning-jour').value),
        debut: document.getElementById('planning-debut').value,
        fin:   document.getElementById('planning-fin').value,
    });
    save('planning', planning);
    save('nextPlanId', nextPlanId);
    closeModal('modal-planning');
    renderPlanning();
    toast('✓ Créneau ajouté');
}

function deletePlanSlot(id) {
    planning = planning.filter(function(p) { return p.id !== id; });
    save('planning', planning);
    renderPlanning();
    toast('Créneau supprimé');
}

// ════════════════════════════════════════════════
//  STATISTIQUES
// ════════════════════════════════════════════════
function setPeriod(period, btn) {
    document.querySelectorAll('.period-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderStats(period);
}

function renderStats(period) {
    var filtered = filterByPeriod(commandes, period);

    var ca = filtered.reduce(function(a, c) { return a + (parseFloat(c.total) || 0); }, 0);
    var couverts = filtered.reduce(function(a, c) { return a + (parseInt(c.pers) || 0); }, 0);
    var panier = filtered.length ? (ca / filtered.length) : 0;

    var caEl = document.getElementById('stats-ca');
    if (caEl) {
        caEl.textContent = ca.toFixed(0) + '€';
        document.getElementById('stats-cmds').textContent = filtered.length;
        document.getElementById('stats-couverts').textContent = couverts;
        document.getElementById('stats-panier').textContent = panier.toFixed(0) + '€';
        renderBarChart('chart-menus', menuStats(filtered));
        renderBarChart('chart-ca', caByDay(filtered));
        renderBarChart('chart-resa', resaByDay(filterByPeriod(reservations, period)));
    }
}

function filterByPeriod(arr, period) {
    var now = new Date();
    return arr.filter(function(item) {
        var d = new Date(item.date + 'T00:00:00');
        if (period === 'semaine') {
            var startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            return d >= startOfWeek;
        } else if (period === 'mois') {
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        return true;
    });
}

function menuStats(cmds) {
    var counts = {};
    cmds.forEach(function(c) {
        var menus_str = c.menus || '';
        ['Gourmand','Surprise','Wow'].forEach(function(m) {
            if (menus_str.indexOf(m) !== -1) counts[m] = (counts[m] || 0) + 1;
        });
    });
    if (!Object.keys(counts).length) return [{ label: 'Aucune donnée', val: 0 }];
    return Object.keys(counts).map(function(k) { return { label: k, val: counts[k] }; });
}

function caByDay(cmds) {
    var days = {};
    cmds.forEach(function(c) {
        var d = c.date ? c.date.slice(5) : '?';
        days[d] = (days[d] || 0) + (parseFloat(c.total) || 0);
    });
    if (!Object.keys(days).length) return [{ label: 'Aucune donnée', val: 0 }];
    return Object.keys(days).sort().slice(-7).map(function(d) { return { label: d, val: days[d] }; });
}

function resaByDay(resas) {
    var days = {};
    resas.forEach(function(r) {
        var d = r.date ? r.date.slice(5) : '?';
        days[d] = (days[d] || 0) + 1;
    });
    if (!Object.keys(days).length) return [{ label: 'Aucune donnée', val: 0 }];
    return Object.keys(days).sort().slice(-7).map(function(d) { return { label: d, val: days[d] }; });
}

function renderBarChart(containerId, data) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var max = Math.max.apply(null, data.map(function(d) { return d.val; })) || 1;
    el.innerHTML = data.map(function(d) {
        var pct = Math.round((d.val / max) * 100);
        return '<div class="bar-row">' +
            '<div class="bar-label">' + d.label + '</div>' +
            '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
            '<div class="bar-val">' + (Number.isInteger(d.val) ? d.val : d.val.toFixed(0) + '€') + '</div>' +
        '</div>';
    }).join('');
}
