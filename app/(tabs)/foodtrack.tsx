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
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { auth, db } from '../firebase/firebase';
const logo = require('@/assets/images/calin_logo_transparent.png');
const hungry = require('@/assets/images/callie-hungry.png');
const FOOD_GROUPS = {
  carbs: { label: 'Carbs', target: 3 },
  protein: { label: 'Protein', target: 2 },
  fats: { label: 'Fats', target: 2 },
  veggies: { label: 'Veggies', target: 3 },
};
const food_nutrient = [
  {
    keywords: ["pizza", "burger", "sandwich", "taco"],
    groups: ["carbs", "protein", "fats"]
  },
  {
    keywords: ["pasta", "noodle", "ramen", "spaghetti", "macaroni", "rice", "bread", "bagel", "croissant"],
    groups: ["carbs"]
  },
  {
    keywords: ["chicken", "beef", "steak", "pork", "fish"],
    groups: ["protein"]
  },
  {
    keywords: ["salad", "lettuce", "broccoli", "spinach", "vegetable"],
    groups: ["veggies"]
  },
  {
    keywords: ["egg"],
    groups: ["protein", "fats"]
  },
  {
    keywords: ["fruit", "apple", "banana", "orange", "berry"],
    groups: ["carbs", "veggies"]
  }
];

export default function Dashboard() {
  const todayKey = new Date().toISOString().split('T')[0];
  const [entries, setEntries] = useState<{ name: string; groups: string[] }[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [customFoodName, setCustomFoodName] = useState('');
  const [history, setHistory] = useState<{ date: string; entries: any }[]>([]);
  const [user, setUser] = useState<User | null>(null);


  const getPastDates = (days: number) => {
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });
  };

  useEffect(() => {
    if (!user) return;

    const loadHistory = async () => {
      const dates = getPastDates(3);
      const results = [];

      for (const date of dates) {
        const ref = doc(db, 'users', user.uid, 'dailyLogs', date);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          results.push({
            date,
            entries: snap.data().entries,
          });
        }
      }

      setHistory(results);
    };

    loadHistory();
  }, [user, entries]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadToday = async () => {
      const ref = doc(db, 'users', user.uid, 'dailyLogs', todayKey);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setEntries(snap.data().entries);
      } else {
        await setDoc(ref, {
          entries: [],
          createdAt: new Date(),
        });
        setEntries([]);
      }
    };

    loadToday();
  }, [user]);

  function detectFoodGroups(foodName: string) {
    const name = foodName.toLowerCase();
    let detectedGroups: string[] = [];

    for (const rule of food_nutrient) {
      if (rule.keywords.some(keyword => name.includes(keyword))) {
        detectedGroups.push(...rule.groups);
      }
    }

    detectedGroups = [...new Set(detectedGroups)];

    return detectedGroups.length > 0 ? detectedGroups : ["carbs"];
  }
  

  const addEntry = async (food: { name: string; groups: string[] | never[]; }) => {
    if (!user) return;
    
    try {
      const ref = doc(db, 'users', user.uid, 'dailyLogs', todayKey);
      const newEntries = [...entries, food];

      setEntries(newEntries); 

      await updateDoc(ref, {
        entries: newEntries,
      });
    } catch (e) {
      console.error('Failed to add entry:', e);
    }
  };

  

  const groupCounts = {
    carbs: 0,
    protein: 0,
    fats: 0,
    veggies: 0,
  };

  entries.forEach(entry => {
    entry.groups.forEach((group) => {
      if (group in groupCounts) {
        groupCounts[group as keyof typeof groupCounts] += 1;
      }
    });
  });

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
      <Image source={hungry} style={styles.logo} contentFit="cover" />
      <Text style={styles.title}>Your Food Today</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
        {Object.keys(FOOD_GROUPS).map(group => {
          const progress = groupCounts[group as keyof typeof groupCounts];
          const target = FOOD_GROUPS[group as keyof typeof FOOD_GROUPS].target;

          return (
            <View
              key={group}
              style={[
                { alignItems: 'center' }
              ]}
            >
              <CircularProgress
                value={progress}
                maxValue={target}
                radius={45}
                activeStrokeColor={progress >= target ? '#F4B183' : '#D2924E'}
                inActiveStrokeColor={progress >= target ? '#F4B183' : '#FFF2CC'}
                activeStrokeWidth={10}
                inActiveStrokeWidth={10}
                showProgressValue={false}
              />
              <Text style={{ color: '#fff', marginTop: 6, fontFamily: "SourGummy_400Regular" }}>
                {FOOD_GROUPS[group as keyof typeof FOOD_GROUPS].label}
              </Text>
            </View>
          );
        })}
      </View>

      <Pressable
        onPress={() => setShowPopup(true)}
        style={styles.button}
      >
        <Text style={styles.text}>+ log something you ate</Text>
      </Pressable>
      <Text style={styles.subtitle} onPress={() => setShowLog(true)}>
        See Past Entries!
      </Text>
      <Modal visible={showLog} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <View style={{
            backgroundColor: '#FEF0B9',
            padding: 20,
            borderRadius: 16,
            width: '80%',

          }}>
            <Text onPress={() => setShowLog(false)} style={{ color: '#80231f', marginBottom: 12, textAlign: 'right' }}>x</Text>
            <Text style={styles.title}>Recent food</Text>
            {history.length === 0 && (
              <Text style={styles.text}>
                No past entries yet...
              </Text>
            )}
            {history.map(day => (
              <View key={day.date} style={{ marginBottom: 12 }}>
                <Text style={styles.subtitle}>
                  {day.date}
                </Text>
                {day.entries.length === 0 && (
                  <Text style={styles.text}>
                    No entries today 💛
                  </Text>
                )}
                {day.entries.length !== 0 && day.entries.map((entry: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, i: React.Key | null | undefined) => (
                  <Text key={i} style={styles.text}>
                    • {entry.name}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Modal>
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <View style={{
            backgroundColor: '#FEF0B9',
            padding: 20,
            borderRadius: 16,
            width: '80%',

          }}>
            <Text
              onPress={() => setShowPopup(false)}
              style={{ color: '#80231f', marginBottom: 12, textAlign: 'right' }}
            >
              x
            </Text>
            <Text style={styles.subtitle}>
              What have you eaten today?
            </Text>
            
            <View style={{ marginTop: 16 }}>

              <TextInput 
                placeholder="e.g. ramen, smoothie, sandwich"
                placeholderTextColor="#999"
                value={customFoodName}
                onChangeText={setCustomFoodName}
                style={styles.input}
              />

              <Pressable
                onPress={() => {
                  if (!customFoodName) return;
                  setCustomFoodName('');
                  addEntry({ name: customFoodName, groups: detectFoodGroups(customFoodName) });
                  setShowPopup(false);
                }}
                style={styles.button}
              >
                <Text style={styles.text}>
                  add food
                </Text>
              </Pressable>
            </View>

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
    fontFamily: "SourGummy_400Regular",
  },

  input: {
    backgroundColor: '#FFDD8D',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontFamily: "SourGummy_400Regular",
  },

  groupChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFF2CC',
  },

  groupChipSelected: {
    backgroundColor: '#FFD966',
  },

  addButton: {
    marginTop: 12,
    backgroundColor: '#ffb3e6',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    fontFamily: "SourGummy_400Regular",
    color: '#fff',
  },
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
    alignItems: 'center',
    fontFamily: "SourGummy_400Regular",
  },
  logo: {
    width: 300,
    height: 300,
    borderRadius: 18,
  },
});
