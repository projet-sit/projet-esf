# PROMPT COMPLET — Espace Étudiant ESF Le Faucon
## Frontend + Backend complet


##  ARCHITECTURE DU PROJET

```
esf-espace-etudiant/
├── backend/
│   ├── server.js              # Serveur Express principal
│   ├── db.js                  # Connexion PostgreSQL
│   ├── .env                   # Variables d'environnement
│   ├── routes/
│   │   ├── auth.js            # Routes authentification
│   │   ├── filieres.js        # Routes filières & matières
│   │   ├── epreuves.js        # Routes épreuves
│   │   ├── absences.js        # Routes absences
│   │   └── messagerie.js      # Routes messagerie
│   └── middleware/
│       └── authMiddleware.js  # Vérification JWT
├── frontend/
│   └── index.html             # Page unique (SPA)
└── database/
    └── schema.sql             # Script de création des tables
```

---

## 🛢️ BASE DE DONNÉES — schema.sql (PostgreSQL)

```sql
-- Filières
CREATE TABLE filieres (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  label VARCHAR(150) NOT NULL,
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matières
CREATE TABLE matieres (
  id SERIAL PRIMARY KEY,
  filiere_id INT REFERENCES filieres(id) ON DELETE CASCADE,
  nom VARCHAR(150) NOT NULL,
  enseignant VARCHAR(100),
  coefficient INT DEFAULT 1,
  credits INT DEFAULT 3,
  semestre VARCHAR(10) DEFAULT 'S1'
);

-- Étudiants
CREATE TABLE etudiants (
  id SERIAL PRIMARY KEY,
  matricule VARCHAR(30) UNIQUE NOT NULL,
  filiere_id INT REFERENCES filieres(id),
  nom VARCHAR(100),
  prenom VARCHAR(100),
  email VARCHAR(150),
  password_hash VARCHAR(255),
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Professeurs
CREATE TABLE professeurs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password_hash VARCHAR(255),
  matiere_principale VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Épreuves
CREATE TABLE epreuves (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  filiere_id INT REFERENCES filieres(id),
  matiere_id INT REFERENCES matieres(id),
  annee INT NOT NULL,
  type VARCHAR(50) NOT NULL,  -- 'Examen Final', 'Contrôle Continu', 'Rattrapage', 'Devoir Maison'
  fichier_sujet_url VARCHAR(500),
  fichier_correction_url VARCHAR(500),
  has_correction BOOLEAN DEFAULT FALSE,
  ajoute_par INT,             -- id étudiant ou prof
  created_at TIMESTAMP DEFAULT NOW()
);

-- Absences
CREATE TABLE absences (
  id SERIAL PRIMARY KEY,
  etudiant_id INT REFERENCES etudiants(id) ON DELETE CASCADE,
  matiere_id INT REFERENCES matieres(id),
  date_seance DATE NOT NULL,
  type_seance VARCHAR(50),    -- 'Cours magistral', 'TD', 'TP'
  statut VARCHAR(20) DEFAULT 'present',  -- 'present', 'absent', 'justified'
  justification TEXT,
  enregistre_par INT,         -- id professeur
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  expediteur_type VARCHAR(20) NOT NULL,  -- 'etudiant' ou 'professeur'
  expediteur_id INT NOT NULL,
  destinataire_type VARCHAR(20) NOT NULL,
  destinataire_id INT NOT NULL,
  contenu TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertion des 12 filières officielles ESF
INSERT INTO filieres (code, label, emoji) VALUES
  ('ABB',  'Analyses Biologiques et Biochimiques', '🔬'),
  ('BTP',  'Bâtiments et Travaux Publics', '🏗️'),
  ('GT',   'Géomètre Topographe', '🗺️'),
  ('GEER', 'Génie Électrique et Énergies Renouvelables', '⚡'),
  ('SIL',  'Système Informatique et Logiciel', '💻'),
  ('BFA',  'Banque Finance Assurance', '🏦'),
  ('FCA',  'Finance Comptabilité Audit', '📊'),
  ('GRH',  'Gestion des Ressources Humaines', '👥'),
  ('MCC',  'Marketing Communication Commerce', '📣'),
  ('TL',   'Transport et Logistique', '🚚'),
  ('HT',   'Hôtellerie et Tourisme', '🏨'),
  ('GETE', 'Génie de l Environnement – Traitement des Déchets et Eaux', '🌿');
```

