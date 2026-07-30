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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { auth, db } from "./firebase/firebase";
const logo = require('@/assets/images/calin_logo_transparent.png');

const AFFIRMATIONS = [
    "Food is fuel, not a test.",
    "Your body deserves nourishment.",
    "Skipping meals doesn't make you stronger.",
    "All foods can fit in a balanced life.",
    "Taking care of yourself is brave.",
    "Eating regularly supports your brain.",
    "You deserve kindness from yourself.",
    "Food helps you grow and think.",
    "Your body is not an object that you have to constantly fix.",
    "Food is not something you earn based on how you look, exercise, or how \"good\" your day was. Food is fuel, comfort, and connection and it's okay to enjoy it without guilt.",
    "Social media trends and even people around you may show a very narrow version of what is considered normal or healthy, but most bodies you see online are edited to fit an unrealistic standard. Comparing yourself to that will not make you feel any better.",
    "Being healthy does not have a specific look and your worth does not depend on it.",
    "Not eating is never healthy.",
    "Your weight does not indicate your health or worth.",
    "Your relationship with food should be shaped by your own needs, not others' judgement about your body.",
    "It's okay to eat sweets 💛",
    "If you have to be constantly hungry or tired to maintain your \"dream\" body, that is a nightmare body. It is far less miserable to eat properly instead.",
    "Your body is not a problem to solve."
];

export default function EditAffirmations() {
    const [saved, setSaved] = useState<string[]>([]);
    let [fontsLoaded] = useFonts({
        Shrikhand_400Regular,
        SourGummy_400Regular,
        SourGummy_100Thin,
        SourGummy_900Black,
    });

    useEffect(() => {
        const loadSaved = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                const data = snap.data();
                setSaved(data.affirmations || []);
            }
        };

        loadSaved();
    }, []);
    const toggleSave = async (text: string) => {
        let updated;

        if (saved.includes(text)) {
            updated = saved.filter(a => a !== text);
        } else {
            updated = [...saved, text];
        }

        setSaved(updated);

        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, "users", user.uid);

        await setDoc(ref, {
            affirmations: updated
        }, { merge: true });
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

        <View style={styles.container}>

            <Text style={styles.title}>Pick affirmations you like</Text>

            <FlatList
                data={AFFIRMATIONS}
                numColumns={2}
                keyExtractor={(item) => item}

                renderItem={({ item }) => (

                    <Pressable
                        style={styles.card}
                        onPress={() => toggleSave(item)}
                    >

                        <Text style={styles.text}>
                            {item}
                        </Text>

                        <Text style={styles.heart}>
                            {saved.includes(item) ? "❤️" : "🤍"}
                        </Text>

                    </Pressable>

                )}
            />

            <Pressable style={styles.button} onPress={() => router.push('https://forms.gle/dsX88dNe8Fc2oTkPA')}>
                <Text style={styles.text}>Request a New Affirmation</Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFDD8D",
        padding: 20
    },

    title: {
        fontSize: 26,
        color: "#D2924E",
        marginBottom: 20,
        fontFamily: "Shrikhand_400Regular",
    },

    card: {
        flex: 1,
        backgroundColor: "#FFF2CC",
        padding: 16,
        margin: 8,
        borderRadius: 16,
        justifyContent: "space-between",
        minHeight: 120
    },

    text: {
        color: "#5A3A1A",
        fontFamily: "SourGummy_400Regular",
    },

    heart: {
        fontSize: 22,
        alignSelf: "flex-end"
    },
    logo: {
        width: 300,
        height: 300,
        borderRadius: 18,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#FFC65F',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
    },

});