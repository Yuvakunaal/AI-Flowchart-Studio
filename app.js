document.addEventListener("DOMContentLoaded", () => {
  // API Configuration
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE_URL = isLocal ? 'http://127.0.0.1:8000' : 'https://ai-flowchart-studio.onrender.com'; // Update with actual Render URL later

  // UI Elements
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("promptInput");
  const statusSection = document.getElementById("statusSection");
  const statusList = document.getElementById("statusList");
  const loader = document.getElementById("loader");
  const mermaidOutput = document.getElementById("mermaidOutput");
  const canvasContainer = document.getElementById("canvasContainer");
  const welcomeState = document.getElementById("welcomeState");
  const toastContainer = document.getElementById("toastContainer");

  // API Settings Elements
  const apiSettingsToggle = document.getElementById("apiSettingsToggle");
  const apiSettingsContent = document.getElementById("apiSettingsContent");
  const userApiKeyInput = document.getElementById("userApiKey");
  const saveKeyBtn = document.getElementById("saveKeyBtn");

  // Toolbar Elements
  const exportMenuBtn = document.getElementById("exportMenuBtn");
  const exportDropdown = document.getElementById("exportDropdown");
  const copyImageBtn = document.getElementById("copyImageBtn");
  const copyCodeBtn = document.getElementById("copyCodeBtn");
  const downloadSvgBtn = document.getElementById("downloadSvgBtn");
  const themeSelector = document.getElementById("themeSelector");
  const directionSelector = document.getElementById("directionSelector");
  const resetViewBtn = document.getElementById("resetViewBtn");

  // Zoom Controls
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const zoomResetBtn = document.getElementById("zoomResetBtn");

  // Undo/Redo Buttons
  const undoBtn = document.getElementById("undoBtn");
  const redoBtn = document.getElementById("redoBtn");

  // Projects Elements (Modal)
  const projectsBtn = document.getElementById("projectsBtn");
  const projectsModal = document.getElementById("projectsModal");
  const projectsModalBackdrop = document.getElementById("projectsModalBackdrop");
  const closeProjectsModal = document.getElementById("closeProjectsModal");
  const projectNameInput = document.getElementById("projectNameInput");
  const saveProjectBtn = document.getElementById("saveProjectBtn");
  const projectsList = document.getElementById("projectsList");
  const projectsEmpty = document.getElementById("projectsEmpty");

  // Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Manual Builder Elements
  const addNodeBtn = document.getElementById("addNodeBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const nodeIdInput = document.getElementById("nodeId");
  const nodeLabelInput = document.getElementById("nodeLabel");
  const nodeShapeSelect = document.getElementById("nodeShape");

  const addLinkBtn = document.getElementById("addLinkBtn");
  const linkSourceSelect = document.getElementById("linkSource");
  const linkTargetSelect = document.getElementById("linkTarget");
  const linkLabelInput = document.getElementById("linkLabel");

  const nodesListEl = document.getElementById("nodesList");
  const linksListEl = document.getElementById("linksList");

  // Node Editor Elements
  const nodeEditor = document.getElementById("nodeEditor");
  const closeEditorBtn = document.getElementById("closeEditor");
  const editNodeLabel = document.getElementById("editNodeLabel");
  const editNodeShape = document.getElementById("editNodeShape");
  const saveNodeBtn = document.getElementById("saveNodeBtn");
  const deleteNodeBtn = document.getElementById("deleteNodeBtn");

  // Global State
  let manualNodes = [];
  let manualLinks = [];
  let currentMode = "ai";
  let currentTheme = "dark";
  let currentDirection = "TD";
  let currentZoom = 1;
  let currentMermaidCode = "";
  let currentProjectName = null;
  let userApiKey = "";
  let selectedNodeId = null;
  let isEditing = false;
  let interactiveGraph = {
    nodeMap: new Map(),
    edges: [],
    outgoing: new Map(),
    incoming: new Map(),
  };

  // Undo/Redo State
  const MAX_UNDO_STACK = 50;
  let undoStack = [];
  let redoStack = [];

  // Pinch-to-Zoom State
  let initialPinchDistance = null;
  let pinchStartZoom = 1;

  // ==========================================
  // UTILITIES & SECURITY
  // ==========================================
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    toastContainer.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function hideWelcome() {
    if (welcomeState) welcomeState.style.display = 'none';
  }

  function showWelcome() {
    if (welcomeState) welcomeState.style.display = '';
  }

  function wrapText(str, limit = 25) {
    if (!str || str.length <= limit) return str;
    const words = str.split(" ");
    let currentLine = "";
    let result = "";
    words.forEach((word) => {
      if ((currentLine + word).length > limit) {
        result += (result ? "<br/>" : "") + currentLine.trim();
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    });
    result += (result ? "<br/>" : "") + currentLine.trim();
    return result;
  }

  function escapeMermaid(str) {
    if (!str) return "";
    const escaped = str.replace(/"/g, "'");
    return wrapText(escaped);
  }

  function sanitizeId(str) {
    return str.trim().replace(/[^a-zA-Z0-9]/g, "_");
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================
  mermaid.initialize({
    startOnLoad: false,
    theme: currentTheme,
    securityLevel: "loose",
    flowchart: {
      htmlLabels: true,
      useMaxWidth: false,
      curve: "basis",
      nodeSpacing: 55,
      rankSpacing: 70,
      padding: 20,
    },
  });
  loadState();
  updateManualUI(false);
  clearCanvas();

  // ==========================================
  // SERVER WAKE UP PING
  // ==========================================
  async function pingServerWakeup() {
    if (!generateBtn) return;
    const originalHtml = generateBtn.innerHTML;
    
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.8';
    generateBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      Waking up Server...
    `;

    try {
      await fetch(`${API_BASE_URL}/health`, { method: "GET" });
    } catch (e) {
      console.warn("Backend waking up...", e);
    } finally {
      generateBtn.disabled = false;
      generateBtn.style.opacity = '1';
      generateBtn.innerHTML = originalHtml;
    }
  }
  pingServerWakeup();

  // ==========================================
  // LOCAL STORAGE PERSISTENCE
  // ==========================================
  function saveState() {
    localStorage.setItem("flowchart_nodes", JSON.stringify(manualNodes));
    localStorage.setItem("flowchart_links", JSON.stringify(manualLinks));
    localStorage.setItem("gemini_api_key", userApiKey);
  }

  function loadState() {
    try {
      const savedNodes = localStorage.getItem("flowchart_nodes");
      const savedLinks = localStorage.getItem("flowchart_links");
      const savedKey = localStorage.getItem("gemini_api_key");

      if (savedNodes) manualNodes = JSON.parse(savedNodes);
      if (savedLinks) manualLinks = JSON.parse(savedLinks);
      if (savedKey) {
        userApiKey = savedKey;
        userApiKeyInput.value = userApiKey;
      }
    } catch (e) {
      console.error("Failed to load local storage state");
      manualNodes = [];
      manualLinks = [];
    }
  }

  // ==========================================
  // UI EVENT HANDLERS
  // ==========================================
  apiSettingsToggle.addEventListener("click", () => {
    apiSettingsContent.classList.toggle("hidden");
    const chevron = apiSettingsToggle.querySelector(".chevron-icon");
    if (chevron) {
      chevron.style.transform = apiSettingsContent.classList.contains("hidden")
        ? "rotate(0deg)" : "rotate(180deg)";
    }
  });

  // Manual Builder Sanitization
  if (nodeIdInput) {
    nodeIdInput.addEventListener("input", (e) => {
      // Remove whitespace and weird chars as user types
      e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_");
    });
  }

  saveKeyBtn.addEventListener("click", () => {
    userApiKey = userApiKeyInput.value.trim();
    saveState();
    showToast('API key saved securely', 'success');
  });

  // Scroll wheel zoom
  canvasContainer.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      currentZoom = Math.max(0.2, Math.min(3, currentZoom + delta));
      updateZoom();
    }
  }, { passive: false });

  // Canvas drag-to-pan
  let isPanning = false, panStartX = 0, panStartY = 0, scrollStartX = 0, scrollStartY = 0;
  canvasContainer.addEventListener('mousedown', (e) => {
    if (e.target.closest('.node') || e.target.closest('.node-editor')) return;
    isPanning = true;
    panStartX = e.clientX; panStartY = e.clientY;
    scrollStartX = canvasContainer.scrollLeft;
    scrollStartY = canvasContainer.scrollTop;
  });
  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    canvasContainer.scrollLeft = scrollStartX - (e.clientX - panStartX);
    canvasContainer.scrollTop = scrollStartY - (e.clientY - panStartY);
  });
  window.addEventListener('mouseup', () => { isPanning = false; });

  // Touch-based canvas panning & pinch-to-zoom (mobile)
  function getTouchDistance(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  canvasContainer.addEventListener('touchstart', (e) => {
    if (e.target.closest('.node') || e.target.closest('.node-editor')) return;
    if (e.touches.length === 2) {
      // Pinch-to-zoom start
      isPanning = false;
      initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
      pinchStartZoom = currentZoom;
    } else if (e.touches.length === 1) {
      isPanning = true;
      initialPinchDistance = null;
      panStartX = e.touches[0].clientX;
      panStartY = e.touches[0].clientY;
      scrollStartX = canvasContainer.scrollLeft;
      scrollStartY = canvasContainer.scrollTop;
    }
  }, { passive: true });

  canvasContainer.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialPinchDistance !== null) {
      // Pinch-to-zoom move
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialPinchDistance;
      currentZoom = Math.max(0.2, Math.min(3, pinchStartZoom * scale));
      updateZoom();
      return;
    }
    if (!isPanning || e.touches.length !== 1) return;
    canvasContainer.scrollLeft = scrollStartX - (e.touches[0].clientX - panStartX);
    canvasContainer.scrollTop = scrollStartY - (e.touches[0].clientY - panStartY);
  }, { passive: false });

  canvasContainer.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      initialPinchDistance = null;
    }
    if (e.touches.length === 0) {
      isPanning = false;
    }
  });

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;

      tabBtns.forEach((b) => b.classList.toggle("active", b === btn));

      tabContents.forEach((tc) => {
        tc.classList.toggle("hidden", tc.id !== targetId);
        tc.classList.toggle("active", tc.id === targetId);
      });

      currentMode = targetId === "tab-manual" ? "manual" : "ai";
      if (currentMode === "manual") renderManualFlowchart();
      hideEditor();
    });
  });

  // ==========================================
  // INTERACTIVE CANVAS LOGIC
  // ==========================================
  let lastHoveredId = null;

  canvasContainer.addEventListener("mousemove", (e) => {
    const nodeEl = e.target.closest(".node");
    if (nodeEl) {
      const nodeId = extractNodeId(nodeEl);

      if (nodeId && nodeId !== lastHoveredId) {
        lastHoveredId = nodeId;
        highlightConnections(nodeId);
      }
    } else if (lastHoveredId) {
      lastHoveredId = null;
      clearHighlights();
    }
  });

  canvasContainer.addEventListener("mouseleave", () => {
    if (lastHoveredId) {
      lastHoveredId = null;
      clearHighlights();
    }
  });

  canvasContainer.addEventListener("click", (e) => {
    const nodeEl = e.target.closest(".node");
    if (nodeEl) {
      e.stopPropagation();
      const nodeId = extractNodeId(nodeEl);

      if (nodeId) {
        ensureEditableNode(nodeId, nodeEl);
        showEditor(nodeId, e.clientX, e.clientY);
      }
      return;
    }

    if (!e.target.closest(".node-editor")) {
      hideEditor();
    }
  });

  function extractNodeId(nodeEl) {
    if (!nodeEl) return null;
    const existing = nodeEl.getAttribute("data-node-id");
    if (existing) return existing;

    const nodeIdCandidates = [];
    const titleText = nodeEl.querySelector("title")?.textContent?.trim();
    if (titleText) nodeIdCandidates.push(sanitizeId(titleText));

    const svgId = nodeEl.getAttribute("id") || "";
    const flowchartMatch = svgId.match(/flowchart-(.+)-\d+$/);
    if (flowchartMatch?.[1])
      nodeIdCandidates.push(sanitizeId(flowchartMatch[1]));

    const manualIds = manualNodes.map((n) => n.id);
    for (const candidate of nodeIdCandidates) {
      if (manualIds.includes(candidate)) {
        nodeEl.setAttribute("data-node-id", candidate);
        return candidate;
      }
      if (candidate.startsWith("v_")) {
        const unprefixed = candidate.slice(2);
        if (manualIds.includes(unprefixed)) {
          nodeEl.setAttribute("data-node-id", unprefixed);
          return unprefixed;
        }
      }
    }

    if (nodeIdCandidates.length > 0) {
      const fallback = nodeIdCandidates[0];
      nodeEl.setAttribute("data-node-id", fallback);
      return fallback;
    }

    const labelText = nodeEl.querySelector("text")?.textContent?.trim();
    if (labelText) {
      const fallback = sanitizeId(labelText).slice(0, 48);
      nodeEl.setAttribute("data-node-id", fallback);
      return fallback;
    }
    return null;
  }

  function highlightConnections(nodeId) {
    if (!interactiveGraph.nodeMap.has(nodeId)) return;

    const pathNodeIds = collectReachablePathNodes(nodeId);

    interactiveGraph.nodeMap.forEach((nodeEl, key) => {
      nodeEl.style.opacity = pathNodeIds.has(key) ? "1" : "0.55";
      nodeEl.style.transition = "opacity 0.25s ease";
      if (key === nodeId) {
        nodeEl.classList.add("active-node");
      } else {
        nodeEl.classList.remove("active-node");
      }
    });

    interactiveGraph.edges.forEach((edge) => {
      const pathEl = edge.pathEl;
      if (!pathEl) return;
      const inPath =
        pathNodeIds.has(edge.source) && pathNodeIds.has(edge.target);
      pathEl.style.stroke = inPath ? "var(--accent)" : "";
      pathEl.style.strokeWidth = inPath ? "3px" : "";
      pathEl.style.opacity = inPath ? "1" : "0.35";
      pathEl.style.transition = "all 0.25s ease";
    });
  }

  function clearHighlights() {
    interactiveGraph.nodeMap.forEach((nodeEl) => {
      nodeEl.style.opacity = "";
      nodeEl.classList.remove("active-node");
    });
    interactiveGraph.edges.forEach((edge) => {
      if (!edge.pathEl) return;
      edge.pathEl.style.stroke = "";
      edge.pathEl.style.strokeWidth = "";
      edge.pathEl.style.opacity = "";
    });
  }

  function collectReachablePathNodes(startNodeId) {
    const visited = new Set([startNodeId]);
    const queue = [startNodeId];
    while (queue.length > 0) {
      const current = queue.shift();
      const nextIds = new Set([
        ...(interactiveGraph.outgoing.get(current) || []),
        ...(interactiveGraph.incoming.get(current) || []),
      ]);
      nextIds.forEach((nextId) => {
        if (!visited.has(nextId)) {
          visited.add(nextId);
          queue.push(nextId);
        }
      });
    }
    return visited;
  }

  function ensureEditableNode(nodeId, nodeEl) {
    const exists = manualNodes.some((n) => n.id === nodeId);
    if (exists) return;

    if (manualNodes.length === 0 && interactiveGraph.nodeMap.size > 0) {
      hydrateManualStateFromRenderedGraph();
      return;
    }

    const label = getNodeLabel(nodeEl) || nodeId;
    const shape = inferNodeShape(nodeEl);
    manualNodes.push({ id: nodeId, label: escapeMermaid(label), shape });
    saveState();
    updateManualUI(false);
  }

  function hydrateManualStateFromRenderedGraph() {
    const parsedNodes = [];
    interactiveGraph.nodeMap.forEach((nodeEl, id) => {
      parsedNodes.push({
        id,
        label: escapeMermaid(getNodeLabel(nodeEl) || id),
        shape: inferNodeShape(nodeEl),
      });
    });

    const parsedLinks = interactiveGraph.edges.map((edge, idx) => ({
      id: `parsed_${idx}_${Date.now()}`,
      source: edge.source,
      target: edge.target,
      label: edge.label || "",
    }));

    if (parsedNodes.length > 0) {
      manualNodes = parsedNodes;
      manualLinks = parsedLinks;
      saveState();
      updateManualUI(false);
    }
  }

  function getNodeLabel(nodeEl) {
    if (!nodeEl) return "";
    const tspans = [...nodeEl.querySelectorAll("text tspan")]
      .map((t) => t.textContent?.trim())
      .filter(Boolean);
    if (tspans.length > 0) return tspans.join(" ");
    return nodeEl.querySelector("text")?.textContent?.trim() || "";
  }

  function inferNodeShape(nodeEl) {
    if (!nodeEl) return "[]";
    if (nodeEl.querySelector("polygon")) return "{}";
    if (nodeEl.querySelector("circle, ellipse")) return "()";
    return "[]";
  }

  function buildInteractiveGraphIndex() {
    const newGraph = {
      nodeMap: new Map(),
      edges: [],
      outgoing: new Map(),
      incoming: new Map(),
    };

    const nodeEls = mermaidOutput.querySelectorAll(".node");
    nodeEls.forEach((nodeEl) => {
      const nodeId = extractNodeId(nodeEl);
      if (!nodeId) return;
      newGraph.nodeMap.set(nodeId, nodeEl);
    });

    const edgeGroups = mermaidOutput.querySelectorAll(".edgePath");
    edgeGroups.forEach((edgeGroup) => {
      const parsed = extractEdgeEndpoints(edgeGroup);
      if (!parsed) return;

      const source = sanitizeId(parsed.source);
      const target = sanitizeId(parsed.target);
      const pathEl = edgeGroup.querySelector("path.path, path") || edgeGroup;
      const label = edgeGroup.querySelector("title")?.textContent?.trim() || "";

      newGraph.edges.push({ source, target, pathEl, label });

      if (!newGraph.outgoing.has(source))
        newGraph.outgoing.set(source, new Set());
      if (!newGraph.incoming.has(target))
        newGraph.incoming.set(target, new Set());
      newGraph.outgoing.get(source).add(target);
      newGraph.incoming.get(target).add(source);
    });

    interactiveGraph = newGraph;
  }

  function extractEdgeEndpoints(edgeGroup) {
    if (!edgeGroup) return null;

    // Most reliable source: Mermaid path classes like "LS-nodeA LE-nodeB".
    const pathEl = edgeGroup.querySelector("path.path, path");
    const classTokens = (pathEl?.getAttribute("class") || "")
      .split(/\s+/)
      .filter(Boolean);
    const ls = classTokens.find((c) => c.startsWith("LS-"));
    const le = classTokens.find((c) => c.startsWith("LE-"));
    if (ls && le) {
      const source = ls.slice(3);
      const target = le.slice(3);
      if (source && target) return { source, target };
    }

    // Fallback: id pattern e.g. "L-nodeA-nodeB-0".
    const edgeId = edgeGroup.getAttribute("id") || "";
    if (!edgeId.startsWith("L-")) return null;
    const parts = edgeId.slice(2).split("-");
    if (parts.length < 3) return null;
    parts.pop();
    const target = parts.pop();
    const source = parts.join("-");
    if (!source || !target) return null;
    return { source, target };
  }

  function showEditor(id, x, y) {
    const node = manualNodes.find((n) => n.id === id);
    if (!node) return;

    selectedNodeId = id;
    editNodeLabel.value = node.label.replace(/<br\/>/g, " ");
    editNodeShape.value = node.shape;

    document
      .querySelectorAll(".node")
      .forEach((n) => n.classList.remove("active-node"));
    const nodeEl = interactiveGraph.nodeMap.get(id);
    if (nodeEl) nodeEl.classList.add("active-node");

    nodeEditor.classList.remove("hidden");

    // On mobile, CSS handles bottom-sheet positioning; skip JS positioning
    const isMobile = window.innerWidth <= 900;
    if (!isMobile) {
      const padding = 20;
      let finalX = x + padding;
      let finalY = y + padding;

      if (finalX + 280 > window.innerWidth) finalX = x - 280 - padding;
      if (finalY + 300 > window.innerHeight) finalY = y - 300 - padding;

      nodeEditor.style.left = `${finalX}px`;
      nodeEditor.style.top = `${finalY}px`;
    }
    isEditing = true;
  }

  function hideEditor() {
    nodeEditor.classList.add("hidden");
    document
      .querySelectorAll(".node")
      .forEach((n) => n.classList.remove("active-node"));
    clearHighlights();
    selectedNodeId = null;
    isEditing = false;
  }

  closeEditorBtn.addEventListener("click", hideEditor);

  saveNodeBtn.addEventListener("click", () => {
    if (!selectedNodeId) return;

    const nodeIndex = manualNodes.findIndex((n) => n.id === selectedNodeId);
    if (nodeIndex !== -1) {
      pushUndoState();
      manualNodes[nodeIndex].label = escapeMermaid(editNodeLabel.value.trim());
      manualNodes[nodeIndex].shape = editNodeShape.value;

      saveState();
      updateManualUI(true);
      hideEditor();

      renderManualFlowchart();
    }
  });

  deleteNodeBtn.addEventListener("click", () => {
    if (!selectedNodeId) return;
    if (confirm(`Delete node "${selectedNodeId}"?`)) {
      deleteManualNode(selectedNodeId);
      hideEditor();
    }
  });

  // ==========================================
  // AI GENERATOR LOGIC
  // ==========================================
  let currentLi = null;

  generateBtn.addEventListener("click", async () => {
    currentProjectName = null;
    const promptText = promptInput.value.trim();
    if (!promptText) {
      showToast("Please enter a description for your flowchart.", "error");
      return;
    }

    generateBtn.disabled = true;
    statusSection.classList.remove("hidden");
    statusList.innerHTML = "";
    loader.style.display = "block";
    mermaidOutput.style.opacity = 0.5;

    try {
      const headers = { "Content-Type": "application/json" };
      if (userApiKey) {
        headers["X-Gemini-API-Key"] = userApiKey;
      }

      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6);
            if (!dataStr.trim()) continue;
            try {
              const data = JSON.parse(dataStr);
              handleEvent(data);
            } catch (e) {
              console.error("Error parsing JSON chunk", e, dataStr);
            }
          }
        }
      }
    } catch (error) {
      addStatus(
        `Error: ${error.message === "Failed to fetch" ? "Connection failed. Is the backend server running?" : error.message}`,
        true,
      );
      loader.style.display = "none";
      mermaidOutput.style.opacity = 1;
    } finally {
      generateBtn.disabled = false;
    }
  });

  function handleEvent(data) {
    if (data.error) {
      addStatus(`Agent Error: ${data.error}`, true);
      loader.style.display = "none";
      mermaidOutput.style.opacity = 1;
      return;
    }

    if (data.status && !data.result) {
      if (currentLi) {
        currentLi.classList.remove("active");
        currentLi.textContent = `✓ ${currentLi.dataset.text}`;
      }
      const li = document.createElement("li");
      li.classList.add("active");
      li.dataset.text = data.status;
      li.textContent = `⟳ ${data.status}`;
      statusList.appendChild(li);
      currentLi = li;
    }

    if (data.result) {
      if (currentLi) {
        currentLi.classList.remove("active");
        currentLi.textContent = `✓ ${currentLi.dataset.text}`;
      }

      const li = document.createElement("li");
      li.classList.add("active");
      li.dataset.text = "Rendering Flowchart...";
      li.textContent = `⟳ Rendering Flowchart...`;
      statusList.appendChild(li);
      currentLi = li;

      loader.style.display = "none";

      if (data.logic) {
        try {
          syncAItoManualState(data.logic);
        } catch (e) {
          console.error("Error syncing AI to manual state:", e);
        }
      }

      let finalCode = data.result;
      if (currentDirection === "LR") {
        finalCode = finalCode
          .replace(/graph (TD|TB|BT)/, "graph LR")
          .replace(/flowchart (TD|TB|BT)/, "flowchart LR");
      } else {
        finalCode = finalCode
          .replace(/graph LR/, "graph TD")
          .replace(/flowchart LR/, "flowchart TD");
      }

      currentMermaidCode = finalCode;
      currentZoom = 1;
      updateZoom();
      renderMermaid(finalCode).then(() => {
        if (currentLi) {
          currentLi.classList.remove("active");
          currentLi.textContent = `✓ Flowchart rendered successfully!`;
        }
        if (window.confetti) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#3b82f6", "#8b5cf6", "#ffffff"],
          });
        }
      });
    }
  }

  function addStatus(text, isError = false, active = false) {
    const li = document.createElement("li");
    li.textContent = text;
    if (isError) li.classList.add("error");
    if (active) li.classList.add("active");
    statusList.appendChild(li);
  }

  // ==========================================
  // AUTO-SYNC STATE
  // ==========================================
  function syncAItoManualState(logic) {
    if (!logic.nodes) return;

    manualNodes = logic.nodes.map((n) => {
      let shape = "[]";
      if (n.shape === "diamond") shape = "{}";
      if (n.shape === "round") shape = "()";
      return { id: sanitizeId(n.id), label: escapeMermaid(n.label), shape };
    });

    manualLinks = logic.edges.map((e, idx) => ({
      id: `auto_${idx}_${Date.now()}`,
      source: sanitizeId(e.source_id),
      target: sanitizeId(e.target_id),
      label: escapeMermaid(e.label),
    }));

    saveState();
    updateManualUI(false);
  }

  // ==========================================
  // RENDER ENGINE
  // ==========================================
  async function renderMermaid(code) {
    try {
      if (!code || !code.trim()) {
        clearCanvas();
        return;
      }

      hideWelcome();

      if (code.startsWith("```mermaid")) {
        code = code.substring(10).replace(/```$/, "").trim();
      } else if (code.startsWith("```")) {
        code = code.substring(3).replace(/```$/, "").trim();
      }

      mermaidOutput.style.opacity = 0;
      mermaidOutput.classList.remove("mermaid-fade-in");

      mermaid.initialize({
        startOnLoad: false,
        theme: currentTheme,
        securityLevel: "loose",
        flowchart: {
          htmlLabels: true,
          useMaxWidth: false,
          curve: "basis",
          nodeSpacing: 55,
          rankSpacing: 70,
          padding: 20,
        },
      });

      await new Promise((r) => setTimeout(r, 50));

      const { svg } = await mermaid.render("mermaid-svg-inner", code);
      mermaidOutput.innerHTML = svg;
      mermaidOutput.classList.add("mermaid-fade-in");
      mermaidOutput.style.opacity = 1;
      buildInteractiveGraphIndex();

      const svgElement = mermaidOutput.querySelector("svg");
      if (svgElement) {
        svgElement.style.maxWidth = "100%";
        svgElement.style.height = "auto";
        svgElement.style.background = "transparent";
      }
    } catch (error) {
      interactiveGraph = {
        nodeMap: new Map(),
        edges: [],
        outgoing: new Map(),
        incoming: new Map(),
      };
      mermaidOutput.innerHTML = `<div style="color:#ef4444; padding:2rem;"><strong>Render Error:</strong> ${error.message || error}</div><pre style="padding:0 2rem; color:#64748b; font-size:0.8rem;">${code}</pre>`;
      mermaidOutput.style.opacity = 1;
    }
  }

  function clearCanvas() {
    interactiveGraph = {
      nodeMap: new Map(),
      edges: [],
      outgoing: new Map(),
      incoming: new Map(),
    };
    mermaidOutput.innerHTML = "";
    mermaidOutput.style.opacity = 1;
    showWelcome();
  }

  // ==========================================
  // MANUAL BUILDER LOGIC
  // ==========================================
  addNodeBtn.addEventListener("click", () => {
    let id = sanitizeId(nodeIdInput.value);
    let label = escapeMermaid(nodeLabelInput.value.trim());
    const shape = nodeShapeSelect.value;

    if (!id || !label) {
      showToast('Please enter both an ID and a Label to create a node.', 'error');
      return;
    }

    if (manualNodes.find((n) => n.id === id)) {
      showToast('Node ID already exists!', 'error');
      return;
    }

    pushUndoState();
    manualNodes.push({ id, label, shape });
    nodeIdInput.value = "";
    nodeLabelInput.value = "";
    saveState();
    updateManualUI(true);
  });

  function checkLinkDuplicate() {
    const source = linkSourceSelect.value;
    const target = linkTargetSelect.value;
    if (!source || !target || source === target) {
      addLinkBtn.disabled = false;
      addLinkBtn.title = '';
      return;
    }
    const exists = manualLinks.some(l => l.source === source && l.target === target);
    addLinkBtn.disabled = exists;
    addLinkBtn.title = exists ? 'Link already exists between these nodes' : '';
  }

  linkSourceSelect.addEventListener('change', checkLinkDuplicate);
  linkTargetSelect.addEventListener('change', checkLinkDuplicate);

  addLinkBtn.addEventListener("click", () => {
    const source = linkSourceSelect.value;
    const target = linkTargetSelect.value;
    const label = escapeMermaid(linkLabelInput.value.trim());

    if (!source || !target) {
      showToast('Please select both source and target nodes.', 'error');
      return;
    }

    if (source === target) {
      showToast('Self-links are disabled for cleaner flowcharts.', 'error');
      return;
    }

    if (manualLinks.some(l => l.source === source && l.target === target)) {
      showToast('Link already exists between these nodes.', 'error');
      return;
    }

    if (addLinkBtn.disabled) return;

    pushUndoState();
    manualLinks.push({ source, target, label, id: Date.now().toString() });
    linkLabelInput.value = "";
    saveState();
    updateManualUI(true);
    checkLinkDuplicate();
  });

  clearAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the entire flowchart? This cannot be undone.")) {
      currentProjectName = null;
      manualNodes = [];
      manualLinks = [];
      currentMermaidCode = "";
      currentZoom = 1;
      updateZoom();
      saveState();
      updateManualUI(true);
      clearCanvas();
      clearUndoRedoStacks();
    }
  });

  window.deleteManualNode = function (id) {
    pushUndoState();
    manualNodes = manualNodes.filter((n) => n.id !== id);
    manualLinks = manualLinks.filter((l) => l.source !== id && l.target !== id);
    saveState();
    updateManualUI(true);
  };

  window.deleteManualLink = function (id) {
    pushUndoState();
    manualLinks = manualLinks.filter((l) => l.id !== id);
    saveState();
    updateManualUI(true);
  };

  function updateManualUI(doRender = true) {
    nodesListEl.innerHTML = "";
    linkSourceSelect.innerHTML = '<option value="">From Node...</option>';
    linkTargetSelect.innerHTML = '<option value="">To Node...</option>';

    manualNodes.forEach((n) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.innerHTML = `<strong>${n.id}</strong>: ${n.label}`;
      li.appendChild(span);

      const btn = document.createElement("button");
      btn.className = "delete-btn";
      btn.innerHTML = "&times;";
      btn.onclick = () => deleteManualNode(n.id);
      li.appendChild(btn);

      nodesListEl.appendChild(li);

      const opt1 = document.createElement("option");
      opt1.value = n.id;
      opt1.textContent = n.label.replace(/<br\/>/g, " ") || n.id;
      linkSourceSelect.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = n.id;
      opt2.textContent = n.label.replace(/<br\/>/g, " ") || n.id;
      linkTargetSelect.appendChild(opt2);
    });

    linksListEl.innerHTML = "";
    manualLinks.forEach((l) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      const lblStr = l.label ? ` --[${l.label}]--> ` : ` --> `;
      span.textContent = `${l.source}${lblStr}${l.target}`;
      li.appendChild(span);

      const btn = document.createElement("button");
      btn.className = "delete-btn";
      btn.innerHTML = "&times;";
      btn.onclick = () => deleteManualLink(l.id);
      li.appendChild(btn);

      linksListEl.appendChild(li);
    });

    if (doRender && currentMode === "manual") {
      renderManualFlowchart();
    }
  }

  function renderManualFlowchart() {
    if (manualNodes.length === 0) {
      mermaidOutput.innerHTML = '';
      showWelcome();
      return;
    }

    const reserved = [
      "graph",
      "flowchart",
      "subgraph",
      "end",
      "start",
      "stateDiagram",
      "sequenceDiagram",
    ];
    const safeId = (id) =>
      reserved.includes(id.toLowerCase()) ? `v_${id}` : id;
    const nodeIds = new Set(manualNodes.map((n) => n.id));

    // Keep links clean to prevent broken/dangling arrows in the canvas.
    const cleanedLinks = manualLinks.filter(
      (l) =>
        l.source &&
        l.target &&
        l.source !== l.target &&
        nodeIds.has(l.source) &&
        nodeIds.has(l.target),
    );
    if (cleanedLinks.length !== manualLinks.length) {
      manualLinks = cleanedLinks;
      saveState();
      updateManualUI(false);
    }

    // Theme-aware class definitions
    const themeStyles = {
      default: {
        defaultNode: 'fill:#ffffff,stroke:#475569,stroke-width:1.5px,color:#0f172a',
        decisionNode: 'fill:#fff7ed,stroke:#c2410c,stroke-width:1.8px,color:#7c2d12',
        roundNode: 'fill:#ecfeff,stroke:#0e7490,stroke-width:1.8px,color:#164e63',
      },
      dark: {
        defaultNode: 'fill:#1e293b,stroke:#60a5fa,stroke-width:1.5px,color:#f1f5f9',
        decisionNode: 'fill:#312e2a,stroke:#fb923c,stroke-width:1.8px,color:#fed7aa',
        roundNode: 'fill:#1a2e35,stroke:#22d3ee,stroke-width:1.8px,color:#cffafe',
      },
      forest: {
        defaultNode: 'fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px,color:#14532d',
        decisionNode: 'fill:#fefce8,stroke:#ca8a04,stroke-width:1.8px,color:#713f12',
        roundNode: 'fill:#ecfdf5,stroke:#059669,stroke-width:1.8px,color:#064e3b',
      },
      neutral: {
        defaultNode: 'fill:#f8fafc,stroke:#64748b,stroke-width:1.5px,color:#1e293b',
        decisionNode: 'fill:#f1f5f9,stroke:#475569,stroke-width:1.8px,color:#0f172a',
        roundNode: 'fill:#f5f5f5,stroke:#6b7280,stroke-width:1.8px,color:#1f2937',
      },
    };
    const ts = themeStyles[currentTheme] || themeStyles.default;
    let code = `graph ${currentDirection}\n`;
    code += `    classDef defaultNode ${ts.defaultNode};\n`;
    code += `    classDef decisionNode ${ts.decisionNode};\n`;
    code += `    classDef roundNode ${ts.roundNode};\n`;

    const defaultNodes = [];
    const decisionNodes = [];
    const roundNodes = [];

    manualNodes.forEach((n) => {
      let leftShape = "[";
      let rightShape = "]";
      if (n.shape === "{}") {
        leftShape = "{";
        rightShape = "}";
      } else if (n.shape === "()") {
        leftShape = "(";
        rightShape = ")";
      }
      code += `    ${safeId(n.id)}${leftShape}"${n.label}"${rightShape}\n`;

      if (n.shape === "{}") {
        decisionNodes.push(safeId(n.id));
      } else if (n.shape === "()") {
        roundNodes.push(safeId(n.id));
      } else {
        defaultNodes.push(safeId(n.id));
      }
    });

    cleanedLinks.forEach((l) => {
      const s = safeId(l.source);
      const t = safeId(l.target);
      if (l.label) {
        code += `    ${s}-->|"${l.label}"|${t}\n`;
      } else {
        code += `    ${s}-->${t}\n`;
      }
    });

    if (defaultNodes.length > 0) {
      code += `    class ${defaultNodes.join(",")} defaultNode;\n`;
    }
    if (decisionNodes.length > 0) {
      code += `    class ${decisionNodes.join(",")} decisionNode;\n`;
    }
    if (roundNodes.length > 0) {
      code += `    class ${roundNodes.join(",")} roundNode;\n`;
    }

    currentMermaidCode = code;
    renderMermaid(code);
  }

  // ==========================================
  // TOOLBAR & EXPORT SUITE
  // ==========================================
  themeSelector.addEventListener("change", (e) => {
    currentTheme = e.target.value;
    if (manualNodes.length > 0) {
      renderManualFlowchart();
    } else if (currentMermaidCode && currentMermaidCode.trim()) {
      renderMermaid(currentMermaidCode);
    }
  });

  directionSelector.addEventListener("change", (e) => {
    currentDirection = e.target.value;
    if (currentMode === "manual") {
      renderManualFlowchart();
    } else {
      if (!currentMermaidCode || !currentMermaidCode.trim()) {
        clearCanvas();
        return;
      }
      const code = currentMermaidCode.replace(
        /graph (TD|LR|TB|BT)/,
        `graph ${currentDirection}`,
      );
      currentMermaidCode = code;
      renderMermaid(code);
    }
  });

  resetViewBtn.addEventListener("click", () => {
    canvasContainer.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    currentZoom = 1;
    updateZoom();
    if (!currentMermaidCode || !currentMermaidCode.trim()) {
      clearCanvas();
      return;
    }
    renderMermaid(currentMermaidCode);
  });

  zoomInBtn.addEventListener("click", () => {
    if (currentZoom < 3) {
      currentZoom += 0.1;
      updateZoom();
    }
  });

  zoomOutBtn.addEventListener("click", () => {
    if (currentZoom > 0.3) {
      currentZoom -= 0.1;
      updateZoom();
    }
  });

  zoomResetBtn.addEventListener("click", () => {
    currentZoom = 1;
    updateZoom();
  });

  function updateZoom() {
    mermaidOutput.style.zoom = currentZoom;
    // Fallback for very old browsers:
    mermaidOutput.style.transformOrigin = "top center";
    mermaidOutput.style.transform = `scale(${currentZoom})`;
    if (CSS.supports("zoom: 1")) {
      mermaidOutput.style.transform = "none";
    }
    zoomResetBtn.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  // Export Dropdown Logic
  if (exportMenuBtn && exportDropdown) {
    exportMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // If we are opening it, set the position for desktop
      if (exportDropdown.classList.contains('hidden')) {
        const isMobile = window.innerWidth <= 900;
        if (!isMobile) {
          const rect = exportMenuBtn.getBoundingClientRect();
          exportDropdown.style.top = `${rect.bottom + 8}px`;
          exportDropdown.style.right = `${window.innerWidth - rect.right}px`;
        } else {
          exportDropdown.style.top = '';
          exportDropdown.style.right = '';
        }
      }
      exportDropdown.classList.toggle('hidden');
    });

    const closeExportMenuBtn = document.getElementById('closeExportMenuBtn');
    if (closeExportMenuBtn) {
      closeExportMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exportDropdown.classList.add('hidden');
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!exportMenuBtn.contains(e.target) && !exportDropdown.contains(e.target)) {
        exportDropdown.classList.add('hidden');
      }
    });

    // Close when an option is clicked
    exportDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        exportDropdown.classList.add('hidden');
      });
    });
  }

  copyCodeBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(currentMermaidCode);
    const originalText = copyCodeBtn.innerHTML;
    copyCodeBtn.innerHTML = "✓ Copied";
    setTimeout(() => (copyCodeBtn.innerHTML = originalText), 2000);
  });

  downloadSvgBtn.addEventListener("click", () => {
    const svgElement = document.querySelector("#mermaidOutput svg");
    if (!svgElement) return;
    const serializer = new XMLSerializer();
    let svgData = serializer.serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flowchart.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  copyImageBtn.addEventListener("click", async () => {
    const svgElement = document.querySelector("#mermaidOutput svg");
    if (!svgElement) return;

    const originalBtnText = copyImageBtn.innerHTML;
    copyImageBtn.innerHTML = "Downloading...";

    try {
      const bbox = svgElement.getBBox();
      const padding = 40;
      const exportWidth = bbox.width + padding * 2;
      const exportHeight = bbox.height + padding * 2;

      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = exportWidth + "px";
      tempDiv.style.height = exportHeight + "px";
      tempDiv.style.background = "#ffffff";

      const svgClone = svgElement.cloneNode(true);
      svgClone.setAttribute("width", exportWidth);
      svgClone.setAttribute("height", exportHeight);
      svgClone.setAttribute(
        "viewBox",
        `${bbox.x - padding} ${bbox.y - padding} ${exportWidth} ${exportHeight}`,
      );

      tempDiv.appendChild(svgClone);
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 3,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      document.body.removeChild(tempDiv);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Blob creation failed");

        const link = document.createElement("a");
        link.download = "flowchart.png";
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);

        copyImageBtn.innerHTML = "✓ Downloaded";

        setTimeout(() => {
          copyImageBtn.innerHTML = originalBtnText;
        }, 2000);
      }, "image/png");
    } catch (err) {
      console.error("PNG Export Error:", err);
      alert("Could not download image. Falling back to SVG download.");
      downloadSvgBtn.click();
      copyImageBtn.innerHTML = originalBtnText;
    }
  });

  // ==========================================
  // UNDO / REDO SYSTEM
  // ==========================================
  function captureState() {
    return {
      nodes: JSON.parse(JSON.stringify(manualNodes)),
      links: JSON.parse(JSON.stringify(manualLinks)),
      mermaidCode: currentMermaidCode,
      direction: currentDirection,
      theme: currentTheme,
    };
  }

  function pushUndoState() {
    undoStack.push(captureState());
    if (undoStack.length > MAX_UNDO_STACK) undoStack.shift();
    redoStack = [];
    updateUndoRedoButtons();
  }

  function restoreState(snapshot) {
    manualNodes = JSON.parse(JSON.stringify(snapshot.nodes));
    manualLinks = JSON.parse(JSON.stringify(snapshot.links));
    currentMermaidCode = snapshot.mermaidCode;
    currentDirection = snapshot.direction;
    currentTheme = snapshot.theme;

    themeSelector.value = currentTheme;
    directionSelector.value = currentDirection;

    saveState();
    updateManualUI(false);

    if (currentMermaidCode && currentMermaidCode.trim()) {
      renderMermaid(currentMermaidCode);
    } else {
      clearCanvas();
    }
  }

  function undo() {
    if (undoStack.length === 0) return;
    redoStack.push(captureState());
    const prev = undoStack.pop();
    restoreState(prev);
    updateUndoRedoButtons();
    showToast('Undo', 'info');
  }

  function redo() {
    if (redoStack.length === 0) return;
    undoStack.push(captureState());
    const next = redoStack.pop();
    restoreState(next);
    updateUndoRedoButtons();
    showToast('Redo', 'info');
  }

  function updateUndoRedoButtons() {
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
  }

  // Wire undo/redo buttons
  if (undoBtn) undoBtn.addEventListener('click', undo);
  if (redoBtn) redoBtn.addEventListener('click', redo);

  // Keyboard shortcuts for undo/redo
  document.addEventListener('keydown', (e) => {
    // Skip if user is typing in an input/textarea
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    if (ctrlOrCmd && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if ((ctrlOrCmd && e.key === 'y') || (ctrlOrCmd && e.shiftKey && e.key === 'z') || (ctrlOrCmd && e.shiftKey && e.key === 'Z')) {
      e.preventDefault();
      redo();
    }
  });

  // (Undo hooks are embedded directly inside each handler above)

  // AI generation resets undo stack — new flowchart = fresh session
  generateBtn.addEventListener('click', () => {
    clearUndoRedoStacks();
  }, true);

  function clearUndoRedoStacks() {
    undoStack = [];
    redoStack = [];
    updateUndoRedoButtons();
  }

  // Initialize undo/redo buttons state
  updateUndoRedoButtons();

  // ==========================================
  // SAVE / LOAD PROJECTS
  // ==========================================
  const PROJECTS_STORAGE_KEY = 'flowchart_projects';

  function getProjects() {
    try {
      const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProjectsToStorage(projects) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }

  function saveProject(name) {
    if (!name || !name.trim()) {
      showToast('Please enter a project name.', 'error');
      return;
    }
    const projects = getProjects();
    const key = name.trim();

    if (projects[key]) {
      if (!confirm(`Project "${key}" already exists. Overwrite?`)) return;
    } else if (Object.keys(projects).length >= 5) {
      showToast('Maximum limit of 5 projects reached. Please delete an existing project first.', 'error');
      return;
    }

    projects[key] = {
      nodes: JSON.parse(JSON.stringify(manualNodes)),
      links: JSON.parse(JSON.stringify(manualLinks)),
      mermaidCode: currentMermaidCode,
      direction: currentDirection,
      theme: currentTheme,
      savedAt: new Date().toISOString(),
    };
    saveProjectsToStorage(projects);
    currentProjectName = key;
    showToast(`Project "${key}" saved!`, 'success');
    renderProjectsList();
  }

  function loadProject(name) {
    const projects = getProjects();
    const project = projects[name];
    if (!project) {
      showToast('Project not found.', 'error');
      return;
    }

    // Loading a project = fresh session, clear undo/redo
    clearUndoRedoStacks();
    currentProjectName = name;

    manualNodes = JSON.parse(JSON.stringify(project.nodes || []));
    manualLinks = JSON.parse(JSON.stringify(project.links || []));
    currentMermaidCode = project.mermaidCode || '';
    currentDirection = project.direction || 'TD';
    currentTheme = project.theme || 'dark';

    themeSelector.value = currentTheme;
    directionSelector.value = currentDirection;

    saveState();
    updateManualUI(false);

    if (currentMermaidCode && currentMermaidCode.trim()) {
      currentZoom = 1;
      updateZoom();
      renderMermaid(currentMermaidCode);
    } else {
      clearCanvas();
    }

    closeProjectsModalFn();
    showToast(`Project "${name}" loaded!`, 'success');
  }

  function deleteProject(name) {
    if (!confirm(`Delete project "${name}"? This cannot be undone.`)) return;
    const projects = getProjects();
    delete projects[name];
    saveProjectsToStorage(projects);
    
    if (currentProjectName === name) {
      currentProjectName = null;
      if (projectNameInput) projectNameInput.value = '';
    }

    showToast(`Project "${name}" deleted.`, 'info');
    renderProjectsList();
  }

  function renderProjectsList() {
    if (!projectsList || !projectsEmpty) return;
    const projects = getProjects();
    const keys = Object.keys(projects).sort((a, b) => {
      const da = projects[b].savedAt || '';
      const db = projects[a].savedAt || '';
      return da.localeCompare(db);
    });

    projectsList.innerHTML = '';
    
    const countDisplay = document.getElementById('projectCountDisplay');
    if (countDisplay) {
      countDisplay.textContent = `${keys.length}/5`;
    }

    if (keys.length === 0) {
      projectsEmpty.style.display = '';
      return;
    }

    projectsEmpty.style.display = 'none';

    keys.forEach(name => {
      const project = projects[name];
      const li = document.createElement('li');
      li.className = 'project-item';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'project-item-name';
      nameSpan.textContent = name;
      nameSpan.title = name;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'project-item-date';
      if (project.savedAt) {
        const d = new Date(project.savedAt);
        dateSpan.textContent = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'project-item-actions';

      const loadBtn = document.createElement('button');
      loadBtn.className = 'project-load-btn';
      loadBtn.textContent = 'Load';
      loadBtn.title = `Load "${name}"`;
      loadBtn.addEventListener('click', () => loadProject(name));

      const delBtn = document.createElement('button');
      delBtn.className = 'project-delete-btn';
      delBtn.innerHTML = '&times;';
      delBtn.title = `Delete "${name}"`;
      delBtn.addEventListener('click', () => deleteProject(name));

      actionsDiv.appendChild(loadBtn);
      actionsDiv.appendChild(delBtn);

      li.appendChild(nameSpan);
      li.appendChild(dateSpan);
      li.appendChild(actionsDiv);
      projectsList.appendChild(li);
    });
  }

  // ==========================================
  // PROJECTS MODAL
  // ==========================================
  function openProjectsModalFn() {
    if (projectsModal) {
      projectsModal.classList.remove('hidden');
      renderProjectsList();
      if (projectNameInput) {
        if (currentProjectName) {
          projectNameInput.value = currentProjectName;
        }
        projectNameInput.focus();
      }
    }
  }

  function closeProjectsModalFn() {
    if (projectsModal) {
      projectsModal.classList.add('hidden');
    }
  }

  // Projects toolbar button
  if (projectsBtn) {
    projectsBtn.addEventListener('click', openProjectsModalFn);
  }

  // Close modal
  if (closeProjectsModal) {
    closeProjectsModal.addEventListener('click', closeProjectsModalFn);
  }
  if (projectsModalBackdrop) {
    projectsModalBackdrop.addEventListener('click', closeProjectsModalFn);
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectsModal && !projectsModal.classList.contains('hidden')) {
      closeProjectsModalFn();
    }
  });

  // Save project button
  if (saveProjectBtn && projectNameInput) {
    saveProjectBtn.addEventListener('click', () => {
      saveProject(projectNameInput.value);
    });

    // Enter key to save
    projectNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveProject(projectNameInput.value);
      }
    });
  }

  // Initialize projects list on load
  renderProjectsList();
});