---

## ⚙️ BACKEND — server.js

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/filieres',   require('./routes/filieres'));
app.use('/api/epreuves',   require('./routes/epreuves'));
app.use('/api/absences',   require('./routes/absences'));
app.use('/api/messagerie', require('./routes/messagerie'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur ESF démarré sur le port ${PORT}`));
```

---

## ⚙️ BACKEND — db.js

```javascript
const { Pool } = require('pg');
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
module.exports = pool;
```

---

## ⚙️ BACKEND — .env

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=esf_espace_etudiant
DB_USER=postgres
DB_PASSWORD=ton_mot_de_passe
JWT_SECRET=esf_faucon_secret_2024
FRONTEND_URL=http://localhost:5500
```

---

## ⚙️ BACKEND — middleware/authMiddleware.js

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};
```

---

## ⚙️ BACKEND — routes/auth.js

```javascript
const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
// L'étudiant se connecte avec son matricule + filière
router.post('/login', async (req, res) => {
  const { matricule, filiere_code } = req.body;
  if (!matricule || !filiere_code)
    return res.status(400).json({ error: 'Matricule et filière requis' });

  try {
    const result = await pool.query(
      `SELECT e.*, f.code as filiere_code, f.label as filiere_label, f.emoji
       FROM etudiants e
       JOIN filieres f ON e.filiere_id = f.id
       WHERE e.matricule = $1 AND f.code = $2 AND e.actif = TRUE`,
      [matricule.toUpperCase(), filiere_code.toUpperCase()]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Matricule ou filière incorrect' });

    const etudiant = result.rows[0];
    const token = jwt.sign(
      { id: etudiant.id, matricule: etudiant.matricule, filiere: etudiant.filiere_code, role: 'etudiant' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      etudiant: {
        id: etudiant.id,
        matricule: etudiant.matricule,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        filiere_code: etudiant.filiere_code,
        filiere_label: etudiant.filiere_label,
        emoji: etudiant.emoji,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// POST /api/auth/register (création de compte étudiant)
router.post('/register', async (req, res) => {
  const { matricule, filiere_code, nom, prenom, email } = req.body;
  if (!matricule || !filiere_code)
    return res.status(400).json({ error: 'Matricule et filière requis' });

  try {
    // Vérifier que la filière existe
    const filiere = await pool.query('SELECT id FROM filieres WHERE code = $1', [filiere_code.toUpperCase()]);
    if (filiere.rows.length === 0)
      return res.status(400).json({ error: 'Filière inconnue' });

    // Vérifier que le matricule n'est pas déjà pris
    const existing = await pool.query('SELECT id FROM etudiants WHERE matricule = $1', [matricule.toUpperCase()]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Ce matricule possède déjà un compte' });

    const result = await pool.query(
      `INSERT INTO etudiants (matricule, filiere_id, nom, prenom, email)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, matricule`,
      [matricule.toUpperCase(), filiere.rows[0].id, nom || '', prenom || '', email || '']
    );

    res.status(201).json({ message: 'Compte créé avec succès', etudiant: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
```

---

## ⚙️ BACKEND — routes/filieres.js

```javascript
const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

// GET /api/filieres — toutes les filières
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM filieres ORDER BY code');
  res.json(result.rows);
});

// GET /api/filieres/:code/matieres — matières d'une filière
router.get('/:code/matieres', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT m.* FROM matieres m
     JOIN filieres f ON m.filiere_id = f.id
     WHERE f.code = $1 ORDER BY m.coefficient DESC`,
    [req.params.code.toUpperCase()]
  );
  res.json(result.rows);
});

