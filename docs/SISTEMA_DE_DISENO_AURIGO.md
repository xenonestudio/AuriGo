# Sistema de Diseño y Guía de Estilo Oficial AuriGo
> **Fusión del Manual de Identidad Corporativa AuriGo (Táchira) y la Arquitectura Soft Glassmorphism (Modern Clean UI)**

Este documento establece las especificaciones maestras de diseño, tokens visuales, componentes de interfaz y lineamientos de experiencia de usuario para todas las plataformas de **AuriGo** (Web App, Android y futuros paneles).

---

## 1. Principios Fundamentales de Diseño

1. **La Cordialidad Hecha Interfaz (Hospitalidad + Fluidez):**
   - Geometría Cordial: esquinas redondeadas suaves (`12px` en botones, `16px` a `24px` en tarjetas). Sin vértices agresivos ni esquinas puntiagudas.
   - Texturas con la **Trama Topográfica Andina ("Curvas del Torbes")** a baja opacidad (6%-8%) y cortes en el **Ángulo Dinámico de 15° ("Cuesta Tachirense")**.
2. **Soft Glassmorphism con Identidad Andina:**
   - Contenedores con desenfoque de fondo sutil (`backdrop-filter: blur(12px)`), bordes sutiles en `#E2E8F0` y sombras difusas naturales.
3. **Regla Cromática de Oro (60 - 30 - 10):**
   - **60% Dominante (Respiro Visual):** Blanco Puro (`#FFFFFF`) y Gris Niebla (`#F8FAFC`).
   - **30% Estructural (Jerarquía):** Negro Obsidiana (`#0F172A`) y Gris Pizarra (`#334155`) en bloques, modales, modo noche y tarjetas clave.
   - **10% Conversión y Acción (Foco):** Reservado estrictamente al **Amarillo Aurinegro (`#FFB800`)** para el botón de acción principal (*"¡Camine! Pedir mi AuriGo"*), pins en el mapa y estados activos.

---

## 2. Tokens de Diseño Maestros (AuriGo Tokens)

### 2.1 Paleta de Colores

| Token | Hex / Valor | Rol en el Sistema |
| :--- | :--- | :--- |
| `--aurigo-yellow` | `#FFB800` | **10% CTA Conversión**: Botón principal, Isotipo sobre oscuro, selección activa. |
| `--aurigo-yellow-glow` | `0 8px 25px rgba(255, 184, 0, 0.35)` | Sombra de elevación en botón de pedido. |
| `--aurigo-obsidian` | `#0F172A` | **30% Estructural**: Cabeceras, tarjetas ejecutivas, texto de botones amarillos. |
| `--aurigo-amber` | `#D97706` | Acento de lectura: Texto "Go" en fondos claros, subtítulos destacados. |
| `--aurigo-blue-tachira` | `#0284C7` | Navegación: Trazo de ruta GPS, badge "Conductor Verificado", íconos de soporte. |
| `--aurigo-green-laso` | `#16A34A` | Semántico Éxito: Confirmación de Pago Móvil/COP, conductor llegando. |
| `--aurigo-pink-clavellina` | `#E11D48` | Categoría Especial: Exclusivo para la línea *AuriClavellina* (Mujeres y Niños). |
| `--aurigo-slate` | `#334155` | Gris Pizarra para texto secundario e iconografía duotone. |
| `--aurigo-mist` | `#F8FAFC` | Fondo general diurno (60% respiro). |
| `--aurigo-surface` | `#FFFFFF` | Superficie de tarjetas y modales. |
| `--aurigo-border` | `#E2E8F0` | Borde sutil para tarjetas y chips. |

### 2.2 Sistema Tipográfico (Google Fonts)

- **Display / Titulares:** `Plus Jakarta Sans` (Bold 700, ExtraBold 800)
- **Interfaz (UI) / Cuerpo:** `Inter` (Regular 400, Medium 500, SemiBold 600)
- **Numérica Multimoneda:** `Inter Tabular / JetBrains Mono` (Bold 700 con `tabular-nums` obligatorio para tarifas en triple moneda: `16.000 COP | $4.00 | 180 Bs.`).

---

## 3. Microcopy y Copywriting Oficial (Tono Gocho Cordial)

| Momento de Interfaz | Texto Prohibido (Genérico) | Microcopy Oficial AuriGo |
| :--- | :--- | :--- |
| **Cabecera Chat / Home** | "¿A dónde vas?" | *"¿Pa' dónde vamos hoy, [Nombre]? Elige tu destino"* |
| **Botón de Pedido** | "Solicitar vehículo" | *"¡Camine! Pedir mi AuriGo"* |
| **Selector de Moneda** | "Seleccione pago" | *"Paga a tu manera: Pesos (COP), Dólares (USD) o Pago Móvil al instante"* |
| **Llegada del Conductor** | "El conductor ha llegado" | *"🟡⚫ ¡Tu AuriGo ya está afuera! Recuerda verificar la placa [Placa] antes de subir"* |

---

## 4. Componentes UI AuriGo (Web App y Móvil)

1. **Valet Chat Bubble (Burbujas del Operador):**
   - Fondo blanco con borde sutil `#E2E8F0`, avatar del Isotipo ("Pin Andino en Marcha") sobre fondo Negro Obsidiana (`#0F172A`).
2. **Vehicle Card (Tarjetas de Vehículos AuriGo):**
   - *AuriMoto* (Rápido, incluye casco e impermeable para la lluvia)
   - *AuriClásico* (Sedán confortable hasta 4 personas)
   - *AuriClima* (Carro climatizado con A/C para las cuestas)
   - *AuriClavellina* (Conducido por y para mujeres y niños con distintivo Rosa Clavellina `#E11D48`)
3. **Pill Buttons de Lugares Frecuentes:**
   - `[🏠 Casa]`, `[💼 Trabajo]`, `[📍 Barrio Obrero]`, `[🛍️ Sambil San Cristóbal]`.
4. **Selector Multimoneda Tabular:**
   - Visualización instantánea con pestañas para alternar entre **COP (Pesos)**, **USD ($)** y **VES (Bs.)**.
