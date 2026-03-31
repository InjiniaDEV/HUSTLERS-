import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // TODO: Implement profile update API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      {success && <Text style={styles.success}>Profile updated!</Text>}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Save" onPress={handleSave} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  success: { color: 'green', marginBottom: 12, textAlign: 'center' },
});
