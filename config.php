<?php
// config.php
// Configuración de APIs y base de datos

// Stripe Configuration
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_your_stripe_publishable_key_here');
define('STRIPE_SECRET_KEY', 'sk_test_your_stripe_secret_key_here');

// PayPal Configuration
define('PAYPAL_CLIENT_ID', 'AYs-LWLc-c3Md_EgJlDQ8Or5Mpzrn8ozxjU_a1C-ayXKlGiWb3SbhBGiBfnWjuWQRkBf_GzUKn8M8Buy');
define('PAYPAL_CLIENT_SECRET', 'ELD_2Jp5lfKlZ4j9BB8r9575maURRNAUnn3reGrV6nTYwardXpOCAar8IXvPb46DeLZId8Rz4KJAV18N');
define('PAYPAL_MODE', 'sandbox'); // 'sandbox' para testing, 'live' para producción

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'enrique_garza');
define('DB_USER', 'root');
define('DB_PASS', 'Messi2003W');

// Email Configuration - OUTLOOK (MÁS FÁCIL)
define('SMTP_HOST', 'smtp-mail.outlook.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'songoku.ssjbkk10hotmail.com'); // Cambiar por tu email de Outlook
define('SMTP_PASS', 'blmaowcipjliallg'); // Tu contraseña de aplicación


// Calendly Configuration
define('CALENDLY_API_TOKEN', 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzYwNTk3MjYwLCJqdGkiOiI5Yzc1MjJhYS0yNWRlLTRhMGYtODA3Ny0wOGIyNjQ4YmUwMzgiLCJ1c2VyX3V1aWQiOiI1ZTY4NDM2NS01NTEyLTQ2NzctOTU2Zi1kYzQzZWQ2NmZkNmUifQ.Lgd5sR9gjfXvZGk2HtNpmlk6eah-eQk0hTtNjvw_lAEEgzI8ui58E_Y5k8iBUFYyGHiru8Au5GPk8nehp5qIYQ');

// Event Type URIs
define('CALENDLY_EVENT_TYPE_URI_CORTE', 'https://api.calendly.com/event_types/5fa710e1-d256-436a-9d79-47c2554a5553');
define('CALENDLY_EVENT_TYPE_URI_ASESORIA', 'https://api.calendly.com/event_types/f11003b1-7723-4966-bba2-01973a6ae0f2');
define('CALENDLY_EVENT_TYPE_URI_COMPLETO', 'https://api.calendly.com/event_types/53fb5459-0705-430d-bfc6-04596dac2a64');
?>
