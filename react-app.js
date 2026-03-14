// Application React pour les pages ESF
// Utilise React 18 via CDN + Babel (voir les balises <script> ajoutées dans les pages HTML).

const { useState } = React;

// ==========================
// LAYOUT GLOBAL (Header / Footer)
// ==========================

function Header({ active }) {
  function linkClass(page) {
    return page === active ? "active" : "";
  }

  return React.createElement(
    "header",
    null,
    React.createElement(
      "nav",
      { className: "menu" },
      React.createElement(
        "div",
        { className: "logo" },
        React.createElement(
          "a",
          { href: "accueil.html" },
          React.createElement("img", {
            src: "images/logo.png",
            alt: "Logo ESF Bénin"
          })
        )
      ),
      React.createElement(
        "ul",
        { className: "nav-links", id: "navLinks" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "accueil.html", className: linkClass("accueil") },
            "Accueil"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "filiere.html", className: linkClass("filiere") },
            "Nos Filières"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "admission.html", className: linkClass("admission") },
            "Admission"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "nous_contacter.html", className: linkClass("contact") },
            "Nous Contacter"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "vie_universitaire.html", className: linkClass("vie") },
            "Vie Universitaire"
          )
        )
      ),
      React.createElement(
        "div",
        {
          className: "bar",
          id: "hamburger",
          onClick: typeof toggleMenu === "function" ? toggleMenu : undefined
        },
        React.createElement("span", null),
        React.createElement("span", null),
        React.createElement("span", null)
      )
    )
  );
}

function Footer() {
  return React.createElement(
    "footer",
    null,
    React.createElement(
      "p",
      null,
      "\xA9 2026 ESF Bénin \u2014 Tous droits r\xE9serv\xE9s. | ",
      React.createElement(
        "a",
        { href: "nous_contacter.html" },
        "Nous Contacter"
      )
    )
  );
}

function PageLayout({ active, children }) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Header, { active }),
    React.createElement("main", null, children),
    React.createElement(Footer, null)
  );
}

// ==========================
// VIE UNIVERSITAIRE
// ==========================

const vieClubs = [
  {
    title: "Club Informatique",
    description:
      "Développement web, programmation, hackathons et projets innovants. Un espace pour les passionnés de technologie.",
    badge: "Technologie"
  },
  {
    title: "Club Sports",
    description:
      "Football, basketball, volleyball… Des tournois réguliers pour promouvoir l'esprit d'équipe et le bien-être.",
    badge: "Esprit d'équipe"
  },
  {
    title: "Club Culture & Arts",
    description:
      "Théâtre, musique, danse et expositions artistiques. Le club encourage la créativité et l'expression culturelle.",
    badge: "Créativité"
  },
  {
    title: "Club Environnement",
    description:
      "Actions de sensibilisation écologique, nettoyage du campus et projets de développement durable.",
    badge: "Écologie"
  }
];

const vieServices = [
  {
    title: "Bibliothèque",
    description:
      "Une bibliothèque moderne avec des milliers de livres, des accès numériques et des espaces de travail en groupe."
  },
  {
    title: "Laboratoires",
    description:
      "Des laboratoires dernière génération pour les travaux pratiques en biologie, chimie et informatique."
  },
  {
    title: "Restauration",
    description:
      "Un restaurant étudiant proposant des repas équilibrés et abordables chaque jour de la semaine."
  },
  {
    title: "Soutien Médical",
    description:
      "Un infirmier est disponible sur le campus pour assurer le suivi de santé des étudiants au quotidien."
  }
];

const vieEvents = [
  {
    title: "Cérémonie de Remise des Diplômes",
    description:
      "Chaque année, une cérémonie est organisée pour célébrer les diplômés et leur remettre leur titre officiellement."
  },
  {
    title: "Tournois Sportifs Inter-Écoles",
    description:
      "L'ESF participe aux compétitions sportives inter-écoles pour développer l'esprit de compétition."
  },
  {
    title: "Conférences & Séminaires",
    description:
      "Des experts professionnels interviennent régulièrement pour enrichir le parcours académique des étudiants."
  },
  {
    title: "Fête de l'École",
    description:
      "Une fête annuelle réunissant étudiants, enseignants et partenaires pour célébrer l'esprit de l'ESF."
  }
];

