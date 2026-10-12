/**
 * Virtual Keyboard and Finger Guide Engine
 * Renders an interactive ergonomic keyboard with finger mapping,
 * matching TypingClub and Ratatype teaching methodologies.
 */

// Finger mapping definitions
const FINGER_DATA = {
  lp: { id: 'lp', name: 'Meñique izquierdo', hand: 'left', finger: 'pinky', color: '#f472b6', bg: '#fdf2f8' },
  lr: { id: 'lr', name: 'Anular izquierdo', hand: 'left', finger: 'ring', color: '#fb923c', bg: '#fff7ed' },
  lm: { id: 'lm', name: 'Corazón izquierdo', hand: 'left', finger: 'middle', color: '#eab308', bg: '#fefce8' },
  li: { id: 'li', name: 'Índice izquierdo', hand: 'left', finger: 'index', color: '#10b981', bg: '#ecfdf5' },
  th: { id: 'th', name: 'Pulgares (Espacio)', hand: 'both', finger: 'thumb', color: '#38bdf8', bg: '#f0f9ff' },
  ri: { id: 'ri', name: 'Índice derecho', hand: 'right', finger: 'index', color: '#10b981', bg: '#ecfdf5' },
  rm: { id: 'rm', name: 'Corazón derecho', hand: 'right', finger: 'middle', color: '#eab308', bg: '#fefce8' },
  rr: { id: 'rr', name: 'Anular derecho', hand: 'right', finger: 'ring', color: '#fb923c', bg: '#fff7ed' },
  rp: { id: 'rp', name: 'Meñique derecho', hand: 'right', finger: 'pinky', color: '#f472b6', bg: '#fdf2f8' }
};

