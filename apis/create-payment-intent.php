<?php
// create-payment-intent.php
// Backend para procesar pagos con Stripe

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de Stripe
require_once 'vendor/autoload.php'; // Composer autoload
\Stripe\Stripe::setApiKey('sk_test_your_stripe_secret_key_here');

try {
    // Obtener datos del POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    $service = $input['service'];
    $amount = $input['amount']; // Ya viene en centavos
    $currency = $input['currency'];
    
    // Crear Payment Intent
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => $amount,
        'currency' => $currency,
        'metadata' => [
            'service' => $service,
            'customer_email' => 'customer@example.com' // Obtener del formulario
        ],
        'automatic_payment_methods' => [
            'enabled' => true,
        ],
    ]);
    
    // Devolver client secret
    echo json_encode([
        'clientSecret' => $paymentIntent->client_secret,
        'paymentIntentId' => $paymentIntent->id
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?>
