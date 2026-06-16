import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(1)).current;

  // Partículas de cor
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setHidden(true);

    // Animação das partículas
    Animated.loop(
      Animated.sequence([
        Animated.timing(particle1, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(particle1, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(particle2, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(particle2, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(particle3, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(particle3, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Sequência principal de animação
    Animated.sequence([
      // Logo aparece com bounce
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      // Título sobe
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(titleY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      // Subtítulo aparece
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(300),
      // Barra de progresso
      Animated.timing(progressWidth, {
        toValue: width * 0.7,
        duration: 1800,
        useNativeDriver: false,
      }),
      Animated.delay(300),
      // Fade out
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      StatusBar.setHidden(false);
      onFinish();
    });
  }, []);

  const particle1Translate = particle1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });
  const particle2Translate = particle2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });
  const particle3Translate = particle3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <Animated.View style={[styles.container, { opacity: bgOpacity }]}>
      <StatusBar hidden />

      {/* Partículas decorativas */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          { opacity: particle1, transform: [{ translateY: particle1Translate }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          { opacity: particle2, transform: [{ translateY: particle2Translate }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle3,
          { opacity: particle3, transform: [{ translateY: particle3Translate }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle4,
          { opacity: particle1, transform: [{ translateY: particle2Translate }] },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Título */}
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleY }],
        }}
      >
        <Text style={styles.title}>Pik-arte</Text>
        <Text style={styles.tagline}>Sua arte, sem limites</Text>
      </Animated.View>

      {/* Subtítulo */}
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Powered by Gemini AI ✨
      </Animated.Text>

      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: progressWidth },
            ]}
          />
        </View>
        <Animated.Text style={[styles.loadingText, { opacity: subtitleOpacity }]}>
          Carregando ferramentas...
        </Animated.Text>
      </View>

      {/* Versão */}
      <Animated.Text style={[styles.version, { opacity: subtitleOpacity }]}>
        v1.0.0
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  particle1: {
    width: 80,
    height: 80,
    backgroundColor: '#A855F7',
    top: height * 0.1,
    left: width * 0.1,
    opacity: 0.3,
  },
  particle2: {
    width: 60,
    height: 60,
    backgroundColor: '#EC4899',
    top: height * 0.15,
    right: width * 0.08,
    opacity: 0.3,
  },
  particle3: {
    width: 50,
    height: 50,
    backgroundColor: '#06B6D4',
    bottom: height * 0.2,
    left: width * 0.15,
    opacity: 0.3,
  },
  particle4: {
    width: 70,
    height: 70,
    backgroundColor: '#F59E0B',
    bottom: height * 0.25,
    right: width * 0.1,
    opacity: 0.3,
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#A855F7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#C084FC',
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#9090A0',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  progressContainer: {
    position: 'absolute',
    bottom: height * 0.12,
    alignItems: 'center',
    width: '100%',
  },
  progressBg: {
    width: width * 0.7,
    height: 4,
    backgroundColor: '#2E2E3A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#A855F7',
    borderRadius: 2,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    color: '#9090A0',
    fontSize: 12,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  version: {
    position: 'absolute',
    bottom: height * 0.05,
    color: '#444455',
    fontSize: 11,
  },
});
