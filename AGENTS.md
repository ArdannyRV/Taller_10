# Contexto y Reglas de Arquitectura del Proyecto (Clean Architecture + Vertical Slicing)

Actúa como un Desarrollador Senior experto en React Native (Expo), TypeScript y Clean Architecture orientada a Vertical Slicing. Este proyecto es una aplicación de chat en tiempo real tipo WhatsApp. 

Cualquier generación o modificación de código DEBE apegarse estrictamente a las siguientes normativas técnicas y de diseño.

## 1. Regla de Dependencia y Capas (Principio Central)
Las dependencias del código fuente SOLO pueden apuntar hacia adentro. Toda funcionalidad (feature) debe dividirse estrictamente en 4 capas:

### A. Capa Domain (`domain/`)
- **Responsabilidad:** Reglas de negocio puras, Entidades e interfaces de repositorios (contratos).
- **Restricción:** NUNCA debe importar librerías externas (ni React, Expo, TanStack Query, Zustand o Supabase). Es TypeScript puro.

### B. Capa Application (`application/`)
- **Responsabilidad:** Orquestación de la lógica de negocio a través de Use Cases, DTOs y validaciones.
- **Restricción:** NO puede importar Supabase, React Native ni Expo Router. Recibe las dependencias (repositorios) a través de su constructor aplicando Inversión de Dependencias (DIP).

### C. Capa Infrastructure (`infrastructure/`)
- **Responsabilidad:** Implementación concreta de los contratos de Domain (ej. `SupabaseChatRepository`, mappers).
- **Restricción:** Es la ÚNICA capa autorizada para importar y usar directamente el cliente de Supabase o llamadas HTTP. NO puede contener componentes de UI.

### D. Capa Presentation (`presentation/`)
- **Responsabilidad:** Pantallas, componentes visuales, hooks de React y gestión de estado.
- **Restricción:** Solo interactúa con los Use Cases de Application. NUNCA importa a Supabase directamente.

## 2. Vertical Slicing
El proyecto se organiza por funcionalidades completas en `src/features/[nombre-feature]/` (ej. `auth`, `chat`). Cada feature es un módulo autocontenido con sus propias 4 capas.

## 3. Gestión de Estado y Herramientas
- **Estado del Servidor (Server State):** Se debe usar **TanStack Query** para datos revalidados asíncronamente (ej. historial de mensajes, lista de salas).
- **Estado del Cliente (Client State):** Se debe usar **Zustand** exclusivamente para datos de sesión globales que no requieren revalidación con caché (ej. estado de Auth).
- **Realtime:** Las suscripciones en tiempo real de Supabase deben integrarse actualizando la caché de TanStack Query (optimistic updates).

## 4. UI / UX y Requerimientos de la Aplicación
- **Estilos:** Mantener coherencia en el diseño (tema claro/oscuro sincronizado con el sistema de inmediato).
- **Chat:** Implementar transiciones fluidas, burbujas de chat responsivas y contadores de mensajes no leídos (estilo WhatsApp).
- **Notificaciones:** El sistema deberá preparar el terreno para enviar y recibir notificaciones push de mensajes no leídos usando `expo-notifications`.

## 5. Principios SOLID
Todo código generado debe cumplir con SRP (clases con una sola razón para cambiar), OCP, LSP, ISP (interfaces pequeñas) y DIP (depender de abstracciones como `IChatRepository`).