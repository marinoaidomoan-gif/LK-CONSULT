// ============================================
// MENU MOBILE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('bouton-menu-mobile');
    const menuList = document.getElementById('menu-liste');
    const menuLinks = document.querySelectorAll('.menu-lien');
    const menuIcon = menuToggle?.querySelector('i');

    if (!menuToggle || !menuList) return;

    // Fonction pour basculer l'état du menu
    const toggleMenu = (isOpen) => {
        const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !menuList.classList.contains('ouvert');
        
        // Mise à jour des classes et des attributs d'accessibilité
        menuList.classList.toggle('ouvert', shouldOpen);
        menuToggle.setAttribute('aria-expanded', shouldOpen.toString());
        menuToggle.setAttribute('aria-label', shouldOpen ? "Fermer le menu" : "Ouvrir le menu");
        
        // Changement de l'icône FontAwesome (Burger vs Croix)
        if (menuIcon) {
            menuIcon.className = shouldOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }

        // Verrouillage du scroll du site en arrière-plan
        document.body.style.overflow = shouldOpen ? 'hidden' : '';
    };

    // Gestion du clic sur le bouton d'ouverture/fermeture
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Fermeture automatique au clic sur un lien du menu (idéal pour les ancres #)
    menuLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Fermeture si l'utilisateur clique en dehors du menu
    document.addEventListener('click', (e) => {
        if (!menuList.contains(e.target) && !menuToggle.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Fermeture avec la touche Échap (Accessibilité clavier)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuList.classList.contains('ouvert')) {
            toggleMenu(false);
            menuToggle.focus(); // Redonne le focus au bouton
        }
    });
});


// ============================================
// COMPTEUR STATISTIQUES (HERO)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Sélectionner tous les éléments contenant les nombres
  const compteurs = document.querySelectorAll('.stat-nombre');

  // Si aucun compteur trouvé, on arrête
  if (!compteurs.length) return;

  // Fonction pour animer un compteur
  function animerCompteur(element, cible, suffixe, duree) {
    let depart = 0;
    const pas = Math.max(1, Math.floor(cible / 60)); // 60 étapes pour ~1.5s
    const interval = Math.floor(duree / 60);
    let etape = 0;

    const timer = setInterval(() => {
      etape += pas;
      if (etape >= cible) {
        etape = cible;
        clearInterval(timer);
      }
      // Mettre à jour l'affichage avec le suffixe (ex: "+")
      element.textContent = etape + suffixe;
    }, interval);
  }

  // Démarrer les compteurs
  compteurs.forEach((element) => {
    const texteComplet = element.textContent.trim(); // ex: "14+"
    const cible = parseInt(texteComplet, 10); // ex: 14
    const suffixe = texteComplet.replace(cible.toString(), ''); // ex: "+"

    // Si la cible est valide, on lance l'animation
    if (!isNaN(cible) && cible > 0) {
      // On met d'abord à 0 pour que le départ soit propre
      element.textContent = '0' + suffixe;
      animerCompteur(element, cible, suffixe, 10000); // 1.5 secondes
    }
  });
});