// Keyboard layout rows for Spanish / QWERTY standard
const KEYBOARD_ROWS = [
  // Number row
  [
    { key: 'º', shift: 'ª', code: 'Backquote', finger: 'lp', width: 1 },
    { key: '1', shift: '!', code: 'Digit1', finger: 'lp', width: 1 },
    { key: '2', shift: '"', code: 'Digit2', finger: 'lr', width: 1 },
    { key: '3', shift: '·', code: 'Digit3', finger: 'lm', width: 1 },
    { key: '4', shift: '$', code: 'Digit4', finger: 'li', width: 1 },
    { key: '5', shift: '%', code: 'Digit5', finger: 'li', width: 1 },
    { key: '6', shift: '&', code: 'Digit6', finger: 'ri', width: 1 },
    { key: '7', shift: '/', code: 'Digit7', finger: 'ri', width: 1 },
    { key: '8', shift: '(', code: 'Digit8', finger: 'rm', width: 1 },
    { key: '9', shift: ')', code: 'Digit9', finger: 'rr', width: 1 },
    { key: '0', shift: '=', code: 'Digit0', finger: 'rp', width: 1 },
    { key: "'", shift: '?', code: 'Minus', finger: 'rp', width: 1 },
    { key: '¡', shift: '¿', code: 'Equal', finger: 'rp', width: 1 },
    { key: 'Borrar', code: 'Backspace', finger: 'rp', width: 2, isSpecial: true }
  ],
  // Top row
  [
    { key: 'Tab', code: 'Tab', finger: 'lp', width: 1.5, isSpecial: true },
    { key: 'q', shift: 'Q', code: 'KeyQ', finger: 'lp', width: 1 },
    { key: 'w', shift: 'W', code: 'KeyW', finger: 'lr', width: 1 },
    { key: 'e', shift: 'E', code: 'KeyE', finger: 'lm', width: 1 },
    { key: 'r', shift: 'R', code: 'KeyR', finger: 'li', width: 1 },
    { key: 't', shift: 'T', code: 'KeyT', finger: 'li', width: 1 },
    { key: 'y', shift: 'Y', code: 'KeyY', finger: 'ri', width: 1 },
    { key: 'u', shift: 'U', code: 'KeyU', finger: 'ri', width: 1 },
    { key: 'i', shift: 'I', code: 'KeyI', finger: 'rm', width: 1 },
    { key: 'o', shift: 'O', code: 'KeyO', finger: 'rr', width: 1 },
    { key: 'p', shift: 'P', code: 'KeyP', finger: 'rp', width: 1 },
    { key: '`', shift: '^', code: 'BracketLeft', finger: 'rp', width: 1 },
    { key: '+', shift: '*', code: 'BracketRight', finger: 'rp', width: 1 },
    { key: 'Enter', code: 'Enter', finger: 'rp', width: 1.5, isSpecial: true }
  ],
  // Home row (Fila base)
  [
    { key: 'Bloq Mayús', code: 'CapsLock', finger: 'lp', width: 1.75, isSpecial: true },
    { key: 'a', shift: 'A', code: 'KeyA', finger: 'lp', width: 1 },
    { key: 's', shift: 'S', code: 'KeyS', finger: 'lr', width: 1 },
    { key: 'd', shift: 'D', code: 'KeyD', finger: 'lm', width: 1 },
    { key: 'f', shift: 'F', code: 'KeyF', finger: 'li', width: 1, hasBump: true },
    { key: 'g', shift: 'G', code: 'KeyG', finger: 'li', width: 1 },
    { key: 'h', shift: 'H', code: 'KeyH', finger: 'ri', width: 1 },
    { key: 'j', shift: 'J', code: 'KeyJ', finger: 'ri', width: 1, hasBump: true },
    { key: 'k', shift: 'K', code: 'KeyK', finger: 'rm', width: 1 },
    { key: 'l', shift: 'L', code: 'KeyL', finger: 'rr', width: 1 },
    { key: 'ñ', shift: 'Ñ', code: 'Semicolon', finger: 'rp', width: 1 },
    { key: '´', shift: '¨', code: 'Quote', finger: 'rp', width: 1 },
    { key: 'ç', shift: 'Ç', code: 'Backslash', finger: 'rp', width: 1.25 }
  ],
  // Bottom row
  [
    { key: 'Shift', code: 'ShiftLeft', finger: 'lp', width: 2.25, isSpecial: true },
    { key: 'z', shift: 'Z', code: 'KeyZ', finger: 'lp', width: 1 },
    { key: 'x', shift: 'X', code: 'KeyX', finger: 'lr', width: 1 },
    { key: 'c', shift: 'C', code: 'KeyC', finger: 'lm', width: 1 },
    { key: 'v', shift: 'V', code: 'KeyV', finger: 'li', width: 1 },
    { key: 'b', shift: 'B', code: 'KeyB', finger: 'li', width: 1 },
    { key: 'n', shift: 'N', code: 'KeyN', finger: 'ri', width: 1 },
    { key: 'm', shift: 'M', code: 'KeyM', finger: 'ri', width: 1 },
    { key: ',', shift: ';', code: 'Comma', finger: 'rm', width: 1 },
    { key: '.', shift: ':', code: 'Period', finger: 'rr', width: 1 },
    { key: '-', shift: '_', code: 'Slash', finger: 'rp', width: 1 },
    { key: 'Shift', code: 'ShiftRight', finger: 'rp', width: 2.25, isSpecial: true }
  ],
  // Space row
  [
    { key: 'Control', code: 'ControlLeft', finger: 'lp', width: 1.5, isSpecial: true },
    { key: 'Alt', code: 'AltLeft', finger: 'th', width: 1.25, isSpecial: true },
    { key: 'Espacio', code: 'Space', finger: 'th', width: 6.5, isSpace: true },
    { key: 'AltGr', code: 'AltRight', finger: 'th', width: 1.25, isSpecial: true },
    { key: 'Control', code: 'ControlRight', finger: 'rp', width: 1.5, isSpecial: true }
  ]
];

// Map characters to key codes and required finger
const CHAR_TO_KEY_MAP = {};