function VieCard({ title, description, badge }) {
  return React.createElement(
    "div",
    { className: "vie-card" },
    badge
      ? React.createElement(
          "div",
          { className: "highlight-badge" },
          badge
        )
      : null,
    React.createElement("div", { className: "card-icon" }, "★"),
    React.createElement(
      "div",
      { className: "card-body" },
      React.createElement("h3", null, title),
      React.createElement("p", null, description)
    )
  );
}

function VieUniversitairePage() {
  return React.createElement(
    PageLayout,
    { active: "vie" },
    React.createElement(
      "section",
      { className: "vie-hero" },
      React.createElement(
        "h1",
        null,
        "Vie Universitaire"
      ),
      React.createElement(
        "p",
        null,
        "À l'ESF, l'expérience universitaire va bien au-delà des cours. Découvrez les clubs, les événements et les services qui font de notre campus un lieu de vie animé."
      )
    ),
    React.createElement(
      "section",
      { className: "vie-section" },
      React.createElement("h2", null, "Clubs & Associations"),
      React.createElement(
        "div",
        { className: "vie-grid" },
        vieClubs.map((card, index) =>
          React.createElement(VieCard, {
            key: index,
            title: card.title,
            description: card.description,
            badge: card.badge
          })
        )
      )
    ),
    React.createElement(
      "section",
      { className: "vie-section alt" },
      React.createElement("h2", null, "Services pour les Étudiants"),
      React.createElement(
        "div",
        { className: "vie-grid" },
        vieServices.map((card, index) =>
          React.createElement(VieCard, {
            key: index,
            title: card.title,
            description: card.description
          })
        )
      )
    ),
    React.createElement(
      "section",
      { className: "vie-section" },
      React.createElement("h2", null, "Événements & Manifestations"),
      React.createElement(
        "div",
        { className: "vie-grid" },
        vieEvents.map((card, index) =>
          React.createElement(VieCard, {
            key: index,
            title: card.title,
            description: card.description
          })
        )
      )
    )
  );
}

// ==========================
// NOUS CONTACTER
// ==========================

function ContactForm() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};
    if (!form.nom.trim()) {
      newErrors.nom = "Veuillez entrer votre nom.";
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      newErrors.email = "Veuillez entrer un email valide.";
    }
    if (!form.sujet) {
      newErrors.sujet = "Veuillez choisir un sujet.";
    }
    if (!form.message.trim()) {
      newErrors.message = "Veuillez écrire un message.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    if (!validate()) {
      e.preventDefault();
    }
  }

  return React.createElement(
    "form",
    {
      className: "contact-form",
      id: "contactForm",
      action: "contact.php",
      method: "post",
      onSubmit: handleSubmit,
      noValidate: true
    },
    React.createElement("h2", null, "Envoyer un Message"),
    React.createElement(
      "div",
      { className: "form-group" },
      React.createElement("label", { htmlFor: "nom" }, "Votre Nom"),
      React.createElement("input", {
        type: "text",
        id: "nom",
        name: "nom",
        value: form.nom,
        onChange: handleChange,
        placeholder: "Ex : Marc ALIOU"
      }),
      errors.nom
        ? React.createElement(
            "small",
            { style: { color: "#b91c1c" } },
            errors.nom
          )
        : null
    ),
    React.createElement(
      "div",
      { className: "form-group" },
      React.createElement("label", { htmlFor: "email" }, "Votre Email"),
      React.createElement("input", {
        type: "email",
        id: "email",
        name: "email",
        value: form.email,
        onChange: handleChange,
        placeholder: "Ex : jean@email.com"
      }),
      errors.email
        ? React.createElement(
            "small",
            { style: { color: "#b91c1c" } },
            errors.email
          )
        : null
    ),
    React.createElement(
      "div",
      { className: "form-group" },
      React.createElement("label", { htmlFor: "sujet" }, "Sujet"),
      React.createElement(
        "select",
        {
          id: "sujet",
          name: "sujet",
          value: form.sujet,
          onChange: handleChange
        },
        React.createElement(
          "option",
          { value: "" },
          "Choisissez un sujet"
        ),
        React.createElement(
          "option",
          { value: "admission" },
          "Admission"
        ),
        React.createElement(
          "option",
          { value: "filiere" },
          "Information sur une filière"
        ),
        React.createElement(
          "option",
          { value: "frais" },
          "Frais de scolarité"
        ),
        React.createElement("option", { value: "autre" }, "Autre")
      ),
      errors.sujet
        ? React.createElement(
            "small",
            { style: { color: "#b91c1c" } },
            errors.sujet
          )
        : null
    ),
    React.createElement(
      "div",
      { className: "form-group" },
      React.createElement(
        "label",
        { htmlFor: "message" },
        "Votre Message"
      ),
      React.createElement("textarea", {
        id: "message",
        name: "message",
        value: form.message,
        onChange: handleChange,
        placeholder: "Écrivez votre message ici..."
      }),
      errors.message
        ? React.createElement(
            "small",
            { style: { color: "#b91c1c" } },
            errors.message
          )
        : null
    ),
    React.createElement(
      "button",
      { className: "btn-submit", type: "submit" },
      "Envoyer"
    ),
    React.createElement(
      "div",
      { className: "msg-success", id: "msgSuccess" },
      "Merci ! Votre message a bien été envoyé. Nous vous répondons bientôt."
    )
  );
}

