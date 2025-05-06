// Barre de recherche
const rechercheInput = document.getElementById('recherche');
rechercheInput.addEventListener('input', () => {
  const terme = rechercheInput.value.toLowerCase();
  document.querySelectorAll('.logement').forEach(logement => {
    const titre = logement.dataset.titre;
    logement.style.display = titre.includes(terme) ? 'block' : 'none';
  });
});

// Gestion des favoris avec localStorage
const coeurs = document.querySelectorAll('.coeur');
let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

const MAJ_COEURS = () => {
  coeurs.forEach(coeur => {
    const id = coeur.dataset.id;
    if (favoris.includes(id)) {
      coeur.textContent = '❤️';
    } else {
      coeur.textContent = '♡';
    }
  });
};

coeurs.forEach(coeur => {
  coeur.addEventListener('click', () => {
    const id = coeur.dataset.id;
    if (favoris.includes(id)) {
      favoris = favoris.filter(f => f !== id);
    } else {
      favoris.push(id);
    }
    localStorage.setItem('favoris', JSON.stringify(favoris));
    MAJ_COEURS();
  });
});

MAJ_COEURS(); // Initialise à l'ouverture

const btnFavoris = document.getElementById('btnFavoris');
let afficherFavoris = false;

btnFavoris.addEventListener('click', () => {
  afficherFavoris = !afficherFavoris;

  if (afficherFavoris) {
    btnFavoris.textContent = 'Voir tout';
    document.querySelectorAll('.logement').forEach(logement => {
      const id = logement.querySelector('.coeur').dataset.id;
      logement.style.display = favoris.includes(id) ? 'block' : 'none';
    });
  } else {
    btnFavoris.textContent = 'Voir les favoris';
    document.querySelectorAll('.logement').forEach(logement => {
      logement.style.display = 'block';
    });
  }
});
