import { getMenuById, getPageById } from "../data/menuConfig.js";
import { CONTROLLER_BINDINGS, KEYBOARD_BINDINGS, KEYBOARD_LAYOUT } from "../data/inputBindings.js";

function formatMetric(value) {
  return `${Math.round(value || 0)}%`;
}

const CONTROL_GUIDES = {
  "keyboard-mouse": {
    title: "Keyboard + Mouse",
    primary: ["Mouse drag orbit", "Wheel zoom", "Click select star or planet", "R regenerate", "F focus selection"],
    secondary: ["1 / 2 / 3 switch galaxy, system, planet", "Q / E cycle ship posture", "[ / ] cycle menus", ", / . cycle sub pages"],
  },
  xbox: {
    title: "Xbox Controller",
    primary: ["Left stick pan camera", "Right stick orbit camera", "LT / RT zoom", "A focus selection", "B pause motion"],
    secondary: ["X cycle view mode", "Y regenerate", "LB / RB change menu", "D-pad left / right change sub page", "D-pad up / down change ship mode"],
  },
  ps5: {
    title: "PS5 Controller",
    primary: ["Left stick pan camera", "Right stick orbit camera", "L2 / R2 zoom", "Cross focus selection", "Circle pause motion"],
    secondary: ["Square cycle view mode", "Triangle regenerate", "L1 / R1 change menu", "D-pad left / right change sub page", "D-pad up / down change ship mode"],
  },
  "generic-gamepad": {
    title: "Generic Gamepad",
    primary: ["Left stick pan camera", "Right stick orbit camera", "Triggers zoom", "South button focus", "East button pause motion"],
    secondary: ["West button cycle view", "North button regenerate", "Shoulders change menu", "D-pad changes sub pages and ship mode"],
  },
};

function getControlGuide(inputProfile) {
  return CONTROL_GUIDES[inputProfile] || CONTROL_GUIDES["keyboard-mouse"];
}

function renderControlList(items) {
  return items.map((item) => `<span class="sd-chip">${item}</span>`).join("");
}

function renderBindingRows(rows) {
  return rows
    .map(
      (entry) => `
        <div class="sd-binding-row">
          <span class="sd-binding-key">${entry.key}</span>
          <span class="sd-binding-action">${entry.action}</span>
        </div>
      `,
    )
    .join("");
}

function renderKeyboardLayout() {
  return `
    <div class="sd-keyboard-layout">
      ${KEYBOARD_LAYOUT.map(
        (row) => `
          <div class="sd-keyboard-row">
            ${row.map((key) => `<span class="sd-keycap">${key}</span>`).join("")}
          </div>
        `,
      ).join("")}
    </div>
  `;
}

function renderControllerLayout(profile) {
  const layout = CONTROLLER_BINDINGS[profile] || CONTROLLER_BINDINGS["generic-gamepad"];
  return `
    <div class="sd-controller-layout">
      <div class="sd-section-title">${layout.label}</div>
      <div class="sd-binding-group">
        <div class="sd-section-title">Face Buttons</div>
        ${renderBindingRows(layout.faceButtons)}
      </div>
      <div class="sd-binding-group">
        <div class="sd-section-title">Shoulders and Triggers</div>
        ${renderBindingRows(layout.shoulders)}
      </div>
      <div class="sd-binding-group">
        <div class="sd-section-title">Sticks</div>
        ${renderBindingRows(layout.sticks)}
      </div>
      <div class="sd-binding-group">
        <div class="sd-section-title">D-pad</div>
        ${renderBindingRows(layout.dpad)}
      </div>
    </div>
  `;
}

