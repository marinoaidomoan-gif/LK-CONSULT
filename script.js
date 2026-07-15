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
// COMPTEUR STATISTIQUES (HERO) — DÉCLENCHEMENT AU SCROLL
// ============================================
document.addEventListener('DOMContentLoaded', function() {

    // 1. Sélectionner la zone qui contient les stats et les compteurs
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return; // Sécurité : si la zone n'existe pas, on arrête

    const compteurs = heroStats.querySelectorAll('.stat-nombre');

    // 2. Vérifier qu'il y a bien des compteurs à animer
    if (!compteurs.length) return;

    // 3. Fonction qui anime UN compteur (ex: 0 → 14+)
    function animerCompteur(element, cible, suffixe, duree = 1500) {
        let depart = 0;
        const pas = Math.max(1, Math.floor(cible / 60));
        const interval = Math.floor(duree / 60);
        let etape = 0;

        const timer = setInterval(() => {
            etape += pas;
            if (etape >= cible) {
                etape = cible;
                clearInterval(timer);
            }
            element.textContent = etape + suffixe;
        }, interval);
    }

    // 4. Fonction qui initialise les compteurs (mise à 0 + sauvegarde des valeurs)
    function initialiserEtLancerCompteurs() {
        // On parcourt chaque compteur
        compteurs.forEach((element) => {
            const texteComplet = element.textContent.trim(); // ex: "14+"
            const cible = parseInt(texteComplet, 10);        // ex: 14
            const suffixe = texteComplet.replace(cible.toString(), ''); // ex: "+"

            if (!isNaN(cible) && cible > 0) {
                // On met le compteur à 0 pour que l'animation parte de zéro
                element.textContent = '0' + suffixe;
                // On lance l'animation pour ce compteur avec 1500ms de durée
                animerCompteur(element, cible, suffixe, 1500);
            }
        });
    }

    // 5. Création de l'observateur qui scrute l'arrivée des statistiques
    const observateurStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // La zone des stats est visible : on lance TOUS les compteurs
                initialiserEtLancerCompteurs();
                // Une fois lancé, on arrête d'observer pour ne pas rejouer l'animation
                observateurStats.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Se déclenche quand 50% de la zone des stats est visible
        // (on pourrait mettre 0.3 pour que ce soit plus réactif)
    });

    // 6. Démarrer la surveillance de la zone .hero-stats
    observateurStats.observe(heroStats);
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

// Année dynamique
const anneeCourante = document.getElementById('annee-courante');
if (anneeCourante) {
  anneeCourante.textContent = new Date().getFullYear();
}

// ============================================
// ANIMATION MISSION & VISION (au scroll)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const panneauxMV = document.querySelectorAll('.panneau-mv');
  if (!panneauxMV.length) return;

  const observateurMV = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observateurMV.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  panneauxMV.forEach((panneau) => observateurMV.observe(panneau));
});

// ============================================
// ANIMATION EXPERTISES (au scroll)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const cartesExpertise = document.querySelectorAll('.carte-expertise');
  if (!cartesExpertise.length) return;

  const observateurExpertise = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(cartesExpertise).indexOf(entry.target);
        // Délai progressif pour effet cascade (60ms entre chaque carte)
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 60);
        observateurExpertise.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  cartesExpertise.forEach((carte) => observateurExpertise.observe(carte));
});

// ============================================
// EN-TÊTE : passage en mode "solide" au scroll
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const entete = document.querySelector('.en-tete');
  if (!entete) return;

  const seuilDefilement = 60; // px avant de basculer en mode opaque
  let enAttente = false;

  function mettreAJourEntete() {
    entete.classList.toggle('en-tete-scroll', window.scrollY > seuilDefilement);
    enAttente = false;
  }

  mettreAJourEntete(); // état correct dès le chargement (ex: page rechargée après un scroll)

  window.addEventListener('scroll', () => {
    if (!enAttente) {
      requestAnimationFrame(mettreAJourEntete);
      enAttente = true;
    }
  }, { passive: true });
});

