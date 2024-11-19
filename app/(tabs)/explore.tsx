import { StyleSheet } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F58529', dark: '#DD2A7B' }} // Matching gradient colors
      headerImage={<ThemedView style={styles.headerPlaceholder} />} // Provide a minimal placeholder
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          Hi There!
        </ThemedText>
      </ThemedView>
      <ThemedText>Simon Says</ThemedText>
      <Collapsible title="Instructions">
        <ThemedText>
          Follow the prompts to complete the game:
        </ThemedText>
        <ThemedText>
          1. If "Simon Says" is mentioned, perform the gesture (tilt or shake) within the time limit.
        </ThemedText>
        <ThemedText>
          2. If "Simon Says" is NOT mentioned, stay still and let the timer expire.
        </ThemedText>
        <ThemedText>
          The game will end when you make a mistake. Your streak will show how many correct actions you performed.
        </ThemedText>
      </Collapsible>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerPlaceholder: {
    backgroundColor: 'transparent', // Invisible placeholder
    height: 150, // Match the expected height of the header
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 36,
    color: '#FFFFFF', // Matching the white color used in index.tsx
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});