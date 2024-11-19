import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Vibration, TouchableOpacity } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const SimonSaysGame = () => {
  const [sequence, setSequence] = useState<{ gesture: string; simonSays: boolean }[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<{ gesture: string; simonSays: boolean } | null>(null);
  const [timer, setTimer] = useState(5);
  const [progress, setProgress] = useState(1);
  const [streak, setStreak] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);

  useEffect(() => {
    const SENSITIVITY = 0.8;
    const SHAKE_THRESHOLD = 1.5;

    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeDetected = false;

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      if ((deltaX > SHAKE_THRESHOLD && deltaY > SHAKE_THRESHOLD) || 
          (deltaY > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD) || 
          (deltaX > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD)) {
        shakeDetected = true;
      } else {
        shakeDetected = false;
      }

      if (shakeDetected) {
        setCurrentGesture('shake');
      } else if (x > SENSITIVITY) {
        setCurrentGesture('right');
      } else if (x < -SENSITIVITY) {
        setCurrentGesture('left');
      } else if (y > SENSITIVITY) {
        setCurrentGesture('down');
      } else if (y < -SENSITIVITY) {
        setCurrentGesture('up');
      } else {
        setCurrentGesture(null);
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    });

    Accelerometer.setUpdateInterval(100);

    return () => subscription && subscription.remove();
  }, []);

  const startGame = () => {
    const gestures = ['up', 'down', 'left', 'right', 'shake'];
    const newSequence = Array.from({ length: 5 }, () => ({
      gesture: gestures[Math.floor(Math.random() * gestures.length)],
      simonSays: Math.random() < 0.5,
    }));
    setSequence(newSequence);
    setGameActive(true);
    setTimer(5);
    setProgress(1);
    setStreak(0);
    setNextPrompt(newSequence);
  };

  const setNextPrompt = (sequenceToUse: { gesture: string; simonSays: boolean }[] = sequence) => {
    if (sequenceToUse.length === 0) {
      const gestures = ['up', 'down', 'left', 'right', 'shake'];
      const newPrompt = {
        gesture: gestures[Math.floor(Math.random() * gestures.length)],
        simonSays: Math.random() < 0.5,
      };
      setCurrentPrompt(newPrompt);
    } else {
      const [next, ...rest] = sequenceToUse;
      setCurrentPrompt(next);
      setSequence(rest);
    }
    setTimer(5); // Reset timer
    setProgress(1); // Reset progress
  };

  useEffect(() => {
    if (!gameActive || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
      setProgress((prev) => prev - 0.2);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameActive, timer]);

  useEffect(() => {
    if (timer <= 0) {
      if (currentPrompt && !currentPrompt.simonSays && !currentGesture) {
        setStreak((prev) => prev + 1); // Increment streak for correct "No Simon Says" response
        setNextPrompt();
      } else {
        endGame("You failed to follow Simon Says!");
      }
    }
  }, [timer]);

  useEffect(() => {
    if (!currentGesture || !gameActive) return;

    if (currentPrompt) {
      if (currentPrompt.simonSays && currentGesture === currentPrompt.gesture) {
        setStreak((prev) => prev + 1); // Increment streak for correct "Simon Says" response
        setNextPrompt();
      } else {
        endGame("You failed to follow Simon Says!");
      }
    }
  }, [currentGesture]);

  const endGame = (message: string) => {
    Alert.alert("Game Over", message + ` Streak: ${streak}`);
    Vibration.vibrate();
    setGameActive(false);
  };

  return (
    <LinearGradient
      colors={['#A1519C', '#F4A573']} // Updated gradient colors
      style={styles.container}
    >
      <Text style={styles.title}>Simon Says</Text>
      {gameActive && (
        <>
          <View style={styles.timerContainer}>
            <Svg height="50" width="50">
              <Circle
                cx="25"
                cy="25"
                r="20"
                stroke="white"
                strokeWidth="5"
                fill="none"
                strokeDasharray="125.6"
                strokeDashoffset={(1 - progress) * 125.6}
              />
            </Svg>
            <Text style={styles.timerText}>{timer}</Text>
          </View>
          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>Streak: {streak}</Text>
          </View>
        </>
      )}
      <View style={styles.promptBox}>
        {currentPrompt && (
          <Text style={styles.promptText}>
            {currentPrompt.simonSays ? 'Simon Says ' : ''}{currentPrompt.gesture.toUpperCase()}
          </Text>
        )}
      </View>
      {!gameActive && (
        <TouchableOpacity style={[styles.button, styles.whiteButton]} onPress={startGame}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  timerContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    position: 'absolute',
    textAlign: 'center',
  },
  streakContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  promptBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: 5,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    marginTop: 30,
  },
  whiteButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#DD2A7B',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SimonSaysGame;