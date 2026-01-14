# 📚 BlindGuide AI - Technical Documentation

## Table of Contents

1. [Code Architecture](#code-architecture)
2. [Module Documentation](#module-documentation)
3. [API Reference](#api-reference)
4. [Algorithm Details](#algorithm-details)
5. [Configuration Guide](#configuration-guide)
6. [Troubleshooting](#troubleshooting)

---

## Code Architecture

### File Structure

```
BlindGuide/
├── index.html          # Main application (single-file PWA)
├── manifest.json       # PWA manifest for installability
├── sw.js              # Service Worker for offline support
├── README.md          # Project overview and documentation
├── TECHNICAL.md       # This file - detailed technical docs
│
├── worker/            # Cloudflare Worker (API proxy)
│   └── index.js       # Serverless function code
│
└── docs/              # Additional documentation
    ├── ARCHITECTURE.md
    ├── API.md
    └── ACCESSIBILITY.md
```

### Application Structure (index.html)

The application is organized into logical sections:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Meta tags for PWA and accessibility -->
    <!-- CSS styles (embedded for single-file deployment) -->
</head>
<body>
    <!-- Loading Screen -->
    <!-- Help Overlay -->
    <!-- Main Application UI -->
    
    <!-- External Scripts -->
    <script src="tensorflow.js"></script>
    <script src="coco-ssd.js"></script>
    
    <!-- Application JavaScript -->
    <script>
        // ══════════════════════════════════════════
        // SECTION 1: CONFIGURATION
        // ══════════════════════════════════════════
        const CONFIG = { ... };
        
        // ══════════════════════════════════════════
        // SECTION 2: STATE MANAGEMENT
        // ══════════════════════════════════════════
        const state = { ... };
        
        // ══════════════════════════════════════════
        // SECTION 3: AUDIO SYSTEM
        // ══════════════════════════════════════════
        function initAudio() { ... }
        function playBeep() { ... }
        function playAlertSound() { ... }
        
        // ══════════════════════════════════════════
        // SECTION 4: HAPTIC FEEDBACK
        // ══════════════════════════════════════════
        function vibrate() { ... }
        function vibrateAlert() { ... }
        
        // ══════════════════════════════════════════
        // SECTION 5: SPEECH SYSTEM
        // ══════════════════════════════════════════
        function speak() { ... }
        function speakAlert() { ... }
        function initSpeechRecognition() { ... }
        function handleVoiceCommand() { ... }
        
        // ══════════════════════════════════════════
        // SECTION 6: AI ANALYSIS
        // ══════════════════════════════════════════
        function analyzeWithAI() { ... }
        function fetchAI() { ... }
        
        // ══════════════════════════════════════════
        // SECTION 7: LOCAL DETECTION
        // ══════════════════════════════════════════
        function detectLocal() { ... }
        
        // ══════════════════════════════════════════
        // SECTION 8: PROTECTION LOOP (CORE)
        // ══════════════════════════════════════════
        function protectionLoop() { ... }
        
        // ══════════════════════════════════════════
        // SECTION 9: USER ACTIONS
        // ══════════════════════════════════════════
        function describeArea() { ... }
        function checkSafety() { ... }
        function speakDirection() { ... }
        
        // ══════════════════════════════════════════
        // SECTION 10: UI MANAGEMENT
        // ══════════════════════════════════════════
        function updateUI() { ... }
        function updateDirections() { ... }
        
        // ══════════════════════════════════════════
        // SECTION 11: GESTURE HANDLING
        // ══════════════════════════════════════════
        function setupGestures() { ... }
        
        // ══════════════════════════════════════════
        // SECTION 12: INITIALIZATION
        // ══════════════════════════════════════════
        async function init() { ... }
    </script>
</body>
</html>
```

---

## Module Documentation

### 1. Configuration Module

```javascript
/**
 * CONFIG - Application Configuration
 * 
 * Centralized configuration object for easy tuning and maintenance.
 * All magic numbers and settings are defined here.
 */
const CONFIG = {
    // Cloudflare Worker endpoint for AI API calls
    WORKER_URL: "https://guidedog.kpremks.workers.dev",
    
    // Distance thresholds (in meters)
    // These define when alerts are triggered
    DANGER_ZONE: 1.0,      // < 1m = immediate danger, must stop
    WARNING_ZONE: 2.0,     // < 2m = caution, slow down
    AWARENESS_ZONE: 4.0,   // < 4m = be aware, object detected
    
    // Timing configuration (in milliseconds)
    AI_SCAN_INTERVAL: 3000,      // How often to run cloud AI scan
    LOCAL_SCAN_INTERVAL: 300,    // How often to run local detection
    VOICE_COOLDOWN: 2000,        // Min time between voice alerts
    VIBRATE_COOLDOWN: 500,       // Min time between vibrations
    
    // Object classification for threat assessment
    CRITICAL: [
        "car", "bus", "truck", 
        "motorcycle", "bicycle", "train"
    ],  // Moving vehicles - highest priority
    
    OBSTACLES: [
        "person", "dog", "chair", "bench", 
        "couch", "bed", "dining table", 
        "toilet", "refrigerator", "potted plant",
        "suitcase", "backpack", "fire hydrant",
        "stop sign", "parking meter"
    ]  // Static obstacles
};
```

### 2. State Management Module

```javascript
/**
 * STATE - Application State Container
 * 
 * Single source of truth for all application state.
 * Uses a centralized state object pattern for predictability.
 */
const state = {
    // Core resources
    video: null,           // HTMLVideoElement reference
    model: null,           // COCO-SSD TensorFlow model
    
    // Application status
    isRunning: false,      // Protection loop active?
    isPaused: false,       // User paused alerts?
    
    // Detection results
    localDetections: [],   // Current frame detections
    aiResult: null,        // Latest AI analysis result
    lastAIScan: 0,         // Timestamp of last AI scan
    
    // Current status
    currentStatus: 'safe', // 'safe' | 'warning' | 'danger'
    currentObstacle: null, // Most threatening detection
    
    // Alert deduplication
    lastAlerts: {},        // Map of alert key -> timestamp
    lastVibrate: 0,        // Last vibration timestamp
    lastVoice: 0,          // Last voice alert timestamp
    
    // Voice recognition
    recognition: null,     // SpeechRecognition instance
    isListening: false,    // Currently listening?
    
    // Audio context
    audioCtx: null         // Web Audio API context
};
```

### 3. Audio System Module

```javascript
/**
 * AUDIO SYSTEM
 * 
 * Provides spatial audio feedback using Web Audio API.
 * Sound direction indicates obstacle location.
 */

/**
 * Initialize Web Audio API context
 * Must be called after user interaction (browser requirement)
 */
function initAudio() {
    try {
        state.audioCtx = new (
            window.AudioContext || 
            window.webkitAudioContext
        )();
    } catch (e) {
        console.warn('Audio not available:', e);
    }
}

/**
 * Resume audio context if suspended
 * Required by browsers that auto-suspend audio
 */
function resumeAudio() {
    if (state.audioCtx?.state === 'suspended') {
        state.audioCtx.resume();
    }
}

/**
 * Play a directional beep sound
 * 
 * @param {number} frequency - Tone frequency in Hz (200-2000)
 * @param {number} duration - Sound duration in seconds
 * @param {number} pan - Stereo position (-1=left, 0=center, 1=right)
 * @param {number} volume - Volume level (0-1)
 */
function playBeep(frequency, duration, pan = 0, volume = 0.5) {
    if (!state.audioCtx) return;
    resumeAudio();
    
    try {
        // Create oscillator (sound source)
        const osc = state.audioCtx.createOscillator();
        osc.frequency.value = frequency;
        osc.type = 'sine';  // Pure tone
        
        // Create gain node (volume control)
        const gain = state.audioCtx.createGain();
        gain.gain.setValueAtTime(volume, state.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.01, 
            state.audioCtx.currentTime + duration
        );
        
        // Create panner (stereo positioning)
        const panner = state.audioCtx.createStereoPanner();
        panner.pan.value = Math.max(-1, Math.min(1, pan));
        
        // Connect nodes: osc -> gain -> panner -> output
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(state.audioCtx.destination);
        
        // Play sound
        osc.start();
        osc.stop(state.audioCtx.currentTime + duration);
    } catch (e) {
        console.error('Audio playback error:', e);
    }
}

/**
 * Play alert sound based on urgency level
 * 
 * @param {string} position - 'left' | 'ahead' | 'right'
 * @param {string} urgency - 'danger' | 'warning' | 'info'
 */
function playAlertSound(position, urgency) {
    // Calculate stereo pan from position
    let pan = 0;
    if (position === 'left') pan = -0.8;
    else if (position === 'right') pan = 0.8;
    
    // Play pattern based on urgency
    if (urgency === 'danger') {
        // Rapid triple beep - high frequency
        playBeep(1200, 0.1, pan, 0.7);
        setTimeout(() => playBeep(1200, 0.1, pan, 0.7), 150);
        setTimeout(() => playBeep(1200, 0.1, pan, 0.7), 300);
    } else if (urgency === 'warning') {
        // Double beep - medium frequency
        playBeep(800, 0.15, pan, 0.5);
        setTimeout(() => playBeep(800, 0.15, pan, 0.5), 200);
    } else {
        // Single soft beep - low frequency
        playBeep(500, 0.2, pan, 0.3);
    }
}
```

### 4. Haptic Feedback Module

```javascript
/**
 * HAPTIC FEEDBACK SYSTEM
 * 
 * Provides vibration patterns for obstacle alerts.
 * Different patterns indicate different threat levels.
 */

/**
 * Trigger vibration with rate limiting
 * 
 * @param {number|number[]} pattern - Vibration pattern
 *   Single number: vibrate for N milliseconds
 *   Array: alternating vibrate/pause durations
 *   Example: [200, 100, 200] = vibrate 200ms, pause 100ms, vibrate 200ms
 */
function vibrate(pattern) {
    // Rate limiting to prevent vibration spam
    const now = Date.now();
    if (now - state.lastVibrate < CONFIG.VIBRATE_COOLDOWN) return;
    state.lastVibrate = now;
    
    // Attempt vibration (not supported on all devices)
    try {
        navigator.vibrate?.(pattern);
    } catch (e) {
        // Silently fail - vibration is enhancement, not critical
    }
}

/**
 * Play predefined vibration pattern for alert level
 * 
 * @param {string} urgency - 'danger' | 'warning' | 'info'
 */
function vibrateAlert(urgency) {
    const patterns = {
        // Strong, rapid pulses for immediate danger
        danger: [200, 100, 200, 100, 200],
        
        // Medium double pulse for warning
        warning: [150, 100, 150],
        
        // Light single pulse for confirmation
        info: [100]
    };
    
    vibrate(patterns[urgency] || patterns.info);
}
```

### 5. Speech System Module

```javascript
/**
 * SPEECH SYSTEM
 * 
 * Handles both speech output (text-to-speech) and
 * speech input (voice recognition).
 */

/**
 * Speak text using Web Speech API
 * 
 * @param {string} text - Text to speak
 * @param {boolean} force - Bypass cooldown if true
 */
function speak(text, force = false) {
    if (!text) return;
    
    // Rate limiting (unless forced)
    const now = Date.now();
    if (!force && now - state.lastVoice < CONFIG.VOICE_COOLDOWN) return;
    
    // Stop listening while speaking (prevent feedback)
    if (state.isListening) stopListening();
    
    try {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;    // Normal speed
        utterance.volume = 1.0;  // Full volume
        
        // Speak
        speechSynthesis.speak(utterance);
        state.lastVoice = now;
        
        console.log('🔊 Speaking:', text);
    } catch (e) {
        console.error('Speech synthesis error:', e);
    }
}

/**
 * Speak alert with deduplication
 * Prevents repeating the same alert too frequently
 * 
 * @param {string} key - Unique identifier for this alert type
 * @param {string} text - Alert text to speak
 */
function speakAlert(key, text) {
    const now = Date.now();
    const lastTime = state.lastAlerts[key] || 0;
    
    // Don't repeat same alert within 4 seconds
    if (now - lastTime < 4000) return;
    
    state.lastAlerts[key] = now;
    speak(text, true);  // Force speak (bypass cooldown)
}

/**
 * Initialize speech recognition
 * 
 * @returns {boolean} True if successfully initialized
 */
function initSpeechRecognition() {
    try {
        // Get browser-specific SpeechRecognition
        const SpeechRecognition = 
            window.SpeechRecognition || 
            window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.log('Speech recognition not supported');
            return false;
        }
        
        // Create and configure recognition instance
        state.recognition = new SpeechRecognition();
        state.recognition.continuous = false;      // Stop after result
        state.recognition.interimResults = false;  // Final results only
        state.recognition.lang = 'en-US';
        
        // Event handlers
        state.recognition.onstart = () => {
            state.isListening = true;
            updateMicButton(true);
        };
        
        state.recognition.onresult = (event) => {
            const text = event.results[0][0].transcript.toLowerCase();
            console.log('🎤 Heard:', text);
            handleVoiceCommand(text);
        };
        
        state.recognition.onend = () => {
            state.isListening = false;
            updateMicButton(false);
        };
        
        state.recognition.onerror = (event) => {
            state.isListening = false;
            updateMicButton(false);
            
            if (event.error === 'no-speech') {
                speak('No speech heard. Tap microphone and try again.');
            }
        };
        
        return true;
    } catch (e) {
        console.error('Speech recognition init error:', e);
        return false;
    }
}

/**
 * Process voice command
 * Maps spoken phrases to application actions
 * 
 * @param {string} text - Recognized speech text (lowercase)
 */
function handleVoiceCommand(text) {
    vibrate([30]);  // Acknowledge command
    
    // Command matching (ordered by priority)
    
    // Start (from help screen)
    if (text.includes('start') || text.includes('begin')) {
        if (document.getElementById('help').classList.contains('visible')) {
            hideHelp();
            return;
        }
    }
    
    // Pause/Resume
    if (text.includes('stop') || text.includes('pause')) {
        state.isPaused = true;
        speak('Alerts paused. Say resume to continue.', true);
        return;
    }
    
    if (text.includes('resume') || text.includes('continue')) {
        state.isPaused = false;
        speak('Alerts resumed.', true);
        return;
    }
    
    // Description commands
    if (text.includes('around') || text.includes('describe')) {
        describeArea();
        return;
    }
    
    // Safety check
    if (text.includes('safe') || text.includes('clear')) {
        checkSafety();
        return;
    }
    
    // Direction queries
    if (text.includes('left')) {
        speakDirection('left');
        return;
    }
    
    if (text.includes('right')) {
        speakDirection('right');
        return;
    }
    
    // AI scan
    if (text.includes('scan') || text.includes('stair')) {
        triggerAIScan();
        return;
    }
    
    // Help
    if (text.includes('help')) {
        showHelp();
        return;
    }
    
    // Unknown command
    speak('Say: what is around, is it safe, left, right, or scan.', true);
}
```

### 6. AI Analysis Module

```javascript
/**
 * AI ANALYSIS MODULE
 * 
 * Handles communication with cloud AI services (GPT-4o, Claude)
 * for advanced scene understanding.
 */

/**
 * Analyze current frame with cloud AI
 * Uses race pattern to get fastest response
 * 
 * @returns {Promise<string|null>} AI analysis text or null
 */
async function analyzeWithAI() {
    try {
        // Capture current frame to canvas
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(state.video, 0, 0, 640, 480);
        
        // Convert to base64 JPEG
        const imageData = canvas
            .toDataURL('image/jpeg', 0.7)
            .split(',')[1];
        
        // Race both AI providers
        const results = await Promise.allSettled([
            fetchAI(imageData, 'openai'),
            fetchAI(imageData, 'anthropic')
        ]);
        
        // Return first successful result
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value) {
                return result.value;
            }
        }
        
        return null;  // Both failed
    } catch (e) {
        console.error('AI analysis error:', e);
        return null;
    }
}

/**
 * Call AI provider via Cloudflare Worker
 * 
 * @param {string} imageData - Base64 encoded JPEG
 * @param {string} provider - 'openai' | 'anthropic'
 * @returns {Promise<string|null>} Analysis text or null
 */
async function fetchAI(imageData, provider) {
    try {
        const response = await fetch(CONFIG.WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                image: imageData, 
                provider: provider 
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.result || null;
    } catch (e) {
        console.error(`AI ${provider} error:`, e);
        return null;
    }
}
```

### 7. Local Detection Module

```javascript
/**
 * LOCAL DETECTION MODULE
 * 
 * Uses TensorFlow.js COCO-SSD model for real-time
 * object detection on-device.
 */

/**
 * Detect objects in current video frame
 * 
 * @returns {Promise<Array>} Array of detection objects
 */
async function detectLocal() {
    // Check prerequisites
    if (!state.model || !state.video) return [];
    
    try {
        // Run inference
        const predictions = await state.model.detect(state.video);
        
        // Process predictions
        return predictions.map(p => {
            // Calculate center point of bounding box
            const cx = (p.bbox[0] + p.bbox[2] / 2) / state.video.videoWidth;
            const cy = (p.bbox[1] + p.bbox[3] / 2) / state.video.videoHeight;
            
            // Calculate relative size
            const size = Math.max(p.bbox[2], p.bbox[3]) / 
                        Math.max(state.video.videoWidth, state.video.videoHeight);
            
            // Determine position (left/ahead/right)
            let position = 'ahead';
            if (cx < 0.35) position = 'left';
            else if (cx > 0.65) position = 'right';
            
            // Estimate distance from size
            const distance = estimateDistance(size);
            
            // Check if in walking path
            const inPath = cx > 0.25 && cx < 0.75 && cy > 0.3;
            
            // Classify danger level
            let danger = 'low';
            if (CONFIG.CRITICAL.includes(p.class)) danger = 'critical';
            else if (CONFIG.OBSTACLES.includes(p.class)) danger = 'obstacle';
            
            return {
                name: p.class,
                position: position,
                distance: distance,
                inPath: inPath,
                danger: danger,
                confidence: p.score
            };
        }).filter(d => d.confidence > 0.4);  // Filter low confidence
        
    } catch (e) {
        console.error('Detection error:', e);
        return [];
    }
}

/**
 * Estimate real-world distance from object size
 * 
 * @param {number} relativeSize - Object size relative to frame (0-1)
 * @returns {number} Estimated distance in meters
 */
function estimateDistance(relativeSize) {
    // Size-to-distance mapping (empirically calibrated)
    if (relativeSize > 0.60) return 0.5;
    if (relativeSize > 0.45) return 1.0;
    if (relativeSize > 0.30) return 1.5;
    if (relativeSize > 0.20) return 2.0;
    if (relativeSize > 0.10) return 3.0;
    if (relativeSize > 0.05) return 4.0;
    return 5.0;
}
```

### 8. Protection Loop Module (Core)

```javascript
/**
 * PROTECTION LOOP - Core Safety Algorithm
 * 
 * This is the heart of BlindGuide AI.
 * Continuously scans for obstacles and generates alerts.
 */

/**
 * Main protection loop
 * Runs continuously while app is active
 */
async function protectionLoop() {
    // Check if should run
    if (!state.isRunning) {
        setTimeout(protectionLoop, 500);
        return;
    }
    
    // ═══════════════════════════════════════════
    // PHASE 1: LOCAL DETECTION
    // ═══════════════════════════════════════════
    
    state.localDetections = await detectLocal();
    
    // ═══════════════════════════════════════════
    // PHASE 2: THREAT ASSESSMENT
    // ═══════════════════════════════════════════
    
    let mostDangerous = null;
    let threatLevel = 'safe';
    
    for (const detection of state.localDetections) {
        // Only consider obstacles in walking path
        if (!detection.inPath) continue;
        
        // Assess threat level based on distance
        if (detection.distance < CONFIG.DANGER_ZONE) {
            threatLevel = 'danger';
            mostDangerous = detection;
            break;  // Immediate threat found
        } else if (detection.distance < CONFIG.WARNING_ZONE) {
            if (threatLevel !== 'danger') {
                threatLevel = 'warning';
                mostDangerous = detection;
            }
        }
    }
    
    // ═══════════════════════════════════════════
    // PHASE 3: AI SCAN (Periodic)
    // ═══════════════════════════════════════════
    
    const now = Date.now();
    if (now - state.lastAIScan > CONFIG.AI_SCAN_INTERVAL) {
        state.lastAIScan = now;
        
        // Non-blocking AI analysis
        analyzeWithAI().then(result => {
            if (!result) return;
            
            state.aiResult = result;
            const lower = result.toLowerCase();
            
            // Check for hazards AI can detect
            if (lower.includes('stair') || lower.includes('step')) {
                speakAlert('stairs', 'Warning! Stairs ahead!');
                vibrateAlert('danger');
                playAlertSound('ahead', 'danger');
            } else if (lower.includes('door')) {
                speakAlert('door', 'Door ahead');
            } else if (lower.includes('wet') || lower.includes('slippery')) {
                speakAlert('wet', 'Caution, wet floor');
                vibrateAlert('warning');
            }
        });
    }
    
    // ═══════════════════════════════════════════
    // PHASE 4: ALERT GENERATION
    // ═══════════════════════════════════════════
    
    if (!state.isPaused) {
        if (threatLevel === 'danger' && mostDangerous) {
            // IMMEDIATE DANGER
            const escape = mostDangerous.position === 'left' ? 'right' :
                          mostDangerous.position === 'right' ? 'left' : 'back';
            
            updateUI('danger', mostDangerous);
            playAlertSound(mostDangerous.position, 'danger');
            vibrateAlert('danger');
            speakAlert(
                `danger_${mostDangerous.name}`,
                `Stop! ${mostDangerous.name}! Go ${escape}!`
            );
            
        } else if (threatLevel === 'warning' && mostDangerous) {
            // WARNING
            updateUI('warning', mostDangerous);
            playAlertSound(mostDangerous.position, 'warning');
            vibrateAlert('warning');
            speakAlert(
                `warning_${mostDangerous.name}`,
                `Caution, ${mostDangerous.name} ${mostDangerous.position}`
            );
            
        } else {
            // ALL CLEAR
            updateUI('safe', null);
        }
    }
    
    // Update state
    state.currentStatus = threatLevel;
    state.currentObstacle = mostDangerous;
    
    // ═══════════════════════════════════════════
    // PHASE 5: SCHEDULE NEXT ITERATION
    // ═══════════════════════════════════════════
    
    setTimeout(protectionLoop, CONFIG.LOCAL_SCAN_INTERVAL);
}
```

---

## API Reference

### Cloudflare Worker API

**Endpoint:** `POST https://guidedog.kpremks.workers.dev`

**Request:**
```json
{
    "image": "<base64-encoded-jpeg>",
    "provider": "openai" | "anthropic"
}
```

**Response:**
```json
{
    "result": "Stairs going down ahead, 5 steps. Handrail on right."
}
```

**Error Response:**
```json
{
    "error": "Error message"
}
```

### Worker Implementation

```javascript
// Cloudflare Worker Code

export default {
    async fetch(request, env) {
        // CORS headers for browser access
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Validate method
        if (request.method !== 'POST') {
            return new Response(
                JSON.stringify({ error: 'POST only' }), 
                { status: 405, headers: corsHeaders }
            );
        }

        try {
            const { image, provider } = await request.json();
            
            // Safety-focused prompt
            const prompt = `You help a blind person navigate safely. 
                In 1-2 SHORT sentences, describe ONLY critical safety info: 
                stairs, steps, doors, wet floors, obstacles. 
                If clear, say "Path clear".`;

            let result;
            
            if (provider === 'anthropic' && env.ANTHROPIC_API_KEY) {
                // Call Anthropic Claude
                result = await callAnthropic(env.ANTHROPIC_API_KEY, image, prompt);
            } else if (env.OPENAI_API_KEY) {
                // Call OpenAI GPT-4o
                result = await callOpenAI(env.OPENAI_API_KEY, image, prompt);
            }
            
            return new Response(
                JSON.stringify({ result }), 
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
            
        } catch (error) {
            return new Response(
                JSON.stringify({ error: error.message }), 
                { status: 500, headers: corsHeaders }
            );
        }
    }
};
```

---

## Configuration Guide

### Adjusting Sensitivity

```javascript
// In CONFIG object:

// Make alerts trigger earlier (more sensitive)
DANGER_ZONE: 1.5,   // Was 1.0
WARNING_ZONE: 3.0,  // Was 2.0

// Make alerts trigger later (less sensitive)
DANGER_ZONE: 0.7,   // Was 1.0
WARNING_ZONE: 1.5,  // Was 2.0
```

### Adjusting Alert Frequency

```javascript
// Faster AI scans (better detection, more API calls)
AI_SCAN_INTERVAL: 2000,  // Was 3000

// Slower local scans (less CPU, slower response)
LOCAL_SCAN_INTERVAL: 500,  // Was 300

// More frequent voice alerts
VOICE_COOLDOWN: 1000,  // Was 2000
```

### Adding Custom Objects

```javascript
// Add objects to critical list
CRITICAL: [
    ...existing,
    "skateboard",  // Add skateboards as critical
    "scooter"
],

// Add objects to obstacle list
OBSTACLES: [
    ...existing,
    "luggage",
    "shopping cart"
]
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No voice output | Browser blocked | User must interact first |
| No vibration | Device unsupported | Normal - audio still works |
| AI scan fails | Network/API error | Check worker logs |
| Slow detection | Old device | Reduce frame rate |
| Camera denied | Permission | Must allow camera access |

### Debug Mode

Add to browser console:
```javascript
// Enable verbose logging
localStorage.setItem('debug', 'true');

// View current state
console.log(state);

// View detections
console.log(state.localDetections);

// Test audio
playBeep(800, 0.5, 0, 0.5);

// Test vibration
vibrate([200, 100, 200]);

// Test speech
speak('Test message', true);
```

### Performance Optimization

```javascript
// For older devices, reduce scan frequency
CONFIG.LOCAL_SCAN_INTERVAL = 500;  // 500ms instead of 300ms

// Reduce AI scan frequency
CONFIG.AI_SCAN_INTERVAL = 5000;  // 5 seconds instead of 3

// Lower video resolution
navigator.mediaDevices.getUserMedia({
    video: { 
        width: { ideal: 320 },   // Lower resolution
        height: { ideal: 240 } 
    }
});
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Basic detection |
| 2.0 | +1 week | Added AI analysis |
| 3.0 | +2 weeks | Voice commands |
| 4.0 | +3 weeks | Dual AI providers |
| 5.0 | +4 weeks | Improved voice recognition |
| 6.0 | +5 weeks | **Automatic protection loop** |

---

*Documentation last updated: January 2025*
