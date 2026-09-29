---
name: 3D viewer fallback
description: Prevent model-viewer initialization failures in browser previews without a working WebGL context.
---

Before importing or registering `<model-viewer>`, synchronously probe WebGL and skip viewer initialization when no context is available. Keep a non-WebGL visual fallback, and avoid placing fallback status copy over mobile hero text.

**Why:** The Replit preview browser could not create a WebGL context. Registering the viewer caused an uncaught initialization error before the element's load/error handlers could show a fallback.

**How to apply:** Any future 3D product stage using model-viewer should feature-detect WebGL before loading the custom element and provide a static fallback for unsupported devices.