// ============================================
// HERO — Carrousel : points, flèches, pause au survol
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const hero = document.querySelector('.hero');
  const images = document.querySelectorAll('.hero-fond-image');
  const points = document.querySelectorAll('.hero-point');
  const flecheGauche = document.querySelector('.hero-fleche-gauche');
  const flecheDroite = document.querySelector('.hero-fleche-droite');

  if (!hero || !images.length) return;

  let indexActuel = 0;
  let intervalle = null;
  const dureeParImage = 6000; // 6s par image (entre les 5-7s recommandés)
  const reduireMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function afficherImage(index) {
    images.forEach((img, i) => img.classList.toggle('actif', i === index));
    points.forEach((point, i) => {
      point.classList.toggle('actif', i === index);
      point.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    indexActuel = index;
  }

  function imageSuivante() {
    afficherImage((indexActuel + 1) % images.length);
  }

  function imagePrecedente() {
    afficherImage((indexActuel - 1 + images.length) % images.length);
  }

  function demarrerDefilement() {
    if (reduireMouvement) return; // respecte "mouvement réduit" : pas de défilement auto
    arreterDefilement();
    intervalle = setInterval(imageSuivante, dureeParImage);
  }

  function arreterDefilement() {
    if (intervalle) {
      clearInterval(intervalle);
      intervalle = null;
    }
  }

  afficherImage(0);
  demarrerDefilement();

  // Pause au survol de toute la zone Hero
  hero.addEventListener('mouseenter', arreterDefilement);
  hero.addEventListener('mouseleave', demarrerDefilement);

  // Flèches
  flecheDroite?.addEventListener('click', () => { imageSuivante(); demarrerDefilement(); });
  flecheGauche?.addEventListener('click', () => { imagePrecedente(); demarrerDefilement(); });

  // Points
  points.forEach((point, i) => {
    point.addEventListener('click', () => { afficherImage(i); demarrerDefilement(); });
  });
});

// ============================================
// MENU — État actif (Active State)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const liens = document.querySelectorAll('.menu-lien');
  const sections = document.querySelectorAll('section[id]');

  // Fonction pour mettre à jour le lien actif
  function mettreAJourLienActif() {
    let sectionActuelle = '';
    const scrollY = window.scrollY + 120; // Décalage pour tenir compte du header fixe

    sections.forEach(section => {
      const debut = section.offsetTop;
      const fin = debut + section.offsetHeight;
      if (scrollY >= debut && scrollY < fin) {
        sectionActuelle = section.id;
      }
    });

    liens.forEach(lien => {
      lien.classList.remove('actif');
      if (lien.getAttribute('href') === '#' + sectionActuelle) {
        lien.classList.add('actif');
      }
    });
  }

  // Déclencher au scroll et au chargement
  window.addEventListener('scroll', mettreAJourLienActif);
  window.addEventListener('load', mettreAJourLienActif);
  mettreAJourLienActif();
});

// ============================================
// ANNÉES D'EXPÉRIENCE — Calcul dynamique
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const element = document.getElementById('annees-experience');
  if (!element) return;
  
  const anneeCreation = 2012;
  const anneeActuelle = new Date().getFullYear();
  const anneesExperience = anneeActuelle - anneeCreation;
  
  element.textContent = anneesExperience + ' ans';
});

// ============================================
// RÉALISATIONS — Filtres avec animation
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const boutonsFiltre = document.querySelectorAll('.filtre-bouton');
  const cartes = document.querySelectorAll('.carte-realisation');
  if (!boutonsFiltre.length || !cartes.length) return;

  const dureeAnimation = 350; // doit correspondre à la transition CSS ci-dessus

  boutonsFiltre.forEach((bouton) => {
    bouton.addEventListener('click', () => {
      const filtre = bouton.dataset.filtre;

      boutonsFiltre.forEach((b) => {
        b.classList.remove('actif');
        b.setAttribute('aria-selected', 'false');
      });
      bouton.classList.add('actif');
      bouton.setAttribute('aria-selected', 'true');

      cartes.forEach((carte) => {
        const correspond = filtre === 'tout' || carte.dataset.categorie === filtre;

        if (correspond) {
          carte.style.display = '';
          requestAnimationFrame(() => {
            carte.classList.remove('masquee');
          });
        } else {
          carte.classList.add('masquee');
          setTimeout(() => {
            if (carte.classList.contains('masquee')) {
              carte.style.display = 'none';
            }
          }, dureeAnimation);
        }
      });
    });
  });
});

// ============================================
// RÉALISATIONS — Effet de clic (scale)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const cartesRealisations = document.querySelectorAll('.carte-realisation');
  cartesRealisations.forEach((carte) => {
    carte.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.98)';
    });
    carte.addEventListener('mouseup', function() {
      this.style.transform = '';
    });
    carte.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
});