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
    longDescription: `Découvrez ce lumineux appartement de 40 m² niché en plein centre de Paris, à deux pas de la majestueuse Tour Eiffel. 
    Parfaitement agencé pour accueillir un couple ou un voyageur solo, il offre un espace chaleureux mêlant confort moderne et charme parisien. 
    La cuisine entièrement équipée vous invite à préparer vos repas, tandis que le salon cosy est idéal pour vous détendre après une journée de visites. 
    Les grandes fenêtres laissent pénétrer une lumière naturelle abondante, offrant une atmosphère douce et apaisante. 
    Vous profiterez également d'une connexion Wi-Fi haut débit, d'un lit queen-size confortable, et d'une salle de bain élégante. 
    Que ce soit pour une escapade romantique ou un voyage d'affaires, cet appartement vous garantit un séjour inoubliable au cœur de la Ville Lumière.`
  },
  {
    id: 2,
    titre: "Maison à Biarritz",
    prix: 90,
    image: "/airbnbBiarritz.jpg",
    description: "Vue imprenable sur la mer.",
    longDescription: `Cette charmante maison de 85 m² située en bord de mer à Biarritz est l'escapade idéale pour les familles et les groupes d'amis. 
    Avec ses larges baies vitrées, elle offre une vue panoramique à couper le souffle sur l'océan Atlantique. 
    Vous apprécierez le grand salon lumineux doté d'une cheminée, parfait pour les soirées conviviales. 
    La cuisine moderne et entièrement équipée facilite la préparation de délicieux repas que vous pourrez déguster sur la terrasse ensoleillée. 
    La maison dispose de trois chambres confortables et de deux salles de bains, ainsi qu'un jardin paysager pour des moments de détente en plein air. 
    À seulement quelques minutes des plages, des commerces et des célèbres spots de surf, c’est un pied-à-terre parfait pour profiter du charme basque.`
  },
  {
    id: 3,
    titre: "Appartement à New York",
    prix: 150,
    image: "/airbnbNY.jpg",
    description: "Parfait pour un séjour urbain.",
    longDescription: `Situé en plein cœur de Manhattan, cet appartement moderne de 50 m² vous plonge au centre de l'effervescence new-yorkaise. 
    Décoré avec goût dans un style contemporain, il offre tout le confort nécessaire pour un séjour urbain réussi. 
    Le salon spacieux comprend un canapé-lit, une télévision à écran plat et un espace de travail fonctionnel. 
    La cuisine ouverte est équipée d'appareils de dernière génération, idéale pour cuisiner après une journée d'exploration. 
    La chambre principale dispose d'un lit queen-size confortable et de rangements pratiques. 
    Situé à proximité de Central Park, de Times Square et des nombreux musées, cet appartement est le point de départ parfait pour découvrir la ville qui ne dort jamais.`
  },
  {
    id: 4,
    titre: "Chalet à la montagne",
    prix: 110,
    image: "/chalet.jpg",
    description: "Idéal pour un séjour au ski.",
    longDescription: `Venez vous ressourcer dans ce charmant chalet rustique de 70 m² situé au cœur des montagnes. 
    Parfait pour les amateurs de ski et de nature, ce refuge chaleureux dispose d'un poêle à bois qui crée une atmosphère cosy après une journée sur les pistes. 
    Le chalet comprend deux chambres douillettes, une salle de bain moderne, ainsi qu'un salon spacieux avec canapé et télévision. 
    La cuisine équipée vous permettra de préparer des repas conviviaux à partager autour de la grande table en bois massif. 
    À l'extérieur, profitez d'une terrasse avec vue panoramique sur les sommets enneigés, idéale pour un petit-déjeuner au soleil ou une soirée étoilée. 
    Accessible toute l'année, ce chalet est une invitation à la détente et à l'aventure en montagne.`
  },
  {
    id: 5,
    titre: "Bateau fluvial Parisien",
    prix: 95,
    image: "/bateau.jpg",
    description: "Vivez une expérience unique sur la Seine.",
    longDescription: `Offrez-vous une expérience inoubliable en séjournant sur ce charmant bateau fluvial amarré au cœur de Paris. 
    Ce logement atypique dispose de cabines confortables décorées avec soin, alliant charme maritime et modernité. 
    Depuis les larges fenêtres, admirez les vues emblématiques sur les monuments parisiens tels que Notre-Dame et le Louvre. 
    Le pont supérieur vous invite à vous détendre en plein air avec un café au lever du soleil ou un verre au coucher du soleil. 
    La cabine principale comprend un lit double, un espace de rangement, ainsi qu'une salle de bain privative fonctionnelle. 
    Parfait pour un séjour romantique ou un voyage original, ce bateau vous plonge dans une ambiance unique, entre calme et effervescence citadine.`
  },
  {
    id: 6,
    titre: "Riad à Marrakech",
    prix: 80,
    image: "/riad.jpg",
    description: "Séjournez dans un riad traditionnel.",
    longDescription: `Découvrez la magie de Marrakech en séjournant dans ce magnifique riad traditionnel, situé au cœur de la médina. 
    Ce lieu authentique de 100 m² combine architecture marocaine classique et confort contemporain. 
    Vous serez charmé par son patio central orné de mosaïques colorées et d'une fontaine apaisante, entouré de plusieurs chambres élégantes. 
    Le riad dispose d'une piscine privée, parfaite pour se rafraîchir après une journée de visite sous le soleil marocain. 
    Les chambres, décorées avec goût, offrent un cadre intime et chaleureux, avec des textiles artisanaux et des meubles en bois sculpté. 
    Profitez également d'un petit-déjeuner traditionnel servi dans la cour ou sur la terrasse avec vue sur la médina. 
    Une expérience immersive au cœur de la culture marocaine vous attend dans ce havre de paix.`
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
