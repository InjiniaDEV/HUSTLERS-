import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function KycUploadScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    // TODO: Implement KYC document upload API call
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KYC Document Upload</Text>
      <Button title="Pick Document Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {uploading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Upload" onPress={handleUpload} disabled={!image} />
      )}
      {success && <Text style={styles.success}>Document uploaded successfully!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  image: { width: 200, height: 150, marginVertical: 16, alignSelf: 'center' },
  success: { color: 'green', marginTop: 12, textAlign: 'center' },
});