function NousContacterPage() {
  return React.createElement(
    PageLayout,
    { active: "contact" },
    React.createElement(
      "section",
      { className: "vie-hero" },
      React.createElement("h1", null, "Nous Contacter"),
      React.createElement(
        "p",
        null,
        "Vous avez une question ? N'hésitez pas à nous écrire. Nous vous répondons dans les plus brefs délais."
      )
    ),
    React.createElement(
      "section",
      { className: "contact-section" },
      React.createElement(
        "div",
        { className: "contact-wrapper" },
        React.createElement(
          "div",
          { className: "contact-info" },
          React.createElement("h2", null, "Nos Coordonnées"),
          React.createElement(
            "div",
            { className: "info-item" },
            React.createElement("span", { className: "info-icon" }, "📍"),
            React.createElement(
              "p",
              null,
              React.createElement("strong", null, "Adresse"),
              React.createElement("br", null),
              "ESF — Abomey-Calavi, derrière la Pharmacie Château d'eau, Bénin"
            )
          ),
          React.createElement(
            "div",
            { className: "info-item" },
            React.createElement("span", { className: "info-icon" }, "☎"),
            React.createElement(
              "p",
              null,
              React.createElement("strong", null, "Téléphones"),
              React.createElement("br", null),
              "+229 01 96 46 16 11",
              React.createElement("br", null),
              "+229 01 94 33 86 72"
            )
          ),
          React.createElement(
            "div",
            { className: "info-item" },
            React.createElement("span", { className: "info-icon" }, "✉"),
            React.createElement(
              "p",
              null,
              React.createElement("strong", null, "Email"),
              React.createElement("br", null),
              "contact@esfbenin.net"
            )
          ),
          React.createElement(
            "div",
            { className: "info-item" },
            React.createElement("span", { className: "info-icon" }, "⏰"),
            React.createElement(
              "p",
              null,
              React.createElement("strong", null, "Horaires"),
              React.createElement("br", null),
              "Lundi – Vendredi : 08h00 – 17h00",
              React.createElement("br", null),
              "Samedi : 08h00 – 12h00"
            )
          )
        ),
        React.createElement(ContactForm, null)
      )
    )
  );
}

// ==========================
// FILIÈRES
// ==========================

