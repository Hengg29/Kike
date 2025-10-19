<?php
// save-payment.php
// Guardar pago en base de datos después de éxito

require_once 'config.php';

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Obtener datos del pago
$input = json_decode(file_get_contents('php://input'), true);

$service = $input['service'] ?? '';
$price = $input['price'] ?? 0;
$payment_id = $input['payment_id'] ?? '';
$payer_email = $input['payer_email'] ?? '';
$status = $input['status'] ?? '';

// Validar datos
if (empty($service) || empty($payment_id) || empty($payer_email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Insertar pago
    $stmt = $pdo->prepare("
        INSERT INTO payments (service, amount, payment_intent_id, payer_email, status, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    
    $result = $stmt->execute([$service, $price, $payment_id, $payer_email, $status]);
    
    if ($result) {
        // Obtener ID del pago insertado
        $payment_db_id = $pdo->lastInsertId();
        
        // Debug logging
        error_log("✅ Payment saved successfully with ID: " . $payment_db_id);
        error_log("Payment details: service=$service, price=$price, email=$payer_email");
        
        echo json_encode([
            'success' => true,
            'payment_id' => $payment_db_id,
            'message' => 'Payment saved successfully'
        ]);
    } else {
        error_log("❌ Failed to save payment");
        throw new Exception('Failed to save payment');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
