# 📧 Guía SMTP - Configuración de Emails Automáticos

## 🎯 **Opción 1: Gmail (RECOMENDADO)**

### **📋 Paso a Paso:**

#### **1. Preparar Gmail:**
- ✅ Tener cuenta de Gmail
- ✅ Activar **Verificación en 2 pasos**
- ✅ Ir a **Configuración** → **Seguridad**

#### **2. Generar Contraseña de Aplicación:**
1. **Ir a**: https://myaccount.google.com/security
2. **Buscar**: "Contraseñas de aplicaciones"
3. **Seleccionar**: "Correo"
4. **Seleccionar**: "Otro (nombre personalizado)"
5. **Escribir**: "Enrique Garza Website"
6. **Copiar** la contraseña generada (16 caracteres)

#### **3. Configurar en el Código:**
```php
// En config.php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'enrique@gmail.com');
define('SMTP_PASS', 'contraseña_de_16_caracteres_aqui');
```

---

## 🎯 **Opción 2: Outlook/Hotmail**

### **📋 Paso a Paso:**

#### **1. Preparar Outlook:**
- ✅ Tener cuenta de Outlook
- ✅ Ir a **Configuración** → **Privacidad**

#### **2. Generar Contraseña de Aplicación:**
1. **Ir a**: https://account.microsoft.com/security
2. **Buscar**: "Contraseñas de aplicaciones"
3. **Crear nueva** contraseña
4. **Copiar** la contraseña generada

#### **3. Configurar en el Código:**
```php
// En config.php
define('SMTP_HOST', 'smtp-mail.outlook.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'enrique@outlook.com');
define('SMTP_PASS', 'contraseña_generada_aqui');
```

---

## 🎯 **Opción 3: Yahoo Mail**

### **📋 Paso a Paso:**

#### **1. Preparar Yahoo:**
- ✅ Tener cuenta de Yahoo
- ✅ Ir a **Configuración** → **Seguridad**

#### **2. Generar Contraseña de Aplicación:**
1. **Ir a**: https://login.yahoo.com/account/security
2. **Buscar**: "Contraseñas de aplicaciones"
3. **Generar nueva** contraseña
4. **Copiar** la contraseña

#### **3. Configurar en el Código:**
```php
// En config.php
define('SMTP_HOST', 'smtp.mail.yahoo.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'enrique@yahoo.com');
define('SMTP_PASS', 'contraseña_generada_aqui');
```

---

## 📧 **¿Qué Emails se Envían Automáticamente?**

### **✅ Al Cliente:**
- **Confirmación** de cita
- **Detalles** del servicio
- **Fecha y hora** de la cita
- **Instrucciones** de cancelación

### **✅ A Enrique:**
- **Notificación** de nueva reserva
- **Datos del cliente**
- **Servicio contratado**
- **Fecha y hora** de la cita

---

## 🔧 **Archivos Incluidos:**

### **📁 Archivos Creados:**
- ✅ `send-email.php` - Sistema de emails
- ✅ `config.php` - Configuración SMTP
- ✅ `GUIA-SMTP.md` - Esta guía

### **📧 Funciones Incluidas:**
- ✅ `sendConfirmationEmail()` - Email al cliente
- ✅ `notifyEnrique()` - Notificación a Enrique
- ✅ `sendEmail()` - Función base de envío

---

## 🚀 **Implementación:**

### **1. Configurar SMTP:**
```php
// Editar config.php con tus datos
define('SMTP_USER', 'tu_email@gmail.com');
define('SMTP_PASS', 'tu_contraseña_de_aplicacion');
```

### **2. Probar Envío:**
```php
// Llamar desde JavaScript después del pago
fetch('send-email.php', {
    method: 'POST',
    body: JSON.stringify({
        action: 'send_confirmation',
        customer_email: 'cliente@email.com',
        customer_name: 'Juan Pérez',
        service: 'Corte de Cabello',
        appointment_date: '2024-01-15 10:00'
    })
});
```

---

## 💡 **Ventajas:**

### **✅ Automatización:**
- **Sin intervención** manual
- **Emails instantáneos** al reservar
- **Confirmaciones** profesionales
- **Notificaciones** a Enrique

### **✅ Profesionalismo:**
- **Emails bonitos** con HTML
- **Información completa** del servicio
- **Instrucciones** claras
- **Marca personal** de Enrique

---

## 🔒 **Seguridad:**

### **✅ Protección:**
- **Contraseñas de aplicación** (no la principal)
- **SMTP seguro** con TLS
- **Validación** de datos
- **Sin exposición** de credenciales

---

## 📞 **Soporte:**

Si tienes problemas:
1. **Verificar** que la verificación en 2 pasos esté activa
2. **Revisar** que la contraseña de aplicación sea correcta
3. **Probar** con otro proveedor de email
4. **Contactar** al desarrollador para ayuda
