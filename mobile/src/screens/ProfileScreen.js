import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProfileScreen({ navigation }) {
  // TODO: Fetch and display user profile from Redux or API
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {/* Display user info here */}
      <Button title="Edit Profile" onPress={() => {}} />
      <Button title="Upload KYC Documents" onPress={() => navigation.navigate('KYCUpload')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
});
