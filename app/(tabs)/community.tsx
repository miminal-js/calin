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
import { getAuth } from "firebase/auth";
import {
  get,
  onValue,
  push,
  ref,
  update
} from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { db, rdb } from "../firebase/firebase";
const logo = require('@/assets/images/calin_logo_transparent.png');
const communitypic = require('@/assets/images/callie-community.png');



import PostCard from "@/components/postcard";

export default function CommunityScreen() {

  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [anonymous, setAnonymous] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [username, setUsername] = useState("");
  let [fontsLoaded] = useFonts({
    Shrikhand_400Regular,
    SourGummy_400Regular,
    SourGummy_100Thin,
    SourGummy_900Black,
  });


  const quizQuestions = [
    {
      question: "Is it okay to post dieting tips in this community?",
      options: ["Yes", "No"],
      correct: "No"
    },
    {
      question: "Someone seems to be a bit down, but someone else posts a mean comment. What should you do?",
      options: ["Report them", "Join in and be mean too", "Ignore it"],
      correct: "Report them"
    },
    {
      question: "Is sharing weight numbers allowed here?",
      options: ["Yes", "No"],
      correct: "No"
    },
    {
      question: "A few years ago, you struggled with an eating disorder and now you want to share your story. How should you do it?",
      options: ["Share it in a kind and supportive way", "Post it in a way that might trigger others", "Tell people that what you went through is the only way to be healthy"],
      correct: "Share it in a kind and supportive way"
    },
    {
      question: "A community member says that they're struggling. What should you do?",
      options: ["Offer support and kindness", "Tell them to just get over it", "Report the post"],
      correct: "Offer support and kindness"
    },
    {
      question: "You post something that may be offensive to others and someone reports it. You've never done this before. What is the next thing that will happen?",
      options: ["You will be immediately banned from the community", "You will receive a warning via email", "Nothing will happen"],
      correct: "You will receive a warning via email"
    }
  ];

  const auth = getAuth();
  const user = auth.currentUser;

  const userId = user?.uid;
  const displayName = user?.email?.split("@")[0];

  // load user info
  useEffect(() => {

    const loadUser = async () => {

      const userRef = ref(rdb, "users/" + userId);

      const snapshot = await get(userRef);

      const data = snapshot.val();

      if (data?.quizPassed) {
        setQuizPassed(true);
      }

      if (userId) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
        }
      }

    };

    loadUser();

  }, [userId]);

  // load posts
  useEffect(() => {

    const postsRef = ref(rdb, "posts");

    onValue(postsRef, (snapshot) => {

      const data = snapshot.val();

      if (!data) return;

      const loadedPosts = [];

      for (let id in data) {
        loadedPosts.push({
          id,
          ...data[id]
        });
      }

      setPosts(loadedPosts.reverse());

    });

  }, []);

  const answerQuestion = (answer: string) => {

    const current = quizQuestions[quizIndex];
    if (!current) return;

    if (answer === current.correct) {

      if (quizIndex === quizQuestions.length - 1) {

        const userRef = ref(rdb, "users/" + userId);

        update(userRef, {
          quizPassed: true
        });

        setQuizPassed(true);

      } else {

        setQuizIndex(quizIndex + 1);

      }

    } else {

      alert("Not quite! Try again 💛");
      setQuizIndex(0);

    }

  };

  // banned words filter
  const bannedWords = ["diet", "starve", "calories", "thinspo"];

  // create post
  const addPost = () => {


    if (!postText || !user || !username) {
      alert("something went wrong... please wait a few seconds and try again");
      return;
    }

    if (bannedWords.some(word => (postText.toLowerCase()).includes(word))) {
      alert("this message might go against community rules 💛");
      return;
    }

    if (/\d/.test(postText)) {
      alert("numbers aren't allowed in posts 💛");
      return;
    }

    push(ref(rdb, "posts"), {
      text: postText,
      user: anonymous ? "anonymous" : username || displayName,
      userId: userId,
      hearts: 0,
      timestamp: Date.now()
    });

    setPostText("");

  };

  // add heart
  const addHeart = (post: any) => {

    const postRef = ref(rdb, "posts/" + post.id);

    update(postRef, {
      hearts: post.hearts + 1
    });

  };

  const addComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;

    push(ref(rdb, `posts/${postId}/comments`), {
      text: commentText,
      user: anonymous ? "anonymous" : username || displayName,
      userId: userId,
      timestamp: Date.now()
    });
  };

  const filteredPosts = posts.filter((post) =>
    (post.text?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
    (post.user?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  if (!fontsLoaded) {
    return <View style={styles.container}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} contentFit="cover" />
        <Text>Loading...</Text>
      </View>
    </View>;
  }

  if (!quizPassed && !quizStarted) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.modalBackground}>

          <View style={styles.modalCard}>

            <Text style={styles.subtitle}>
              Welcome to the Câlin Community! Before you join...
            </Text>

            <Text style={styles.text}>
              Our community is a safe space for people to share their thoughts and feelings. We want to make sure that everyone feels welcome and supported here. Because of this, we have a few rules that we ask everyone to follow. Please read them carefully before you start posting.
              Because this space is meant to be safe and supportive, we ask that you take a short quiz before you can post. This quiz will help us make sure that everyone understands the rules and is committed to creating a positive environment.
              <Text style={styles.subtitle}>What can I post?</Text>
              In this commmunity, you can post your thoughts, feelings, and experiences. You can also post questions and ask for advice. However, we do not allow posts that promote dieting, weight loss, or body shaming. We also do not allow posts that contain numbers, as this can be triggering for some people.
              When posting, try to be kind and supportive. Everyone is going through their own struggles, and we want to create a space where people can feel safe and supported. If you see a post that goes against our rules, please report it to us. The report form can be accessed by clicking the red flag icon on one's post.
              Before posting, think to yourself: "Would I say this to a friend? Would I want to read this if I was struggling?" If the answer is no, then please reconsider posting it. We want to create a space where everyone feels welcome and supported, and we appreciate your help in making that happen.
              <br />
              <Text style={styles.subtitle}>What happens if I break the rules?</Text>
              It's completely okay to make mistakes. If you are reported and we find that you've done something wrong as a first offense, we will intially email you with a warning reminding you of community guidelines. Your post will be removed. If this pattern continues, however, you may be banned from the community. We take the safety and well-being of our community members very seriously, and we want to make sure that everyone feels welcome and supported here. If you have any questions about the rules or the quiz, please reach out to us. We're happy to help!
              <br />
              Thank you so much for reading our community guidelines. We hope that you enjoy your time here and that you find the support and kindness that you're looking for. We can't wait to see what you have to share!
            </Text>

            <Pressable
              onPress={() => setQuizStarted(true)}
              style={styles.button}
            >
              <Text>Continue to Quiz</Text>
            </Pressable>

          </View>
        </View>
      </Modal>
    );
  }

  if (!quizPassed && quizStarted) {

    return (
      <Modal
        visible={!quizPassed}
        transparent
        animationType="fade"
      >

        <View style={styles.modalBackground}>

          <View style={styles.modalCard}>

            <Text style={styles.subtitle}>
              Community Quiz
            </Text>

            <Text style={{ marginBottom: 20 }}>
              {quizQuestions[quizIndex]?.question}
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

              {quizQuestions[quizIndex]?.options.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => answerQuestion(option)}
                  style={{
                    backgroundColor: "#FFC65F",
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 10
                  }}
                >
                  <Text>{option}</Text>
                </Pressable>
              ))}

            </View>

          </View>
        </View>

      </Modal>
    );

  }

  return (

    <FlatList
      data={filteredPosts}
      style={{ backgroundColor: "#FFDD8D" }}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onHeart={addHeart}
          currentUser={userId}
          addComment={addComment}
        />
      )}
      ListHeaderComponent={
        <>
          <View style={styles.topSection}>
            <Image source={communitypic} style={styles.logo} contentFit="cover" />

            <Text style={styles.title}>Community</Text>

            <TextInput
              placeholder="search posts or users"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.input}
            />

            <TextInput
              multiline
              numberOfLines={5}
              placeholder="share something kind today!"
              value={postText}
              onChangeText={setPostText}
              style={styles.input}
            />

            <Pressable
              onPress={() => setAnonymous(!anonymous)}
              style={{ marginTop: 8 }}
            >
              <Text style={anonymous ? {
                backgroundColor: '#ffbe45', fontFamily: 'SourGummy_400Regular', paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 5
              } : {
                backgroundColor: '#FFC65F', fontFamily: 'SourGummy_400Regular', paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 5
              }}>
                {anonymous ? "posting anonymously" : "post anonymously"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>Recent Posts</Text>
        </>
      }
      ListEmptyComponent={<Text>No posts found :(</Text>}
      contentContainerStyle={styles.container}
    />

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDD8D',
    width: '100%',
    paddingBottom: 30,
  },
  topSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 300,
    height: 300,
    borderRadius: 18,
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
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FFC65F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    fontFamily: "SourGummy_400Regular",
  },
  text: {
    color: '#fff',
    fontFamily: "SourGummy_400Regular",
  },
  input: {
    backgroundColor: '#FEF0B9',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontFamily: "SourGummy_400Regular",
    width: '95%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#FEF0B9',
    padding: 20,
    borderRadius: 16,
    width: '80%',
  },

});
