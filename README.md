# 🎯 Mission Timer

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/yourusername/mission-timer)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

> Stay focused on distracting websites. Get in, complete your task, get out.

Mission Timer is a Chrome extension that helps you stay productive by forcing intentionality when visiting distracting websites like X (Twitter), LinkedIn, Reddit, and more. Before you can use these sites, you must state your mission and complete it within a time limit.

![Mission Timer Demo](screenshots/demo.png)

## ✨ Features

- 🎯 **Mission Prompt**: Asked "What is your mission?" before accessing distracting sites
- ⏱️ **Countdown Timer**: Default 120-second timer (customizable)
- 📍 **Always Visible**: Mission widget stays fixed on the right side
- 🚪 **Auto-Close**: Tab automatically closes when time expires
- ✅ **Manual Complete**: Click "Done" to finish early
- ⚙️ **Customizable**: Change timer duration and manage website list
- 🔒 **Privacy First**: All data stored locally, no external servers

## 🚀 Installation

### Method 1: Chrome Web Store (Coming Soon)

Once published, you can install directly from the Chrome Web Store.

### Method 2: Developer Mode (Current)

1. **Download the extension**
   ```bash
   git clone https://github.com/yourusername/mission-timer.git
   cd mission-timer
   ```

2. **Generate icons** (Required)
   - Open `generate-icons.html` in Chrome
   - Click "Generate Icons"
   - Save all 3 PNG files to the `icons/` folder:
     - `icon16.png` (16x16)
     - `icon48.png` (48x48)
     - `icon128.png` (128x128)

3. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `mission-timer` folder
   - The extension is now installed!

## 📖 Usage

### First Time Setup

1. Click the Mission Timer icon in your Chrome toolbar
2. Click "Open Settings" to customize your experience
3. Default timer is set to 120 seconds (2 minutes)
4. Default monitored sites: X, Twitter, LinkedIn, Reddit

### Daily Use

1. **Visit a monitored site** (e.g., x.com, linkedin.com)
2. **Enter your mission**: You'll see a prompt asking "What is your mission?"
3. **Set your intention**: Type what you need to accomplish (e.g., "Reply to John's message")
4. **Stay focused**: The mission widget appears on the right side with a countdown
5. **Complete or close**:
   - Click "Done - Close Tab" when finished
   - Or the tab auto-closes when time runs out

### Customizing Settings

Click the extension icon → "Open Settings" to:

- **Timer Duration**: Change from 10 to 3600 seconds
- **Website List**: Add or remove sites to monitor
  - Enter domain names only (e.g., `instagram.com`)
  - No need for `https://` or `www.`
  - One site per entry

## 🛠️ Default Configuration

```javascript
{
  timerDuration: 120,  // 2 minutes
  websites: [
    'x.com',
    'twitter.com',
    'linkedin.com',
    'reddit.com'
  ]
}
```

## 📁 File Structure

```
mission-timer/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Service worker for tab management
├── content.js             # Content script for UI injection
├── styles.css             # Styling for overlay and widget
├── popup.html             # Extension popup UI
├── popup.js               # Popup JavaScript
├── options.html           # Settings page
├── generate-icons.html    # Icon generator tool
├── icons/
│   ├── icon.svg           # Source icon
│   ├── icon16.png         # Extension icon (16x16)
│   ├── icon48.png         # Extension icon (48x48)
│   └── icon128.png        # Extension icon (128x128)
├── README.md              # This file
└── LICENSE                # MIT License
```

## 🔒 Privacy

- ✅ All data stored locally in your browser
- ✅ No data sent to external servers
- ✅ No analytics or tracking
- ✅ No account required
- ✅ Mission statements are private to your browser

## 🎯 How It Works

1. **Detection**: Extension monitors page navigation to configured websites
2. **Interception**: Shows mission prompt overlay before content loads
3. **Tracking**: Injects floating widget with countdown timer
4. **Enforcement**: Automatically closes tab when timer reaches zero
5. **Completion**: User can manually close tab early with "Done" button

## 🎨 UI Components

### Mission Overlay
- Dark, blurred background
- "What is your mission?" prompt
- Text input for mission statement
- "Start Mission" button

### Mission Widget
- Fixed position on right side of page
- Shows countdown timer (color changes: blue → yellow → red)
- Displays your mission statement
- Progress bar visualization
- "Done - Close Tab" button

## 🐛 Troubleshooting

### Extension Not Working
- Ensure extension is enabled in `chrome://extensions/`
- Check that icons are generated in the `icons/` folder
- Reload the extension after making changes

### Mission Prompt Not Appearing
- Verify the website is in your monitored list
- Refresh the webpage
- Check browser console for errors

### Buttons Not Responding
- Reload the extension in `chrome://extensions/`
- Check browser console for JavaScript errors
- Ensure you're using Chrome or Chromium-based browser

## 🌐 Supported Websites

Works with any website! Default list includes:
- X (Twitter)
- LinkedIn
- Reddit
- Add your own in settings!

## 💻 Development

### Prerequisites
- Chrome or Chromium browser
- Basic knowledge of JavaScript and Chrome Extensions

### Local Development

1. Clone the repository
2. Make your changes
3. Reload the extension in `chrome://extensions/`
4. Test your changes

### Chrome Extension Permissions

This extension requires:
- `storage`: Save settings and mission data
- `tabs`: Close tabs when timer expires
- `activeTab`: Interact with current page
- `scripting`: Inject overlay and widget
- `host_permissions`: Access to monitored websites

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by productivity techniques like timeboxing and intention setting
- Built with Chrome Extension Manifest V3
- Icons generated using HTML5 Canvas

## 📧 Support

If you have any questions or issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Open an issue on GitHub
3. Provide browser version and steps to reproduce

---

**Stay focused. Complete your mission. ✓**

Made with ❤️ to help you stay productive