const filieres = [
  {
    title: "Analyses Biologiques et Biochimiques",
    description:
      "Formation axée sur les analyses en laboratoire pour la santé, l'environnement et l'industrie. Formation de techniciens pour les laboratoires médicaux, pharmaceutiques et de recherche.",
    image:
      "https://esfbenin.net/wp-content/uploads/2022/09/GenieBiologiqueflyer.jpg"
  },
  {
    title: "Bâtiment et Travaux Publics",
    description:
      "Conception et réalisation d'infrastructures : routes, ponts, bâtiments et œuvres de génie civil.",
    image:
      "https://esfbenin.net/wp-content/uploads/2022/09/BTPflyer.jpg"
  },
  {
    title: "Géomètre Topographe",
    description:
      "Mesure des terrains, levés topographiques et élaboration de plans de construction.",
    image:
      "https://esfbenin.net/wp-content/uploads/2022/09/btpflyers.jpg"
  },
  {
    title: "Génie Électrique et Énergies Renouvelables",
    description:
      "Installation et maintenance des systèmes électriques, solaires et des énergies renouvelables.",
    image:
      "https://esfbenin.net/wp-content/uploads/2021/01/GENIE-ELECTRIQUE-ET-ENERGIES-RENOUVELABLES-700x450.jpg"
  },
  {
    title: "Systèmes Informatiques et Logiciels",
    description:
      "Développement logiciel, réseaux, maintenance informatique et cybersécurité.",
    image:
      "https://esfbenin.net/wp-content/uploads/2022/09/Silflyer.jpg"
  },
  {
    title: "Banque, Finance et Assurance",
    description:
      "Gestion financière, crédits, évaluation des risques et produits bancaires.",
    image:
      "https://esfbenin.net/wp-content/uploads/2021/01/BANQUE-FINANCE-ASSURANCE.jpg"
  },
  {
    title: "Finance, Comptabilité et Audit",
    description:
      "Analyse financière, contrôle de gestion et audit des entreprises.",
    image:
      "https://esfbenin.net/wp-content/uploads/2021/01/FINANCE-COMPTABILITE-AUDIT.jpg"
  },
  {
    title: "Gestion des Ressources Humaines",
    description:
      "Recrutement, formation du personnel, gestion RH et relations sociales.",
    image:
      "https://esfbenin.net/wp-content/uploads/2021/01/GESTION-DES-RESSOURCES-HUMAINES.jpg"
  },
  {
    title: "Marketing, Communication et Commerce",
    description:
      "Stratégies de vente, communication digitale et gestion de la relation client.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    title: "Transport et Logistique",
    description:
      "Organisation des flux de marchandises et gestion des entrepôts.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
  },
  {
    title: "Hôtellerie et Tourisme",
    description:
      "Accueil, gestion hôtelière, organisation de voyages et développement du tourisme.",
    image:
      "https://esfbenin.net/wp-content/uploads/2022/10/HTflyer.jpg"
  },
  {
    title: "Génie de l'Environnement",
    description:
      "Protection de l'environnement, traitement des déchets et des eaux.",
    image:
      "https://esfbenin.net/wp-content/uploads/2022/08/genieenvironnement-1.jpg"
  }
];

function FiliereCard({ filiere, badge }) {
  return React.createElement(
    "div",
    { className: "filiere-card" },
    badge
      ? React.createElement(
          "div",
          { className: "badge" },
          badge
        )
      : null,
    React.createElement("img", {
      src: filiere.image,
      alt: filiere.title
    }),
    React.createElement(
      "div",
      { className: "card-body" },
      React.createElement("h3", null, filiere.title),
      React.createElement("p", null, filiere.description)
    )
  );
}

function FilieresPage() {
  const popularIndexes = [0, 4, 6];

  return React.createElement(
    PageLayout,
    { active: "filiere" },
    React.createElement(
      "section",
      { className: "filieres" },
      React.createElement("h2", null, "Nos Filières de Formation"),
      React.createElement(
        "div",
        { className: "filieres-grid" },
        filieres.map((filiere, index) =>
          React.createElement(FiliereCard, {
            key: filiere.title,
            filiere,
            badge: popularIndexes.includes(index) ? "Populaire" : null
          })
        )
      )
    )
  );
}

// ==========================
// ACCUEIL
// ==========================

