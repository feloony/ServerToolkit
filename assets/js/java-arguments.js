(function () {
  const ramSlider = document.getElementById("allocated-ram");
  const ramDisplay = document.getElementById("ram-display");
  const generateBtn = document.getElementById("generate-args");
  const outputEl = document.getElementById("args-output");
  const copyBtn = document.getElementById("args-copy");
  const versionSelect = document.getElementById("mc-version");
  const versionStatus = document.getElementById("version-status");
  const versionSpinner = document.getElementById("version-spinner");
  const serverSoftware = document.getElementById("server-software");
  const javaVersion = document.getElementById("java-version");
  const performanceSelect = document.getElementById("performance");
  const serverType = document.getElementById("server-type");
  const playerCount = document.getElementById("player-count");
  const modCount = document.getElementById("mod-count");
  const worldSize = document.getElementById("world-size");
  const hardwareTier = document.getElementById("hardware-tier");
  const gcType = document.getElementById("gc-type");
  const flagAikar = document.getElementById("flag-aikar");
  const flagPreload = document.getElementById("flag-preload");
  const flagOptimize = document.getElementById("flag-optimize");
  const flagLargePages = document.getElementById("flag-large-pages");
  const flagNativeTransport = document.getElementById("flag-native-transport");
  const flagJFR = document.getElementById("flag-jfr");
  const flagDebug = document.getElementById("flag-debug");
  const advancedToggle = document.getElementById("advanced-toggle");
  const advancedSection = document.getElementById("advanced-section");

  const MOJANG_API = "https://launchermeta.mojang.com/mc/game/version_manifest.json";
  const PISTON_API = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";

  let minecraftVersions = [];
  let isLoadingVersions = false;

  if (advancedToggle && advancedSection) {
    advancedToggle.addEventListener("click", () => {
      const isHidden = advancedSection.style.display === "none" || advancedSection.style.display === "";
      advancedSection.style.display = isHidden ? "block" : "none";
      advancedToggle.classList.toggle("open", isHidden);
    });
  }

  const presets = {
    test: { ram: 2, software: "paper", java: "21", performance: "memory", serverType: "smp", playerCount: "5", modCount: "0", worldSize: "small", hardwareTier: "low", gcType: "g1gc" },
    small: { ram: 4, software: "paper", java: "21", performance: "balanced", serverType: "smp", playerCount: "10", modCount: "0", worldSize: "medium", hardwareTier: "low", gcType: "g1gc" },
    medium: { ram: 6, software: "paper", java: "21", performance: "balanced", serverType: "smp", playerCount: "20", modCount: "0", worldSize: "medium", hardwareTier: "medium", gcType: "g1gc" },
    large: { ram: 8, software: "paper", java: "21", performance: "performance", serverType: "smp", playerCount: "50", modCount: "0", worldSize: "large", hardwareTier: "high", gcType: "g1gc" },
    modded: { ram: 16, software: "forge", java: "17", performance: "performance", serverType: "pixelmon", playerCount: "20", modCount: "100", worldSize: "large", hardwareTier: "medium", gcType: "g1gc" },
    extreme: { ram: 32, software: "purpur", java: "21", performance: "performance", serverType: "smp", playerCount: "100", modCount: "0", worldSize: "huge", hardwareTier: "extreme", gcType: "g1gc" }
  };

  async function fetchMinecraftVersions() {
    if (isLoadingVersions) return;
    isLoadingVersions = true;
    
    if (versionSpinner) versionSpinner.classList.add("active");
    if (versionStatus) {
      versionStatus.innerHTML = '<i class="fas fa-sync-alt"></i> Fetching versions from Mojang API...';
    }

    try {
      const response = await fetch(MOJANG_API);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      minecraftVersions = data.versions || [];
      
      if (minecraftVersions.length === 0) throw new Error("No versions found");
      populateVersionDropdown();
      
      if (versionStatus) {
        versionStatus.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success);"></i> Loaded ${minecraftVersions.length} versions from Mojang API`;
      }
    } catch (error) {
      console.error("Failed to fetch from Mojang API:", error);
      
      try {
        const fallbackResponse = await fetch(PISTON_API);
        if (!fallbackResponse.ok) throw new Error(`HTTP ${fallbackResponse.status}`);
        
        const fallbackData = await fallbackResponse.json();
        minecraftVersions = fallbackData.versions || [];
        
        if (minecraftVersions.length === 0) throw new Error("No versions found in fallback");
        populateVersionDropdown();
        
        if (versionStatus) {
          versionStatus.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success);"></i> Loaded ${minecraftVersions.length} versions from Piston API`;
        }
      } catch (fallbackError) {
        console.error("Failed to fetch from fallback API:", fallbackError);
        loadStaticVersions();
      }
    } finally {
      isLoadingVersions = false;
      if (versionSpinner) versionSpinner.classList.remove("active");
    }
  }

  function populateVersionDropdown() {
    if (!versionSelect) return;
    versionSelect.innerHTML = "";

    const releaseVersions = minecraftVersions.filter(v => v.type === "release");
    const snapshotVersions = minecraftVersions.filter(v => v.type === "snapshot");
    const legacyVersions = minecraftVersions.filter(v => v.type === "old_beta" || v.type === "old_alpha");
    const latestRelease = releaseVersions[0];

    if (latestRelease) {
      const latestOption = document.createElement("option");
      latestOption.value = latestRelease.id;
      latestOption.textContent = `${latestRelease.id} (Latest Release)`;
      latestOption.selected = true;
      versionSelect.appendChild(latestOption);
    }

    const releaseGroup = document.createElement("optgroup");
    releaseGroup.label = "Stable Releases";
    releaseVersions.slice(0, 30).forEach(version => {
      const option = document.createElement("option");
      option.value = version.id;
      option.textContent = version.id;
      releaseGroup.appendChild(option);
    });
    versionSelect.appendChild(releaseGroup);

    if (snapshotVersions.length > 0) {
      const snapshotGroup = document.createElement("optgroup");
      snapshotGroup.label = "Snapshots";
      snapshotVersions.slice(0, 10).forEach(version => {
        const option = document.createElement("option");
        option.value = version.id;
        option.textContent = `${version.id} (Snapshot)`;
        snapshotGroup.appendChild(option);
      });
      versionSelect.appendChild(snapshotGroup);
    }

    if (legacyVersions.length > 0) {
      const legacyGroup = document.createElement("optgroup");
      legacyGroup.label = "Legacy Versions";
      legacyVersions.slice(0, 20).forEach(version => {
        const option = document.createElement("option");
        option.value = version.id;
        option.textContent = `${version.id} (Legacy)`;
        legacyGroup.appendChild(option);
      });
      versionSelect.appendChild(legacyGroup);
    }

    if (versionSelect.options.length > 0) {
      versionSelect.value = latestRelease ? latestRelease.id : releaseVersions[0]?.id || "";
    }

    generateCommand();
  }

  function loadStaticVersions() {
    const staticVersions = [
      { id: "1.21.4", type: "release" }, { id: "1.21.3", type: "release" },
      { id: "1.21.1", type: "release" }, { id: "1.20.4", type: "release" },
      { id: "1.20.2", type: "release" }, { id: "1.19.4", type: "release" },
      { id: "1.18.2", type: "release" }, { id: "1.17.1", type: "release" },
      { id: "1.16.5", type: "release" }, { id: "1.12.2", type: "release" },
      { id: "1.8.8", type: "release" },
    ];

    minecraftVersions = staticVersions;
    
    if (versionSelect) {
      versionSelect.innerHTML = "";
      staticVersions.forEach((version, index) => {
        const option = document.createElement("option");
        option.value = version.id;
        option.textContent = index === 0 ? `${version.id} (Latest)` : version.id;
        versionSelect.appendChild(option);
      });
    }

    if (versionStatus) {
      versionStatus.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i> Could not reach Mojang API. Using static version list.`;
    }

    generateCommand();
  }

  if (ramSlider && ramDisplay) {
    ramSlider.addEventListener("input", () => {
      ramDisplay.textContent = ramSlider.value + " GB";
      updatePresetActiveState();
      generateCommand();
    });
  }

  function getBaseArgs() {
    const args = new Set();
    const ram = ramSlider ? ramSlider.value : 4;

    args.add(`-Xmx${ram}G`);
    args.add(`-Xms${ram}G`);

    if (flagAikar && flagAikar.checked) {
      args.add("-XX:+UseG1GC");
      args.add("-XX:+ParallelRefProcEnabled");
      args.add("-XX:MaxGCPauseMillis=200");
      args.add("-XX:+UnlockExperimentalVMOptions");
      args.add("-XX:+DisableExplicitGC");
      args.add("-XX:+AlwaysPreTouch");
      args.add("-XX:G1NewSizePercent=30");
      args.add("-XX:G1MaxNewSizePercent=40");
      args.add("-XX:G1HeapRegionSize=8M");
      args.add("-XX:G1ReservePercent=20");
      args.add("-XX:G1HeapWastePercent=5");
      args.add("-XX:G1MixedGCCountTarget=4");
      args.add("-XX:InitiatingHeapOccupancyPercent=15");
      args.add("-XX:G1MixedGCLiveThresholdPercent=90");
      args.add("-XX:G1RSetUpdatingPauseTimePercent=5");
      args.add("-XX:SurvivorRatio=32");
      args.add("-XX:+PerfDisableSharedMem");
      args.add("-XX:MaxTenuringThreshold=1");
    }

    if (flagPreload && flagPreload.checked) {
      args.add("-XX:+AlwaysPreTouch");
    }

    if (flagOptimize && flagOptimize.checked) {
      args.add("-XX:+UseStringDeduplication");
      args.add("-XX:+UseFastAccessorMethods");
      args.add("-XX:+UseCompressedOops");
      args.add("-XX:+OptimizeStringConcat");
    }

    if (flagLargePages && flagLargePages.checked) {
      args.add("-XX:+UseLargePages");
      args.add("-XX:LargePageSizeInBytes=2m");
    }

    if (flagNativeTransport && flagNativeTransport.checked) {
      args.add("-Djava.net.preferIPv4Stack=true");
      args.add("-Dio.netty.transport.epoll=true");
    }

    if (flagJFR && flagJFR.checked) {
      args.add("-XX:+FlightRecorder");
      args.add("-XX:StartFlightRecording=duration=60s,filename=server.jfr");
    }

    if (flagDebug && flagDebug.checked) {
      args.add("-verbose:gc");
      args.add("-XX:+PrintGCDetails");
      args.add("-XX:+PrintGCTimeStamps");
      args.add("-Xlog:gc*:file=gc.log:time,uptime,level,tags");
    }

    const gc = gcType ? gcType.value : "g1gc";
    if (gc === "zgc") {
      args.add("-XX:+UseZGC");
      args.add("-XX:+ZGenerational");
    } else if (gc === "shenandoah") {
      args.add("-XX:+UseShenandoahGC");
      args.add("-XX:ShenandoahGCHeuristics=compact");
    } else if (gc === "parallel") {
      args.add("-XX:+UseParallelGC");
      args.add("-XX:ParallelGCThreads=4");
    } else if (gc === "serial") {
      args.add("-XX:+UseSerialGC");
    }

    return args;
  }

  function getSoftwareArgs(software) {
    const args = [];
    if (software === "paper") {
      args.push("-Dpaper.enable-scheduled-optimizations=true");
      args.push("-Dpaper.playerconnection.optimize=true");
    } else if (software === "purpur") {
      args.push("-DPurpur.tpscapture=true");
      args.push("-Dpurpur.commands.tabcomplete=ALL");
    } else if (software === "forge" || software === "neoforge") {
      args.push("-Dforge.disableOptiFineChecker=true");
    }

    const mods = modCount ? parseInt(modCount.value) : 0;
    if (mods > 0 && (software === "forge" || software === "fabric" || software === "neoforge")) {
      args.push("-Dfml.readTimeout=180");
      if (mods > 50) {
        args.push("-XX:MetaspaceSize=512M");
        args.push("-XX:MaxMetaspaceSize=1G");
      }
    }

    return args;
  }

  function getPerformanceArgs(performance) {
    const args = [];
    if (performance === "performance") {
      args.push("-XX:+AlwaysPreTouch");
      args.push("-XX:+PerfDisableSharedMem");
      args.push("-XX:+UseStringDeduplication");
      args.push("-XX:+UseFastAccessorMethods");
      args.push("-XX:+UseCompressedOops");
    } else if (performance === "memory") {
      args.push("-XX:G1NewSizePercent=20");
      args.push("-XX:G1ReservePercent=20");
      args.push("-XX:MaxGCPauseMillis=50");
      args.push("-XX:G1HeapRegionSize=32M");
    }
    return args;
  }

  function generateCommand() {
    if (!outputEl || !versionSelect) return;
    const version = versionSelect.value;
    const software = serverSoftware.value;
    const performance = performanceSelect.value;

    if (!version || version === "Loading versions...") {
      outputEl.innerHTML = '<span style="color: var(--text-muted);">Loading versions...</span>';
      return;
    }

    const args = getBaseArgs();
    const perfArgs = getPerformanceArgs(performance);
    perfArgs.forEach(a => args.add(a));
    
    const swArgs = getSoftwareArgs(software);
    swArgs.forEach(a => args.add(a));

    if (["1.17", "1.18", "1.19", "1.20", "1.21"].some(v => version.startsWith(v))) {
      args.add("-XX:+UseStringDeduplication");
    }

    const playerCountVal = playerCount ? parseInt(playerCount.value) : 20;
    if (playerCountVal > 50) {
      args.add("-XX:ParallelGCThreads=8");
      args.add("-XX:ConcGCThreads=4");
    }

    const hardware = hardwareTier ? hardwareTier.value : "medium";
    if (hardware === "low") {
      args.add("-XX:ConcGCThreads=2");
      args.add("-XX:ParallelGCThreads=2");
    } else if (hardware === "extreme") {
      args.add("-XX:ParallelGCThreads=16");
      args.add("-XX:ConcGCThreads=8");
    }

    const jarHint = software === "fabric" ? "fabric-server.jar" : software === "forge" || software === "neoforge" ? "forge.jar" : "server.jar";

    outputEl.textContent = `java ${Array.from(args).join(" ")} -jar ${jarHint} nogui`;
  }

  function updatePresetActiveState() {
    const currentRam = parseInt(ramSlider.value);
    const currentSoftware = serverSoftware.value;
    const currentJava = javaVersion.value;
    const currentPerformance = performanceSelect.value;

    document.querySelectorAll(".preset-card").forEach(card => {
      const preset = presets[card.dataset.preset];
      if (preset && 
          preset.ram === currentRam && 
          preset.software === currentSoftware && 
          preset.java === currentJava && 
          preset.performance === currentPerformance) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  }

  document.querySelectorAll(".preset-card").forEach(card => {
    card.addEventListener("click", () => {
      const preset = presets[card.dataset.preset];
      if (!preset) return;

      ramSlider.value = preset.ram;
      ramDisplay.textContent = preset.ram + " GB";
      serverSoftware.value = preset.software;
      javaVersion.value = preset.java;
      performanceSelect.value = preset.performance;
      serverType.value = preset.serverType;
      playerCount.value = preset.playerCount;
      modCount.value = preset.modCount;
      worldSize.value = preset.worldSize;
      hardwareTier.value = preset.hardwareTier;
      gcType.value = preset.gcType;

      updatePresetActiveState();
      generateCommand();

      if (window.showToast) {
        showToast("Preset applied", "success");
      }
    });
  });

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      generateCommand();
      if (window.showToast) {
        showToast("Arguments generated", "success");
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const text = outputEl ? outputEl.textContent : "";
      if (text.includes("Configure your settings") || text.includes("Loading versions")) {
        if (window.showToast) showToast("Generate arguments first", "error");
        return;
      }
      if (window.copyToClipboard) copyToClipboard(text, "Command copied to clipboard");
    });
  }

  [serverSoftware, performanceSelect, javaVersion, serverType, playerCount, modCount, worldSize, hardwareTier, gcType].forEach(el => {
    if (el) el.addEventListener("change", () => { updatePresetActiveState(); generateCommand(); });
  });

  [flagAikar, flagPreload, flagOptimize, flagLargePages, flagNativeTransport, flagJFR, flagDebug].forEach(el => {
    if (el) el.addEventListener("change", generateCommand);
  });

  fetchMinecraftVersions();
})();