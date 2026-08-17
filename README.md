# ServerToolkit

A modern, open-source collection of tools for Minecraft server owners and developers. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no server required.

## Features

- Modern dark mode UI with rounded corners and smooth animations
- Fully responsive — works on desktop, tablet, and mobile
- Privacy focused — all tools run locally in your browser
- Lightweight — no external dependencies except Font Awesome and Google Fonts
- Free and open source — MIT licensed

## Tools

- **MOTD Generator** (`motd.html`) — Create and preview Minecraft MOTDs with colors and formatting. Supports both § and & color codes with live preview.
- **Server Properties Editor** (`server-properties.html`) — Upload or paste your `server.properties` file, edit common settings, and download the modified file. All processing happens locally.
- **Java Arguments Generator** (`java-arguments.html`) — Generate Java startup arguments based on server software, version, RAM, and performance preferences. Includes presets for common server types and advanced configuration options.
- **Server Information** (`server-info.html`) — Query server status, version, and player count using the Minecraft server list ping protocol.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yorokobiyt/servertoolkit.git
   cd servertoolkit
   ```

2. Open `index.html` in your browser. No server or build step required.

3. Alternatively, serve the directory with any static file server:

   ```bash
   # Using Python
   python -m http.server 8080

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8080
   ```

4. Open `http://localhost:8080` in your browser.

## Project Structure

```
servertoolkit/
├── index.html                  # Landing page
├── motd.html                   # MOTD Generator
├── server-properties.html      # Server Properties Editor
├── java-arguments.html         # Java Arguments Generator
├── server-info.html            # Server Information
├── README.md                   # This file
├── LICENSE                     # MIT License
└── assets/
    ├── css/
    │   ├── style.css           # Global styles
    │   ├── java-arguments.css  # Java Arguments specific styles
    │   └── ...                 # Other tool-specific styles
    └── js/
        ├── main.js             # Global JavaScript (toasts, mobile nav, etc.)
        ├── java-arguments.js   # Java Arguments logic
        └── ...                 # Other tool-specific scripts
```

## Key Features by Tool

### Java Arguments Generator

- Fetches Minecraft versions directly from the Mojang API
- Quick presets: Test Server, Small SMP, Medium Community, Large Network, Modded Server, Extreme Performance
- Advanced customization: server type, player count, mod count, world size, hardware tier
- Garbage collector selection: G1GC, ZGC, Shenandoah, Parallel, Serial
- Advanced flags: Aikar's flags, preload chunks, large pages, native transport, JFR, debug mode

### MOTD Generator

- Full color palette (16 Minecraft colors)
- Formatting: bold, italic, underline, strikethrough, reset
- Live preview with Minecraft-style server list display
- Supports both `§` and `&` color codes

### Server Properties Editor

- Paste or upload existing `server.properties`
- Edit 30+ common settings with proper input types
- Preserves unknown/custom properties
- Copy or download the modified file

## Technologies Used

- HTML5 — Semantic markup
- CSS3 — Custom properties, flexbox, grid, animations
- JavaScript (ES6+) — Vanilla JS, no frameworks
- Font Awesome 6 — Icons
- Google Fonts (Inter) — Typography
- Mojang API — Minecraft version data

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

Contributions are welcome. Please feel free to submit a pull request or open an issue.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## Development

This is a static site. Edit the HTML, CSS, and JS files directly and refresh your browser to see changes.

For the Java Arguments Generator, the Minecraft version list is fetched dynamically from the Mojang API. If the API is unreachable, the tool falls back to a static version list.