function AccueilPage() {
  return React.createElement(
    PageLayout,
    { active: "accueil" },
    React.createElement(
      "section",
      { className: "hero" },
      React.createElement("img", {
        src: "https://esfbenin.net/wp-content/uploads/2019/07/building_esf.jpg",
        alt: "Bâtiment de l'ESF"
      }),
      React.createElement("h2", null, "Innovation et Savoir-faire")
    ),
    React.createElement(
      "section",
      { className: "stats" },
      React.createElement(
        "div",
        { className: "stat-card" },
        React.createElement("h3", null, "+11 Diplômes"),
        React.createElement(
          "p",
          null,
          "Tous reconnus par l'État béninois."
        )
      ),
      React.createElement(
        "div",
        { className: "stat-card" },
        React.createElement("h3", null, "Pôle d'Excellence"),
        React.createElement(
          "p",
          null,
          "Grâce à une pédagogie efficiente."
        )
      ),
      React.createElement(
        "div",
        { className: "stat-card" },
        React.createElement("h3", null, "+60 Enseignants"),
        React.createElement(
          "p",
          null,
          "Professeurs titulaires, docteurs, etc."
        )
      ),
      React.createElement(
        "div",
        { className: "stat-card" },
        React.createElement("h3", null, "+30 Partenaires"),
        React.createElement(
          "p",
          null,
          "Entreprises, institutions publiques."
        )
      )
    ),
    React.createElement(
      "section",
      { className: "motif" },
      React.createElement("h2", null, "Pourquoi Nous Choisir ?"),
      React.createElement(
        "p",
        null,
        "Nous ne faisons pas que donner aux étudiants une formation et des expériences qui les préparent au succès dans leur carrière."
      ),
      React.createElement(
        "p",
        null,
        "Nous les aidons à réussir, à découvrir un domaine qui les passionne et à être les meilleurs."
      )
    ),
    React.createElement(
      "section",
      { className: "about" },
      React.createElement(
        "h2",
        null,
        "À Propos de Notre École"
      ),
      React.createElement(
        "p",
        null,
        "Nous sommes l'une des meilleures écoles de Technologie et de Management du Bénin."
      ),
      React.createElement(
        "p",
        null,
        "L'École Supérieure le Faucon (ESF) est une école de Technologie et de Management, située à Abomey-Calavi derrière la Pharmacie Château d'eau. Elle offre aux étudiants un cadre agréable de formation pratique et théorique. Elle a été créée par l'Arrêté Ministériel N°017/MESRS du 28 décembre 2007."
      ),
      React.createElement(
        "a",
        { href: "#details", className: "btn-details" },
        "En Savoir Plus"
      )
    ),
    React.createElement(
      "section",
      { id: "details" },
      React.createElement(
        "div",
        { className: "directeur-wrapper" },
        React.createElement(
          "div",
          { className: "directeur-photo" },
          React.createElement("img", {
            src: "https://esfbenin.net/wp-content/uploads/2021/01/photo_dg-Copie.jpg",
            alt: "M. SOARES Michel — Directeur Général"
          }),
          React.createElement("h2", null, "M. SOARES Michel"),
          React.createElement("p", null, "Directeur Général")
        ),
        React.createElement(
          "div",
          { className: "directeur-texte" },
          React.createElement(
            "h3",
            null,
            "ESF \u2014 Centre d'Excellence"
          ),
          React.createElement(
            "p",
            null,
            "Depuis sa création, l'ESF se veut être un pôle éducatif d'excellence. Elle s'est entourée de professionnels et d'universitaires compétents qui savent transmettre facilement à leurs étudiants les connaissances théoriques et pratiques liées à leur formation."
          ),
          React.createElement(
            "p",
            null,
            "Elle met également à la disposition de ses apprenants des laboratoires de travaux pratiques et leur permet, à la fin de chaque année académique, de bénéficier d'un stage pratique en entreprise."
          ),
          React.createElement(
            "p",
            null,
            "La devise de l'ESF est l'",
            React.createElement("strong", null, "Innovation et le Savoir-faire"),
            ". Elle offre chaque année à ses étudiants de meilleures conditions d'apprentissage, d'hygiène et de sécurité. Elle finance également les start-up innovantes créées par ses étudiants."
          ),
          React.createElement(
            "p",
            null,
            "Les résultats aux examens nationaux de Licence Professionnelle depuis 2017 sont très satisfaisants :"
          ),
          React.createElement(
            "ul",
            { className: "resultats-liste" },
            React.createElement(
              "li",
              null,
              "Bâtiments et Travaux Publics : ",
              React.createElement("strong", null, "100%"),
              " (2017 et 2018)"
            ),
            React.createElement(
              "li",
              null,
              "Analyses Biologiques et Biochimiques : ",
              React.createElement("strong", null, "85%"),
              " (2017 et 2018)"
            ),
            React.createElement(
              "li",
              null,
              "Finance Comptabilité Audit : ",
              React.createElement("strong", null, "100%"),
              " (2018)"
            )
          ),
          React.createElement(
            "p",
            null,
            "L'ESF a reçu un avis favorable pour l'agrément par la Commission des Agréments du Conseil Consultatif National de l'Enseignement Supérieur dans ses différentes filières de formation en Licence Professionnelle."
          )
        )
      )
    )
  );
}

