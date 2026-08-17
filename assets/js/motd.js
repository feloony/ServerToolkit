    (function () {
      const colors = [
        { code: "0", hex: "#000000", label: "0" },
        { code: "1", hex: "#0000AA", label: "1" },
        { code: "2", hex: "#00AA00", label: "2" },
        { code: "3", hex: "#00AAAA", label: "3" },
        { code: "4", hex: "#AA0000", label: "4" },
        { code: "5", hex: "#AA00AA", label: "5" },
        { code: "6", hex: "#FFAA00", label: "6" },
        { code: "7", hex: "#AAAAAA", label: "7" },
        { code: "8", hex: "#555555", label: "8" },
        { code: "9", hex: "#5555FF", label: "9" },
        { code: "a", hex: "#55FF55", label: "a" },
        { code: "b", hex: "#55FFFF", label: "b" },
        { code: "c", hex: "#FF5555", label: "c" },
        { code: "d", hex: "#FF55FF", label: "d" },
        { code: "e", hex: "#FFFF55", label: "e" },
        { code: "f", hex: "#FFFFFF", label: "f" },
      ];

      const formats = [
        { code: "l", label: "Bold", icon: "fa-bold" },
        { code: "o", label: "Italic", icon: "fa-italic" },
        { code: "n", label: "Underline", icon: "fa-underline" },
        { code: "m", label: "Strike", icon: "fa-strikethrough" },
        { code: "r", label: "Reset", icon: "fa-undo" },
      ];

      const input = document.getElementById("motd-input");
      const output = document.getElementById("motd-output");
      const preview = document.getElementById("motd-preview");
      const colorPalette = document.getElementById("color-palette");
      const formatChips = document.getElementById("format-chips");
      const copyBtn = document.getElementById("motd-copy");
      const resetBtn = document.getElementById("motd-reset");

      function buildColorPalette() {
        colors.forEach((c) => {
          const swatch = document.createElement("button");
          swatch.className = "color-swatch";
          swatch.style.background = c.hex;
          swatch.textContent = c.label;
          swatch.title = "§" + c.code;
          swatch.addEventListener("click", () => insertCode("§" + c.code));
          colorPalette.appendChild(swatch);
        });
      }

      function buildFormatChips() {
        formats.forEach((f) => {
          const chip = document.createElement("button");
          chip.className = "format-chip";
          chip.innerHTML = `<i class="fas ${f.icon}"></i> ${f.label}`;
          chip.title = "§" + f.code;
          chip.addEventListener("click", () => insertCode("§" + f.code));
          formatChips.appendChild(chip);
        });
      }

      function insertCode(code) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const val = input.value;
        input.value = val.substring(0, start) + code + val.substring(end);
        input.selectionStart = input.selectionEnd = start + code.length;
        input.focus();
        render();
      }

      function convertAmpersands(text) {
        return text.replace(/&([0-9a-fk-or])/gi, "§$1");
      }

      function parseMotd(text) {
        const converted = convertAmpersands(text);
        const segments = [];
        const regex = /§([0-9a-fk-or])/g;
        let lastIndex = 0;
        let currentStyle = {};
        let currentText = "";
        let match;

        while ((match = regex.exec(converted)) !== null) {
          if (match.index > lastIndex) {
            currentText += converted.slice(lastIndex, match.index);
          }

          if (currentText) {
            segments.push({ text: currentText, style: { ...currentStyle } });
            currentText = "";
          }

          const code = match[1].toLowerCase();
          if (code === "r") {
            currentStyle = {};
          } else if ("0123456789abcdef".includes(code)) {
            currentStyle = { color: code };
          } else {
            currentStyle[code] = true;
          }

          lastIndex = match.index + match[0].length;
        }

        if (lastIndex < converted.length) {
          currentText += converted.slice(lastIndex);
        }

        if (currentText) {
          segments.push({ text: currentText, style: { ...currentStyle } });
        }

        return segments;
      }

      function render() {
        const text = input.value;
        const converted = convertAmpersands(text);
        output.innerHTML = converted || "&nbsp;";

        const segments = parseMotd(text);
        preview.innerHTML = "";

        if (segments.length === 0) {
          preview.innerHTML = '<span style="color: #8b949e; font-style: italic;">Your MOTD preview will appear here...</span>';
          return;
        }

        segments.forEach((seg) => {
          const span = document.createElement("span");
          span.textContent = seg.text;
          const style = seg.style;

          if (style.color) {
            const colorMap = {};
            colors.forEach(c => colorMap[c.code] = c.hex);
            span.style.color = colorMap[style.color] || "#000";
          }

          if (style.l) span.style.fontWeight = "700";
          if (style.o) span.style.fontStyle = "italic";
          if (style.n) span.style.textDecoration = "underline";
          if (style.m) span.style.textDecoration = "line-through";

          preview.appendChild(span);
        });
      }

      copyBtn.addEventListener("click", () => {
        const text = input.value.trim();
        if (!text) {
          if (window.showToast) showToast("Enter some MOTD text first", "error");
          return;
        }
        if (window.copyToClipboard) copyToClipboard(input.value, "MOTD copied to clipboard");
      });

      resetBtn.addEventListener("click", () => {
        input.value = "";
        render();
        input.focus();
      });

      input.addEventListener("input", render);

      buildColorPalette();
      buildFormatChips();
      render();
    })();