module.exports = router;
```

---

## ⚙️ BACKEND — routes/epreuves.js

```javascript
const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

// GET /api/epreuves — liste avec filtres optionnels
router.get('/', auth, async (req, res) => {
  const { filiere, annee, correction } = req.query;
  let query = `
    SELECT ep.*, f.code as filiere_code, f.label as filiere_label, m.nom as matiere_nom
    FROM epreuves ep
    JOIN filieres f ON ep.filiere_id = f.id
    LEFT JOIN matieres m ON ep.matiere_id = m.id
    WHERE 1=1
  `;
  const params = [];
  let i = 1;
  if (filiere)     { query += ` AND f.code = $${i++}`;           params.push(filiere.toUpperCase()); }
  if (annee)       { query += ` AND ep.annee = $${i++}`;         params.push(parseInt(annee)); }
  if (correction === 'yes') { query += ` AND ep.has_correction = TRUE`; }
  if (correction === 'no')  { query += ` AND ep.has_correction = FALSE`; }
  query += ' ORDER BY ep.created_at DESC';

  const result = await pool.query(query, params);
  res.json(result.rows);
});

// POST /api/epreuves — ajouter une épreuve
router.post('/', auth, async (req, res) => {
  const { titre, filiere_code, matiere_id, annee, type, fichier_sujet_url, fichier_correction_url } = req.body;
  try {
    const filiere = await pool.query('SELECT id FROM filieres WHERE code = $1', [filiere_code.toUpperCase()]);
    if (!filiere.rows.length) return res.status(400).json({ error: 'Filière inconnue' });

    const result = await pool.query(
      `INSERT INTO epreuves (titre, filiere_id, matiere_id, annee, type, fichier_sujet_url, fichier_correction_url, has_correction, ajoute_par)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [titre, filiere.rows[0].id, matiere_id || null, annee, type,
       fichier_sujet_url || null, fichier_correction_url || null,
       !!fichier_correction_url, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/epreuves/:id — supprimer une épreuve
router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM epreuves WHERE id = $1 AND ajoute_par = $2', [req.params.id, req.user.id]);
  res.json({ message: 'Épreuve supprimée' });
});

module.exports = router;
```

---

## ⚙️ BACKEND — routes/absences.js

```javascript
const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

// GET /api/absences/moi — absences de l'étudiant connecté
router.get('/moi', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT a.*, m.nom as matiere_nom, m.enseignant
     FROM absences a
     JOIN matieres m ON a.matiere_id = m.id
     WHERE a.etudiant_id = $1
     ORDER BY a.date_seance DESC`,
    [req.user.id]
  );
  res.json(result.rows);
});

// GET /api/absences/stats — statistiques de présence
router.get('/stats', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT
       COUNT(*) as total,
       COUNT(*) FILTER (WHERE statut = 'present') as presents,
       COUNT(*) FILTER (WHERE statut = 'absent') as absents,
       COUNT(*) FILTER (WHERE statut = 'justified') as justifies,
       ROUND(COUNT(*) FILTER (WHERE statut = 'present') * 100.0 / NULLIF(COUNT(*), 0), 1) as taux_presence
     FROM absences
     WHERE etudiant_id = $1`,
    [req.user.id]
  );
  res.json(result.rows[0]);
});

// POST /api/absences — enregistrer une absence (par un prof)
router.post('/', auth, async (req, res) => {
  const { etudiant_id, matiere_id, date_seance, type_seance, statut, justification } = req.body;
  const result = await pool.query(
    `INSERT INTO absences (etudiant_id, matiere_id, date_seance, type_seance, statut, justification, enregistre_par)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [etudiant_id, matiere_id, date_seance, type_seance, statut || 'present', justification || null, req.user.id]
  );
  res.status(201).json(result.rows[0]);
});

