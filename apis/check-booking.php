<?php
// check-booking.php
// Verificar si el usuario ya tiene una reserva
// MEJORADO: Retorna información detallada de la reserva

require_once 'config.php';

// Debug logging
error_log("🔍 check-booking.php called");

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("❌ Method not allowed: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Obtener datos
$input = json_decode(file_get_contents('php://input'), true);
error_log("📥 Received check data: " . json_encode($input));

$customer_email = $input['customer_email'] ?? '';

// Validar datos
if (empty($customer_email)) {
    error_log("❌ Missing customer_email");
    http_response_code(400);
    echo json_encode(['error' => 'Missing customer_email']);
    exit;
}

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("✅ Database connected successfully");

    $stmt = $pdo->prepare("
        SELECT 
            b.id,
            b.appointment_date,
            b.status,
            b.created_at,
            s.name as service_name
        FROM bookings b
        LEFT JOIN services s ON b.service_id = s.id
        WHERE b.customer_email = ? 
        AND b.status IN ('confirmed', 'pending')
        AND b.appointment_date > DATE_SUB(NOW(), INTERVAL 1 DAY)
        ORDER BY b.created_at DESC
        LIMIT 1
    ");
    $stmt->execute([$customer_email]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $has_booking = $booking !== false;
    
    error_log("🔍 Booking check: email='$customer_email', has_booking=" . ($has_booking ? 'YES' : 'NO'));
    
    if ($has_booking) {
        echo json_encode([
            'has_booking' => true,
            'booking' => [
                'id' => $booking['id'],
                'appointment_date' => $booking['appointment_date'],
                'service' => $booking['service_name'],
                'status' => $booking['status'],
                'created_at' => $booking['created_at']
            ],
            'message' => 'User already has an active booking'
        ]);
    } else {
        echo json_encode([
            'has_booking' => false,
            'message' => 'No active booking found'
        ]);
    }
    
} catch (Exception $e) {
    error_log("❌ Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