// Helper: initialize character lookup map
(function initCharMap() {
  KEYBOARD_ROWS.forEach(row => {
    row.forEach(keyObj => {
      if (keyObj.key) {
        CHAR_TO_KEY_MAP[keyObj.key] = { ...keyObj, needShift: false };
      }
      if (keyObj.shift) {
        CHAR_TO_KEY_MAP[keyObj.shift] = { ...keyObj, needShift: true };
      }
    });
  });

  // Space explicitly
  CHAR_TO_KEY_MAP[' '] = { key: ' ', code: 'Space', finger: 'th', needShift: false };

  // Spanish accents mappings
  CHAR_TO_KEY_MAP['á'] = { key: 'a', code: 'KeyA', finger: 'lp', isAccented: true, accentKey: '´' };
  CHAR_TO_KEY_MAP['é'] = { key: 'e', code: 'KeyE', finger: 'lm', isAccented: true, accentKey: '´' };
  CHAR_TO_KEY_MAP['í'] = { key: 'i', code: 'KeyI', finger: 'rm', isAccented: true, accentKey: '´' };
  CHAR_TO_KEY_MAP['ó'] = { key: 'o', code: 'KeyO', finger: 'rr', isAccented: true, accentKey: '´' };
  CHAR_TO_KEY_MAP['ú'] = { key: 'u', code: 'KeyU', finger: 'ri', isAccented: true, accentKey: '´' };
  CHAR_TO_KEY_MAP['Á'] = { key: 'A', code: 'KeyA', finger: 'lp', isAccented: true, needShift: true };
  CHAR_TO_KEY_MAP['É'] = { key: 'E', code: 'KeyE', finger: 'lm', isAccented: true, needShift: true };
  CHAR_TO_KEY_MAP['Í'] = { key: 'I', code: 'KeyI', finger: 'rm', isAccented: true, needShift: true };
  CHAR_TO_KEY_MAP['Ó'] = { key: 'O', code: 'KeyO', finger: 'rr', isAccented: true, needShift: true };
  CHAR_TO_KEY_MAP['Ú'] = { key: 'U', code: 'KeyU', finger: 'ri', isAccented: true, needShift: true };
  CHAR_TO_KEY_MAP['ü'] = { key: 'u', code: 'KeyU', finger: 'ri', isAccented: true };
})();

class VirtualKeyboard {
  constructor(containerId, fingerGuideId) {
    this.container = document.getElementById(containerId);
    this.fingerGuide = document.getElementById(fingerGuideId);
    this.keyElements = new Map();
    this.currentActiveChar = null;
    this.currentShiftActive = false;
    this.isColorCoded = true;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.keyElements.clear();

    const keyboardWrapper = document.createElement('div');
    keyboardWrapper.className = 'keyboard-grid';

    KEYBOARD_ROWS.forEach((row, rowIndex) => {
      const rowElem = document.createElement('div');
      rowElem.className = 'keyboard-row';

      row.forEach(keyObj => {
        const keyElem = document.createElement('div');
        keyElem.className = `key-cap key-${keyObj.finger}`;
        keyElem.dataset.code = keyObj.code;
        keyElem.dataset.finger = keyObj.finger;

        if (keyObj.width) {
          keyElem.style.flex = `${keyObj.width}`;
        }
        if (keyObj.isSpecial) {
          keyElem.classList.add('key-special');
        }
        if (keyObj.isSpace) {
          keyElem.classList.add('key-space');
        }
        if (keyObj.hasBump) {
          keyElem.classList.add('key-has-bump');
          const bump = document.createElement('span');
          bump.className = 'home-bump';
          keyElem.appendChild(bump);
        }

        // Key labels
        const labelBox = document.createElement('div');
        labelBox.className = 'key-labels';

        if (keyObj.shift && keyObj.shift !== keyObj.key.toUpperCase()) {
          const shiftLabel = document.createElement('span');
          shiftLabel.className = 'key-shift-label';
          shiftLabel.textContent = keyObj.shift;
          labelBox.appendChild(shiftLabel);
        }

        const mainLabel = document.createElement('span');
        mainLabel.className = 'key-main-label';
        mainLabel.textContent = keyObj.key.toUpperCase();
        labelBox.appendChild(mainLabel);

        keyElem.appendChild(labelBox);

        // Store reference
        this.keyElements.set(keyObj.code, keyElem);
        rowElem.appendChild(keyElem);
      });

      keyboardWrapper.appendChild(rowElem);
    });

    this.container.appendChild(keyboardWrapper);
    this.renderFingerGuide();
  }

