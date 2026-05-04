# TriFlow Design System

## 🎨 Paleta de Colores

### Light Mode
```
Primary Background:     #F7F5F0 (warm beige)
Surface:                #FDFCFA (off-white)
Card Background:        #FFFFFF (white)
Border Primary:         #EAE4D8
Border Secondary:       #D8D0C0

Sage (Primary Action):  #7C9E87
Sage Light:             #A8C4AF
Sage Dark:              #5A7D65

Sand (Secondary):       #C4A882
Clay (Warning/Danger):  #C4856A
Sky (Info):             #7EA8C4
Violet (Accent):        #9B8EC4
Violet Light:           #C4B8E8
Violet Dark:            #7060A8

Text Primary:           #2C2C2C (charcoal)
Text Mid:               #6B6458
Text Sub:               #9C9284
Muted/Disabled:         #B8B0A0
Scrollbar:              #C8C0B0
```

### Dark Mode
```
Primary Background:     #161C18
Surface:                #1C2420
Card Background:        #212B25
Border Primary:         #2A3830
Border Secondary:       #354540

Sage:                   #7EC494
Sage Light:             #5A9970
Sage Dark:              #A8D4B4

Sand:                   #D4B48C
Clay:                   #D4956A
Sky:                    #8AB8D4
Violet:                 #B4A8D8
Violet Light:           #7868A8
Violet Dark:            #CEC4EC

Text Primary:           #EAE6DE (charcoal light)
Text Mid:               #A8A090
Text Sub:               #6E6860
Muted/Disabled:         #4A4840
Scrollbar:              #2A3830
```

## 🔤 Tipografía

### Fuentes
- **Serif (Display)**: Playfair Display (Regular 400, Semi-bold 600)
  - Uso: Títulos grandes, encabezados principales
  - Ejemplos: "TriFlow", nombres de usuario, títulos de pestaña

- **Sans-serif (Body)**: DM Sans (Light 300, Regular 400, Medium 500, Semi-bold 600)
  - Uso: Cuerpo de texto, labels, botones, inputs
  - Ejemplos: Descripción de tabs, valores numéricos, instrucciones

### Tamaños
```
Títulos grandes:    24px - 38px (Playfair Display)
Títulos medios:     18px - 22px (Playfair Display)
Títulos pequeños:   14px - 16px (DM Sans, peso 600)
Body:               13px - 15px (DM Sans, peso 400)
Labels/Helper:      11px - 12px (DM Sans, peso 400-500)
```

## 📦 Componentes Core

### Botones
```
Primario:
  - Background: Sage (#7C9E87)
  - Padding: 14px
  - Border Radius: 99px (fully rounded)
  - Font: DM Sans 600, 15px
  - Color: #FFFFFF

Secundario:
  - Background: Border color
  - Border: 1px
  - Padding: 10px (calculado)
  - Border Radius: 99px

Disabled:
  - Background: Muted color
  - Color: Muted
  - Cursor: default

Estados:
  - Hover: Darken 5-10%
  - Active: Darken 10-15%
  - Transition: 0.2s ease
```

### Inputs
```
Container:
  - Padding: 12px 14px
  - Border Radius: 12px
  - Border: 1.5px solid Border Primary
  - Background: Card background
  - Font: DM Sans 400, 14px
  - Color: Text Primary
  - Outline: none

Focus State:
  - Border color: Sage
  - Transition: 0.3s ease

Error State:
  - Border: Clay color
  - Background: Clay + 22% opacity
```

### Cards
```
Container:
  - Background: Card Background (light: #FFFFFF, dark: #212B25)
  - Border: 1px solid Border Primary
  - Border Radius: 14px - 16px
  - Padding: 13px - 16px
  - Transition: 0.4s ease

Elevated:
  - Box Shadow: 0 4px 12px rgba(0,0,0,0.08)
```

### Modal/Overlay
```
Backdrop:
  - Background: rgba(0,0,0,0.55)
  - Z-index: 9999
  - Backdrop-filter: blur(3px)

Modal Body:
  - Border Radius: 22px
  - Padding: 28px 24px
  - Animation: modeIn 0.25s ease
```

