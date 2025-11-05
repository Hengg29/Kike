<?php
// send-email.php
// Enviar emails automáticos cuando alguien reserve

// Incluir configuración
require_once 'config.php';

// Función para enviar email
function sendEmail($to, $subject, $message, $from_name = 'Enrique Garza') {
    // Configuración SMTP
    $smtp_host = SMTP_HOST;
    $smtp_port = SMTP_PORT;
    $smtp_user = SMTP_USER;
    $smtp_pass = SMTP_PASS;
    
    // Headers del email
    $headers = [
        'From: ' . $from_name . ' <' . $smtp_user . '>',
        'Reply-To: ' . $smtp_user,
        'Content-Type: text/html; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Enviar email
    $success = mail($to, $subject, $message, implode("\r\n", $headers));
    
    return $success;
}

// Función para email de confirmación al cliente
function sendConfirmationEmail($customer_email, $customer_name, $service, $appointment_date) {
    $subject = "✅ Confirmación de Cita - Enrique Garza";
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .header { background: #D4AF37; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .highlight { color: #D4AF37; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>¡Cita Confirmada!</h1>
        </div>
        <div class='content'>
            <h2>Hola " . $customer_name . ",</h2>
            <p>Tu cita ha sido confirmada exitosamente:</p>
            <ul>
                <li><strong>Servicio:</strong> " . $service . "</li>
                <li><strong>Fecha y Hora:</strong> " . $appointment_date . "</li>
                <li><strong>Especialista:</strong> Enrique Garza</li>
            </ul>
            <p>Si necesitas hacer algún cambio, contáctanos con 24 horas de anticipación.</p>
            <p>¡Esperamos verte pronto!</p>
            <p><strong>Enrique Garza</strong><br>
            Visagismo Profesional</p>
        </div>
    </body>
    </html>";
    
    return sendEmail($customer_email, $subject, $message);
}

// Función para notificar a Enrique
function notifyEnrique($customer_name, $customer_email, $service, $appointment_date) {
    $subject = "📅 Nueva Reserva - " . $customer_name;
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .highlight { color: #D4AF37; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>Nueva Reserva</h1>
        </div>
        <div class='content'>
            <h2>Detalles de la Reserva:</h2>
            <ul>
                <li><strong>Cliente:</strong> " . $customer_name . "</li>
                <li><strong>Email:</strong> " . $customer_email . "</li>
                <li><strong>Servicio:</strong> " . $service . "</li>
                <li><strong>Fecha y Hora:</strong> " . $appointment_date . "</li>
            </ul>
            <p>Revisa tu calendario de Calendly para más detalles.</p>
        </div>
    </body>
    </html>";
    
    return sendEmail(SMTP_USER, $subject, $message);
}

// Procesar cuando se recibe una reserva
if ($_POST['action'] === 'send_confirmation') {
    $customer_email = $_POST['customer_email'];
    $customer_name = $_POST['customer_name'];
    $service = $_POST['service'];
    $appointment_date = $_POST['appointment_date'];
    
    // Enviar confirmación al cliente
    $client_sent = sendConfirmationEmail($customer_email, $customer_name, $service, $appointment_date);
    
    // Notificar a Enrique
    $enrique_sent = notifyEnrique($customer_name, $customer_email, $service, $appointment_date);
    
    if ($client_sent && $enrique_sent) {
        echo json_encode(['success' => true, 'message' => 'Emails enviados correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error enviando emails']);
    }
}
?>
