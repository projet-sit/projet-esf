<?php
// Traitement du formulaire de contact ESF avec enregistrement en base de données

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération et nettoyage basique des données
    $nom     = isset($_POST['nom']) ? trim($_POST['nom']) : '';
    $email   = isset($_POST['email']) ? trim($_POST['email']) : '';
    $sujet   = isset($_POST['sujet']) ? trim($_POST['sujet']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Validation minimale côté serveur
    if ($nom === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
        header('Location: nous_contacter.html?success=0');
        exit;
    }

    // Paramètres de connexion à la base MySQL (à adapter à ton serveur)
    $dbHost = 'localhost';
    $dbName = 'esf_site';
    $dbUser = 'root';
    $dbPass = '';

    try {
        $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);

        $stmt = $pdo->prepare('
            INSERT INTO contact_messages (nom, email, sujet, message, created_at)
            VALUES (:nom, :email, :sujet, :message, NOW())
        ');

        $stmt->execute([
            ':nom'     => $nom,
            ':email'   => $email,
            ':sujet'   => $sujet,
            ':message' => $message,
        ]);

        // Redirection vers la page de contact avec message de succès
        header('Location: nous_contacter.html?success=1');
        exit;
    } catch (PDOException $e) {
        // En cas d'erreur de base de données, on peut loguer l'erreur et renvoyer un échec générique
        // error_log('Erreur DB contact.php : ' . $e->getMessage());
        header('Location: nous_contacter.html?success=0');
        exit;
    }
}

// Si accès direct sans POST, on renvoie vers la page de contact
header('Location: nous_contacter.html');
exit;