function renderSystemCard(system, selectedPlanet) {
  if (!system) {
    return `
      <div class="sd-empty-card">
        <h3>No System Selected</h3>
        <p>Hover or click a star to inspect its planets, posture, and galaxy role.</p>
      </div>
    `;
  }

  const planets = system.planets
    .map((planet) => `<span class="sd-chip ${planet.id === selectedPlanet?.id ? "is-selected" : ""}">${planet.name} | ${planet.biome}</span>`)
    .join("");
  const stations = system.stations
    .map((station) => `<span class="sd-chip">${station.name} | ${station.role}</span>`)
    .join("");
  const selectedPlanetCard = selectedPlanet
    ? `
      <div class="sd-section">
        <div class="sd-section-title">Planet Focus</div>
        <div class="sd-planet-focus">
          <strong>${selectedPlanet.name}</strong>
          <span>${selectedPlanet.biome} / ${selectedPlanet.worldClass}</span>
          <span>Habitability ${formatMetric(selectedPlanet.habitability)}</span>
          <span>Resources ${formatMetric(selectedPlanet.resourceValue)}</span>
          <span>${selectedPlanet.moons.length} moons in local orbit</span>
        </div>
      </div>
    `
    : "";

  return `
    <div class="sd-system-card">
      <div class="sd-system-header">
        <div>
          <div class="sd-kicker">${system.sector}</div>
          <h3>${system.name}</h3>
        </div>
        <span class="sd-chip">${system.alliance}</span>
      </div>
      <p class="sd-system-copy">${system.description}</p>
      <div class="sd-metric-grid">
        <div><span>Command</span><strong>${formatMetric(system.metrics.command)}</strong></div>
        <div><span>Threat</span><strong>${formatMetric(system.metrics.threat)}</strong></div>
        <div><span>Economy</span><strong>${formatMetric(system.metrics.economy)}</strong></div>
        <div><span>Logistics</span><strong>${formatMetric(system.metrics.logistics)}</strong></div>
        <div><span>Diplomacy</span><strong>${formatMetric(system.metrics.diplomacy)}</strong></div>
        <div><span>Anomaly</span><strong>${formatMetric(system.metrics.anomaly)}</strong></div>
      </div>
      <div class="sd-section">
        <div class="sd-section-title">Worlds</div>
        <div class="sd-chip-row">${planets}</div>
      </div>
      <div class="sd-section">
        <div class="sd-section-title">Stations</div>
        <div class="sd-chip-row">${stations}</div>
      </div>
      <div class="sd-section">
        <div class="sd-section-title">Deep Space Objects</div>
        <div class="sd-chip-row">
          ${system.interstellarObjects.map((object) => `<span class="sd-chip">${object.type} | ${object.name}</span>`).join("")}
        </div>
      </div>
      ${selectedPlanetCard}
    </div>
  `;
}

function renderHudOverview(currentState, page, activeSystem) {
  return `
    <section class="sd-screen-hud">
      <div class="sd-hud-card">
        <span class="sd-kicker">Universe Feed</span>
        <strong>${currentState.systemCount} sectors online</strong>
        <p>${activeSystem ? `${activeSystem.name} is feeding live local-space telemetry.` : "Awaiting focused system telemetry from the galaxy map."}</p>
      </div>
      <div class="sd-hud-card">
        <span class="sd-kicker">Bridge Layer</span>
        <strong>${page.menuLabel} / ${page.label}</strong>
        <p>${page.title} is driving the active 3D overlay and sub HUD routing.</p>
      </div>
      <div class="sd-hud-card">
        <span class="sd-kicker">Input Profile</span>
        <strong>${currentState.inputProfile}</strong>
        <p>${currentState.controllerStatus}</p>
      </div>
      <div class="sd-hud-card">
        <span class="sd-kicker">Camera Stack</span>
        <strong>${currentState.viewMode} view</strong>
        <p>${currentState.shipControlMode} posture loaded into tactical ship controls.</p>
      </div>
    </section>
  `;
}

function renderSubHud(currentState, activeSystem, page) {
  const selectedPlanet = currentState.selectedPlanet;
  return `
    <section class="sd-sub-hud">
      <div class="sd-subhud-card">
        <span class="sd-kicker">Selection Feed</span>
        <strong>${activeSystem ? activeSystem.name : "No active system"}</strong>
        <p>${activeSystem ? activeSystem.description : "Pick a star system to unlock local sub HUD data for planets, moons, and stations."}</p>
      </div>
      <div class="sd-subhud-card">
        <span class="sd-kicker">Planet Link</span>
        <strong>${selectedPlanet ? selectedPlanet.name : "No active planet"}</strong>
        <p>${selectedPlanet ? `${selectedPlanet.biome} ${selectedPlanet.worldClass} with ${selectedPlanet.moons.length} moons.` : "Planet sub HUD becomes active when a world is selected in system or planet view."}</p>
      </div>
      <div class="sd-subhud-card">
        <span class="sd-kicker">Overlay Stack</span>
        <strong>${page.overlayMode}</strong>
        <p>${page.capabilities.join(", ")}</p>
      </div>
    </section>
  `;
}

