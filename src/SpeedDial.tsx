import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

export interface SpeedDialActionItem {
  id: string;
  icon?: React.ReactNode;
  label?: string;
  onPress: () => void;
  backgroundColor?: string;
  iconColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}

export interface SpeedDialProps {
  actions: SpeedDialActionItem[];
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  layout?: 'radial' | 'linear';
  // Linear specific
  direction?: 'up' | 'down' | 'left' | 'right';
  // Radial specific
  startAngle?: number; // In degrees. e.g., -90 (straight up)
  endAngle?: number;   // In degrees. e.g., -180 (straight left)
  radius?: number;     // Distance in pixels
  
  // Customizations
  labelPosition?: 'left' | 'right' | 'auto';
  mainButtonColor?: string;
  mainButtonIconColor?: string;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  backdropColor?: string;
  backdropOpacity?: number;
  fabSize?: number;
  actionSize?: number;
  
  // Custom styles
  style?: StyleProp<ViewStyle>;
  mainButtonStyle?: StyleProp<ViewStyle>;
}

export const SpeedDial: React.FC<SpeedDialProps> = ({
  actions,
  isOpen: controlledIsOpen,
  onToggle,
  layout = 'linear',
  direction = 'up',
  startAngle = -90,
  endAngle = -180,
  radius = 100,
  labelPosition = 'auto',
  mainButtonColor = '#6366F1', // Indigo-500
  mainButtonIconColor = '#FFFFFF',
  openIcon,
  closeIcon,
  backdropColor = '#0F172A', // Slate-900
  backdropOpacity = 0.4,
  fabSize = 56,
  actionSize = 44,
  style,
  mainButtonStyle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const animationValue = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const nextState = !isOpen;
    if (onToggle) {
      onToggle(nextState);
    }
    if (!isControlled) {
      setInternalIsOpen(nextState);
    }
  };

  const closeMenu = () => {
    if (onToggle) {
      onToggle(false);
    }
    if (!isControlled) {
      setInternalIsOpen(false);
    }
  };

  useEffect(() => {
    Animated.spring(animationValue, {
      toValue: isOpen ? 1 : 0,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isOpen, animationValue]);

  // Backdrop interpolations
  const backdropEventOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, backdropOpacity],
  });

  // Main button rotation animation
  const mainButtonRotation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  // Math calculations for individual action buttons
  const getActionLayout = (index: number, total: number) => {
    let targetX = 0;
    let targetY = 0;

    if (layout === 'linear') {
      const step = (actionSize + 12) * (index + 1);
      switch (direction) {
        case 'up':
          targetY = -step;
          break;
        case 'down':
          targetY = step;
          break;
        case 'left':
          targetX = -step;
          break;
        case 'right':
          targetX = step;
          break;
      }
    } else {
      // Radial layout math
      // Spread items over the angle range
      const angleRange = endAngle - startAngle;
      const currentAngle = total > 1
        ? startAngle + (index * angleRange) / (total - 1)
        : startAngle;

      const rad = (currentAngle * Math.PI) / 180;
      targetX = radius * Math.cos(rad);
      targetY = radius * Math.sin(rad);
    }

    return { targetX, targetY };
  };

  const defaultOpenIcon = openIcon || (
    <View style={styles.iconPlaceholder}>
      <View style={[styles.horizontalBar, { backgroundColor: mainButtonIconColor }]} />
      <View style={[styles.verticalBar, { backgroundColor: mainButtonIconColor }]} />
    </View>
  );

  const defaultCloseIcon = closeIcon || (
    <Animated.View style={{ transform: [{ rotate: mainButtonRotation }] }}>
      <View style={styles.iconPlaceholder}>
        <View style={[styles.horizontalBar, { backgroundColor: mainButtonIconColor }]} />
        <View style={[styles.verticalBar, { backgroundColor: mainButtonIconColor }]} />
      </View>
    </Animated.View>
  );

  // Render elements in reverse order or absolute overlays
  const renderActions = () => {
    const total = actions.length;
    return actions.map((action, index) => {
      const { targetX, targetY } = getActionLayout(index, total);

      const scale = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      const opacity = animationValue.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [0, 0, 1],
      });

      const translateX = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, targetX],
      });

      const translateY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, targetY],
      });

      // Label opacity fades in slightly later
      const labelOpacity = animationValue.interpolate({
        inputRange: [0, 0.6, 1],
        outputRange: [0, 0, 1],
      });

      const buttonStyleOverrides = {
        width: actionSize,
        height: actionSize,
        borderRadius: actionSize / 2,
        backgroundColor: action.backgroundColor || '#FFFFFF',
      };

      // Handle pointer events so fanning buttons don't block clicks when closed
      const pointerEvents = isOpen ? 'auto' : 'none';

      // Place labels opposite to radial fan-out direction or based on position
      const isLeft =
        labelPosition === 'left' ||
        (labelPosition === 'auto' && targetX <= 10);
      const labelPositionStyle = isLeft
        ? { right: actionSize + 12 }
        : { left: actionSize + 12 };

      const AnimatedView = Animated.View as any;

      return (
        <AnimatedView
          key={action.id}
          pointerEvents={pointerEvents}
          style={[
            styles.actionContainer,
            {
              transform: [{ translateX }, { translateY }, { scale }],
              opacity,
              top: (fabSize - actionSize) / 2,
              left: (fabSize - actionSize) / 2,
            },
          ]}
        >
          {action.label && (
            <AnimatedView
              style={[
                styles.actionLabelContainer,
                labelPositionStyle,
                { opacity: labelOpacity },
              ]}
            >
              <Text style={[styles.actionLabelText, action.labelStyle]}>
                {action.label}
              </Text>
            </AnimatedView>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              action.onPress();
              closeMenu();
            }}
            style={[
              styles.actionButton,
              buttonStyleOverrides,
              action.buttonStyle,
              styles.shadow,
            ]}
          >
            {action.icon || (
              <Text style={{ color: action.iconColor || '#334155', fontWeight: 'bold' }}>
                {action.label ? action.label[0] : '•'}
              </Text>
            )}
          </TouchableOpacity>
        </AnimatedView>
      );
    });
  };

  const AnimatedView = Animated.View as any;

  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      {/* Absolute Backdrop covering screen */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <AnimatedView
            style={[
              styles.backdrop,
              {
                backgroundColor: backdropColor,
                opacity: backdropEventOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Sub-action buttons */}
      {renderActions()}

      {/* Main FAB Trigger */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={toggleMenu}
        style={[
          styles.mainButton,
          {
            width: fabSize,
            height: fabSize,
            borderRadius: fabSize / 2,
            backgroundColor: mainButtonColor,
          },
          mainButtonStyle,
          styles.shadow,
        ]}
      >
        {isOpen ? defaultCloseIcon : defaultOpenIcon}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: -1500,
    bottom: -1500,
    left: -1500,
    right: -1500,
    zIndex: -1,
  },
  mainButton: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalBar: {
    position: 'absolute',
    width: 18,
    height: 2,
    borderRadius: 1,
  },
  verticalBar: {
    position: 'absolute',
    width: 2,
    height: 18,
    borderRadius: 1,
  },
  actionContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabelContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(15, 23, 42, 0.95)', // Slate-900 transparent
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
