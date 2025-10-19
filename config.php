<?php
// config.php
// Configuración de APIs y base de datos

// Cargar variables de entorno desde .env si existe
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Saltar comentarios
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

// Función helper para obtener variables de entorno
function getEnvVar($key, $default = null) {
    return $_ENV[$key] ?? $default;
}

// Stripe Configuration
define('STRIPE_PUBLISHABLE_KEY', getEnvVar('STRIPE_PUBLISHABLE_KEY', 'pk_test_your_stripe_publishable_key_here'));
define('STRIPE_SECRET_KEY', getEnvVar('STRIPE_SECRET_KEY', 'sk_test_your_stripe_secret_key_here'));

// PayPal Configuration
define('PAYPAL_CLIENT_ID', getEnvVar('PAYPAL_CLIENT_ID', 'your_paypal_client_id_here'));
define('PAYPAL_CLIENT_SECRET', getEnvVar('PAYPAL_CLIENT_SECRET', 'your_paypal_client_secret_here'));
define('PAYPAL_MODE', getEnvVar('PAYPAL_MODE', 'sandbox')); // 'sandbox' para testing, 'live' para producción

// Database Configuration
define('DB_HOST', getEnvVar('DB_HOST', 'localhost'));
define('DB_NAME', getEnvVar('DB_NAME', 'enrique_garza'));
define('DB_USER', getEnvVar('DB_USER', 'root'));
define('DB_PASS', getEnvVar('DB_PASS', 'your_database_password'));

// Email Configuration - OUTLOOK
define('SMTP_HOST', getEnvVar('SMTP_HOST', 'smtp-mail.outlook.com'));
define('SMTP_PORT', getEnvVar('SMTP_PORT', 587));
define('SMTP_USER', getEnvVar('SMTP_USER', 'your_email@outlook.com'));
define('SMTP_PASS', getEnvVar('SMTP_PASS', 'your_app_password'));

// Calendly Configuration
define('CALENDLY_API_TOKEN', getEnvVar('CALENDLY_API_TOKEN', 'your_calendly_api_token_here'));

// Event Type URIs
define('CALENDLY_EVENT_TYPE_URI_CORTE', getEnvVar('CALENDLY_EVENT_TYPE_URI_CORTE', 'your_calendly_event_type_uri_corte'));
define('CALENDLY_EVENT_TYPE_URI_ASESORIA', getEnvVar('CALENDLY_EVENT_TYPE_URI_ASESORIA', 'your_calendly_event_type_uri_asesoria'));
define('CALENDLY_EVENT_TYPE_URI_COMPLETO', getEnvVar('CALENDLY_EVENT_TYPE_URI_COMPLETO', 'your_calendly_event_type_uri_completo'));
?>