## 🎯 Espaciado

```
Extra Small: 4px
Small:       8px
Medium:      12px - 14px
Large:       16px - 18px
XL:          20px
2XL:         28px

Gap entre elementos: 8px - 12px
Padding de containers: 14px - 20px
Margin bottom de secciones: 16px - 24px
```

## 🔄 Animaciones

```
fade-up:     opacity 0→1, translateY 14px→0, 0.45s ease both
fade-in:     opacity 0→1, 0.35s ease both
mode-in:     opacity 0→1, scale 0.98→1, 0.3s ease both
pulse:       opacity 1→0.35→1, 0.5s ease infinite
modeIn:      opacity 0→1, scale 0.98→1, 0.25s ease

Transiciones predefinidas:
  - color/border: 0.3s ease
  - background: 0.4s ease
  - all: 0.2s ease
```

## 📏 Responsive

```
Mobile first approach

Breakpoints:
  - Mobile (default):  < 480px
  - Tablet:            480px - 768px
  - Desktop:          > 768px

Layout:
  - Padding horizontal: 18px - 20px en mobile
  - Full width en áreas de scroll
  - NavBar fixed bottom: altura 60px, z-index 1000

Viewport height:
  - Main content scroll: calc(100dvh - 104px)
  - NavBar + safe areas: 60px (bottom) + 44px (notch, si aplica)
```

## 🧩 Estructura de Tabs

```
6 Tabs principales:
  1. Inicio (◈) - Dashboard/Home
  2. Hábito (▦) - Menú semanal
  3. Despensa (⬡) - Inventario de ingredientes
  4. Entrena (◉) - Plan de entrenamiento
  5. Asistente (✦) - Chat con IA
  6. Perfil (◎) - Configuración de usuario

NavBar:
  - Position: fixed bottom
  - Height: 60px
  - Flex layout con 6 botones iguales
  - Active state: icon color Sage + underline 16x2px
  - Transition: 0.2s
```

## 🎨 Temas por Sección

### Inicio (Dashboard)
- Fondo neutro (BG color)
- Cards con peso visual
- Mini-charts con líneas suaves
- Grid layouts para métricas

### Hábito (Menú)
- Cards por día de la semana
- Day tracker con colores: Sage=tiene menú, Border=sin menú
- Selector de día con pills

### Entrena (Training)
- Semana selector (pills 1-4)
- Sesión cards con progreso visual (barra violeta)
- Vista detallada: tabla con ejercicios + inputs

### Asistente (Chat)
- Bubble chat style
- Avatar gradiente (Sage→SageDark)
- Suggested prompts como pills

### Perfil
- Avatar grande
- Cards de configuración
- Toggle dark mode
- Stats grid (4 columnas)

## ✨ Principios de Diseño

1. **Minimalista pero cálido**: Colores naturales (sage, sand, beige)
2. **Accesibilidad**: Suficiente contraste, tamaños legibles
3. **Consistencia**: Mismo radio, mismo padding, mismas transiciones
4. **Espaciado respirable**: No apretado, espacios generosos
5. **Micro-interacciones**: Transiciones suaves, feedback visual claro
6. **Dark mode**: Mismo sistema de colores, inversión inteligente
7. **Mobile-first**: Funciona perfecto en móvil, escala a desktop

## 📱 Estados Comunes

```
Hover:       Darken color 5-10%, cambiar border si aplica
Active:      Darken más, scale 0.98 opcional
Loading:     Pulse animation en elemento
Disabled:    Opacidad 0.5-0.6, cursor not-allowed
Success:     Verde (usar Sage) + checkmark
Error:       Rojo (usar Clay) + ícono
```

## 🔐 Colores de Datos

```
Positivo/Éxito:    Sage (#7C9E87)
Negativo/Advertencia: Clay (#C4856A)
Info/Neutro:       Sky (#7EA8C4)
Acciones:          Violet (#9B8EC4)
Deshabilitado:     Muted (#B8B0A0)
```