module.exports = router;
```

---

## ⚙️ BACKEND — routes/messagerie.js

```javascript
const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

// GET /api/messagerie/conversations — toutes les conversations de l'utilisateur
router.get('/conversations', auth, async (req, res) => {
  const { id, role } = req.user;
  const result = await pool.query(
    `SELECT DISTINCT ON (
       LEAST(expediteur_id, destinataire_id),
       GREATEST(expediteur_id, destinataire_id)
     )
     m.*,
     (SELECT COUNT(*) FROM messages m2
      WHERE m2.destinataire_id = $1 AND m2.destinataire_type = $2 AND m2.lu = FALSE) as non_lus
     FROM messages m
     WHERE (expediteur_id = $1 AND expediteur_type = $2)
        OR (destinataire_id = $1 AND destinataire_type = $2)
     ORDER BY LEAST(expediteur_id, destinataire_id),
              GREATEST(expediteur_id, destinataire_id),
              created_at DESC`,
    [id, role]
  );
  res.json(result.rows);
});

// GET /api/messagerie/:type/:id — messages avec un contact
router.get('/:type/:id', auth, async (req, res) => {
  const { id: myId, role } = req.user;
  const { type, id: contactId } = req.params;
  const result = await pool.query(
    `SELECT * FROM messages
     WHERE (expediteur_id = $1 AND expediteur_type = $2 AND destinataire_id = $3 AND destinataire_type = $4)
        OR (expediteur_id = $3 AND expediteur_type = $4 AND destinataire_id = $1 AND destinataire_type = $2)
     ORDER BY created_at ASC`,
    [myId, role, parseInt(contactId), type]
  );
  // Marquer comme lus
  await pool.query(
    `UPDATE messages SET lu = TRUE
     WHERE destinataire_id = $1 AND destinataire_type = $2
       AND expediteur_id = $3 AND expediteur_type = $4 AND lu = FALSE`,
    [myId, role, parseInt(contactId), type]
  );
  res.json(result.rows);
});

// POST /api/messagerie — envoyer un message
router.post('/', auth, async (req, res) => {
  const { id, role } = req.user;
  const { destinataire_type, destinataire_id, contenu } = req.body;
  if (!contenu?.trim()) return res.status(400).json({ error: 'Message vide' });

  const result = await pool.query(
    `INSERT INTO messages (expediteur_type, expediteur_id, destinataire_type, destinataire_id, contenu)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [role, id, destinataire_type, parseInt(destinataire_id), contenu.trim()]
  );
  res.status(201).json(result.rows[0]);
});

module.exports = router;
```

---

## 🌐 FRONTEND — Appels API (à intégrer dans index.html)

```javascript
const API = 'http://localhost:3000/api';
let TOKEN = localStorage.getItem('esf_token');
let CURRENT_USER = JSON.parse(localStorage.getItem('esf_user') || 'null');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`
});

// --- AUTH ---
async function login(matricule, filiere_code) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matricule, filiere_code })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  TOKEN = data.token;
  CURRENT_USER = data.etudiant;
  localStorage.setItem('esf_token', TOKEN);
  localStorage.setItem('esf_user', JSON.stringify(CURRENT_USER));
  return data;
}

async function register(matricule, filiere_code, nom, prenom, email) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matricule, filiere_code, nom, prenom, email })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

function logout() {
  localStorage.removeItem('esf_token');
  localStorage.removeItem('esf_user');
  TOKEN = null; CURRENT_USER = null;
  showLoginPage();
}

// --- FILIÈRES ---
async function getFilieres() {
  const res = await fetch(`${API}/filieres`);
  return res.json();
}

async function getMatieres(filiere_code) {
  const res = await fetch(`${API}/filieres/${filiere_code}/matieres`, { headers: headers() });
  return res.json();
}

