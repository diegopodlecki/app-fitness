# Maestro E2E Testing Setup

## 📋 Overview

Maestro is configured for E2E testing but **requires a native build** to run. It will NOT work with Expo Go.

## 🚀 Quick Start

### 1. Install Maestro CLI

**Windows (PowerShell):**
```powershell
iwr "https://get.maestro.mobile.dev" -OutFile maestro.ps1
.\maestro.ps1
```

**macOS/Linux:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### 2. Verify Installation

```bash
maestro --version
```

### 3. Create Native Build

**Android:**
```bash
npx expo run:android
```

**iOS (macOS only):**
```bash
npx expo run:ios
```

### 4. Run Tests

```bash
# Run all tests
maestro test .maestro/flows

# Run specific test
maestro test .maestro/flows/01-navigation.yaml

# Run with video recording
maestro test --video .maestro/flows/02-create-workout.yaml
```

## 📁 Test Files

- `01-navigation.yaml` - Basic tab navigation
- `02-create-workout.yaml` - Complete workout creation flow
- `03-theme-switch.yaml` - Theme persistence

## 🎯 Adding Test IDs

For better test reliability, add `testID` props to your components:

```tsx
<TextInput testID="workout-name-input" />
<TouchableOpacity testID="finish-workout-button">
```

## 🐛 Debugging

```bash
# Run with debug logs
maestro test --debug .maestro/flows/01-navigation.yaml

# Interactive mode
maestro studio
```

## 📚 Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Expo + Maestro Guide](https://docs.expo.dev/build-reference/e2e-tests/)

## ⚠️ Important Notes

- ✅ Works with: Native builds (`npx expo run:android/ios`)
- ❌ Does NOT work with: Expo Go
- 🔧 Requires: Android/iOS emulator or physical device
