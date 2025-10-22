# Esquema de Base de Datos - Sistema de Asistencia Agrícola Inteligente

## Diagrama de Entidades y Relaciones

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    USUARIOS                                             │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ users                                                                                   │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── nombre (VARCHAR(100))                                                               │
│ ├── apellidos (VARCHAR(100))                                                            │
│ ├── correo (VARCHAR(255), UNIQUE)                                                       │
│ ├── edad (INT)                                                                          │
│ ├── password (VARCHAR(255))                                                             │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PARCELAS                                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ parcelas                                                                                │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── user_id (FK → users.id)                                                             │
│ ├── nombre (VARCHAR(100))                                                               │
│ ├── descripcion (TEXT)                                                                  │
│ ├── area_hectareas (DECIMAL(10,4))                                                      │
│ ├── tipo_suelo (VARCHAR(100))                                                           │
│ ├── sistema_riego (VARCHAR(20)) [note: 'goteo, aspersion, inundacion, ninguno']        │
│ ├── activa (BOOLEAN, DEFAULT true)                                                      │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CULTIVOS                                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ cultivos                                                                                │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── parcela_id (FK → parcelas.id)                                                       │
│ ├── tipo_cultivo (VARCHAR(100)) -- maíz, trigo, tomate, etc.                          │
│ ├── variedad (VARCHAR(100))                                                             │
│ ├── fecha_siembra (DATE)                                                                │
│ ├── fecha_cosecha_estimada (DATE)                                                       │
│ ├── fecha_cosecha_real (DATE, NULL)                                                     │
│ ├── area_sembrada (DECIMAL(10,4)) -- hectáreas                                         │
│ ├── estado (VARCHAR(20)) -- sembrado, germinando, creciendo, etc.                      │
│ ├── rendimiento_esperado (DECIMAL(10,2)) -- kg/hectárea                                │
│ ├── rendimiento_real (DECIMAL(10,2), NULL)                                             │
│ ├── activo (BOOLEAN, DEFAULT true)                                                      │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              ACTIVIDADES AGRÍCOLAS                                      │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ actividades_agricolas                                                                   │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── cultivo_id (FK → cultivos.id)                                                       │
│ ├── tipo_actividad (VARCHAR(30)) -- siembra, riego, fertilizacion, etc.               │
│ ├── fecha_programada (DATE)                                                             │
│ ├── fecha_realizada (DATE, NULL)                                                        │
│ ├── descripcion (TEXT)                                                                  │
│ ├── cantidad_aplicada (DECIMAL(10,2), NULL) -- litros, kg, etc.                       │
│ ├── costo (DECIMAL(10,2), NULL)                                                         │
│ ├── estado (VARCHAR(20)) -- programada, en_proceso, completada, cancelada              │
│ ├── observaciones (TEXT)                                                                │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                DATOS METEOROLÓGICOS                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ datos_meteorologicos                                                                    │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── parcela_id (FK → parcelas.id)                                                       │
│ ├── fecha (DATE)                                                                        │
│ ├── datos_clima (JSON) -- Datos completos de la API meteorológica                      │
│ ├── resumen_diario (TEXT) -- Resumen en lenguaje natural del clima del día            │
│ ├── alerta_clima (BOOLEAN, DEFAULT false)                                               │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 GASTOS E INGRESOS                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ transacciones_financieras                                                               │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── cultivo_id (FK → cultivos.id)                                                       │
│ ├── actividad_id (FK → actividades_agricolas.id, NULL)                                 │
│ ├── tipo (VARCHAR(10)) -- gasto, ingreso                                               │
│ ├── categoria (VARCHAR(100)) -- semillas, fertilizantes, mano_obra, venta, etc.       │
│ ├── descripcion (TEXT)                                                                  │
│ ├── monto (DECIMAL(12,2))                                                               │
│ ├── fecha (DATE)                                                                        │
│ ├── metodo_pago (VARCHAR(50))                                                           │
│ ├── comprobante_url (VARCHAR(500), NULL)                                                │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              CONVERSACIONES DEL CHATBOT                                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ conversaciones                                                                          │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── user_id (FK → users.id)                                                             │
│ ├── titulo (VARCHAR(255))                                                               │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   MENSAJES                                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ mensajes                                                                                │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── conversacion_id (FK → conversaciones.id)                                           │
│ ├── rol (VARCHAR(10)) -- user, assistant                                               │
│ ├── contenido (TEXT)                                                                    │
│ ├── metadata (JSON, NULL) -- información adicional del contexto                       │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PROGRAMACIÓN DE RIEGO                                   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ programacion_riego                                                                      │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── cultivo_id (FK → cultivos.id)                                                       │
│ ├── fecha_programada (DATETIME)                                                         │
│ ├── tipo_riego (VARCHAR(50))                                                            │
│ ├── estado (VARCHAR(20)) -- programado, ejecutado, cancelado                           │
│ ├── fecha_ejecutado (DATETIME, NULL)                                                    │
│ ├── observaciones (TEXT)                                                                │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                PREDICCIONES DE RENDIMIENTO                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ predicciones_rendimiento                                                                │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── cultivo_id (FK → cultivos.id)                                                       │
│ ├── fecha_prediccion (DATE)                                                             │
│ ├── rendimiento_predicho (DECIMAL(10,2)) -- kg/hectárea                                │
│ ├── confianza_prediccion (DECIMAL(5,2)) -- porcentaje 0-100                           │
│ ├── factores_considerados (JSON) -- clima, suelo, historial, etc.                     │
│ ├── algoritmo_usado (VARCHAR(100))                                                      │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              CONFIGURACIONES DEL USUARIO                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ configuraciones_usuario                                                                 │
│ ├── id (PK, INT, AUTO_INCREMENT)                                                        │
│ ├── user_id (FK → users.id, UNIQUE)                                                     │
│ ├── notificaciones_email (BOOLEAN, DEFAULT true)                                       │
│ ├── notificaciones_push (BOOLEAN, DEFAULT true)                                        │
│ ├── dashboard_config (JSON) -- configuración personalizada del dashboard              │
│ ├── created_at (TIMESTAMP)                                                              │
│ └── updated_at (TIMESTAMP)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Relaciones Principales

