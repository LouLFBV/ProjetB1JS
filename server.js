const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const reservationsFile = path.join(__dirname, 'reservations.json');

// Simulated logements
const logements = [
  {
    id: 1,
    titre: "Appartement à Paris",
    prix: 120,
    image: "/airbnbParis.jpg",
    description: "Charmant appartement au cœur de Paris. Idéalement situé près de la Tour Eiffel.",
    longDescription: "Appartement lumineux de 40 m² parfait pour un couple ou un voyageur solo..."
  },
  {
    id: 2,
    titre: "Maison à Biarritz",
    prix: 90,
    image: "/airbnbBiarritz.jpg",
    description: "Vue imprenable sur la mer.",
    longDescription: "Spacieuse maison en bord de mer à Biarritz, parfaite pour les familles..."
  },
  {
    id: 3,
    titre: "Appartement à New York",
    prix: 150,
    image: "/airbnbNY.jpg",
    description: "Parfait pour un séjour urbain.",
    longDescription: "Situé à Manhattan, cet appartement moderne vous plonge au cœur de New York..."
  },
  {
    id: 4,
    titre: "Chalet à la montagne",
    prix: 110,
    image: "/chalet.jpg",
    description: "Idéal pour un séjour au ski.",
    longDescription: "Chalet rustique avec poêle à bois, deux chambres, vue montagne..."
  },
  {
    id: 5,
    titre: "Bateau fluvial Parisien",
    prix: 95,
    image: "/bateau.jpg",
    description: "Vivez une expérience unique sur la Seine.",
    longDescription: "Bateau fluvial avec cabines confortables, vue sur les monuments de Paris..."
  },
  {
    id: 6,
    titre: "Riad à Marrakech",
    prix: 80,
    image: "/riad.jpg",
    description: "Séjournez dans un riad traditionnel.",
    longDescription: "Riad marocain avec patio, piscine et chambres élégantes..."
  }
];


// Init file if not present
if (!fs.existsSync(reservationsFile)) {
  fs.writeFileSync(reservationsFile, '[]');
}

// Page d'accueil
app.get('/', (req, res) => {
  res.render('accueil', { logements });
});

// Page de détails avec dates désactivées
app.get('/logement/:id', (req, res) => {
  const logement = logements.find(l => l.id === parseInt(req.params.id));
  if (!logement) return res.status(404).send('Logement non trouvé');

  const reservations = JSON.parse(fs.readFileSync(reservationsFile, 'utf-8'));
  const datesReservees = reservations
    .filter(r => r.logementId === logement.id)
    .flatMap(r => {
      const start = new Date(r.start);
      const end = new Date(r.end);
      const dates = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
      }
      return dates;
    });

  res.render('detail', { logement, datesReservees });
});

// Enregistrement d'une réservation
app.post('/reserver', (req, res) => {
  const { logementId, start, end } = req.body;
  const logement = logements.find(l => l.id === parseInt(logementId));

  if (!logement) return res.status(400).send('Logement invalide');

  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = (endDate - startDate) / (1000 * 60 * 60 * 24);

  if (isNaN(diff) || diff < 0 || diff > 7) {
    return res.status(400).send('La réservation doit être entre 1 et 7 jours.');
  }

  const nouvelleReservation = {
    logementId: parseInt(logementId),
    titre: logement.titre,
    image: logement.image,
    prix: logement.prix,
    start,
    end,
    dateReservation: new Date().toISOString() // utilisé comme ID unique
  };

  const reservations = JSON.parse(fs.readFileSync(reservationsFile));
  reservations.push(nouvelleReservation);
  fs.writeFileSync(reservationsFile, JSON.stringify(reservations, null, 2));

  res.redirect('/mes-reservations');
});

// Affichage des réservations
app.get('/mes-reservations', (req, res) => {
  const reservations = JSON.parse(fs.readFileSync(reservationsFile));
  res.render('mes-reservations', { reservations });
});

// Suppression d'une réservation
app.post('/annuler/:id', (req, res) => {
  const id = req.params.id;
  let reservations = JSON.parse(fs.readFileSync(reservationsFile));

  const nouvelleListe = reservations.filter(r => r.dateReservation !== id);

  if (nouvelleListe.length === reservations.length) {
    return res.status(404).send("Réservation non trouvée.");
  }

  fs.writeFileSync(reservationsFile, JSON.stringify(nouvelleListe, null, 2));
  res.json({ success: true });

});

// Lancer le serveur
app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
