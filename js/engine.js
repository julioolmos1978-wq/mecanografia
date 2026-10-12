/**
 * Typing Engine & Metrics Calculator
 * Tracks live WPM, CPM, Accuracy, Elapsed Time, and Problem Keys
 * Implements standard Typing.com & Ratatype calculation standards.
 */

class TypingEngine {
  constructor(options = {}) {
    this.targetText = '';
    this.currentIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.isRunning = false;
    this.isCompleted = false;

    // Metrics state
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.errorCount = 0;
    this.errorMap = {}; // { 'a': 3, 'f': 1 }
    this.charStatus = []; // 'pending', 'correct', 'incorrect'

    // Configuration
    this.timeLimit = options.timeLimit || null; // for timed tests (in seconds)
    this.targetWpm = options.targetWpm || 25;
    this.minAccuracy = options.minAccuracy || 90;

    // Callbacks
    this.onTick = options.onTick || (() => {});
    this.onCharUpdate = options.onCharUpdate || (() => {});
    this.onComplete = options.onComplete || (() => {});
  }

  loadText(text, options = {}) {
    this.reset();
    this.targetText = text.trim();
    this.timeLimit = options.timeLimit || null;
    this.targetWpm = options.targetWpm || 25;
    this.minAccuracy = options.minAccuracy || 90;
    this.charStatus = new Array(this.targetText.length).fill('pending');
  }

  reset() {
    this.stopTimer();
    this.currentIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.isRunning = false;
    this.isCompleted = false;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.errorCount = 0;
    this.errorMap = {};
    this.charStatus = this.targetText ? new Array(this.targetText.length).fill('pending') : [];
  }

  start() {
    if (this.isRunning) return;
    this.startTime = Date.now();
    this.isRunning = true;
    this.isCompleted = false;

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 200);

    this.tick();
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleInput(typedChar) {
    if (this.isCompleted) return;

    if (!this.isRunning) {
      this.start();
    }

    const expectedChar = this.targetText[this.currentIndex];
    this.totalKeystrokes++;

    const isMatch = (typedChar === expectedChar);

    if (isMatch) {
      this.correctKeystrokes++;
      this.charStatus[this.currentIndex] = 'correct';
      if (window.typingAudio) window.typingAudio.playKey();
    } else {
      this.errorCount++;
      this.charStatus[this.currentIndex] = 'incorrect';
      this.errorMap[expectedChar] = (this.errorMap[expectedChar] || 0) + 1;
      if (window.typingAudio) window.typingAudio.playError();
    }

    const prevIndex = this.currentIndex;
    this.currentIndex++;

    this.onCharUpdate({
      index: prevIndex,
      isCorrect: isMatch,
      expected: expectedChar,
      typed: typedChar,
      nextIndex: this.currentIndex,
      nextChar: this.targetText[this.currentIndex] || null
    });

    this.tick();

    // Check completion condition
    if (this.currentIndex >= this.targetText.length) {
      this.complete();
    }
  }

  handleBackspace() {
    if (this.isCompleted || this.currentIndex === 0) return;

    this.currentIndex--;
    const prevStatus = this.charStatus[this.currentIndex];
    if (prevStatus === 'correct' && this.correctKeystrokes > 0) {
      this.correctKeystrokes--;
    }
    this.charStatus[this.currentIndex] = 'pending';

    this.onCharUpdate({
      index: this.currentIndex,
      isBackspace: true,
      nextIndex: this.currentIndex,
      nextChar: this.targetText[this.currentIndex]
    });

    this.tick();
  }

  tick() {
    if (!this.startTime) return;

    const now = Date.now();
    let elapsedMs = now - this.startTime;
    let elapsedSeconds = elapsedMs / 1000;

    // Check time limit for speed test mode
    if (this.timeLimit) {
      const remaining = Math.max(0, this.timeLimit - elapsedSeconds);
      if (remaining <= 0) {
        this.complete();
        return;
      }
    }

    const stats = this.getStats(elapsedSeconds);
    this.onTick(stats);
  }

  getStats(elapsedSeconds = 0) {
    if (elapsedSeconds <= 0) {
      elapsedSeconds = this.startTime ? (Date.now() - this.startTime) / 1000 : 0.001;
    }
    // Smooth time for first few seconds to avoid crazy spikes
    const minutes = Math.max(elapsedSeconds / 60, 0.05);

    // Standard WPM: (correct characters / 5) / minutes
    const wpm = Math.max(0, Math.round((this.correctKeystrokes / 5) / minutes));
    // Gross WPM
    const grossWpm = Math.max(0, Math.round((this.totalKeystrokes / 5) / minutes));
    // CPM: Characters per minute
    const cpm = Math.max(0, Math.round(this.correctKeystrokes / minutes));
    // Accuracy %
    const accuracy = this.totalKeystrokes > 0
      ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100)
      : 100;
    // Progress %
    const progress = this.targetText.length > 0
      ? Math.min(100, Math.round((this.currentIndex / this.targetText.length) * 100))
      : 0;

    // Time remaining (if timed test)
    const remainingSeconds = this.timeLimit ? Math.max(0, Math.ceil(this.timeLimit - elapsedSeconds)) : null;

    return {
      wpm,
      grossWpm,
      cpm,
      accuracy,
      progress,
      elapsedSeconds,
      formattedTime: this.formatTime(elapsedSeconds),
      remainingSeconds,
      formattedRemaining: remainingSeconds !== null ? this.formatTime(remainingSeconds) : null,
      correctChars: this.correctKeystrokes,
      errorCount: this.errorCount,
      totalKeystrokes: this.totalKeystrokes,
      currentIndex: this.currentIndex,
      totalLength: this.targetText.length
    };
  }

  formatTime(seconds) {
    const s = Math.floor(seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  formatTimeDetailed(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  }

  complete() {
    if (this.isCompleted) return;
    this.isCompleted = true;
    this.isRunning = false;
    this.endTime = Date.now();
    this.stopTimer();

    const elapsedSeconds = Math.max((this.endTime - this.startTime) / 1000, 0.5);
    const finalStats = this.getStats(elapsedSeconds);

    // Calculate stars rating (TypingClub style)
    let stars = 1;
    if (finalStats.accuracy >= 95 && finalStats.wpm >= this.targetWpm) {
      stars = 3;
    } else if (finalStats.accuracy >= 88 && finalStats.wpm >= (this.targetWpm * 0.75)) {
      stars = 2;
    }

    // Top problem keys
    const problemKeys = Object.entries(this.errorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([char, count]) => ({ char, count }));

    if (window.typingAudio) {
      window.typingAudio.playSuccess();
    }

    const results = {
      ...finalStats,
      stars,
      detailedTime: this.formatTimeDetailed(elapsedSeconds),
      problemKeys,
      passed: finalStats.accuracy >= this.minAccuracy
    };

    this.onComplete(results);
  }
}

window.TypingEngine = TypingEngine;
