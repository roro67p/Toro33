// ── Navigation entre pages ──────────────────────────────
function showPage(name) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });

    document.getElementById('page-' + name).classList.add('active');
    var btns = document.querySelectorAll('.nav-btn');
    var map = { menus: 0, evenements: 1, surprises: 2 };
    if (btns[map[name]]) btns[map[name]].classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Onglets menus ────────────────────────────────────────
function showTab(tabId, btn) {
    var container = btn.closest('.tabs-container');
    container.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    container.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

// ── Événements : afficher détail ────────────────────────
function showEvent(slug) {
    document.querySelectorAll('.events-grid').forEach(function(g) { g.style.display = 'none'; });
    document.querySelectorAll('.event-detail').forEach(function(d) { d.style.display = 'none'; });
    var detail = document.getElementById('event-' + slug);
    if (detail) {
        detail.style.display = 'block';
        detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function closeEvent(slug) {
    document.getElementById('event-' + slug).style.display = 'none';
    document.querySelectorAll('.events-grid').forEach(function(g) { g.style.display = ''; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
