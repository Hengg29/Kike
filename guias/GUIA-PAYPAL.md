# 🚀 Guía PayPal - Configuración Completa

## 📋 **Paso a Paso para obtener credenciales de PayPal**

### **1. Crear cuenta PayPal Business**
1. Ve a: https://www.paypal.com/mx/business
2. Haz clic en **"Crear cuenta"**
3. Selecciona **"Cuenta Business"** (no personal)
4. Completa el formulario con:
   - Nombre del negocio: "Enrique Garza - Visagismo"
   - Email: Tu email
   - Teléfono: Tu número
   - Dirección: Tu dirección

### **2. Verificar tu cuenta**
1. **Confirma tu email** (PayPal te enviará un enlace)
2. **Verifica tu teléfono** (SMS con código)
3. **Completa el perfil** (información básica)

### **3. Obtener credenciales de API**
1. **Inicia sesión** en tu cuenta PayPal Business
2. Ve a **"Herramientas"** → **"Todo lo que necesitas para vender"**
3. Busca **"API de PayPal"** o **"Desarrolladores"**
4. Haz clic en **"Crear aplicación"**
5. Completa:
   - **Nombre**: "Sistema de Pagos Enrique Garza"
   - **Tipo**: "API REST"
   - **Funcionalidades**: Marca **"Pagos"**
   - **URL de retorno**: `https://tu-dominio.com/payment-success.php`
   - **URL de cancelación**: `https://tu-dominio.com/payment-cancel.php`

### **4. Credenciales que obtienes**
- **Client ID**: `AeA1QIZXiflr1_-dQH...` (se genera automáticamente)
- **Client Secret**: `ELXh4xK...` (se genera automáticamente)
- **Sandbox**: Para pruebas (recomendado empezar aquí)
- **Live**: Para producción (cuando esté listo)

### **5. Configurar en tu proyecto**
```php
// En config.php
define('PAYPAL_CLIENT_ID', 'tu_client_id_aqui');
define('PAYPAL_CLIENT_SECRET', 'tu_client_secret_aqui');
define('PAYPAL_MODE', 'sandbox'); // 'sandbox' para testing, 'live' para producción
```

## 🧪 **Modo Sandbox (Recomendado para empezar)**

### **Ventajas del Sandbox:**
- ✅ **Pruebas gratuitas** sin dinero real
- ✅ **Tarjetas de prueba** incluidas
- ✅ **Sin riesgo** de cobros accidentales
- ✅ **Perfecto** para desarrollo

### **Tarjetas de prueba PayPal:**
```
Visa: 4032031921231234
Mastercard: 5555555555554444
CVV: 123
Fecha: Cualquier fecha futura
```

## 🚀 **Modo Live (Producción)**

### **Para activar modo Live:**
1. **Completa la verificación** de tu cuenta Business
2. **Proporciona documentos** si es necesario
3. **Cambia** `PAYPAL_MODE` a `'live'`
4. **Usa las credenciales Live** (diferentes a Sandbox)

## 💰 **Comisiones PayPal**

### **En México:**
- **Transacciones nacionales**: 3.4% + $3.50 MXN
- **Transacciones internacionales**: 3.9% + $3.50 MXN
- **Sin cuota mensual**
- **Sin costo de configuración**

## 🔧 **Configuración adicional**

### **URLs de retorno:**
- **Éxito**: `https://tu-dominio.com/payment-success.php`
- **Cancelación**: `https://tu-dominio.com/payment-cancel.php`
- **Error**: `https://tu-dominio.com/payment-error.php`

### **Webhooks (Opcional):**
- **URL**: `https://tu-dominio.com/paypal-webhook.php`
- **Eventos**: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`

## 📞 **Soporte PayPal**

### **Contacto:**
- **Teléfono**: 800-372-7287 (México)
- **Email**: support@paypal.com
- **Chat**: Disponible 24/7 en la cuenta

### **Documentación:**
- **API REST**: https://developer.paypal.com/docs/api/overview/
- **SDK PHP**: https://github.com/paypal/PayPal-PHP-SDK
- **Ejemplos**: https://developer.paypal.com/docs/api/overview/

## ✅ **Checklist de configuración**

- [ ] Cuenta PayPal Business creada
- [ ] Email verificado
- [ ] Teléfono verificado
- [ ] Aplicación API creada
- [ ] Client ID obtenido
- [ ] Client Secret obtenido
- [ ] URLs de retorno configuradas
- [ ] Modo Sandbox activado
- [ ] Pruebas realizadas
- [ ] Modo Live activado (cuando esté listo)

## 🎯 **Próximos pasos**

1. **Crear cuenta** PayPal Business
2. **Obtener credenciales** API
3. **Configurar** en tu proyecto
4. **Probar** con modo Sandbox
5. **Activar** modo Live cuando esté listo

¡PayPal es perfecto para tu negocio de visagismo! 🚀
