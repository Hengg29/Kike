<?php
// check-payment.php
// Verificar si el usuario ya pagó

require_once 'config.php';

// Obtener email del usuario (desde sesión o parámetro)
$user_email = $_GET['email'] ?? '';

if (empty($user_email)) {
    echo json_encode(['paid' => false]);
    exit;
}

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Buscar pagos del usuario
    $stmt = $pdo->prepare("
        SELECT * FROM payments 
        WHERE payer_email = ? AND status = 'completed' 
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    
    $stmt->execute([$user_email]);
    $payment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($payment) {
        echo json_encode([
            'paid' => true,
            'service' => $payment['service'],
            'amount' => $payment['amount'],
            'payment_date' => $payment['created_at']
        ]);
    } else {
        echo json_encode(['paid' => false]);
    }
    
} catch (Exception $e) {
    echo json_encode(['paid' => false, 'error' => $e->getMessage()]);
}
?>
