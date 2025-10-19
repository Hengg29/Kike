<?php
// mercadopago-simple.php
// Implementación simple de Mercado Pago SIN registro de empresa

// Configuración básica (solo necesitas tu Access Token de Mercado Pago)
$access_token = 'TEST-your_access_token_here'; // Reemplazar con tu token real

// Función para crear preferencia de pago
function createPaymentPreference($service, $price, $access_token) {
    $url = 'https://api.mercadopago.com/checkout/preferences';
    
    $data = [
        'items' => [
            [
                'title' => $service,
                'quantity' => 1,
                'unit_price' => $price,
                'currency_id' => 'MXN'
            ]
        ],
        'back_urls' => [
            'success' => 'https://tu-dominio.com/success',
            'failure' => 'https://tu-dominio.com/failure',
            'pending' => 'https://tu-dominio.com/pending'
        ],
        'auto_return' => 'approved'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $access_token
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Procesar pago
if ($_POST['action'] === 'create_payment') {
    $service = $_POST['service'];
    $price = $_POST['price'];
    
    $preference = createPaymentPreference($service, $price, $access_token);
    
    if (isset($preference['init_point'])) {
        echo json_encode([
            'success' => true,
            'payment_url' => $preference['init_point']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Error creando preferencia de pago'
        ]);
    }
}
?>
