// Content script that runs on all pages
(function() {
  'use strict';

  // Prevent multiple injections
  if (window.__missionTimerInjected) return;
  window.__missionTimerInjected = true;

  let timerInterval = null;
  let missionStartTime = 0;
  let missionDuration = 120;
  let missionText = '';
  let currentTabId = null;

  // Get tab ID
  function getTabId() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getTabId' }, (response) => {
        if (response && response.tabId) {
          currentTabId = response.tabId;
          resolve(response.tabId);
        } else {
          // Fallback to URL-based ID
          resolve(window.location.href);
        }
      });
    });
  }

  // Check if we should show the overlay on this page
  function checkAndShowOverlay() {
    chrome.storage.sync.get(['settings', 'activeMissions'], (result) => {
      const settings = result.settings || { timerDuration: 120, websites: [] };
      const activeMissions = result.activeMissions || {};

      // Check if current URL matches any website in the list
      const currentUrl = window.location.href;
      const shouldIntercept = settings.websites.some((site) => {
        const normalizedSite = site.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
        const normalizedUrl = currentUrl.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
        return normalizedUrl.includes(normalizedSite) || normalizedSite.includes(normalizedUrl.split('/')[0]);
      });

      // Check if there's an active mission for this tab using URL as key
      const urlKey = window.location.href;
      const hasActiveMission = Object.values(activeMissions).some(mission => {
        return window.location.href.includes(mission.url || '');
      });

      if (shouldIntercept && !hasActiveMission && !document.getElementById('mission-timer-overlay') && !document.getElementById('mission-widget')) {
        showMissionDialog(settings.timerDuration);
      }
    });
  }

  function showMissionDialog(duration) {
    if (document.getElementById('mission-timer-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'mission-timer-overlay';
    overlay.innerHTML = `
      <div class="mission-dialog">
        <h1>What is your mission?</h1>
        <p class="subtitle">You have ${duration} seconds. Stay focused.</p>
        <input type="text" id="mission-input" placeholder="e.g., Reply to John's message" autofocus>
        <button id="start-mission-btn">Start Mission</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = document.getElementById('mission-input');
    const button = document.getElementById('start-mission-btn');

    if (input) input.focus();

    button.addEventListener('click', () => {
      const mission = input.value.trim();
      if (mission) {
        startMission(mission, duration);
      } else {
        input.style.borderColor = '#ef4444';
        input.placeholder = 'Please enter your mission...';
      }
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        button.click();
      }
    });
  }

  function startMission(mission, duration) {
    missionText = mission;
    missionDuration = duration;
    missionStartTime = Date.now();

    // Remove overlay
    const overlay = document.getElementById('mission-timer-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }

    // Save mission state
    chrome.runtime.sendMessage({
      action: 'startMission',
      mission: mission,
      duration: duration,
      url: window.location.href
    });

    // Show widget
    showMissionWidget();
  }

  function showMissionWidget() {
    if (document.getElementById('mission-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'mission-widget';
    widget.innerHTML = `
      <div class="mission-widget-header">
        <h3>Mission Timer</h3>
      </div>
      <div class="timer-display" id="timer-display">${formatTime(missionDuration)}</div>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill" style="width: 100%"></div>
      </div>
      <div class="mission-text" id="mission-text">${escapeHtml(missionText)}</div>
      <button id="complete-mission-btn">Done - Close Tab</button>
    `;

    document.body.appendChild(widget);

    const completeBtn = document.getElementById('complete-mission-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', completeMission);
    }

    // Start timer
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    const elapsed = Math.floor((Date.now() - missionStartTime) / 1000);
    const remaining = Math.max(0, missionDuration - elapsed);
    const progress = (remaining / missionDuration) * 100;

    const timerDisplay = document.getElementById('timer-display');
    const progressFill = document.getElementById('progress-fill');

    if (timerDisplay) {
      timerDisplay.textContent = formatTime(remaining);

      // Update colors based on remaining time
      timerDisplay.classList.remove('warning', 'danger');
      if (progressFill) progressFill.classList.remove('warning', 'danger');

      if (remaining <= 30) {
        timerDisplay.classList.add('danger');
        if (progressFill) progressFill.classList.add('danger');
      } else if (remaining <= 60) {
        timerDisplay.classList.add('warning');
        if (progressFill) progressFill.classList.add('warning');
      }
    }

    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

    if (remaining <= 0) {
      timeUp();
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function completeMission() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    chrome.runtime.sendMessage({ action: 'completeMission' });
  }

  function timeUp() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    // Show time up notification
    const widget = document.getElementById('mission-widget');
    if (widget) {
      widget.innerHTML = `
        <div class="mission-widget-header">
          <h3>Time's Up!</h3>
        </div>
        <div class="timer-display danger">00:00</div>
        <div class="mission-text">Mission time completed. Closing tab...</div>
      `;
    }

    chrome.runtime.sendMessage({ action: 'timeUp' });
  }

  // Check on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndShowOverlay);
  } else {
    checkAndShowOverlay();
  }

  // Also check on URL changes (for SPAs like Twitter/X)
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const url = window.location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(checkAndShowOverlay, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
})();
