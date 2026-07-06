# Hero Section Design Requirements

## Section Overview

Create a modern, premium, pixel-perfect full-screen Hero Section using **React + Tailwind CSS + GSAP**.

The Hero Section must feel premium, smooth, minimal, and production-ready.

---

# Layout

- Full Screen Hero Section
- Height: **100dvh**
- Use modern CSS units (`dvh`)
- Responsive on all devices
- No layout shift during any animation
- Pixel-perfect spacing
- Professional typography
- Smooth GSAP animations
- Background should cover every screen size properly

---

# Background

Use a **Full Screen Background Video**

Requirements:

- Full width
- Full height (100dvh)
- object-cover
- Always cover screen
- Responsive on every device
- Video should never stretch
- Video should never leave blank spaces

Example CSS idea

- width: 100%
- height: 100dvh
- object-fit: cover

---

# Content Position

Content should stay on the **Left Side**

Vertically centered.

---

# First Text

Show a small badge-style paragraph.

Text:

> Turning Data into Decisions, Code into Solutions

Requirements

- Use `<p>`
- Modern rounded box
- Premium glass/box style
- Proper padding
- Clean typography

---

# Name

Below the paragraph show the name.

Use very large bold typography.

Use this exact style.

```css
style attribute {
    font-family: Satoshi, system-ui, sans-serif;
    font-weight: 800;
    font-size: clamp(3.8rem, 11.5vw, 14rem);
    translate: none;
    rotate: none;
    scale: none;
    opacity: 1;
    transform: translate(0px, 0px);
}
```

Do not modify these values.

---

# Description

Below the name show an h4.

Text:

Specializing in AI Agents, RAG Systems, LangGraph pipelines, and scalable full-stack architecture — turning complex problems into production-ready solutions.

---

# Word Change Animation

The animation should happen only after:

> Specializing in

The remaining sentence should always stay unchanged.

Words that will rotate:

- AI Agents
- RAG Systems
- LangGraph pipelines
- full-stack architecture

The animation must be very smooth and should never break the layout.

---

# Animation Details

Initially show

Specializing in **AI Agents**

A blinking cursor should appear slightly outside the top-left of the first letter ("A").

Example:

Cursor appears near the top of the "A".

The cursor automatically performs a text selection animation.

Animation flow:

1. Cursor appears above the first letter.
2. Cursor moves across the word as if selecting the text.
3. Entire word becomes selected.
4. Cursor returns back smoothly.
5. Immediately after returning, replace the selected word with the next word.
6. Repeat the same animation forever.

Rotation order:

AI Agents

↓

RAG Systems

↓

LangGraph pipelines

↓

full-stack architecture

↓

Back to AI Agents

Repeat infinitely.

---

# Important Animation Rules

- Must use GSAP.
- Extremely smooth animation.
- No flickering.
- No jumping.
- No text shifting.
- No layout movement.
- No CLS (Cumulative Layout Shift).
- Text container width should remain stable.
- Reserve enough width for the longest text.
- The surrounding sentence must never move.
- Animation should feel premium.
- Cursor movement should be realistic.
- Selection should feel like a real text editor.
- Word replacement should happen instantly after cursor returns.

---

# Buttons

Below the description add two buttons.

Button 1

View Work

Button 2

Contact

Requirements

- Modern design
- Pixel-perfect spacing
- Same height
- Proper padding
- Fully responsive
- Premium hover animation
- GSAP hover interaction
- Smooth transitions

---

# Responsive Requirements

Desktop

- Perfect spacing
- Large typography
- Full-screen hero

Tablet

- Maintain proportions
- No overlapping

Mobile

- Proper scaling
- Responsive typography
- No overflow
- Buttons stack properly if needed
- Video remains full screen
- Layout stays clean

---

# Performance

- Use GSAP timelines.
- Optimize animations.
- Smooth 60fps.
- No unnecessary re-renders.
- GPU-friendly transforms.
- Use translate and opacity whenever possible.
- Keep animation lightweight.

---

# Final Goal

Build a premium, modern, production-ready portfolio Hero Section with:

- Full-screen background video
- Left aligned content
- Premium typography
- Animated rotating specialization text
- Cursor-based text selection animation
- GSAP-powered smooth interactions
- Responsive layout
- Pixel-perfect design
- Zero layout shift
- Production-quality frontend implementation