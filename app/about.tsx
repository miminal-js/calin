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
import { ScrollView, StyleSheet, Text, View } from 'react-native';
const logo = require('@/assets/images/calin_logo_transparent.png');

export default function AboutScreen() {
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
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>About Câlin</Text>
        <Text style={styles.subtitle}>A project dedicated to healing and helping others</Text>
        <br />
        <Text style={styles.subtitle}>What even is Câlin?</Text>
        <Text style={styles.text}>Câlin is a mobile app designed to provide a safe space for individuals to explore their emotions and practice self-compassion. In a world where changing yourself is the norm to feel loved, Câlin provides a safe and welcoming space for people to love themselves without restrictions.</Text>
        <Text style={styles.text}>The app offers a variety of features, including a mood tracker, space for one to take care of their nutrition, and an affirmations board.. Users can also connect with a supportive community of like-minded individuals who are on their own journey towards self-love and acceptance.</Text>
        <br />
        <Text style={styles.subtitle}>How was Câlin created?</Text>
        <Text style={styles.text}>The founder of Câlin, Temilola Adepoju, created Câlin with the vision of providing a supportive environment for individuals to prioritize their mental health and well-being. The development process involved extensive research to make sure that this project was accurate, informed, and helpful. In order to create this app, she utilized TypeScript via React Native as well as Expo to code and host this app.</Text>
        <Text style={styles.text}>Temilola lives in Sugar Land, Texas, and is a strong advocate for body positivity and self-acceptance. From coding competitions to app development, Temilola is deeply involved in all areas of computer science. She actively participates in events targeted towards Women in STEM, such as Digital Divas, Kode With Klossy, and Society of Women Engineers. Currently, she serves on the executive team board of INTEGIRLS, a STEM nonprofit, as a member of their Fundraising committee. Additionally, she works with Steel City Codes as a Houston Chapter Head. Outside of STEM, Temi serves as the Librarian of her school choir and maintains an avid interest in film, psychology, writing, music, and art.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#D2924E', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: "SourGummy_400Regular",
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    color: '#FFDD8D',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: "Shrikhand_400Regular",
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFDD8D',
    fontSize: 20,
    fontFamily: "Shrikhand_400Regular",
    marginBottom: 16,
    textAlign: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    borderRadius: 18,
  },

});
