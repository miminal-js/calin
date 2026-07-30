import {
  Shrikhand_400Regular,
  useFonts
} from "@expo-google-fonts/shrikhand";
import {
  SourGummy_100Thin,
  SourGummy_400Regular,
  SourGummy_900Black
} from "@expo-google-fonts/sour-gummy";
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
const logo = require('@/assets/images/calin_logo_transparent.png');

export default function NotFoundScreen() {
  let [fontsLoaded] = useFonts({
    Shrikhand_400Regular,
    SourGummy_400Regular,
    SourGummy_100Thin,
    SourGummy_900Black,
  });
  if (!fontsLoaded) {
    return <View style={styles.container}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} contentFit="cover" />
        <Text>Loading...</Text>
      </View>
    </View>;
  }

  return (
    <>
      <Stack.Screen options={{ title: '404: Page not found' }} />
      <View style={styles.container}>
      <Text style={styles.title}>How'd you get here?</Text>
      <Text style={styles.text}>This page currently does not exist. Perhaps you made a typo?</Text>
        <Link style={styles.button} href="/">
          Back to Home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDD8D",
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
          fontSize: 26,
          color: "#D2924E",
          marginBottom: 20,
          fontFamily: "Shrikhand_400Regular",
  },
  text: {
          color: "#5A3A1A",
          fontFamily: "SourGummy_400Regular",
          fontSize: 18,
  },
  logo: {
    width: 300,
    height: 300,
    borderRadius: 18,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
    marginTop: 16,
    backgroundColor: '#FFC65F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    fontFamily: "SourGummy_400Regular",
  },

});
