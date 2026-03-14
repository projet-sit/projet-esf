<?php
// Petite interface d'administration pour consulter les messages de contact

// --- Protection très simple par mot de passe --- //
session_start();

$adminPassword = 'RICHO123'; // À changer avant mise en production

if (isset($_POST['password'])) {
    if ($_POST['password'] === $adminPassword) {
        $_SESSION['esf_admin'] = true;
    } else {
        $error = 'Mot de passe incorrect.';
    }
}

if (!isset($_SESSION['esf_admin']) || $_SESSION['esf_admin'] !== true) {
    ?>
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Connexion Admin — Messages Contact</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #0f172a;
                color: #e5e7eb;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }
            .login-box {
                background: #111827;
                padding: 30px 40px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                min-width: 320px;
            }
            h1 {
                font-size: 20px;
                margin-bottom: 20px;
                text-align: center;
            }
            label {
                display: block;
                margin-bottom: 6px;
                font-size: 14px;
            }
            input[type="password"] {
                width: 100%;
                padding: 10px;
                border-radius: 6px;
                border: 1px solid #4b5563;
                background: #020617;
                color: #e5e7eb;
                margin-bottom: 12px;
            }
            button {
                width: 100%;
                padding: 10px;
                border-radius: 6px;
                border: none;
                background: #3b82f6;
                color: white;
                font-weight: 600;
                cursor: pointer;
            }
            .error {
                color: #f97316;
                font-size: 13px;
                margin-bottom: 8px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h1>Admin — Messages de contact</h1>
            <?php if (!empty($error)): ?>
                <div class="error"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
            <?php endif; ?>
            <form method="post">
                <label for="password">Mot de passe administrateur</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// --- Si connecté, on affiche la liste des messages --- //

// Paramètres DB (doivent correspondre à contact.php)
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

    $stmt = $pdo->query('SELECT id, nom, email, sujet, message, created_at FROM contact_messages ORDER BY created_at DESC');
    $messages = $stmt->fetchAll();
} catch (PDOException $e) {
    die('Erreur de connexion à la base de données : ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8'));
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Messages de contact — ESF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #0f172a;
            color: #e5e7eb;
            margin: 0;
            padding: 20px;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: #020617;
        }
        th, td {
            padding: 10px;
            border-bottom: 1px solid #1f2937;
            vertical-align: top;
            font-size: 14px;
        }
        th {
            background: #111827;
            text-align: left;
        }
        tr:nth-child(even) td {
            background: #020617;
        }
        tr:nth-child(odd) td {
            background: #030712;
        }
        .email {
            color: #60a5fa;
        }
        .date {
            font-size: 12px;
            color: #9ca3af;
        }
        .message {
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <h1>Messages de contact — ESF</h1>
    <?php if (empty($messages)): ?>
        <p>Aucun message pour le moment.</p>
    <?php else: ?>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Sujet</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($messages as $msg): ?>
                    <tr>
                        <td><?php echo (int)$msg['id']; ?></td>
                        <td class="date"><?php echo htmlspecialchars($msg['created_at'], ENT_QUOTES, 'UTF-8'); ?></td>
                        <td><?php echo htmlspecialchars($msg['nom'], ENT_QUOTES, 'UTF-8'); ?></td>
                        <td class="email"><?php echo htmlspecialchars($msg['email'], ENT_QUOTES, 'UTF-8'); ?></td>
                        <td><?php echo htmlspecialchars($msg['sujet'], ENT_QUOTES, 'UTF-8'); ?></td>
                        <td class="message"><?php echo nl2br(htmlspecialchars($msg['message'], ENT_QUOTES, 'UTF-8')); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</body>
</html>

