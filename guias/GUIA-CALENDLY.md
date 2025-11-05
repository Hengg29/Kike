# 🗓️ Guía Calendly - Configuración Completa

## 📋 **Paso a Paso para configurar Calendly**

### **1. Crear cuenta en Calendly**
1. Ve a: https://calendly.com
2. Haz clic en **"Get Started Free"**
3. Crea tu cuenta con tu email
4. **Es GRATIS** para uso básico

### **2. Configurar tu perfil**
1. **Nombre**: Enrique Garza
2. **Email**: Tu email
3. **Tipo de cuenta**: Individual (gratis)
4. **Zona horaria**: México

### **3. Crear tipos de eventos**

#### **Evento 1: Corte de Cabello**
- **Nombre**: "Corte de Cabello - Visagismo"
- **Duración**: 60 minutos
- **Descripción**: "Corte profesional con técnicas de visagismo"
- **Precio**: $450 MXN
- **Ubicación**: Tu dirección o "Presencial"

#### **Evento 2: Asesoría Online**
- **Nombre**: "Asesoría Online - Visagismo"
- **Duración**: 30 minutos
- **Descripción**: "Consulta online sobre tu estilo personal"
- **Precio**: $350 MXN
- **Ubicación**: "Videollamada"

#### **Evento 3: Paquete Completo**
- **Nombre**: "Corte + Asesoría - Visagismo"
- **Duración**: 90 minutos
- **Descripción**: "Servicio completo: corte + asesoría personalizada"
- **Precio**: $750 MXN
- **Ubicación**: Tu dirección

### **4. Configurar disponibilidad**

#### **Horarios de trabajo:**
- **Lunes a Viernes**: 9:00 AM - 6:00 PM
- **Sábados**: 9:00 AM - 2:00 PM
- **Domingos**: Cerrado

#### **Tiempo de preparación:**
- **Antes del evento**: 15 minutos
- **Después del evento**: 15 minutos

### **5. Obtener enlaces de Calendly**

#### **Para cada evento, obtienes:**
- **Enlace público**: `https://calendly.com/tu-usuario/evento`
- **Enlace embebido**: Para usar en tu sitio web

### **6. Configurar en tu sitio web**

#### **En tu index.html, cambiar las URLs:**
```javascript
const calendlyUrls = {
    'corte': 'https://calendly.com/tu-usuario/corte-cabello',
    'asesoria': 'https://calendly.com/tu-usuario/asesoria-online',
    'completo': 'https://calendly.com/tu-usuario/paquete-completo'
};
```

### **7. Configurar notificaciones**

#### **Email automático:**
- ✅ **Confirmación** al cliente
- ✅ **Recordatorio** 24 horas antes
- ✅ **Notificación** a ti cuando alguien reserva

#### **Configuración de emails:**
- **Asunto**: "Confirmación de cita - Enrique Garza"
- **Mensaje**: Personalizado con tu información
- **Firma**: Enrique Garza - Visagismo Profesional

### **8. Integrar con tu sistema de pagos**

#### **Calendly + PayPal:**
- ✅ **Pago requerido** antes de reservar
- ✅ **Confirmación automática** después del pago
- ✅ **Cancelación** si no se paga

### **9. Configurar recordatorios**

#### **Recordatorios automáticos:**
- **24 horas antes**: Email + SMS
- **2 horas antes**: SMS
- **Inmediato**: Email de confirmación

### **10. Personalizar tu Calendly**

#### **Branding:**
- **Logo**: Tu logo profesional
- **Colores**: Blanco, negro, dorado
- **Fuente**: Elegante y profesional

#### **Página de agradecimiento:**
- **Mensaje**: "¡Gracias por tu reserva!"
- **Próximos pasos**: Instrucciones claras
- **Contacto**: Tu información

## 🎯 **Configuración Avanzada**

### **Integración con Google Calendar:**
1. **Conectar** tu Google Calendar
2. **Sincronizar** eventos automáticamente
3. **Evitar** conflictos de horarios

### **Integración con Zoom:**
1. **Para asesorías online**
2. **Enlace automático** en la confirmación
3. **Recordatorio** con link de Zoom

### **Configuración de precios:**
1. **Precios fijos** por servicio
2. **Descuentos** por paquetes
3. **Pagos** integrados con PayPal

## 📱 **Configuración Móvil**

### **App de Calendly:**
- **Descargar** app móvil
- **Notificaciones** push
- **Gestión** desde el móvil

### **Responsive Design:**
- **Optimizado** para móviles
- **Fácil navegación** en pantallas pequeñas
- **Botones** táctiles grandes

## 🔧 **Configuración Técnica**

### **Webhooks (Opcional):**
- **URL**: `https://tu-dominio.com/calendly-webhook.php`
- **Eventos**: `invitee.created`, `invitee.canceled`

### **API de Calendly:**
- **Token**: Para integraciones avanzadas
- **Endpoints**: Para crear eventos programáticamente

## ✅ **Checklist de configuración**

- [ ] Cuenta Calendly creada
- [ ] Perfil configurado
- [ ] 3 tipos de eventos creados
- [ ] Horarios configurados
- [ ] Enlaces obtenidos
- [ ] URLs actualizadas en el sitio
- [ ] Notificaciones configuradas
- [ ] Recordatorios activados
- [ ] Branding personalizado
- [ ] Pruebas realizadas

## 🚀 **Próximos pasos**

1. **Crear cuenta** en Calendly
2. **Configurar** los 3 tipos de eventos
3. **Obtener** los enlaces
4. **Actualizar** las URLs en tu sitio
5. **Probar** el sistema completo

¡Calendly es perfecto para tu negocio de visagismo! 🎉
