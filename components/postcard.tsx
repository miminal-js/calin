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
import { onValue, ref, remove } from "firebase/database";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { rdb } from "../app/firebase/firebase";
const logo = require('@/assets/images/calin_logo_transparent.png');


export default function PostCard({ post, onHeart, currentUser, addComment }: any) {
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState("");
    let [fontsLoaded] = useFonts({
        Shrikhand_400Regular,
        SourGummy_400Regular,
        SourGummy_100Thin,
        SourGummy_900Black,
    });


    useEffect(() => {
        const commentsRef = ref(rdb, `posts/${post.id}/comments`);

        onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setComments([]);
                return;
            }

            const loaded = Object.keys(data).map(id => ({
                id,
                ...data[id]
            }));

            setComments(loaded);
        });
    }, [post.id]);
    
    const deletePost = () => {
        const postRef = ref(rdb, "posts/" + post.id);
        remove(postRef);
    };

    

    const timeAgo = (timestamp: number) => {

        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        const intervals = [
            { label: "y", seconds: 31536000 },
            { label: "mo", seconds: 2592000 },
            { label: "d", seconds: 86400 },
            { label: "h", seconds: 3600 },
            { label: "m", seconds: 60 }
        ];

        for (let i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count >= 1) return `${count}${i.label} ago`;
        }

        return "just now";
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

        <View
            style={{
                backgroundColor: '#FEF0B9',
                padding: 15,
                borderRadius: 16,
                marginBottom: 12
            }}
        >

            <Text style={styles.user}>
                {post.user || "anonymous"}
            </Text>
            
            <Text style={styles.timestamp}>
                {timeAgo(post.timestamp)}
            </Text>

            <TouchableOpacity onPress={() => router.push("https://forms.gle/edZkTxwEQV2zVogZ9")}>
                <Text>🚩</Text>
            </TouchableOpacity>

            <Text style={styles.text}>
                {post.text}
            </Text>

            <TouchableOpacity onPress={() => onHeart(post)}>
                <Text>💛 {post.hearts || 0}</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 10 }}>
                {comments.map((c) => (
                    <Text key={c.id} style={styles.text}>
                        <Text style={{ fontWeight: "bold" }}>
                            {c.user || "anon"}:{" "}
                        </Text>
                        {c.text}
                    </Text>
                ))}
            </View>

            <TextInput
                placeholder="reply..."
                value={commentText}
                onChangeText={setCommentText}
                style={{
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 6,
                    marginTop: 8
                }}
            />

            <TouchableOpacity
                onPress={() => {
                    addComment(post.id, commentText);
                    setCommentText("");
                }}
            >
                <Text style={styles.text}>reply 💬</Text>
            </TouchableOpacity>

            {post.userId === currentUser && (

                <TouchableOpacity onPress={deletePost}>
                    <Text style={{ marginTop: 8, color: "red", fontFamily: "SourGummy_400Regular" }}>
                        delete
                    </Text>
                </TouchableOpacity>

            )}

        </View>

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
    logo: {
    width: 300,
    height: 300,
    borderRadius: 18,
  },
  user: {
    fontWeight: 'bold',
    fontFamily: "SourGummy_400Regular",
  },
  timestamp: { 
    color: 'gray',
    fontSize: 12,
    fontFamily: "SourGummy_400Regular",
  }

});
