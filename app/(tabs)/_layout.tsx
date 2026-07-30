import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
const dashpic = require('@/assets/images/callie-dashboard.png');
const nutrition = require('@/assets/images/callie-hungry.png');
const community = require('@/assets/images/callie-community.png');

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: 'Home', tabBarIcon: () => <Image source={dashpic} style={{ width: 48, height: 48 }} /> }} />
      <Tabs.Screen name="foodtrack" options={{ title: 'Nourishment', tabBarIcon: () => <Image source={nutrition} style={{ width: 48, height: 48 }} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: () => <Image source={community} style={{ width: 48, height: 48 }} /> }} />
    </Tabs>
  );
}
