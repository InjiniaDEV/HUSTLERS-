import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const dummyKycRequests = [
  { id: '1', name: 'Jane Wanjiku', status: 'pending' },
  { id: '2', name: 'John Doe', status: 'pending' },
];

export default function KycReviewDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>KYC Review Dashboard</Text>
      <FlatList
        data={dummyKycRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 18 },
  status: { fontSize: 16, color: '#888' },
});