function renderInputSection(currentState) {
  const guide = getControlGuide(currentState.inputProfile);
  return `
    <div class="sd-section">
      <div class="sd-section-title">Input Command Deck</div>
      <div class="sd-input-profile-row">
        <span class="sd-chip is-selected">${guide.title}</span>
        <span class="sd-chip">${currentState.controllerStatus}</span>
      </div>
      <div class="sd-section-title">Primary Controls</div>
      <div class="sd-chip-row">${renderControlList(guide.primary)}</div>
      <div class="sd-section-title">Advanced Controls</div>
      <div class="sd-chip-row">${renderControlList(guide.secondary)}</div>
    </div>
  `;
}

function renderSettingsDeck(currentState, page) {
  if (!page.id.startsWith("settings-")) {
    return "";
  }

  if (page.id === "settings-keyboard") {
    return `
      <section class="sd-settings-deck">
        <div class="sd-settings-card">
          <div class="sd-section-title">Keyboard Layout</div>
          ${renderKeyboardLayout()}
        </div>
        <div class="sd-settings-card">
          <div class="sd-section-title">Keyboard Binds</div>
          ${renderBindingRows(KEYBOARD_BINDINGS)}
        </div>
      </section>
    `;
  }

  if (page.id === "settings-controller") {
    const controllerProfile =
      currentState.inputProfile === "keyboard-mouse" ? "xbox" : currentState.inputProfile;
    return `
      <section class="sd-settings-deck">
        <div class="sd-settings-card">
          <div class="sd-section-title">Active Controller Layout</div>
          ${renderControllerLayout(controllerProfile)}
        </div>
        <div class="sd-settings-card">
          <div class="sd-section-title">Keyboard Fallback</div>
          ${renderBindingRows(KEYBOARD_BINDINGS.slice(0, 8))}
        </div>
      </section>
    `;
  }

  return `
    <section class="sd-settings-deck">
      <div class="sd-settings-card">
        <div class="sd-section-title">Bridge HUD Blocks</div>
        ${renderBindingRows([
          { key: "Screen HUD", action: "Top bridge cards for universe feed, camera stack, and input profile" },
          { key: "Sub HUD", action: "Context cards for system, planet, and overlay routing" },
          { key: "Topbar", action: "Main mode switching, ship posture, focus, and motion controls" },
          { key: "Inspector", action: "Input command deck and selected system data" },
        ])}
      </div>
      <div class="sd-settings-card">
        <div class="sd-section-title">Input Profiles</div>
        ${renderBindingRows([
          { key: "Keyboard + Mouse", action: "Desktop bridge navigation and direct star selection" },
          { key: "Xbox", action: "Console-style tactical navigation with labeled ABXY controls" },
          { key: "PS5", action: "DualSense-friendly bridge navigation with Cross, Circle, Square, Triangle labels" },
          { key: "Generic Gamepad", action: "Fallback support for any standard browser gamepad" },
        ])}
      </div>
    </section>
  `;
}

