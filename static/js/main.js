// Chez Romu — main.js

document.addEventListener('DOMContentLoaded', function () {

    // ── Tabs system ──────────────────────────────────────────
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabBtns.length > 0) {
        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const target = btn.getAttribute('data-tab');

                // Deactivate all
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                tabPanels.forEach(function (p) { p.classList.remove('active'); });

                // Activate selected
                btn.classList.add('active');
                const panel = document.getElementById(target);
                if (panel) {
                    panel.classList.add('active');
                    // Scroll to top of tab container smoothly
                    panel.closest('.tabs-container').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });

        // Check URL hash to auto-activate a tab
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const targetBtn = document.querySelector('.tab-btn[data-tab="' + hash + '"]');
            if (targetBtn) targetBtn.click();
        }
    }

    // ── Surprise cards stagger animation ────────────────────
    const cards = document.querySelectorAll('.surprise-card');
    cards.forEach(function (card, i) {
        card.style.animationDelay = (i * 0.1) + 's';
    });

    // ── Active nav highlight on scroll (optional feel) ──────
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('mouseenter', function () {
            this.style.letterSpacing = '0.08em';
        });
        link.addEventListener('mouseleave', function () {
            this.style.letterSpacing = '';
        });
    });

    // ── Easter egg: Ctrl+K triggers surprise notice ─────────
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showEasterEgg();
        }
    });

    function showEasterEgg() {
        const msgs = [
            "🤫 Psst… demandez la table du fond ce soir.",
            "🍷 Le Pomerol 2018 n'est pas sur la carte. Mais il est là.",
            "🧑‍🍳 Le chef est de bonne humeur aujourd'hui. Osez demander.",
            "🎲 Menu Surprise ce soir : le chef a cuisiné son plat préféré.",
            "✨ La soirée Madame Pedrosa approche… tendez l'oreille.",
        ];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        const toast = document.createElement('div');
        toast.style.cssText = [
            'position:fixed', 'bottom:2rem', 'right:2rem',
            'background:#3D2B1F', 'color:#F5E6B8',
            'padding:1rem 1.5rem', 'border-radius:12px',
            'font-size:0.95rem', 'box-shadow:0 8px 30px rgba(0,0,0,0.3)',
            'z-index:9999', 'max-width:320px', 'line-height:1.5',
            'border-left:4px solid #C9A84C',
            'animation:fadeIn 0.3s ease',
        ].join(';');
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(function () { toast.remove(); }, 500);
        }, 4000);
    }
});