### 1. Usuario → Parcelas (1:N)
- Un usuario puede tener múltiples parcelas
- Cada parcela pertenece a un solo usuario

### 2. Parcela → Cultivos (1:N)
- Una parcela puede tener múltiples cultivos (rotación de cultivos)
- Cada cultivo pertenece a una sola parcela

### 3. Cultivo → Actividades Agrícolas (1:N)
- Un cultivo puede tener múltiples actividades (riego, fertilización, etc.)
- Cada actividad está asociada a un cultivo específico

### 4. Cultivo → Transacciones Financieras (1:N)
- Un cultivo puede tener múltiples gastos e ingresos asociados
- Cada transacción está vinculada a un cultivo específico

### 5. Usuario → Conversaciones (1:N)
- Un usuario puede tener múltiples conversaciones con el chatbot
- Cada conversación pertenece a un solo usuario

### 6. Conversación → Mensajes (1:N)
- Una conversación puede tener múltiples mensajes
- Cada mensaje pertenece a una conversación específica

## Características Clave del Diseño

### 🌱 **Gestión Integral de Cultivos**
- Seguimiento completo desde siembra hasta cosecha
- Registro de actividades agrícolas con fechas programadas y reales
- Control de rendimientos esperados vs reales

### 💰 **Control Financiero Detallado**
- Registro de gastos e ingresos por cultivo
- Categorización de transacciones
- Soporte para comprobantes digitales

### 🤖 **Sistema de Chatbot Inteligente**
- Historial completo de conversaciones
- Metadata para contexto adicional
- Estructura escalable para múltiples conversaciones

### 🌦️ **Integración Meteorológica**
- Datos climáticos de API almacenados en JSON
- Resúmenes diarios en lenguaje natural
- Sistema de alertas climáticas integrado

### 💧 **Optimización de Riego**
- Programación inteligente de riego
- Seguimiento de ejecución
- Integración con datos meteorológicos

### 📊 **Predicciones y Análisis**
- Algoritmos de predicción de rendimiento
- Factores considerados almacenados en JSON
- Niveles de confianza de las predicciones

### ⚙️ **Personalización**
- Configuraciones específicas por usuario
- Dashboard personalizable
- Preferencias de notificaciones

Este esquema está diseñado para ser escalable, eficiente y cubrir todos los requerimientos funcionales del sistema de asistencia agrícola inteligente, con un enfoque especial en la integración de APIs externas para datos meteorológicos.