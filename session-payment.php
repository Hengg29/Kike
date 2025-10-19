<?php
// session-payment.php
// Manejar sesiones de pago

session_start();

// Verificar si hay una sesión de pago activa
if (isset($_SESSION['payment_completed']) && isset($_SESSION['payment_timestamp'])) {
    $hoursSincePayment = (time() - $_SESSION['payment_timestamp']) / 3600;
    
    if ($hoursSincePayment < 24) {
        // Pago válido, mostrar calendario
        echo json_encode([
            'has_payment' => true,
            'service' => $_SESSION['payment_service'],
            'message' => 'Payment session active'
        ]);
    } else {
        // Sesión expirada
        unset($_SESSION['payment_completed']);
        unset($_SESSION['payment_timestamp']);
        unset($_SESSION['payment_service']);
        echo json_encode(['has_payment' => false, 'message' => 'Session expired']);
    }
} else {
    echo json_encode(['has_payment' => false, 'message' => 'No active session']);
}
?>
