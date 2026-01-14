# Software Requirements Specification (SRS)

## BlindGuide AI - Real-Time Navigation Assistant for the Visually Impaired

**Document Version:** 1.0  
**Date:** January 2025  
**Project:** BlindGuide AI  
**Classification:** TSA Software Development Competition

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Interface Requirements](#5-interface-requirements)
6. [System Requirements](#6-system-requirements)
7. [Appendices](#7-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of all requirements for the BlindGuide AI application. It is intended for:

- Development team members
- TSA competition evaluators
- Quality assurance testers
- Future maintainers

### 1.2 Scope

BlindGuide AI is a Progressive Web Application (PWA) that provides real-time obstacle detection and navigation assistance for visually impaired individuals. The system:

- Detects obstacles using on-device machine learning
- Analyzes scenes using cloud-based AI (GPT-4o, Claude)
- Provides multi-modal alerts (voice, sound, vibration)
- Operates on standard smartphones without additional hardware

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| **PWA** | Progressive Web Application - web app with native-like capabilities |
| **COCO-SSD** | Common Objects in Context - Single Shot Detector ML model |
| **TTS** | Text-to-Speech synthesis |
| **STT** | Speech-to-Text recognition |
| **API** | Application Programming Interface |
| **WCAG** | Web Content Accessibility Guidelines |
| **FOV** | Field of View |
| **ML** | Machine Learning |

### 1.4 References

| Document | Source |
|----------|--------|
| WCAG 2.1 Guidelines | W3C |
| TensorFlow.js Documentation | Google |
| Web Audio API Specification | W3C |
| Web Speech API | MDN Web Docs |
| OpenAI API Documentation | OpenAI |
| Anthropic API Documentation | Anthropic |

---

## 2. Overall Description

### 2.1 Product Perspective

BlindGuide AI operates within the following ecosystem:

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ENVIRONMENT                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    SMARTPHONE                              │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │  │
│  │  │ Camera  │  │ Speaker │  │Vibration│  │   Mic   │      │  │
│  │  └────┬────┘  └────▲────┘  └────▲────┘  └────┬────┘      │  │
│  │       │            │            │            │            │  │
│  │       ▼            │            │            ▼            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              BLINDGUIDE AI (PWA)                    │  │  │
│  │  │                                                     │  │  │
│  │  │  • Local ML Detection (TensorFlow.js)              │  │  │
│  │  │  • Cloud AI Analysis (via Cloudflare Worker)       │  │  │
│  │  │  • Multi-modal Alert System                        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    CLOUD SERVICES                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │  Cloudflare  │  │   OpenAI     │  │  Anthropic   │     │  │
│  │  │   Worker     │──│   GPT-4o     │  │   Claude     │     │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Product Functions

The system provides the following major functions:

| Function | Description |
|----------|-------------|
| **F1** | Continuous obstacle detection |
| **F2** | Automatic danger alerts |
| **F3** | Cloud AI scene analysis |
| **F4** | Voice command interface |
| **F5** | Spatial audio feedback |
| **F6** | Haptic feedback patterns |
| **F7** | Manual scene description |
| **F8** | Safety path checking |

### 2.3 User Classes and Characteristics

| User Class | Characteristics | Usage Pattern |
|------------|-----------------|---------------|
| **Primary: Blind Users** | No vision, relies on audio/haptic | Continuous use while walking |
| **Secondary: Low Vision Users** | Partial vision, needs enhancement | Supplementary navigation aid |
| **Tertiary: Caregivers** | Sighted, assists blind users | Setup and configuration |

### 2.4 Operating Environment

| Component | Requirement |
|-----------|-------------|
| **Platform** | Web browser (Chrome, Safari, Firefox, Edge) |
| **Device** | Smartphone with rear camera |
| **OS** | iOS 14+, Android 8+, or desktop browser |
| **Network** | Required for AI features; local detection works offline |

### 2.5 Design and Implementation Constraints

| Constraint | Rationale |
|------------|-----------|
| **Single-file PWA** | Simplified deployment, offline capability |
| **No native code** | Cross-platform compatibility |
| **Client-side ML** | Privacy, reduced latency |
| **API key security** | Keys stored server-side only |

### 2.6 Assumptions and Dependencies

**Assumptions:**
- User grants camera and microphone permissions
- Device has functional vibration motor
- User has basic smartphone familiarity

**Dependencies:**
- TensorFlow.js library availability
- OpenAI/Anthropic API availability
- Cloudflare Worker uptime

---

## 3. Functional Requirements

### 3.1 Obstacle Detection System

#### REQ-F001: Local Object Detection
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F001 |
| **Priority** | Critical |
| **Description** | System shall detect common obstacles using on-device ML |
| **Input** | Camera video stream |
| **Output** | List of detected objects with positions and sizes |
| **Processing** | TensorFlow.js COCO-SSD model inference |

**Acceptance Criteria:**
- [ ] Detects 80 COCO object classes
- [ ] Inference completes within 200ms
- [ ] Confidence threshold ≥ 40%
- [ ] Works without network connection

#### REQ-F002: Distance Estimation
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F002 |
| **Priority** | Critical |
| **Description** | System shall estimate distance to detected objects |
| **Input** | Object bounding box dimensions |
| **Output** | Estimated distance in meters |
| **Algorithm** | Size-to-distance mapping (see Algorithm A1) |

**Acceptance Criteria:**
- [ ] Accuracy within ±0.5m for distances < 3m
- [ ] Distinguishes danger (<1m), warning (<2m), awareness (<4m) zones

#### REQ-F003: Path Analysis
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F003 |
| **Priority** | Critical |
| **Description** | System shall determine if obstacles are in walking path |
| **Input** | Object position (x, y coordinates) |
| **Output** | Boolean: in_path (true/false) |
| **Logic** | Object is in path if 0.25 < center_x < 0.75 AND center_y > 0.3 |

**Acceptance Criteria:**
- [ ] Correctly identifies obstacles in center 50% of frame
- [ ] Ignores objects in upper 30% of frame (above head level)

---

### 3.2 AI Scene Analysis System

#### REQ-F004: Cloud AI Integration
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F004 |
| **Priority** | High |
| **Description** | System shall analyze scenes using cloud vision AI |
| **Input** | JPEG image (640x480, quality 70%) |
| **Output** | Natural language scene description |
| **Providers** | OpenAI GPT-4o, Anthropic Claude |

**Acceptance Criteria:**
- [ ] Successfully calls both AI providers
- [ ] Returns response within 3 seconds
- [ ] Handles provider failures gracefully

#### REQ-F005: AI Race Pattern
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F005 |
| **Priority** | Medium |
| **Description** | System shall race both AI providers and use fastest response |
| **Implementation** | Promise.allSettled() with both providers |
| **Behavior** | Return first successful response |

**Acceptance Criteria:**
- [ ] Calls both providers simultaneously
- [ ] Uses first valid response
- [ ] Falls back gracefully if both fail

#### REQ-F006: Hazard Detection
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F006 |
| **Priority** | Critical |
| **Description** | AI shall detect hazards invisible to local model |
| **Target Hazards** | Stairs, steps, doors, wet floors, walls, curbs |
| **Output** | Specific hazard warning |

**Acceptance Criteria:**
- [ ] Detects stairs (up and down)
- [ ] Identifies doors (open/closed)
- [ ] Recognizes wet floor signs
- [ ] Identifies blocked paths/walls

---

### 3.3 Alert System

#### REQ-F007: Voice Alerts
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F007 |
| **Priority** | Critical |
| **Description** | System shall provide spoken alerts for obstacles |
| **Technology** | Web Speech API (SpeechSynthesis) |
| **Language** | English (US) |

**Alert Templates:**
| Threat Level | Template |
|--------------|----------|
| Danger | "Stop! {object}! Go {escape_direction}!" |
| Warning | "Caution, {object} {position}" |
| Stairs | "Warning! Stairs ahead!" |
| Door | "Door ahead" |

**Acceptance Criteria:**
- [ ] Voice output is clear and understandable
- [ ] Rate limiting prevents alert spam (2s cooldown)
- [ ] Deduplication prevents repeating same alert (4s)

#### REQ-F008: Spatial Audio Alerts
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F008 |
| **Priority** | High |
| **Description** | System shall provide directional audio cues |
| **Technology** | Web Audio API (StereoPanner) |
| **Pan Values** | Left: -0.8, Center: 0, Right: +0.8 |

**Sound Patterns:**
| Urgency | Frequency | Pattern |
|---------|-----------|---------|
| Danger | 1200 Hz | Triple rapid beep |
| Warning | 800 Hz | Double beep |
| Info | 500 Hz | Single soft beep |

**Acceptance Criteria:**
- [ ] Sound direction indicates obstacle location
- [ ] Frequency indicates urgency level
- [ ] Volume is appropriate (not startling)

#### REQ-F009: Haptic Alerts
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F009 |
| **Priority** | High |
| **Description** | System shall provide vibration feedback |
| **Technology** | Vibration API |

**Vibration Patterns (ms):**
| Urgency | Pattern |
|---------|---------|
| Danger | [200, 100, 200, 100, 200] |
| Warning | [150, 100, 150] |
| Confirm | [50, 30, 50] |
| Info | [30] |

**Acceptance Criteria:**
- [ ] Patterns are distinguishable by feel
- [ ] Rate limiting prevents vibration spam (500ms cooldown)
- [ ] Graceful degradation on unsupported devices

---

### 3.4 Protection Loop

#### REQ-F010: Continuous Monitoring
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F010 |
| **Priority** | Critical |
| **Description** | System shall continuously monitor for obstacles |
| **Local Scan Interval** | 300ms |
| **AI Scan Interval** | 3000ms |

**Acceptance Criteria:**
- [ ] Local detection runs every 300ms (±50ms)
- [ ] AI analysis runs every 3 seconds
- [ ] Loop continues while app is active
- [ ] Loop pauses when app is backgrounded

#### REQ-F011: Threat Assessment
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F011 |
| **Priority** | Critical |
| **Description** | System shall assess threat level of detected obstacles |

**Threat Classification:**
| Distance | Level | Response |
|----------|-------|----------|
| < 1.0m | DANGER | Immediate stop alert |
| < 2.0m | WARNING | Caution alert |
| < 4.0m | AWARENESS | Soft audio cue |
| ≥ 4.0m | SAFE | No alert |

**Object Priority:**
| Priority | Objects |
|----------|---------|
| Critical | car, bus, truck, motorcycle, bicycle, train |
| Obstacle | person, dog, chair, bench, furniture |
| Low | Other detected objects |

---

### 3.5 Voice Command System

#### REQ-F012: Speech Recognition
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F012 |
| **Priority** | High |
| **Description** | System shall recognize voice commands |
| **Technology** | Web Speech API (SpeechRecognition) |
| **Activation** | Push-to-talk (microphone button) |

**Supported Commands:**
| Command Phrase | Action |
|----------------|--------|
| "What's around" / "Describe" | Trigger scene description |
| "Is it safe" / "Safe to walk" | Check path safety |
| "Left" | Describe left side |
| "Right" | Describe right side |
| "Scan" / "Stairs" | Trigger AI analysis |
| "Stop" / "Pause" | Pause alerts |
| "Resume" / "Continue" | Resume alerts |
| "Help" | Show help guide |
| "Start" | Begin navigation (from help) |

**Acceptance Criteria:**
- [ ] Recognition accuracy > 90% in quiet environment
- [ ] Commands processed within 500ms
- [ ] Unknown commands receive helpful feedback

---

### 3.6 User Interface

#### REQ-F013: Touch Zones
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F013 |
| **Priority** | High |
| **Description** | Screen shall be divided into large touch zones |

**Zone Layout:**
| Zone | Screen Area | Action |
|------|-------------|--------|
| Top | 0-35% | Describe area |
| Middle | 35-65% | Status display |
| Bottom | 65-100% | AI scan |

**Acceptance Criteria:**
- [ ] Zones are large enough for imprecise tapping
- [ ] Each tap provides haptic confirmation
- [ ] Visual feedback for sighted helpers

#### REQ-F014: Gesture Support
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-F014 |
| **Priority** | Medium |
| **Description** | System shall support gesture controls |

**Gestures:**
| Gesture | Action |
|---------|--------|
| Swipe Left | Check left side |
| Swipe Right | Check right side |
| Double Tap | AI scan |
| Long Press (2s) | Show help |

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### REQ-NF001: Detection Latency
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF001 |
| **Requirement** | Local detection shall complete within 300ms |
| **Measurement** | Time from frame capture to detection result |
| **Target** | 95th percentile < 300ms |

#### REQ-NF002: AI Response Time
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF002 |
| **Requirement** | AI analysis shall complete within 3 seconds |
| **Measurement** | Time from request to response |
| **Target** | 95th percentile < 3000ms |

#### REQ-NF003: Memory Usage
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF003 |
| **Requirement** | Application shall use < 200MB RAM |
| **Measurement** | Browser memory profiler |
| **Target** | Stable under 200MB during operation |

#### REQ-NF004: Battery Consumption
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF004 |
| **Requirement** | Battery drain shall be < 30% per hour |
| **Measurement** | Device battery monitor |
| **Target** | < 25% per hour typical use |

### 4.2 Reliability Requirements

#### REQ-NF005: Availability
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF005 |
| **Requirement** | Core functions shall be available offline |
| **Offline Functions** | Local detection, voice alerts, haptic feedback |
| **Online Functions** | AI analysis |

#### REQ-NF006: Error Handling
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF006 |
| **Requirement** | System shall handle errors gracefully |
| **Behavior** | No crashes; fallback to available features |

### 4.3 Accessibility Requirements

#### REQ-NF007: WCAG Compliance
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF007 |
| **Requirement** | Application shall meet WCAG 2.1 AA standards |
| **Key Requirements** | Voice-first, no visual dependency, large touch targets |

#### REQ-NF008: Screen Reader Compatibility
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF008 |
| **Requirement** | UI shall work with screen readers |
| **Testing** | VoiceOver (iOS), TalkBack (Android) |

### 4.4 Security Requirements

#### REQ-NF009: API Key Protection
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF009 |
| **Requirement** | API keys shall never be exposed to client |
| **Implementation** | Keys stored as Cloudflare Worker secrets |

#### REQ-NF010: Data Privacy
| Attribute | Value |
|-----------|-------|
| **ID** | REQ-NF010 |
| **Requirement** | Camera frames shall not be stored or logged |
| **Implementation** | Frames processed in memory only |

---

## 5. Interface Requirements

### 5.1 User Interfaces

#### 5.1.1 Main Screen
```
┌────────────────────────────────────┐
│ [✓ SAFE]              [🤖 AI: Both]│  Status Bar
├────────────────────────────────────┤
│                                    │
│         ┌──────────────┐           │
│         │      ✓       │           │  Alert Box
│         │  Path Clear  │           │
│         │  Safe to walk│           │
│         └──────────────┘           │
│                                    │
│        ← (○)  ↑ (○)  → (○)         │  Direction Indicators
│                                    │
├────────────────────────────────────┤
│ [👁 Describe] [🎤 Speak] [🔍 Scan] │  Control Bar
└────────────────────────────────────┘
```

#### 5.1.2 Danger State
```
┌────────────────────────────────────┐
│ [⚠ DANGER]            [🤖 AI: Both]│
├────────────────────────────────────┤
│                                    │
│         ┌──────────────┐           │
│         │      ⚠️      │           │  SHAKING
│         │ STOP! CHAIR! │           │  ANIMATION
│         │ Go right!    │           │
│         └──────────────┘           │
│                                    │
│        ← (🔴) ↑ (○)  → (○)         │  Left indicator RED
│                                    │
├────────────────────────────────────┤
│ [👁 Describe] [🎤 Speak] [🔍 Scan] │
└────────────────────────────────────┘
```

### 5.2 Hardware Interfaces

| Hardware | Interface | Usage |
|----------|-----------|-------|
| Camera | MediaDevices API | Capture video stream |
| Speaker | Web Audio API | Spatial audio output |
| Microphone | MediaDevices API | Voice input |
| Vibration | Vibration API | Haptic feedback |

### 5.3 Software Interfaces

| System | Interface | Purpose |
|--------|-----------|---------|
| TensorFlow.js | JavaScript API | ML inference |
| OpenAI | REST API | Vision analysis |
| Anthropic | REST API | Vision analysis |
| Cloudflare | Workers API | API proxy |

### 5.4 Communication Interfaces

| Protocol | Usage |
|----------|-------|
| HTTPS | All API communications |
| WebSocket | Not used |
| WebRTC | Not used |

---

## 6. System Requirements

### 6.1 Minimum Device Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **CPU** | Quad-core 1.5GHz | Octa-core 2.0GHz |
| **RAM** | 2 GB | 4 GB |
| **Camera** | 5 MP rear | 12 MP rear |
| **OS** | iOS 14 / Android 8 | iOS 16 / Android 12 |
| **Browser** | Chrome 90 / Safari 14 | Latest version |

### 6.2 Network Requirements

| Condition | Capability |
|-----------|------------|
| **Online** | Full functionality |
| **Offline** | Local detection, voice alerts, haptic feedback |
| **Slow Network** | Local detection prioritized; AI timeout at 5s |

### 6.3 Browser Feature Requirements

| Feature | Required | Fallback |
|---------|----------|----------|
| WebGL | Yes | WASM (slower) |
| Web Audio | Yes | Voice-only alerts |
| Web Speech | Yes | Touch-only interface |
| Vibration | No | Audio-only feedback |
| Service Worker | No | Online-only mode |

---

## 7. Appendices

### Appendix A: Algorithms

#### A1: Distance Estimation Algorithm

```
ALGORITHM: EstimateDistance
INPUT: relativeSize (float, 0-1) - object size relative to frame
OUTPUT: distance (float) - estimated distance in meters

BEGIN
    IF relativeSize > 0.60 THEN RETURN 0.5
    IF relativeSize > 0.45 THEN RETURN 1.0
    IF relativeSize > 0.30 THEN RETURN 1.5
    IF relativeSize > 0.20 THEN RETURN 2.0
    IF relativeSize > 0.10 THEN RETURN 3.0
    IF relativeSize > 0.05 THEN RETURN 4.0
    RETURN 5.0
END
```

#### A2: Threat Assessment Algorithm

```
ALGORITHM: AssessThreat
INPUT: detections (array) - list of detected objects
OUTPUT: threatLevel (enum), mostDangerous (object)

BEGIN
    mostDangerous = NULL
    threatLevel = SAFE
    
    FOR EACH detection IN detections DO
        IF NOT detection.inPath THEN CONTINUE
        
        IF detection.distance < DANGER_ZONE (1.0m) THEN
            threatLevel = DANGER
            mostDangerous = detection
            BREAK  // Immediate threat, stop searching
            
        ELSE IF detection.distance < WARNING_ZONE (2.0m) THEN
            IF threatLevel != DANGER THEN
                threatLevel = WARNING
                mostDangerous = detection
            END IF
        END IF
    END FOR
    
    RETURN (threatLevel, mostDangerous)
END
```

### Appendix B: Data Dictionary

| Field | Type | Description | Valid Values |
|-------|------|-------------|--------------|
| `detection.name` | string | Object class name | COCO class names |
| `detection.position` | enum | Relative position | 'left', 'ahead', 'right' |
| `detection.distance` | float | Estimated distance | 0.5 - 5.0 meters |
| `detection.inPath` | boolean | In walking path | true, false |
| `detection.danger` | enum | Danger classification | 'critical', 'obstacle', 'low' |
| `detection.confidence` | float | Detection confidence | 0.0 - 1.0 |
| `state.currentStatus` | enum | Current threat level | 'safe', 'warning', 'danger' |
| `state.isPaused` | boolean | Alerts paused | true, false |

### Appendix C: Traceability Matrix

| Requirement | Implementation | Test Case |
|-------------|----------------|-----------|
| REQ-F001 | detectLocal() | TC-001, TC-002 |
| REQ-F002 | estimateDistance() | TC-003, TC-004 |
| REQ-F003 | detection.inPath | TC-005 |
| REQ-F004 | analyzeWithAI() | TC-006, TC-007 |
| REQ-F005 | Promise.allSettled() | TC-008 |
| REQ-F006 | AI prompt engineering | TC-009, TC-010 |
| REQ-F007 | speak(), speakAlert() | TC-011, TC-012 |
| REQ-F008 | playAlertSound() | TC-013 |
| REQ-F009 | vibrate(), vibrateAlert() | TC-014 |
| REQ-F010 | protectionLoop() | TC-015, TC-016 |
| REQ-F011 | Threat assessment logic | TC-017, TC-018 |
| REQ-F012 | handleVoiceCommand() | TC-019-TC-028 |

---

**Document Control:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2025 | Development Team | Initial release |

---

*End of Software Requirements Specification*
