const express = require('express');
const app = express();
const path = require('path');

// Configuration
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Données simulées
const logements = [
  { id: 1, titre: 'Appartement à Paris', prix: 120, image: '/airbnbParis.jpg', description: 'Charmant appartement au cœur de Paris.' },
  { id: 2, titre: 'Maison à Biarritz', prix: 90, image: '/airbnbBiarritz.jpg', description: 'Vue imprenable sur la mer.' },
  { id: 3, titre: 'Appartement à New York', prix: 150, image: '/airbnbNY.jpg', description: 'Parfait pour un séjour au ski.' }
  ,{
    id: 4,
    titre: "Chalet à la montagne",
    image: "/chalet.jpg",
    prix: 110
  },
  {
    id: 5,
    titre: "Bateau fluvial Parisien",
    image: "/bateau.jpg",
    prix: 95
  },
  {
    id: 6,
    titre: "Riad à Marrakech",
    image: "/riad.jpg",
    prix: 80
  }
];

// Routes
app.get('/', (req, res) => {
  res.render('accueil', { logements });
});

app.get('/logement/:id', (req, res) => {
  const logement = logements.find(l => l.id === parseInt(req.params.id));
  if (!logement) return res.status(404).send('Logement non trouvé');
  res.render('detail', { logement });
});

// Lancement du serveur
app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});



// Pour lancer : node server.js