# react-native-speed-dial 🚀

A high-performance, zero-dependency, fully customizable floating action button (FAB) speed-dial component for **React Native** and **Expo**. Supports both fanning **radial** (arc-based) and **linear** (list-based) spring-animated layouts.

---

## Features

- ⚡ **GPU-Accelerated Animations**: Uses native driver spring physics for 60FPS transitions.
- 📐 **Radial & Linear Layouts**: Fan out action items in a custom circular arc or in straight columns/rows.
- 🎨 **Fully Customizable**: Control dimensions, colors, icons, labels, label placement, and active backdrop overlays.
- 📦 **Zero Native Code**: Runs directly on **Expo Go** and **React Native Bare** without native linking.
- 👆 **Backdrop Tap-to-Dismiss**: Automatically dims the screen and dismisses the speed-dial when tapping outside.

---

## Installation

```bash
npm install react-native-speed-dial
```
or
```bash
yarn add react-native-speed-dial
```

---

## Usage

### 1. Radial Layout
Fan out icons in a bottom-right corner arc (from 90° straight up to 180° straight left):

```tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SpeedDial } from 'react-native-speed-dial';

export default function App() {
  const actions = [
    {
      id: 'camera',
      label: 'Camera',
      onPress: () => Alert.alert('Camera pressed'),
      backgroundColor: '#E11D48',
      iconColor: '#FFFFFF',
    },
    {
      id: 'gallery',
      label: 'Gallery',
      onPress: () => Alert.alert('Gallery pressed'),
      backgroundColor: '#2563EB',
      iconColor: '#FFFFFF',
    },
    {
      id: 'document',
      label: 'Document',
      onPress: () => Alert.alert('Document pressed'),
      backgroundColor: '#059669',
      iconColor: '#FFFFFF',
    },
  ];

  return (
    <View style={styles.container}>
      <SpeedDial
        actions={actions}
        layout="radial"
        startAngle={-90}  // straight up
        endAngle={-180}  // straight left
        radius={110}     // fan-out distance
        mainButtonColor="#6366F1"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
```

---

### 2. Linear Layout (List)
Stack actions vertically above the FAB button:

```tsx
import { SpeedDial } from 'react-native-speed-dial';

<SpeedDial
  actions={actions}
  layout="linear"
  direction="up"
  mainButtonColor="#EF4444"
/>
```

---

## API Properties

### `<SpeedDial>`

| Parameter | Type | Default | Description |
|---|---|---|---|
| **`actions`** | `SpeedDialActionItem[]` | (Required) | Array of sub-actions to display. |
| **`layout`** | `'linear' \| 'radial'` | `'linear'` | Layout flow style for fanned actions. |
| **`direction`** | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Fan direction for `'linear'` layout. |
| **`startAngle`** | `number` | `-90` | Start angle in degrees for `'radial'` layout. |
| **`endAngle`** | `number` | `-180` | End angle in degrees for `'radial'` layout. |
| **`radius`** | `number` | `100` | Expansion radius for `'radial'` layout. |
| **`mainButtonColor`** | `string` | `#6366F1` | Background color of the main FAB. |
| **`mainButtonIconColor`** | `string` | `#FFFFFF` | Color of the default open/close icon text. |
| **`backdropColor`** | `string` | `#0F172A` | Background color of the backdrop overlay. |
| **`backdropOpacity`** | `number` | `0.4` | Max opacity of the backdrop overlay. |
| **`fabSize`** | `number` | `56` | Diameter of the main FAB. |
| **`actionSize`** | `number` | `44` | Diameter of sub-action buttons. |
| **`isOpen`** | `boolean` | `undefined` | Optional controlled open/close state. |
| **`onToggle`** | `(open: boolean) => void` | `undefined` | Callback fired when the state toggles. |

### `SpeedDialActionItem`

| Parameter | Type | Description |
|---|---|---|
| **`id`** | `string` | Unique identifier. |
| **`icon`** | `React.ReactNode` | Optional custom icon element to render inside. |
| **`label`** | `string` | Optional tooltip text shown next to the button. |
| **`onPress`** | `() => void` | Function to call when clicked. |
| **`backgroundColor`** | `string` | Background color of the sub-button. |
| **`iconColor`** | `string` | Color of default dot text inside the button. |
| **`labelStyle`** | `StyleProp<TextStyle>` | Styling overrides for the label text. |
| **`buttonStyle`** | `StyleProp<ViewStyle>` | Styling overrides for the action button wrapper. |

---

## License

MIT
