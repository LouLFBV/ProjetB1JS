const express = require('express');
const app = express();
const path = require('path');

// Configuration
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Données simulées
const logements = [
  { 
  id: 1, 
  titre: 'Appartement à Paris', 
  prix: 120, 
  image: '/airbnbParis.jpg', 
  description: 'Charmant appartement au cœur de Paris. Idéalement situé près de la Tour Eiffel, à deux pas des cafés, restaurants et musées.',
  longDescription: "Cet appartement lumineux de 40 m² est parfait pour un couple ou un voyageur solo. Il dispose d'une chambre confortable, d'une cuisine équipée, d'une salle de bain moderne et d'un balcon avec vue sur la ville. Connexion Wi-Fi haut débit incluse."
},

  { id: 2, titre: 'Maison à Biarritz', prix: 90, image: '/airbnbBiarritz.jpg', description: 'Vue imprenable sur la mer.', longDescription: "Spacieuse maison en bord de mer à Biarritz, parfaite pour les familles ou les groupes d’amis. Avec trois chambres, un grand salon lumineux, un jardin privé et une terrasse offrant une vue imprenable sur l’océan Atlantique, ce logement est une véritable invitation à la détente. Vous êtes à moins de 5 minutes à pied de la plage et des commerces."
 },
  { id: 3, titre: 'Appartement à New York', prix: 150, image: '/airbnbNY.jpg', description: 'Parfait pour un séjour au ski.' , longDescription: "Situé dans Manhattan, cet appartement moderne au design new-yorkais typique vous plonge au cœur de la ville qui ne dort jamais. Il comprend une chambre spacieuse, une cuisine ouverte, un coin bureau et une salle de bain avec douche à l’italienne. À proximité des métros, cafés, Central Park et des musées. Parfait pour un séjour urbain réussi."
}
  ,{
    id: 4,
    titre: "Chalet à la montagne",
    image: "/chalet.jpg",
    prix: 110,
    description: "Idéal pour un séjour au ski.",
    longDescription: "Ce charmant chalet en bois offre une ambiance chaleureuse et rustique, niché au cœur des montagnes. Avec son poêle à bois, sa vue panoramique sur les sommets enneigés, ses deux chambres et sa cuisine équipée, il est parfait pour un séjour au ski ou un week-end cocooning. Accès direct aux sentiers de randonnée et aux pistes de ski."
  },
  {
    id: 5,
    titre: "Bateau fluvial Parisien",
    image: "/bateau.jpg",
    prix: 95,
    description: "Vivez une expérience unique sur la Seine.",
    longDescription: "Ce bateau fluvial vous offre une expérience unique sur la Seine. Avec ses confortables cabines et son salon panoramique, vous pourrez admirer les monuments de Paris tout en savourant un repas gastronomique préparé par un chef."
  },
  {
    id: 6,
    titre: "Riad à Marrakech",
    image: "/riad.jpg",
    prix: 80,
    description: "Séjournez dans un riad traditionnel.",
    longDescription: "Ce riad traditionnel marocain vous plonge dans l'ambiance chaleureuse de Marrakech. Avec ses chambres élégantes, son patio verdoyant et sa piscine, c'est un véritable havre de paix au cœur de la ville."
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