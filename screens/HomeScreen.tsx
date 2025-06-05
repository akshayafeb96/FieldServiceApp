import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import db, {
  createTables,
  insertJob,
  insertEquipment,
  getAllJobs,
} from '../utils/database';
import { RootStackParamList } from '../types/navigation';

type Job = {
  id: string;
  description: string;
  location: string;
  status: string;
};

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const init = async () => {
      await createTables();
      const dbJobs = await getAllJobs();
      setJobs(dbJobs);
    };
    init();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleSync = async () => {
    try {
      const response = await axios.post('http://192.168.0.110:3000/sync_job');
      const { status, jobs, equipment } = response.data;

      if (status === 'success') {
        if (!db) return;

        for (const job of jobs) {
          // Preserve existing completed job status
          const localJob = await db.getFirstAsync<{ status: string }>(
            'SELECT status FROM jobs WHERE id = ?',
            [job.id]
          );
          const finalStatus = localJob?.status === 'completed' ? 'completed' : job.status;

          await insertJob({ ...job, status: finalStatus });
        }

        for (const eq of equipment) {
          const existing = await db.getFirstAsync<{ remark: string }>(
            'SELECT remark FROM equipment WHERE id = ?',
            [eq.id]
          );
const remarkToKeep = existing?.remark || eq.remark;

          await insertEquipment({ ...eq, remark: remarkToKeep });
        }

        const dbJobs = await getAllJobs();
        setJobs(dbJobs);

        Alert.alert('Sync Complete', `${jobs.length} jobs loaded.`);
      } else {
        Alert.alert('Error', 'Unexpected response from server.');
      }
    } catch (error: any) {
      console.log('Sync error:', error.message || error);
      Alert.alert('Sync Failed', 'Could not connect to server.');
    }
  };

  const renderItem = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetail', { job: item })}
    >
      <Text style={styles.title}>{item.description}</Text>
      <Text>{item.location}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are offline</Text>
        </View>
      )}
      <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
        <Text style={styles.syncText}>🔄 Sync Data</Text>
      </TouchableOpacity>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  offlineBanner: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  offlineText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  syncButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  syncText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
