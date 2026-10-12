/**
 * Main Application Controller for TypoMaster
 * Handles UI interactions, state management, curriculum progression, and storage.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const textDisplay = document.getElementById('textDisplay');
  const hiddenInput = document.getElementById('hiddenInput');
  const focusOverlay = document.getElementById('focusOverlay');
  const progressBar = document.getElementById('progressBar');

  // Stats Elements
  const wpmValue = document.getElementById('wpmValue');
  const cpmValue = document.getElementById('cpmValue');
  const accuracyValue = document.getElementById('accuracyValue');
  const timerValue = document.getElementById('timerValue');
  const timerLabel = document.getElementById('timerLabel');

  // Top Bar Info
  const currentLessonName = document.getElementById('currentLessonName');
  const currentLessonPill = document.getElementById('currentLessonPill');
  const currentLessonTip = document.getElementById('currentLessonTip');

  // Control Buttons
  const btnRestart = document.getElementById('btnRestart');
  const btnNext = document.getElementById('btnNext');
  const btnPrev = document.getElementById('btnPrev');
  const btnLessons = document.getElementById('btnLessons');
  const btnCustomText = document.getElementById('btnCustomText');
  const btnSound = document.getElementById('btnSound');
  const btnZen = document.getElementById('btnZen');

  // Drawers & Modals
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const btnCloseDrawer = document.getElementById('btnCloseDrawer');
  const drawerCategories = document.getElementById('drawerCategories');

  const resultsModal = document.getElementById('resultsModal');
  const resStars = document.getElementById('resStars');
  const resWpm = document.getElementById('resWpm');
  const resCpm = document.getElementById('resCpm');
  const resAccuracy = document.getElementById('resAccuracy');
  const resTime = document.getElementById('resTime');
  const resProblemKeys = document.getElementById('resProblemKeys');
  const resBtnRetry = document.getElementById('resBtnRetry');
  const resBtnNext = document.getElementById('resBtnNext');

  const customTextModal = document.getElementById('customTextModal');
  const customTextArea = document.getElementById('customTextArea');
  const btnApplyCustomText = document.getElementById('btnApplyCustomText');
  const btnCloseCustomModal = document.getElementById('btnCloseCustomModal');

  // State
  let currentLessonIndex = 0;
  let currentMode = 'lesson'; // 'lesson' or 'custom'
  let charSpans = [];

  // Persistent Progress (LocalStorage)
  const STORAGE_KEY = 'typomaster_progress_v1';
  let savedProgress = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) savedProgress = JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage not available');
  }

  function saveLessonResult(lessonId, result) {
    if (!savedProgress[lessonId] || result.wpm > (savedProgress[lessonId].wpm || 0)) {
      savedProgress[lessonId] = {
        wpm: result.wpm,
        cpm: result.cpm,
        accuracy: result.accuracy,
        stars: result.stars,
        completedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));
      } catch (e) {}
    }
  }

  // Initialize Virtual Keyboard
  const virtualKeyboard = new VirtualKeyboard('keyboardContainer', 'fingerGuideContainer');

  // Initialize Typing Engine
  const engine = new TypingEngine({
    onTick: (stats) => {
      wpmValue.textContent = stats.wpm;
      cpmValue.textContent = stats.cpm;
      accuracyValue.textContent = `${stats.accuracy}%`;

      if (stats.remainingSeconds !== null) {
        timerLabel.textContent = 'Tiempo Restante';
        timerValue.textContent = stats.formattedRemaining;
      } else {
        timerLabel.textContent = 'Tiempo Total';
        timerValue.textContent = stats.formattedTime;
      }

      progressBar.style.width = `${stats.progress}%`;
    },

    onCharUpdate: (update) => {
      // Highlight typed character in display box
      if (update.isBackspace) {
        const span = charSpans[update.index];
        if (span) {
          span.className = 'char';
          if (span.textContent === ' ') span.classList.add('char-space');
        }
      } else {
        const span = charSpans[update.index];
        if (span) {
          span.className = `char ${update.isCorrect ? 'char-correct' : 'char-incorrect'}`;
          if (span.textContent === ' ') span.classList.add('char-space');
        }
      }

      // Move caret to next char
      charSpans.forEach(s => s.classList.remove('char-current'));
      if (update.nextIndex < charSpans.length) {
        const nextSpan = charSpans[update.nextIndex];
        if (nextSpan) {
          nextSpan.classList.add('char-current');
          // Auto-scroll inside container if needed
          scrollIntoViewIfNeeded(nextSpan, textDisplay);
        }
      }

      // Update virtual keyboard target key & finger guide
      virtualKeyboard.highlightTargetChar(update.nextChar);
    },

    onComplete: (results) => {
      showResultsModal(results);
    }
  });

  function scrollIntoViewIfNeeded(target, container) {
    const targetTop = target.offsetTop;
    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    if (targetTop > containerTop + containerHeight - 60) {
      container.scrollTop = targetTop - 60;
    } else if (targetTop < containerTop) {
      container.scrollTop = Math.max(0, targetTop - 20);
    }
  }

  // Load a lesson
  function loadLesson(index) {
    if (index < 0) index = 0;
    if (index >= window.LESSONS.length) index = window.LESSONS.length - 1;
    currentLessonIndex = index;
    currentMode = 'lesson';

    const lesson = window.LESSONS[index];
    currentLessonName.textContent = lesson.title;
    currentLessonPill.textContent = lesson.category.toUpperCase();
    currentLessonTip.textContent = lesson.tip || 'Escribe con calma y sin mirar el teclado.';

    renderText(lesson.text);
    engine.loadText(lesson.text, {
      timeLimit: lesson.timeLimit || null,
      targetWpm: lesson.targetWpm || 25,
      minAccuracy: lesson.minAccuracy || 90
    });

    // Reset stats visual display
    wpmValue.textContent = '0';
    cpmValue.textContent = '0';
    accuracyValue.textContent = '100%';
    timerValue.textContent = '00:00';
    timerLabel.textContent = lesson.timeLimit ? 'Tiempo Restante' : 'Tiempo Total';
    progressBar.style.width = '0%';

    // Set target on keyboard
    virtualKeyboard.highlightTargetChar(lesson.text[0]);

    // Focus input
    focusTypingArea();
    renderDrawer();
  }

  // Render text into character spans
  function renderText(text) {
    textDisplay.innerHTML = '';
    charSpans = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;

      if (char === ' ') {
        span.classList.add('char-space');
      }
      if (i === 0) {
        span.classList.add('char-current');
      }

      charSpans.push(span);
      textDisplay.appendChild(span);
    }
  }

  // Results Modal Presentation
  function showResultsModal(results) {
    const lesson = window.LESSONS[currentLessonIndex];
    if (currentMode === 'lesson' && lesson) {
      saveLessonResult(lesson.id, results);
    }

    // Stars
    let starsHtml = '';
    for (let i = 1; i <= 3; i++) {
      starsHtml += `<span class="star ${i <= results.stars ? 'star-filled' : ''}">★</span>`;
    }
    resStars.innerHTML = starsHtml;

    // Metrics
    resWpm.textContent = results.wpm;
    resCpm.textContent = results.cpm;
    resAccuracy.textContent = `${results.accuracy}%`;
    resTime.textContent = results.detailedTime;

    // Problem keys
    if (results.problemKeys && results.problemKeys.length > 0) {
      resProblemKeys.style.display = 'flex';
      const badges = results.problemKeys
        .map(pk => `<span class="problem-key-badge">${pk.char === ' ' ? 'Espacio' : pk.char.toUpperCase()} (${pk.count})</span>`)
        .join('');
      resProblemKeys.innerHTML = `
        <span>Teclas que requirieron corrección:</span>
        <div class="problem-key-badges">${badges}</div>
      `;
    } else {
      resProblemKeys.style.display = 'none';
    }

    resultsModal.classList.add('open');
  }

  function hideResultsModal() {
    resultsModal.classList.remove('open');
    focusTypingArea();
  }

  // Key Capture & Input Management
  function focusTypingArea() {
    hiddenInput.focus();
    focusOverlay.classList.remove('visible');
  }

  textDisplay.addEventListener('click', () => {
    focusTypingArea();
  });

  focusOverlay.addEventListener('click', () => {
    focusTypingArea();
  });

  hiddenInput.addEventListener('blur', () => {
    // Only show overlay if modal isn't open
    if (!resultsModal.classList.contains('open') && !drawerBackdrop.classList.contains('open')) {
      focusOverlay.classList.add('visible');
    }
  });

  // Native keyboard listeners
  window.addEventListener('keydown', (e) => {
    // Ignore keys when typing inside custom text modal textarea
    if (document.activeElement === customTextArea) return;

    // Virtual keyboard tactile down
    virtualKeyboard.pressKey(e.code);

    // Escape exits Zen mode or closes modals
    if (e.key === 'Escape') {
      if (document.body.classList.contains('zen-mode')) {
        document.body.classList.remove('zen-mode');
        btnZen.classList.remove('active');
      }
      hideResultsModal();
      closeDrawer();
      closeCustomTextModal();
      return;
    }

    // Modal navigation
    if (resultsModal.classList.contains('open')) {
      if (e.key === 'Enter') {
        hideResultsModal();
        loadLesson(currentLessonIndex + 1);
      }
      return;
    }

    // Check Caps Lock state
    const capsLockOn = e.getModifierState && e.getModifierState('CapsLock');
    let capsWarning = document.getElementById('capsLockWarning');
    if (capsLockOn) {
      if (!capsWarning) {
        capsWarning = document.createElement('div');
        capsWarning.id = 'capsLockWarning';
        capsWarning.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#fef3c7; border:1px solid #f59e0b; color:#92400e; padding:6px 16px; border-radius:99px; font-size:13px; font-weight:600; box-shadow:0 4px 12px rgba(0,0,0,0.08); z-index:99; display:flex; align-items:center; gap:6px;';
        capsWarning.innerHTML = '⚠️ <span>Bloq Mayús está activado</span>';
        document.body.appendChild(capsWarning);
      }
    } else if (capsWarning) {
      capsWarning.remove();
    }

    // Tab + Enter quick restart
    if (e.key === 'Tab') {
      e.preventDefault();
      loadLesson(currentLessonIndex);
      return;
    }

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      engine.handleBackspace();
      return;
    }

    // Handle Enter key if newline is expected
    if (e.key === 'Enter') {
      const expectedChar = engine.targetText[engine.currentIndex];
      if (expectedChar === '\n') {
        e.preventDefault();
        engine.handleInput('\n');
        return;
      }
    }

    // Process character keys
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      engine.handleInput(e.key);
    }
  });

  window.addEventListener('keyup', (e) => {
    virtualKeyboard.releaseKey(e.code);
  });

  // Action Buttons
  btnRestart.addEventListener('click', () => {
    loadLesson(currentLessonIndex);
  });

  btnNext.addEventListener('click', () => {
    loadLesson(currentLessonIndex + 1);
  });

  btnPrev.addEventListener('click', () => {
    loadLesson(currentLessonIndex - 1);
  });

  resBtnRetry.addEventListener('click', () => {
    hideResultsModal();
    loadLesson(currentLessonIndex);
  });

  resBtnNext.addEventListener('click', () => {
    hideResultsModal();
    loadLesson(currentLessonIndex + 1);
  });

  // Sound Toggle
  const soundModes = ['mechanical', 'gentle', 'mute'];
  let currentSoundIdx = 0;
  btnSound.addEventListener('click', () => {
    currentSoundIdx = (currentSoundIdx + 1) % soundModes.length;
    const mode = soundModes[currentSoundIdx];
    window.typingAudio.soundType = mode;

    if (mode === 'mechanical') {
      btnSound.innerHTML = '🔊 <span>Sonido: Mecánico</span>';
      btnSound.classList.add('active');
    } else if (mode === 'gentle') {
      btnSound.innerHTML = '🔉 <span>Sonido: Suave</span>';
      btnSound.classList.add('active');
    } else {
      btnSound.innerHTML = '🔇 <span>Silencio</span>';
      btnSound.classList.remove('active');
    }
    window.typingAudio.playKey();
  });

  // Zen Mode Toggle
  btnZen.addEventListener('click', () => {
    document.body.classList.toggle('zen-mode');
    btnZen.classList.toggle('active');
    focusTypingArea();
  });

  // Drawer / Curriculum Selector
  btnLessons.addEventListener('click', () => {
    renderDrawer();
    drawerBackdrop.classList.add('open');
  });

  function closeDrawer() {
    drawerBackdrop.classList.remove('open');
    focusTypingArea();
  }

  btnCloseDrawer.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', (e) => {
    if (e.target === drawerBackdrop) closeDrawer();
  });

  function renderDrawer() {
    if (!drawerCategories) return;
    drawerCategories.innerHTML = '';

    window.LESSON_CATEGORIES.forEach(cat => {
      const catGroup = document.createElement('div');
      catGroup.className = 'category-group';

      const catTitle = document.createElement('div');
      catTitle.className = 'category-title';
      catTitle.innerHTML = `<span>${cat.icon}</span> <span>${cat.title}</span>`;
      catGroup.appendChild(catTitle);

      const list = document.createElement('div');
      list.className = 'lesson-list';

      const categoryLessons = window.LESSONS.filter(l => l.category === cat.id);
      categoryLessons.forEach(lesson => {
        const lessonIdx = window.LESSONS.indexOf(lesson);
        const item = document.createElement('div');
        item.className = `lesson-card-item ${lessonIdx === currentLessonIndex ? 'active' : ''}`;

        const progress = savedProgress[lesson.id];
        let statusHtml = '';
        if (progress) {
          let stars = '★'.repeat(progress.stars || 1);
          statusHtml = `<span style="color:var(--color-gold); font-size:0.9rem;">${stars}</span> <span style="font-weight:600; color:var(--color-primary); font-size:0.75rem;">${progress.wpm} PPM</span>`;
        }

        item.innerHTML = `
          <div class="lesson-item-info">
            <span class="lesson-item-name">${lesson.title}</span>
            <span class="lesson-item-tip">${lesson.tip || ''}</span>
          </div>
          <div class="lesson-item-status">${statusHtml}</div>
        `;

        item.addEventListener('click', () => {
          loadLesson(lessonIdx);
          closeDrawer();
        });

        list.appendChild(item);
      });

      catGroup.appendChild(list);
      drawerCategories.appendChild(catGroup);
    });
  }

  // Custom Text Mode
  btnCustomText.addEventListener('click', () => {
    customTextModal.classList.add('open');
    customTextArea.focus();
  });

  function closeCustomTextModal() {
    customTextModal.classList.remove('open');
    focusTypingArea();
  }

  btnCloseCustomModal.addEventListener('click', closeCustomTextModal);
  customTextModal.addEventListener('click', (e) => {
    if (e.target === customTextModal) closeCustomTextModal();
  });

  btnApplyCustomText.addEventListener('click', () => {
    const text = customTextArea.value.trim();
    if (!text) return;

    currentMode = 'custom';
    currentLessonName.textContent = 'Texto Personalizado';
    currentLessonPill.textContent = 'PRÁCTICA LIBRE';
    currentLessonTip.textContent = 'Práctica con tu propio texto personalizado.';

    renderText(text);
    engine.loadText(text, { targetWpm: 30, minAccuracy: 90 });

    wpmValue.textContent = '0';
    cpmValue.textContent = '0';
    accuracyValue.textContent = '100%';
    timerValue.textContent = '00:00';
    timerLabel.textContent = 'Tiempo Total';
    progressBar.style.width = '0%';

    virtualKeyboard.highlightTargetChar(text[0]);
    closeCustomTextModal();
  });

  // Start with Lesson 1
  loadLesson(0);
});