// ==========================
// ADMISSION
// ==========================

const stepsAdmission = [
  {
    title: "1. Choisir une Filière",
    description:
      "Consultez les 12 filières ci-dessous et choisissez celle qui correspond à votre passion et vos objectifs professionnels."
  },
  {
    title: "2. Préparer Votre Dossier",
    description:
      "Relevé de notes du BAC, copie du diplôme, photo d'identité, curriculum vitae et certificat de naissance."
  },
  {
    title: "3. Déposer Votre Dossier",
    description:
      "Rendez-vous à l'ESF à Abomey-Calavi ou inscrivez-vous en ligne via le lien ci-dessous."
  },
  {
    title: "4. Confirmation",
    description:
      "Vous recevrez une confirmation d'admission dans les 5 jours ouvrables après le dépôt de votre dossier complet."
  }
];

function AdmissionStepCard({ step }) {
  return React.createElement(
    "div",
    { className: "vie-card" },
    React.createElement("div", { className: "card-icon" }, "✓"),
    React.createElement(
      "div",
      { className: "card-body" },
      React.createElement("h3", null, step.title),
      React.createElement("p", null, step.description)
    )
  );
}

function AdmissionPage() {
  return React.createElement(
    PageLayout,
    { active: "admission" },
    React.createElement(
      "section",
      { className: "vie-hero" },
      React.createElement("h1", null, "Admission à l'ESF"),
      React.createElement(
        "p",
        null,
        "Rejoignez une école qui forme les professionnels de demain. Découvrez nos conditions d'admission et nos 12 filières de formation en Licence Professionnelle."
      )
    ),
    React.createElement(
      "section",
      { className: "vie-section" },
      React.createElement("h2", null, "Comment S'Inscrire ?"),
      React.createElement(
        "div",
        { className: "vie-grid" },
        stepsAdmission.map((step, index) =>
          React.createElement(AdmissionStepCard, { key: index, step })
        )
      ),
      React.createElement(
        "div",
        {
          style: {
            textAlign: "center",
            marginTop: 30
          }
        },
        React.createElement(
          "a",
          {
            href: "https://progiciel.geststudent.net/Inscription/index.php?id=1055",
            target: "_blank",
            rel: "noreferrer",
            className: "btn-details",
            style: { fontSize: 17, padding: "14px 32px" }
          },
          "S'Inscrire en Ligne"
        )
      )
    ),
    React.createElement(
      "section",
      { className: "filieres", style: { paddingTop: 40 } },
      React.createElement("h2", null, "Nos 12 Filières de Formation"),
      React.createElement(
        "p",
        {
          style: {
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: 30,
            fontSize: 15
          }
        },
        "Cliquez sur une filière pour voir les détails (BAC requis, débouchés, unités d'enseignement)"
      ),
      React.createElement(
        "div",
        null,
        "Pour garder ton HTML simple, on conserve ici la version détaillée statique telle qu'elle est actuellement dans ",
        "admission.html",
        " (cartes dépliables). Si tu veux, on pourra aussi la convertir entièrement en React plus tard."
      )
    )
  );
}

// ==========================
// MONTAGE DES PAGES
// ==========================

document.addEventListener("DOMContentLoaded", function () {
  const accueilRoot = document.getElementById("react-root-accueil");
  if (accueilRoot) {
    const root = ReactDOM.createRoot(accueilRoot);
    root.render(React.createElement(AccueilPage));
  }

  const vieRoot = document.getElementById("react-root-vie");
  if (vieRoot) {
    const root = ReactDOM.createRoot(vieRoot);
    root.render(React.createElement(VieUniversitairePage));
  }

  const contactRoot = document.getElementById("react-root-contact");
  if (contactRoot) {
    const root = ReactDOM.createRoot(contactRoot);
    root.render(React.createElement(NousContacterPage));
  }

  const filiereRoot = document.getElementById("react-root-filieres");
  if (filiereRoot) {
    const root = ReactDOM.createRoot(filiereRoot);
    root.render(React.createElement(FilieresPage));
  }

  const admissionRoot = document.getElementById("react-root-admission");
  if (admissionRoot) {
    const root = ReactDOM.createRoot(admissionRoot);
    root.render(React.createElement(AdmissionPage));
  }
});

