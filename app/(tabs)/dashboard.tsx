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
import { useFocusEffect, useRouter } from 'expo-router';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { db } from "../firebase/firebase";
const dashpic = require('@/assets/images/callie-dashboard.png');
const logo = require('@/assets/images/calin_logo_transparent.png');
const happy = require('@/assets/images/callie-happy.png');
const hungry = require('@/assets/images/callie-hungry.png');
const sad = require('@/assets/images/callie-sad.png');
const stressed = require('@/assets/images/callie-stressed.png');
const surprised = require('@/assets/images/callie-surprised.png');
const angry = require('@/assets/images/callie-angry.png');


export default function Dashboard() {
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const router = useRouter();
  const [showAff, setShowAff] = useState(false);
  const [emotionQ, setEmotionQ] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [username, setUsername] = useState("");
  let [fontsLoaded] = useFonts({
    Shrikhand_400Regular,
    SourGummy_400Regular,
    SourGummy_100Thin,
    SourGummy_900Black,
  });
  const auth = getAuth();
    const user = auth.currentUser;
  
    const userId = user?.uid;
    const displayName = user?.email?.split("@")[0];

  useEffect(() => {

    const loadUser = async () => {
      const userRef = doc(db, "users", userId!);

      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        setUsername(snapshot.data().username);
      } else {
        setUsername(displayName || "User");
      }
    }
    loadUser();
    }, []);


  useFocusEffect(
    useCallback(() => {

      const loadAffirmations = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setAffirmations(data.affirmations || []);
        }
      };

      loadAffirmations();

    }, [])
  );
  
  const todayIndex = Math.floor(new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime() / (1000 * 60 * 60 * 24)) % affirmations.length;

  const todayAffirmation =
    affirmations.length > 0
      ? affirmations[todayIndex]
      : "Pick some affirmations!";

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
      <Image source={dashpic} style={styles.logo} contentFit="cover" />
      <Text style={styles.title}>Hi, {username}</Text>
      <Text style={{ color: '#80231f', textAlign: 'center', fontFamily: 'SourGummy_400Regular' }} onPress={() => { router.push("/"); }}>
        Sign out
      </Text>
      <Modal visible={emotionQ} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Text onPress={() => setEmotionQ(false)} style={{ color: '#80231f', marginBottom: 12, textAlign: 'right' }}>x</Text>
            <Text style={styles.title}>How are you feeling?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { name: "happy", image: happy },
                { name: "hungry", image: hungry },
                { name: "sad", image: sad },
                { name: "stressed", image: stressed },
                { name: "surprised", image: surprised },
                { name: "angry", image: angry }
              ].map((item) => (
                <Pressable
                  key={item.name}
                  onPress={() => {
                    setEmotion(item.name);
                    setEmotionQ(false);
                  }}
                >
                  <Image source={item.image} style={{ width: 60, height: 60, margin: 10 }} />
                  <Text style={styles.text}>{item.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Pressable
          style={styles.affirmationCard}
          onPress={() => setEmotionQ(true)}
        >
          <Text style={styles.stext}>{emotion ? `Today, you are feeling: ${emotion}` : "How are you feeling?"}</Text>
          <Text style={styles.text}>{emotion ==  "happy" && "We're so happy you're feeling happy today! That's amazing! We hope you have a wonderful day and share your happiness with somebody else 💗"}</Text>
          <Text style={styles.text}>{emotion == "sad" && "We're here for you. It's okay to feel sad sometimes. Remember that you are not alone and there is always hope."}</Text>
          <Text style={styles.text}>{emotion == "stressed" && "Take a deep breath. Try to find a quiet moment for yourself. Remember that you are doing your best and that's enough."}</Text>
          <Text style={styles.text}>{emotion == "angry" && "It's okay to feel angry. Try to find a healthy outlet for your anger, whether it's talking to a friend, going for a walk, or doing something creative."}</Text>
          <Text style={styles.text}>{emotion == "hungry" && "Make sure to eat something nourishing! Your body deserves good fuel 💗"}</Text>
          <Text style={styles.text}>{emotion == "surprised" && "Surprises can be exciting or overwhelming. Take a moment to process how you feel and remember that it's okay to take things one step at a time."}</Text>
        </Pressable>
      
      <Pressable
        onPress={() => setShowAff(true)}
        style={styles.affirmationCard}
      >
        <Text style={styles.subtitle}>Today's Affirmation</Text>
        <Text style={styles.text}>
          {todayAffirmation}
        </Text>

        <Text style={styles.stext}>
          view all affirmations
        </Text>
      </Pressable>
      </View>
      
      <Modal visible={showAff} transparent animationType="fade">
        <View style={styles.modalBackground}>

          <View style={styles.modalCard}>
            <Text onPress={() => setShowAff(false)} style={{ color: '#80231f', marginBottom: 12, textAlign: 'right' }}>x</Text>

            <Text style={styles.title}>Your Affirmations</Text>

            <View>
              {affirmations.length === 0 ? (
                <Text style={styles.text}>
                  You haven't saved any affirmations yet!
                </Text>
              ) : (
                affirmations.map((affirmation, index) => (
                  <Text key={index} style={[styles.text, { marginVertical: 8 }]}>
                    • {affirmation}
                  </Text>
                ))
              )}
            </View>
            <Pressable
              onPress={() => {
                setShowAff(false);
                router.push("/affirmations");
              }}
              style={styles.button}
            >
              <Text style={styles.text}>edit affirmations</Text>
            </Pressable>

            

          </View>

        </View>
      </Modal>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFDD8D',
  },
  text: {
    color: '#3b2200',
    textAlign: 'center',
    fontFamily: "SourGummy_400Regular",
  },
  stext: {
    color: '#D2924E',
    textAlign: 'center',
    fontFamily: "SourGummy_400Regular",
  }
  ,
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#D2924E',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: "Shrikhand_400Regular",
    textAlign: 'center',
  },
  subtitle: {
    color: '#D2924E',
    fontSize: 20,
    marginBottom: 16,
    fontFamily: "Shrikhand_400Regular",
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FFC65F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    fontFamily: "SourGummy_400Regular",
  },
  modalCard: {
    backgroundColor: '#FEF0B9',
    padding: 20,
    borderRadius: 16,
    width: '80%',
  },
  affirmationCard: {
    backgroundColor: '#FEF0B9',
    padding: 20,
    borderRadius: 20,
    width: "85%",
    marginTop: 20
  },
  logo: {
    width: 300,
    height: 300,
    borderRadius: 18,
  },
});