  renderFingerGuide() {
    if (!this.fingerGuide) return;
    this.fingerGuide.innerHTML = `
      <div class="finger-guide-content">
        <div class="finger-pill-active" id="activeFingerPill">
          <span class="finger-dot" id="fingerDot"></span>
          <span class="finger-name" id="fingerName">Coloca tus manos en la fila base (ASDF - JKLÑ)</span>
        </div>
        <div class="finger-legend">
          <div class="legend-item"><span class="legend-dot" style="background:#f472b6;"></span> Meñiques</div>
          <div class="legend-item"><span class="legend-dot" style="background:#fb923c;"></span> Anulares</div>
          <div class="legend-item"><span class="legend-dot" style="background:#eab308;"></span> Corazones</div>
          <div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span> Índices</div>
          <div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span> Pulgares</div>
        </div>
      </div>
    `;
  }

  highlightTargetChar(char) {
    // Clear previous highlights
    this.clearHighlights();

    if (!char) return;
    this.currentActiveChar = char;

    const mapping = CHAR_TO_KEY_MAP[char] || CHAR_TO_KEY_MAP[char.toLowerCase()];
    if (!mapping) return;

    // Highlight main key
    const targetKeyEl = this.keyElements.get(mapping.code);
    if (targetKeyEl) {
      targetKeyEl.classList.add('key-active-target');
    }

    // If shift is needed (uppercase or special symbols), highlight shift key
    if (mapping.needShift || (char >= 'A' && char <= 'Z') || char === 'Ñ') {
      const isRightHandFinger = ['ri', 'rm', 'rr', 'rp'].includes(mapping.finger);
      // Use opposite shift key
      const shiftCode = isRightHandFinger ? 'ShiftLeft' : 'ShiftRight';
      const shiftEl = this.keyElements.get(shiftCode);
      if (shiftEl) {
        shiftEl.classList.add('key-active-shift');
      }
    }

    // Update finger instruction indicator
    const fingerInfo = FINGER_DATA[mapping.finger];
    if (fingerInfo) {
      const fingerNameEl = document.getElementById('fingerName');
      const fingerDotEl = document.getElementById('fingerDot');
      const activePill = document.getElementById('activeFingerPill');

      if (fingerNameEl && fingerDotEl && activePill) {
        const charDisplay = char === ' ' ? 'Espacio' : `"${char}"`;
        fingerNameEl.innerHTML = `Pulsa <strong>${charDisplay}</strong> con: <strong style="color:${fingerInfo.color}">${fingerInfo.name}</strong>`;
        fingerDotEl.style.backgroundColor = fingerInfo.color;
        activePill.style.borderColor = fingerInfo.color;
        activePill.style.backgroundColor = fingerInfo.bg;
      }
    }
  }

  pressKey(code) {
    const el = this.keyElements.get(code);
    if (el) {
      el.classList.add('key-pressed');
    }
  }

  releaseKey(code) {
    const el = this.keyElements.get(code);
    if (el) {
      el.classList.remove('key-pressed');
    }
  }

  clearHighlights() {
    this.keyElements.forEach(el => {
      el.classList.remove('key-active-target', 'key-active-shift', 'key-pressed');
    });
  }
}

window.VirtualKeyboard = VirtualKeyboard;
window.FINGER_DATA = FINGER_DATA;
window.CHAR_TO_KEY_MAP = CHAR_TO_KEY_MAP;