export function createControlPanel(options) {
  const { root, state } = options;

  function render() {
    const currentState = state.getState();
    const menu = getMenuById(currentState.activeMenuId);
    const page = getPageById(currentState.activePageId);
    const activeSystem = currentState.selectedSystem || currentState.hoveredSystem;
    const viewModes = ["galaxy", "system", "planet"];
    const shipModes = ["patrol", "survey", "intercept", "colonize"];

    root.innerHTML = `
      <div class="sd-shell">
        <aside class="sd-rail">
          <div class="sd-brand">
            <div class="sd-brand-kicker">3D Sector Systems</div>
            <h1>Galaxy Control Viewer</h1>
            <p>Menu-driven command layers mapped directly into the procedural 3D scene.</p>
          </div>
          <div class="sd-menu-list">
            ${currentState.menus
              .map(
                (entry) => `
                  <button class="sd-menu-button ${entry.id === currentState.activeMenuId ? "is-active" : ""}" data-action="menu" data-menu-id="${entry.id}">
                    <span class="sd-menu-kicker">${entry.kicker}</span>
                    <strong>${entry.label}</strong>
                    <span>${entry.description}</span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </aside>

        <div class="sd-center">
          ${renderHudOverview(currentState, page, activeSystem)}

          <section class="sd-topbar">
            <div>
              <div class="sd-kicker">${menu.label} / ${page.label}</div>
              <h2>${page.title}</h2>
              <p>${page.description}</p>
            </div>
            <div class="sd-topbar-actions">
              <div class="sd-mode-group">
                ${viewModes
                  .map(
                    (mode) => `
                      <button class="sd-pill ${currentState.viewMode === mode ? "is-active" : ""}" data-action="view-mode" data-view-mode="${mode}">
                        ${mode}
                      </button>
                    `,
                  )
                  .join("")}
              </div>
              <div class="sd-mode-group">
                ${shipModes
                  .map(
                    (mode) => `
                      <button class="sd-pill ${currentState.shipControlMode === mode ? "is-active" : ""}" data-action="ship-mode" data-ship-mode="${mode}">
                        ${mode}
                      </button>
                    `,
                  )
                  .join("")}
              </div>
              <button class="sd-pill" data-action="focus-selection">Focus Selected</button>
              <button class="sd-pill" data-action="toggle-motion">${currentState.motionEnabled ? "Pause Motion" : "Resume Motion"}</button>
              <button class="sd-pill sd-pill-accent" data-action="regenerate">Regenerate</button>
            </div>
          </section>

          <section class="sd-subpages">
            ${menu.pages
              .map(
                (entry) => `
                  <button class="sd-subpage-card ${entry.id === currentState.activePageId ? "is-active" : ""}" data-action="page" data-page-id="${entry.id}">
                    <div class="sd-subpage-top">
                      <span class="sd-chip">${entry.label}</span>
                      <span class="sd-subpage-accent" style="background:${entry.accent}"></span>
                    </div>
                    <strong>${entry.title}</strong>
                    <p>${entry.description}</p>
                    <div class="sd-chip-row">
                      ${entry.capabilities.map((capability) => `<span class="sd-chip">${capability}</span>`).join("")}
                    </div>
                  </button>
                `,
              )
              .join("")}
          </section>

          ${renderSettingsDeck(currentState, page)}

          ${renderSubHud(currentState, activeSystem, page)}

          <section class="sd-bottom-strip">
            <div class="sd-strip-card">
              <span class="sd-kicker">System Density</span>
              <strong>${currentState.systemCount} systems</strong>
              <input class="sd-range" type="range" min="120" max="900" step="20" value="${currentState.systemCount}" data-action="system-count" />
            </div>
            <div class="sd-strip-card">
              <span class="sd-kicker">3D Overlay Logic</span>
              <strong>${page.overlayMode}</strong>
              <p>${page.capabilities.join(", ")}</p>
            </div>
            <div class="sd-strip-card">
              <span class="sd-kicker">Viewer Modes</span>
              <strong>${currentState.viewMode} / ${currentState.shipControlMode}</strong>
              <p>Galaxy, system, and planet cameras with ship command presets for patrol, survey, intercept, and colonize.</p>
            </div>
          </section>
        </div>

        <aside class="sd-inspector">
          <div class="sd-section">
            <div class="sd-section-title">Main Menu Logic</div>
            <div class="sd-chip-row">
              ${page.capabilities.map((capability) => `<span class="sd-chip">${capability}</span>`).join("")}
            </div>
          </div>
          ${renderInputSection(currentState)}
          <div class="sd-section">
            <div class="sd-section-title">System Inspector</div>
            ${renderSystemCard(activeSystem, currentState.selectedPlanet)}
          </div>
        </aside>
      </div>
    `;
  }

  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const action = target.getAttribute("data-action");
    if (action === "menu") {
      state.setMenu(target.getAttribute("data-menu-id"));
    }
    if (action === "page") {
      state.setPage(target.getAttribute("data-page-id"));
    }
    if (action === "toggle-motion") {
      state.toggleMotion();
    }
    if (action === "view-mode") {
      state.setViewMode(target.getAttribute("data-view-mode"));
    }
    if (action === "ship-mode") {
      state.setShipControlMode(target.getAttribute("data-ship-mode"));
    }
    if (action === "regenerate") {
      state.regenerate();
    }
    if (action === "focus-selection") {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "f" }));
    }
  });

  root.addEventListener("input", (event) => {
    const target = event.target.closest("[data-action='system-count']");
    if (!target) {
      return;
    }

    state.setSystemCount(target.value);
  });

  state.subscribe(render);
  render();
}
