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
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { signup } from "./firebase/auth";
const logo = require('@/assets/images/calin_logo_transparent.png');


export default function SignUp() {
  let [fontsLoaded] = useFonts({
    Shrikhand_400Regular,
    SourGummy_400Regular,
    SourGummy_100Thin,
    SourGummy_900Black,
  });

      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [username, setUsername] = useState("");

      const handleSignup = async () => {
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        try {
          await signup(email, password, username);
          router.replace("/dashboard");
        } catch (error: any) {
          let message = "Something went wrong";

                      if (error.code === "auth/wrong-password") {
                        message = "Incorrect password";
                      } else if (error.code === "auth/user-not-found") {
                        message = "No account with that email";
                      } else if (error.code === "auth/email-already-in-use") {
                        message = "Email already in use";
                      } else if (error.code === "auth/weak-password") {
                        message = "Password must be at least 6 characters";
                      }

                      alert(message);
        }
      };
  if (!fontsLoaded) {
    return <View style={styles.container}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} contentFit="cover" />
        <Text>Loading...</Text>
      </View>
    </View>;
  }
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Register!</Text>
      <TextInput style = {styles.input} placeholder="Email" onChangeText={setEmail} />
            <TextInput style = {styles.input} placeholder="Username" onChangeText={setUsername} />
            <TextInput style = {styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
            />
            <TextInput style = {styles.input}
               placeholder="Confirm Password"
               secureTextEntry
               onChangeText={setConfirmPassword}
            />

            <Pressable style={styles.button} onPress={handleSignup}>
            <Text>Sign Up</Text>
            </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FFDD8D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: "SourGummy_400Regular",
  },
  title: {
    color: '#D2924E',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: "Shrikhand_400Regular",
  },
button: {
    marginTop: 16,
    backgroundColor: '#FFC65F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontFamily: "SourGummy_400Regular",
  },
input: {
    borderWidth: 5,
    backgroundColor: '#FEF0B9',
    borderColor: '#FFC65F',
    padding: 5,
    borderRadius: 5,
    width: '80%',
    marginBottom: 8,
  fontFamily: "SourGummy_400Regular",
    },
  logo: {
    width: 300,
    height: 300,
    borderRadius: 18,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
