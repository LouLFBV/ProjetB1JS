// 🔍 Recherche en temps réel
const rechercheInput = document.getElementById('recherche');
rechercheInput?.addEventListener('input', () => {
  const terme = rechercheInput.value.toLowerCase();
  document.querySelectorAll('.logement').forEach(logement => {
    const titre = logement.dataset.titre;
    logement.style.display = titre.includes(terme) ? 'block' : 'none';
  });
});

// ❤️ Gestion des favoris
const coeurs = document.querySelectorAll('.coeur');
let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

const MAJ_COEURS = () => {
  coeurs.forEach(coeur => {
    const id = coeur.dataset.id;
    coeur.textContent = favoris.includes(id) ? '❤️' : '♡';
  });
};

coeurs.forEach(coeur => {
  coeur.addEventListener('click', () => {
    const id = coeur.dataset.id;

    coeur.classList.add('active');
    setTimeout(() => coeur.classList.remove('active'), 300);

    if (favoris.includes(id)) {
      favoris = favoris.filter(f => f !== id);
    } else {
      favoris.push(id);
    }

    localStorage.setItem('favoris', JSON.stringify(favoris));
    MAJ_COEURS();
  });
});

MAJ_COEURS();

// ⭐ Filtrer uniquement les favoris
const btnFavoris = document.getElementById('btnFavoris');
let afficherFavoris = false;

btnFavoris?.addEventListener('click', () => {
  afficherFavoris = !afficherFavoris;
  btnFavoris.textContent = afficherFavoris ? 'Voir tout' : 'Voir les favoris';

  document.querySelectorAll('.logement').forEach(logement => {
    const id = logement.querySelector('.coeur').dataset.id;
    logement.style.display = !afficherFavoris || favoris.includes(id) ? 'block' : 'none';
  });
});

// 📅 Flatpickr avec langue française
if (typeof flatpickr !== 'undefined') {
  const disabledDates = typeof datesReservees !== 'undefined' ? datesReservees : [];

  const commonOptions = {
    dateFormat: "Y-m-d",
    disable: disabledDates,
    minDate: "today",
    locale: "fr"
  };

  const startPicker = flatpickr("#start", {
    ...commonOptions,
    onChange: function (selectedDates) {
      if (!selectedDates[0]) return;

      const startDate = selectedDates[0];
      const maxDate = new Date(startDate);
      maxDate.setDate(maxDate.getDate() + 7);

      endPicker.set('minDate', startDate);
      endPicker.set('maxDate', maxDate);
    }
  });

  const endPicker = flatpickr("#end", {
    ...commonOptions
  });
}

// ⛔ Empêche de soumettre une réservation de +7 jours
// ✅ Ajoute confirmation avant envoi
document.querySelectorAll('form.reservation-section').forEach(form => {
  form.addEventListener('submit', function (e) {
    const start = new Date(this.start.value);
    const end = new Date(this.end.value);
    const diff = (end - start) / (1000 * 60 * 60 * 24);

    if (diff < 0) {
      e.preventDefault();
      alert("La date de départ doit être après la date d'arrivée.");
    } else if (diff > 7) {
      e.preventDefault();
      alert("Vous ne pouvez pas réserver pour plus de 7 jours.");
    } else {
      const ok = confirm(`Confirmer votre réservation du ${this.start.value} au ${this.end.value} ?`);
      if (!ok) {
        e.preventDefault();
      }
    }
  });
});

// 🗑️ Annulation de réservation (sans rechargement)
document.querySelectorAll('.annuler-reservation').forEach(button => {
  button.addEventListener('click', async () => {
    const id = button.dataset.reservationId;

    if (!confirm("Voulez-vous vraiment annuler cette réservation ?")) return;

    try {
      const res = await fetch(`/annuler/${id}`, { method: 'POST' });

      if (res.ok) {
        alert("Réservation annulée.");

        // Supprime dynamiquement la carte HTML de la réservation
        const reservationCard = button.closest('.reservation-card');
        if (reservationCard) reservationCard.remove();

      } else {
        const message = await res.text();
        alert(`Erreur : ${message || "Impossible d’annuler la réservation."}`);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      alert("Erreur réseau : impossible de contacter le serveur.");
    }
  });
});