// --- ÉPREUVES ---
async function getEpreuves(filiere = '', annee = '', correction = '') {
  const params = new URLSearchParams();
  if (filiere) params.append('filiere', filiere);
  if (annee) params.append('annee', annee);
  if (correction) params.append('correction', correction);
  const res = await fetch(`${API}/epreuves?${params}`, { headers: headers() });
  return res.json();
}

async function addEpreuve(data) {
  const res = await fetch(`${API}/epreuves`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
}

// --- ABSENCES ---
async function getAbsences() {
  const res = await fetch(`${API}/absences/moi`, { headers: headers() });
  return res.json();
}

async function getAbsenceStats() {
  const res = await fetch(`${API}/absences/stats`, { headers: headers() });
  return res.json();
}

// --- MESSAGERIE ---
async function getMessages(type, contactId) {
  const res = await fetch(`${API}/messagerie/${type}/${contactId}`, { headers: headers() });
  return res.json();
}

async function sendMessage(destinataire_type, destinataire_id, contenu) {
  const res = await fetch(`${API}/messagerie`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ destinataire_type, destinataire_id, contenu })
  });
  return res.json();
}
```

---

## 📦 INSTALLATION

```bash
# 1. Initialiser le projet
mkdir esf-espace-etudiant && cd esf-espace-etudiant
npm init -y

# 2. Installer les dépendances backend
npm install express pg bcrypt jsonwebtoken dotenv cors

# 3. Créer la base de données PostgreSQL
psql -U postgres -c "CREATE DATABASE esf_espace_etudiant;"
psql -U postgres -d esf_espace_etudiant -f database/schema.sql

# 4. Configurer le .env (voir modèle ci-dessus)

# 5. Lancer le serveur
node backend/server.js

# 6. Ouvrir frontend/index.html dans le navigateur
```

---

## 🎨 DESIGN FRONTEND

```
Thème      : Sombre élégant
Fond       : #0a0e1a
Surface    : #111827
Accent     : #c8a84b (or — couleur du Faucon ESF)
Danger     : #ef4444
Succès     : #22c55e
Polices    : Playfair Display (titres) + DM Sans (texte)
Onglets    : Tableau de bord / Filières & Matières / Épreuves / Absences / Messagerie
```

---

## 📚 12 FILIÈRES OFFICIELLES ESF LE FAUCON

| Code | Filière | Emoji |
|------|---------|-------|
| ABB  | Analyses Biologiques et Biochimiques | 🔬 |
| BTP  | Bâtiments et Travaux Publics | 🏗️ |
| GT   | Géomètre Topographe | 🗺️ |
| GEER | Génie Électrique et Énergies Renouvelables | ⚡ |
| SIL  | Système Informatique et Logiciel | 💻 |
| BFA  | Banque Finance Assurance | 🏦 |
| FCA  | Finance Comptabilité Audit | 📊 |
| GRH  | Gestion des Ressources Humaines | 👥 |
| MCC  | Marketing Communication Commerce | 📣 |
| TL   | Transport et Logistique | 🚚 |
| HT   | Hôtellerie et Tourisme | 🏨 |
| GETE | Génie de l'Environnement – Traitement des Déchets et Eaux | 🌿 |

---

## 🔐 RÈGLES DE SÉCURITÉ

- Connexion par **matricule + filière uniquement** (pas de mot de passe au départ)
- Tous les endpoints sauf `/auth/login` et `/auth/register` requièrent un **JWT valide**
- Le JWT expire après **8 heures**
- Les matricules sont stockés en **majuscules**
- Un étudiant ne peut accéder qu'à **ses propres absences**
- Un étudiant ne peut supprimer que **les épreuves qu'il a lui-même ajoutées**

---

*Projet : Espace Étudiant ESF Le Faucon — Abomey-Calavi, Bénin*
*Source filières : esfbenin.net*
