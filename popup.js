// Popup script - Simplified version
document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup loaded');
  
  // Get elements
  var settingsBtn = document.getElementById('settings-btn');
  var disableBtn = document.getElementById('disable-btn');
  var timerDisplay = document.getElementById('timer-display');
  var websiteList = document.getElementById('website-list');
  
  console.log('Settings button:', settingsBtn);
  console.log('Disable button:', disableBtn);
  
  // Open settings
  if (settingsBtn) {
    settingsBtn.onclick = function() {
      console.log('Settings clicked');
      var url = chrome.runtime.getURL('options.html');
      chrome.tabs.create({ url: url });
      window.close();
    };
  }
  
  // Disable button
  if (disableBtn) {
    disableBtn.onclick = function() {
      console.log('Disable clicked');
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var message = 'To disable this site, remove it from the settings.';
        if (tabs && tabs[0] && tabs[0].url) {
          try {
            var hostname = new URL(tabs[0].url).hostname;
            message = 'To disable on ' + hostname + ', remove it from settings.';
          } catch (e) {}
        }
        alert(message);
        
        var url = chrome.runtime.getURL('options.html');
        chrome.tabs.create({ url: url });
        window.close();
      });
    };
  }
  
  // Load settings
  if (chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['settings'], function(result) {
      var settings = result.settings || {
        timerDuration: 120,
        websites: ['x.com', 'twitter.com', 'linkedin.com', 'reddit.com']
      };
      
      if (timerDisplay) {
        timerDisplay.textContent = (settings.timerDuration || 120) + 's';
      }
      
      if (websiteList) {
        var sites = settings.websites || [];
        if (sites.length === 0) {
          websiteList.innerHTML = '<li>No websites configured</li>';
        } else {
          var html = '';
          for (var i = 0; i < sites.length; i++) {
            html += '<li>' + sites[i] + '</li>';
          }
          websiteList.innerHTML = html;
        }
      }
    });
  } else {
    // Fallback if storage not available
    if (timerDisplay) timerDisplay.textContent = '120s';
    if (websiteList) {
      websiteList.innerHTML = '<li>x.com</li><li>twitter.com</li><li>linkedin.com</li><li>reddit.com</li>';
    }
  }
});
