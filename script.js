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

// ============================================
// ANIMATION RÉALISATIONS (au scroll)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const cartes = document.querySelectorAll('.carte-realisation');
  if (!cartes.length) return;

  const observateur = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(cartes).indexOf(entry.target);
        // Délai progressif pour effet cascade (150ms entre chaque)
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 50);
        observateur.unobserve(entry.target); // Une seule fois
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  cartes.forEach((carte) => observateur.observe(carte));
});

/* ============================================
   SECTION CONTACT — Validation & envoi du formulaire
   ============================================ */
(function () {
  // Fonctionne que le script soit chargé dans le <head> ou en fin de <body>
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiserFormulaireContact);
  } else {
    initialiserFormulaireContact();
  }

  function initialiserFormulaireContact() {
    const formulaire = document.getElementById('formulaire-contact');
    if (!formulaire) {
      console.warn('[contact.js] Formulaire #formulaire-contact introuvable dans la page.');
      return;
    }

    const messageSucces = document.getElementById('message-succes');
    const boutonEnvoi = formulaire.querySelector('button[type="submit"]');
    const libelleBoutonOriginal = boutonEnvoi.innerHTML;

    const regles = {
      nom: {
        valider: (valeur) => valeur.trim().length >= 2,
        message: 'Veuillez indiquer votre nom complet.',
      },
      email: {
        valider: (valeur) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur.trim()),
        message: 'Veuillez indiquer une adresse email valide.',
      },
      message: {
        valider: (valeur) => valeur.trim().length >= 10,
        message: 'Votre message doit contenir au moins 10 caractères.',
      },
    };

    function afficherErreur(champInput, texte) {
      const champ = champInput.closest('.champ');
      const erreur = champ.querySelector('.erreur-message');
      champ.classList.add('invalide');
      if (erreur) erreur.textContent = texte;
    }

    function effacerErreur(champInput) {
      const champ = champInput.closest('.champ');
      const erreur = champ.querySelector('.erreur-message');
      champ.classList.remove('invalide');
      if (erreur) erreur.textContent = '';
    }

    function validerChamp(nomChamp) {
      const input = formulaire.elements[nomChamp];
      const regle = regles[nomChamp];
      if (!input || !regle) return true;

      if (!regle.valider(input.value)) {
        afficherErreur(input, regle.message);
        return false;
      }
      effacerErreur(input);
      return true;
    }

    Object.keys(regles).forEach((nomChamp) => {
      const input = formulaire.elements[nomChamp];
      if (!input) return;
      input.addEventListener('blur', () => validerChamp(nomChamp));
      input.addEventListener('input', () => {
        if (input.closest('.champ').classList.contains('invalide')) {
          validerChamp(nomChamp);
        }
      });
    });

    formulaire.addEventListener('submit', function (evenement) {
      evenement.preventDefault();

      const champsValides = Object.keys(regles)
        .map(validerChamp)
        .every(Boolean);

      if (!champsValides) {
        const premierInvalide = formulaire.querySelector('.champ.invalide input, .champ.invalide textarea');
        if (premierInvalide) premierInvalide.focus();
        return;
      }

      boutonEnvoi.disabled = true;
      boutonEnvoi.innerHTML = '<i class="fa-solid fa-spinner" aria-hidden="true"></i> Envoi en cours...';

      setTimeout(() => {
        formulaire.classList.add('envoye');
        messageSucces.classList.add('actif');
        messageSucces.scrollIntoView({ behavior: 'smooth', block: 'center' });

        boutonEnvoi.disabled = false;
        boutonEnvoi.innerHTML = libelleBoutonOriginal;
      }, 900);
    });
  }
})();