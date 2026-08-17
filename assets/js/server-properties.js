(function () {
    const knownKeys = [
      { key: "server-port", label: "Server Port", type: "number", min: 1, max: 65535 },
      { key: "server-ip", label: "Server IP", type: "text" },
      { key: "max-players", label: "Max Players", type: "number", min: 1, max: 10000 },
      { key: "motd", label: "MOTD", type: "text" },
      { key: "level-name", label: "Level Name", type: "text" },
      { key: "level-seed", label: "Level Seed", type: "text" },
      { key: "level-type", label: "Level Type", type: "select", options: ["minecraft:normal", "minecraft:flat", "minecraft:large_biomes", "minecraft:amplified"] },
      { key: "gamemode", label: "Gamemode", type: "select", options: ["survival", "creative", "adventure", "spectator"] },
      { key: "difficulty", label: "Difficulty", type: "select", options: ["peaceful", "easy", "normal", "hard"] },
      { key: "hardcore", label: "Hardcore", type: "select", options: ["true", "false"] },
      { key: "pvp", label: "PVP", type: "select", options: ["true", "false"] },
      { key: "force-gamemode", label: "Force Gamemode", type: "select", options: ["true", "false"] },
      { key: "allow-flight", label: "Allow Flight", type: "select", options: ["true", "false"] },
      { key: "allow-nether", label: "Allow Nether", type: "select", options: ["true", "false"] },
      { key: "spawn-monsters", label: "Spawn Monsters", type: "select", options: ["true", "false"] },
      { key: "spawn-animals", label: "Spawn Animals", type: "select", options: ["true", "false"] },
      { key: "spawn-npcs", label: "Spawn NPCs", type: "select", options: ["true", "false"] },
      { key: "generate-structures", label: "Generate Structures", type: "select", options: ["true", "false"] },
      { key: "enable-command-block", label: "Enable Command Blocks", type: "select", options: ["true", "false"] },
      { key: "view-distance", label: "View Distance", type: "number", min: 2, max: 32 },
      { key: "simulation-distance", label: "Simulation Distance", type: "number", min: 2, max: 32 },
      { key: "spawn-protection", label: "Spawn Protection", type: "number", min: 0, max: 100 },
      { key: "max-world-size", label: "Max World Size", type: "number", min: 1, max: 29999984 },
      { key: "generator-settings", label: "Generator Settings", type: "text" },
      { key: "online-mode", label: "Online Mode", type: "select", options: ["true", "false"] },
      { key: "white-list", label: "White List", type: "select", options: ["true", "false"] },
      { key: "enforce-whitelist", label: "Enforce Whitelist", type: "select", options: ["true", "false"] },
      { key: "enforce-secure-profile", label: "Enforce Secure Profile", type: "select", options: ["true", "false"] },
      { key: "prevent-proxy-connections", label: "Prevent Proxy Connections", type: "select", options: ["true", "false"] },
      { key: "require-resource-pack", label: "Require Resource Pack", type: "select", options: ["true", "false"] },
      { key: "op-permission-level", label: "OP Permission Level", type: "number", min: 1, max: 4 },
      { key: "function-permission-level", label: "Function Permission Level", type: "number", min: 1, max: 4 },
      { key: "enable-status", label: "Enable Server Status", type: "select", options: ["true", "false"] },
      { key: "enable-query", label: "Enable Query", type: "select", options: ["true", "false"] },
      { key: "query.port", label: "Query Port", type: "number", min: 1, max: 65535 },
      { key: "network-compression-threshold", label: "Network Compression Threshold", type: "number", min: -1 },
      { key: "rate-limit", label: "Rate Limit", type: "number", min: 0 },
      { key: "entity-broadcast-range-percentage", label: "Entity Broadcast Range", type: "number", min: 10, max: 1000 },
      { key: "use-native-transport", label: "Use Native Transport", type: "select", options: ["true", "false"] },
      { key: "enable-rcon", label: "Enable RCON", type: "select", options: ["true", "false"] },
      { key: "rcon.port", label: "RCON Port", type: "number", min: 1, max: 65535 },
      { key: "max-tick-time", label: "Max Tick Time (ms)", type: "number", min: 0 },
      { key: "player-idle-timeout", label: "Player Idle Timeout (minutes)", type: "number", min: 0 },
      { key: "pause-when-empty-seconds", label: "Pause When Empty (seconds)", type: "number", min: -1 },
      { key: "chat-spam-threshold-seconds", label: "Chat Spam Threshold", type: "number", min: 0 },
      { key: "command-spam-threshold-seconds", label: "Command Spam Threshold", type: "number", min: 0 },
      { key: "log-ips", label: "Log IP Addresses", type: "select", options: ["true", "false"] },
      { key: "resource-pack", label: "Resource Pack URL", type: "text" },
      { key: "resource-pack-sha1", label: "Resource Pack SHA-1", type: "text" },
      { key: "resource-pack-id", label: "Resource Pack ID", type: "text" },
      { key: "resource-pack-prompt", label: "Resource Pack Prompt", type: "text" },
      { key: "initial-enabled-packs", label: "Initial Enabled Packs", type: "text" },
      { key: "initial-disabled-packs", label: "Initial Disabled Packs", type: "text" },
      { key: "accepts-transfers", label: "Accepts Transfers", type: "select", options: ["true", "false"] },
      { key: "hide-online-players", label: "Hide Online Players", type: "select", options: ["true", "false"] },
      { key: "max-chained-neighbor-updates", label: "Max Chained Neighbor Updates", type: "number", min: 0 },
      { key: "region-file-compression", label: "Region File Compression", type: "select", options: ["deflate", "lz4", "none"] }
    ];      
    const knownKeyMap = {};
      knownKeys.forEach(k => knownKeyMap[k.key] = k);

      let propertiesData = {};

      function parseProperties(text) {
        const result = {};
        const lines = text.split(/\r?\n/);
        lines.forEach(line => {
          line = line.trim();
          if (!line || line.startsWith("#")) return;
          const eqIdx = line.indexOf("=");
          if (eqIdx === -1) return;
          const key = line.slice(0, eqIdx).trim();
          const value = line.slice(eqIdx + 1).trim();
          if (key) result[key] = value;
        });
        return result;
      }

      function serializeProperties(data) {
        const lines = [];
        for (const [key, value] of Object.entries(data)) {
          lines.push(`${key}=${value}`);
        }
        return lines.join("\n");
      }

      function renderEditor() {
        const knownContainer = document.getElementById("known-settings");
        const unknownContainer = document.getElementById("unknown-settings");
        knownContainer.innerHTML = "";
        unknownContainer.innerHTML = "";

        const knownKeysFound = [];
        const unknownKeysFound = [];

        Object.keys(propertiesData).forEach(key => {
          if (knownKeyMap[key]) {
            knownKeysFound.push(key);
          } else {
            unknownKeysFound.push(key);
          }
        });

        knownKeys.forEach(def => {
          const value = propertiesData[def.key] !== undefined ? propertiesData[def.key] : "";
          const wrapper = document.createElement("div");
          wrapper.className = "form-group";

          const label = document.createElement("label");
          label.textContent = def.label;
          wrapper.appendChild(label);

          let input;
          if (def.type === "select") {
            input = document.createElement("select");
            input.className = "form-select";
            def.options.forEach(opt => {
              const option = document.createElement("option");
              option.value = opt;
              option.textContent = opt;
              if (value === opt) option.selected = true;
              input.appendChild(option);
            });
          } else if (def.type === "number") {
            input = document.createElement("input");
            input.type = "number";
            input.className = "form-input";
            input.value = value;
            if (def.min !== undefined) input.min = def.min;
            if (def.max !== undefined) input.max = def.max;
          } else {
            input = document.createElement("input");
            input.type = "text";
            input.className = "form-input";
            input.value = value;
          }

          input.dataset.key = def.key;
          input.addEventListener("input", () => {
            propertiesData[def.key] = input.value;
            updateOutput();
          });

          wrapper.appendChild(input);
          knownContainer.appendChild(wrapper);
        });

        if (unknownKeysFound.length > 0) {
          unknownKeysFound.forEach(key => {
            const row = document.createElement("div");
            row.className = "info-row";
            row.innerHTML = `<span class="info-label">${key}</span><span class="info-value unknown">${propertiesData[key]}</span>`;
            unknownContainer.appendChild(row);
          });
        } else {
          unknownContainer.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i><p>No unknown properties.</p></div>';
        }

        updateOutput();
      }

      function updateOutput() {
        const output = document.getElementById("properties-output");
        output.textContent = serializeProperties(propertiesData);
      }

      function loadFromText(text) {
        propertiesData = parseProperties(text);
        document.getElementById("properties-parsed").style.display = "block";
        renderEditor();
      }

      const rawTextarea = document.getElementById("properties-raw");
      rawTextarea.addEventListener("input", () => {
        if (rawTextarea.value.trim()) {
          loadFromText(rawTextarea.value);
        }
      });

      document.getElementById("properties-file").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          rawTextarea.value = ev.target.result;
          loadFromText(ev.target.result);
        };
        reader.readAsText(file);
      });

      const uploadZone = document.getElementById("upload-zone");
      uploadZone.addEventListener("click", () => document.getElementById("properties-file").click());

      uploadZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = "var(--accent)";
      });

      uploadZone.addEventListener("dragleave", () => {
        uploadZone.style.borderColor = "";
      });

      uploadZone.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = "";
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          rawTextarea.value = ev.target.result;
          loadFromText(ev.target.result);
        };
        reader.readAsText(file);
      });

      document.querySelectorAll(".tool-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          document.querySelectorAll(".tool-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          document.querySelectorAll(".tab-content").forEach(c => c.style.display = "none");
          document.getElementById("tab-" + tab.dataset.tab).style.display = "block";
        });
      });

      document.getElementById("properties-copy").addEventListener("click", () => {
        const text = serializeProperties(propertiesData);
        if (!text) {
          if (window.showToast) showToast("No properties to copy", "error");
          return;
        }
        if (window.copyToClipboard) copyToClipboard(text, "Properties copied to clipboard");
      });

      document.getElementById("properties-download").addEventListener("click", () => {
        const text = serializeProperties(propertiesData);
        if (!text) {
          if (window.showToast) showToast("No properties to download", "error");
          return;
        }
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "server.properties";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (window.showToast) showToast("File downloaded", "success");
      });
    })();
