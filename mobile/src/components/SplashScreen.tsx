import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useTranslation } from 'react-i18next';
import Svg, { Path, G, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { usePersonalization } from '../contexts/PersonalizationContext';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

// Premium lotus icon with subtle glow effect
const LotusIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    {/* Subtle glow behind lotus */}
    <Circle cx="50" cy="50" r="45" fill="url(#glowGrad)" />
    <G transform="translate(50, 52)">
      {/* Left outer petal */}
      <Path
        d="M-8,2 Q-38,-8 -40,2 Q-30,15 -8,2"
        fill="#FFFFFF"
        opacity="0.7"
      />
      {/* Right outer petal */}
      <Path
        d="M8,2 Q38,-8 40,2 Q30,15 8,2"
        fill="#FFFFFF"
        opacity="0.7"
      />
      {/* Left inner petal */}
      <Path
        d="M-5,0 Q-25,-18 -28,-5 Q-18,10 -5,0"
        fill="#FFFFFF"
        opacity="0.85"
      />
      {/* Right inner petal */}
      <Path
        d="M5,0 Q25,-18 28,-5 Q18,10 5,0"
        fill="#FFFFFF"
        opacity="0.85"
      />
      {/* Center petal (on top, pointing up) */}
      <Path
        d="M0,-38 Q12,-18 0,5 Q-12,-18 0,-38"
        fill="#FFFFFF"
      />
    </G>
  </Svg>
);

// Animated ring component
const AnimatedRing: React.FC<{
  size: number;
  delay: number;
  color: string;
  breatheAnim: Animated.Value;
  targetScale: number;
  targetOpacity: number;
}> = ({ size, delay, color, breatheAnim, targetScale, targetOpacity }) => {
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in ring
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(ringOpacity, {
        toValue: 0.15,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Breathing animation for ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, {
          toValue: targetScale,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ringScale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedOpacity = ringOpacity.interpolate({
    inputRange: [0, 0.15],
    outputRange: [0, targetOpacity],
  });

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          opacity: animatedOpacity,
          transform: [{ scale: ringScale }],
        },
      ]}
    />
  );
};

// Floating particle for zen effect
const FloatingParticle: React.FC<{
  delay: number;
  startX: number;
  startY: number;
  size: number;
}> = ({ delay, startX, startY, size }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -80,
            duration: 4000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { t } = useTranslation();
  const { currentTheme } = usePersonalization();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(10)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Smooth entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 12,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Gentle breathing animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.04,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow pulsing - more subtle
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title fade and slide in
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Subtitle fade in
    Animated.sequence([
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(subtitleFade, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleSlide, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Auto-hide splash screen
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Generate random particles - more particles for richer effect
  const particles = [
    { delay: 100, startX: width * 0.15, startY: height * 0.58, size: 3 },
    { delay: 400, startX: width * 0.85, startY: height * 0.52, size: 2.5 },
    { delay: 700, startX: width * 0.25, startY: height * 0.68, size: 4 },
    { delay: 1000, startX: width * 0.75, startY: height * 0.62, size: 2.5 },
    { delay: 600, startX: width * 0.5, startY: height * 0.72, size: 3.5 },
    { delay: 1200, startX: width * 0.35, startY: height * 0.55, size: 2 },
    { delay: 900, startX: width * 0.65, startY: height * 0.7, size: 3 },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={currentTheme.gradient}
        locations={[0, 0.5, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.gradient}
      >
        {/* Floating particles */}
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo with rings, glow and breathing */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: breatheAnim }],
              },
            ]}
          >
            {/* Animated rings around logo */}
            <AnimatedRing
              size={180}
              delay={200}
              color="rgba(255, 255, 255, 0.8)"
              breatheAnim={breatheAnim}
              targetScale={1.12}
              targetOpacity={0.12}
            />
            <AnimatedRing
              size={220}
              delay={400}
              color="rgba(255, 255, 255, 0.6)"
              breatheAnim={breatheAnim}
              targetScale={1.18}
              targetOpacity={0.06}
            />

            {/* Outer glow */}
            <Animated.View
              style={[
                styles.logoGlow,
                { opacity: glowAnim }
              ]}
            />
            <LotusIcon size={110} />
          </Animated.View>

          {/* App Name with gradient ".me" */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: titleFade,
                transform: [{ translateY: titleSlide }],
              }
            ]}
          >
            <Text style={styles.titleMain}>Slow Spot</Text>
            <MaskedView
              maskElement={
                <Text style={styles.titleAccentMask}>.me</Text>
              }
            >
              <LinearGradient
                colors={['#FCD34D', '#F59E0B', '#FCD34D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.titleAccentGradient}
              >
                <Text style={[styles.titleAccentMask, { opacity: 0 }]}>.me</Text>
              </LinearGradient>
            </MaskedView>
          </Animated.View>

          {/* Tagline with slide animation */}
          <Animated.View
            style={{
              opacity: subtitleFade,
              transform: [{ translateY: subtitleSlide }],
            }}
          >
            <Text style={styles.subtitle}>
              {t('splash.tagline')}
            </Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  logoGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  titleMain: {
    fontSize: 52,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  titleAccentMask: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1,
  },
  titleAccentGradient: {
    flexDirection: 'row',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default SplashScreen;
