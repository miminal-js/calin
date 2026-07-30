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
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const logo = require('@/assets/images/calin_logo_transparent.png');

export default function Index() {
  let [fontsLoaded] = useFonts({
    Shrikhand_400Regular,
    SourGummy_400Regular,
    SourGummy_100Thin,
    SourGummy_900Black,
  });
  if (!fontsLoaded) {
    return <View style={styles.page}>
      <View style={styles.container}>
      <Image source={logo} style={styles.logo} contentFit="cover" />
      <Text>Loading...</Text>
      </View>
      </View>;
  }
  return (
  <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.container}>
       <Image source={logo} style={styles.logo} contentFit="cover"/>
      <Text style={styles.title}>Welcome to Câlin</Text>
      <Text style={styles.subtitle}>your app for wellness and nutrition</Text>
      <Pressable style={styles.button} onPress={() => router.push('/signup')}>
              <Text style={styles.text}>Get Started</Text>
      </Pressable>
        <Link href="/login" style={styles.text}>Already have an account? Log in</Link>
    </View>
    <View style={styles.blurb}>
        <Text style={styles.blurbhead}>What is Câlin?</Text>
        <Text style={styles.text}>Câlin is an app focused on providing assistance regarding nutrition and body image. It aims to create a positive experience for everyone and combat dieting apps targeted towards children.</Text>
        <Pressable style={styles.blurbbutton} onPress={() => router.push('/about')}>
                      <Text style={styles.text}>Learn More</Text>
         </Pressable>
    </View>
    <View style={styles.footer}>
    <Text style={styles.text}>Câlin Collective</Text>
    <Text style={styles.text}>Created 2025</Text>
    </View>
   </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: {
    fontFamily: "SourGummy_400Regular",
  },
// blurb
    blurb: {
        backgroundColor: '#FFC65F',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        padding: 24,
    },

    blurbhead: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
      fontFamily: "Shrikhand_400Regular",
    },

    blurbbutton: {
        marginTop: 16,
            backgroundColor: '#FFDD8D',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 5,
        },
// normal title stuff
  title: {
    color: '#D2924E',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: "Shrikhand_400Regular",
  },
    subtitle: {
     color: '#D2924E',
     fontSize: 20,
     marginBottom: 16,
    fontFamily: "Shrikhand_400Regular",
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FFC65F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  page: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: '#FFDD8D',
  },
logo: {
    width: 300,
    height: 300,
    borderRadius: 18,
  },
footer: {
    backgroundColor: '#D2924E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    marginTop: 'auto',
    },
});
