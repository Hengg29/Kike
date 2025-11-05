<?php
// save-booking.php
// Guardar reserva cuando el usuario complete el proceso en Calendly
// MEJORADO: Previene dobles reservaciones

require_once 'config.php';

// Debug logging
error_log("🔍 save-booking.php called");

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("❌ Method not allowed: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Obtener datos de la reserva
$input = json_decode(file_get_contents('php://input'), true);
error_log("📥 Received booking data: " . json_encode($input));

$customer_email = $input['customer_email'] ?? '';
$customer_name = $input['customer_name'] ?? '';
$customer_phone = $input['customer_phone'] ?? '';
$service = $input['service'] ?? '';
$appointment_date = $input['appointment_date'] ?? '';
$calendly_event_id = $input['calendly_event_id'] ?? '';

// Validar datos
if (empty($customer_email) || empty($customer_name) || empty($appointment_date)) {
    error_log("❌ Missing required fields: email=$customer_email, name=$customer_name, date=$appointment_date");
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("✅ Database connected successfully");

    $stmt = $pdo->prepare("
        SELECT COUNT(*) as booking_count, MAX(id) as last_booking_id
        FROM bookings 
        WHERE customer_email = ? 
        AND status IN ('confirmed', 'pending')
        AND appointment_date > DATE_SUB(NOW(), INTERVAL 1 DAY)
    ");
    $stmt->execute([$customer_email]);
    $check_result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($check_result['booking_count'] > 0) {
        error_log("⚠️ User already has an active booking: email='$customer_email', booking_id=" . $check_result['last_booking_id']);
        http_response_code(409); // Conflict
        echo json_encode([
            'error' => 'DUPLICATE_BOOKING',
            'message' => 'Ya tienes una cita confirmada',
            'has_booking' => true,
            'booking_id' => $check_result['last_booking_id']
        ]);
        exit;
    }

    // Obtener ID del servicio
    $stmt = $pdo->prepare("SELECT id FROM services WHERE name LIKE ?");
    $stmt->execute(['%' . $service . '%']);
    $service_result = $stmt->fetch(PDO::FETCH_ASSOC);
    $service_id = $service_result ? $service_result['id'] : null;
    
    error_log("🔍 Service lookup: service='$service', service_id=$service_id");
    
    // Obtener ID del pago más reciente del usuario
    $stmt = $pdo->prepare("
        SELECT id FROM payments 
        WHERE payer_email = ? AND status = 'completed' 
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $stmt->execute([$customer_email]);
    $payment_result = $stmt->fetch(PDO::FETCH_ASSOC);
    $payment_id = $payment_result ? $payment_result['id'] : null;
    
    error_log("🔍 Payment lookup: email='$customer_email', payment_id=$payment_id");

    if (!$payment_id) {
        error_log("❌ No valid payment found for user: $customer_email");
        http_response_code(403);
        echo json_encode([
            'error' => 'NO_PAYMENT',
            'message' => 'No se encontró un pago válido'
        ]);
        exit;
    }

    // Insertar reserva
    $stmt = $pdo->prepare("
        INSERT INTO bookings (
            payment_id, calendly_event_id, customer_name, customer_email, 
            customer_phone, service_id, appointment_date, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', NOW())
    ");
    
    $result = $stmt->execute([
        $payment_id, $calendly_event_id, $customer_name, $customer_email,
        $customer_phone, $service_id, $appointment_date
    ]);
    
    error_log("🔍 Booking insert result: " . ($result ? 'SUCCESS' : 'FAILED'));
    
    if ($result) {
        // Obtener ID de la reserva insertada
        $booking_id = $pdo->lastInsertId();
        
        error_log("✅ Booking saved successfully with ID: $booking_id");
        error_log("Booking details: email=$customer_email, service=$service, date=$appointment_date");
        
        echo json_encode([
            'success' => true,
            'booking_id' => $booking_id,
            'message' => 'Booking saved successfully',
            'has_booking' => true
        ]);
    } else {
        error_log("❌ Failed to save booking");
        throw new Exception('Failed to save booking');
    }
    
} catch (Exception $e) {
    error_log("❌ Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
