---
name: Luminous Ether
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424754'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#b10e6b'
  on-tertiary: '#ffffff'
  tertiary-container: '#d23284'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffd9e4'
  tertiary-fixed-dim: '#ffb0cd'
  on-tertiary-fixed: '#3e0022'
  on-tertiary-fixed-variant: '#8c0053'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  accent-text:
    fontFamily: Yellowtail
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.2'
  label-caps:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 2rem
  xl: 4rem
  container-max: 1200px
  gutter: 1.5rem
---

## Brand & Style

The design system is centered on the concept of "Seamless Transition." It targets a premium audience that values both high-performance utility and aesthetic inspiration. The UI should evoke a sense of weightlessness, as if files are drifting through a digital nebula rather than being processed by a machine.

The style is a refined evolution of **Glassmorphism**, characterized by extreme translucency and depth. By layering frosted surfaces over a surreal, slow-moving 3D nature backdrop, the interface feels integrated into an environment rather than sitting on top of it. The visual narrative is one of clarity, magic, and effortless movement.

## Colors

The palette leverages a vibrant spectrum of cool and warm tones to represent the dynamic nature of data transfer. 
- **Primary Blue & Cyan** represent the stability and speed of the shifting process.
- **Secondary Purple & Pink** provide the "dreamy" luxury feel, used for interactive states and highlights.
- **Surface Strategy:** The UI does not use solid backgrounds. Every container uses the `glass_surface` token to maintain connection with the underlying 3D environment. 
- **Gradients:** Use linear gradients (135deg) transitioning from Primary to Secondary for primary actions, and Secondary to Tertiary for promotional or high-energy elements.

## Typography

This design system uses a sophisticated typographic hierarchy to balance technical precision with organic beauty.
- **Sora** provides a geometric, modern structure for all functional headings.
- **Inter** ensures maximum legibility for file names, metadata, and settings.
- **Yellowtail** is used sparingly for "human" touches, such as tooltips, empty state illustrations, or decorative pull-quotes.
- **Kaushan Script** is reserved exclusively for the brand mark to signify a premium, "signed" experience.

## Layout & Spacing

The layout philosophy is **Floating Fluidity**. Elements should never feel cramped; they float within generous margins to maintain the "dreamy" aesthetic.

- **Grid:** Use a 12-column fluid grid for desktop with 24px gutters. For mobile, shift to a single-column layout with 16px side margins.
- **Centering:** The primary "Shifter" interface should be centrally weighted to create a focal point against the moving 3D background.
- **Safe Areas:** Maintain a minimum of 80px vertical spacing between major glass sections to allow the background animation to remain visible and breathe.

## Elevation & Depth

Depth is achieved through optical physics rather than traditional shadows.
- **Backdrop Blur:** A consistent 24px blur is applied to all glass containers to create a sense of distance from the background.
- **Glows:** Instead of black shadows, use "Soft Glowing Drop Shadows." Use the primary or secondary color at 20% opacity with a 30px blur, offset 10px downward. This makes components appear self-illuminated.
- **Borders:** Every glass element must have a 1px solid white border at 50% opacity. This "specular edge" defines the shape against the blurred background.

## Shapes

The design system utilizes **Rounded** geometry (0.5rem base) to echo the organic forms found in the nature-inspired background.
- **Cards & Modals:** Use `rounded-xl` (1.5rem) to soften the large glass surfaces.
- **Interactive Elements:** Buttons and input fields use `rounded-lg` (1rem).
- **Progress Bars:** Use fully pill-shaped (rounded-full) corners to suggest fluid motion.

## Components

### Buttons
- **Primary:** Gradient fill (Blue to Purple), white text, with a soft purple glow shadow. On hover, increase glow intensity and slightly scale the button (1.05x).
- **Secondary:** Glass surface (70% white) with 1px border. Text in Primary Blue.

### Cards & File Nodes
- Large glass panes with `backdrop-filter: blur(24px)`.
- Use an inner "shine" (a subtle diagonal linear gradient mask) that moves across the card on hover.

### Inputs
- Semi-transparent background (30% white) to distinguish from the main glass container. 
- Bottom-border only or very subtle 1px border. Focus state triggers a Cyan outer glow.

### Motion & Interaction
- **Background:** A slow, continuous zoom-pan effect on the 3D nature scene.
- **File Shifting:** When a file is "shifted," use a particle-burst effect or a smooth "motion blur" path from source to destination.
- **Entrance:** Glass panels should fade in while scaling from 95% to 100% with a spring easing function.

### Progress Indicators
- Use a "liquid fill" animation for progress bars, where the color pulsates and has a slight wave effect at the leading edge.