<?php
// check-payment-status.php
// Verificar si el usuario ya tiene un pago válido

require_once 'config.php';

// Obtener email del usuario (puedes usar session, cookie, o parámetro)
$user_email = $_GET['email'] ?? $_SESSION['user_email'] ?? '';

if (empty($user_email)) {
    echo json_encode(['has_payment' => false, 'message' => 'No email provided']);
    exit;
}

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar si hay un pago válido en las últimas 24 horas
    $stmt = $pdo->prepare("
        SELECT service, amount, created_at 
        FROM payments 
        WHERE payer_email = ? 
        AND status = 'completed' 
        AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $stmt->execute([$user_email]);
    $payment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($payment) {
        echo json_encode([
            'has_payment' => true,
            'service' => $payment['service'],
            'amount' => $payment['amount'],
            'payment_date' => $payment['created_at'],
            'message' => 'Payment found'
        ]);
    } else {
        echo json_encode([
            'has_payment' => false,
            'message' => 'No valid payment found'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'has_payment' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
