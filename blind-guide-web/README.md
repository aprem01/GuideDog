# 🦮 BlindGuide AI - Web App (PWA)

A Progressive Web App for blind navigation that works on **iPhone and Android**.

## Features

✅ **Works on both iPhone & Android**
✅ **Camera-based object detection** (YOLO)
✅ **Spatial audio** (directional sounds)
✅ **Vibration feedback** (haptic patterns)
✅ **Voice commands** ("What's around me?")
✅ **AI scene analysis** (GPT-4o for stairs, doors)
✅ **Walking vs Stationary detection**
✅ **Installable as app** (PWA)
✅ **Works offline** (after first load)

## Quick Deploy Options

### Option 1: GitHub Pages (Free & Easy)

1. Create a GitHub repository
2. Upload all files from this folder
3. Go to Settings → Pages → Enable GitHub Pages
4. Your app will be at: `https://yourusername.github.io/repo-name/`

### Option 2: Netlify (Free & Easy)

1. Go to [netlify.com](https://netlify.com)
2. Drag & drop this folder to deploy
3. Get instant HTTPS URL

### Option 3: Vercel (Free)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in this folder
3. Get instant HTTPS URL

### Option 4: Cloudflare Pages (Free)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repo or upload directly
3. Get instant HTTPS URL

### Option 5: Local Testing

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Then open: https://localhost:8000
```

**⚠️ IMPORTANT:** Camera access requires HTTPS. Local testing needs `localhost`.

## Files

```
blind-guide-web/
├── index.html      # Main app
├── manifest.json   # PWA manifest
├── sw.js          # Service worker (offline)
├── icon-192.svg   # App icon
└── README.md      # This file
```

## How to Use

### On Phone:

1. Open the URL in Safari (iPhone) or Chrome (Android)
2. **iPhone:** Tap Share → "Add to Home Screen"
3. **Android:** Tap menu → "Install app" or "Add to Home Screen"
4. Open the installed app
5. Allow camera and microphone access

### Controls:

| Button | Action |
|--------|--------|
| 🎤 Tap to Ask | Voice commands |
| 👁️ Describe | What's around |
| ✓ Safe? | Check if path is clear |
| 🧭 Nav | Toggle navigation on/off |
| ⚙️ Settings | Adjust preferences |

### Voice Commands:

| Say | Action |
|-----|--------|
| "What's around me?" | Describe scene |
| "Is it safe?" | Check path |
| "What's on my left?" | Describe left side |
| "Pause" | Stop navigation |
| "Resume" | Start navigation |

## Settings

- **Voice Alerts** - Spoken warnings
- **Vibration** - Haptic feedback
- **Sound Cues** - Directional beeps
- **AI Analysis** - GPT-4o for stairs/doors
- **High Contrast** - For low vision

## How It Works

### Detection Zones:

```
YOU → [IMMEDIATE 0.8m] → [CLOSE 1.5m] → [AWARENESS 3m] → [CLEAR]
         ⚡ Act NOW!       🔔 Prepare      👁️ Notice        ✅ Safe
```

### Walking vs Stationary:

| Mode | Feedback |
|------|----------|
| **WALKING** | Continuous guidance via sounds/vibration |
| **STATIONARY** | Only alerts for approaching dangers |

## API Keys

The app uses GPT-4o for scene analysis. The API key is embedded in the code.

To use your own key, edit `index.html` and change:
```javascript
OPENAI_API_KEY: "your-key-here"
```

## Browser Support

| Browser | Support |
|---------|---------|
| Safari iOS 14+ | ✅ Full |
| Chrome Android | ✅ Full |
| Chrome Desktop | ✅ Full |
| Firefox | ✅ Partial (no speech recognition) |

## Troubleshooting

### Camera not working?
- Make sure you're using HTTPS (not HTTP)
- Check browser permissions for camera
- On iPhone, use Safari (Chrome has limited camera access)

### Voice not working?
- Check browser permissions for microphone
- On iPhone, voice recognition requires internet

### Vibration not working?
- iPhone: Vibration API has limited support
- Android: Should work in Chrome

### App not installing?
- Make sure you're using HTTPS
- Clear browser cache and try again

## Privacy

- Camera feed is processed **locally** in your browser
- Only scene analysis images are sent to OpenAI API
- No data is stored on any server
- Works offline after first load (except AI features)

## License

MIT License - Feel free to modify and distribute!
