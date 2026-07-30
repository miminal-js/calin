import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: 'Home' }} />
      <Tabs.Screen name="foodtrack" options={{ title: 'Nourishment' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
    </Tabs>
  );
}
