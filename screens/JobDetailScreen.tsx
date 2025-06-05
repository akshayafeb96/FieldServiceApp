import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import db from '../utils/database';

type JobDetailRouteProp = RouteProp<RootStackParamList, 'JobDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const JobDetailScreen = () => {
  const route = useRoute<JobDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { job } = route.params;

  const [equipment, setEquipment] = React.useState<
    { id: string; name: string; job_id: string; remark: string }[]
  >([]);

  const loadEquipment = async () => {
    if (!db) return;
    const rows = await db.getAllAsync('SELECT * FROM equipment WHERE job_id = ?', [job.id]);
    setEquipment(rows as any); // cast to avoid TS error
  };

  useFocusEffect(
    React.useCallback(() => {
      loadEquipment();
    }, [job.id])
  );

  const handleMarkComplete = async () => {
    if (!db) return;
    await db.runAsync('UPDATE jobs SET status = ? WHERE id = ?', ['completed', job.id]);
    Alert.alert('Success', 'Job marked as completed.');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Job ID: {job.id}</Text>
        <Text>Description: {job.description}</Text>
        <Text>Location: {job.location}</Text>
        <Text>Status: {job.status}</Text>

        <Text style={styles.subheading}>Equipment</Text>
        <FlatList
          data={equipment}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.equipmentItem}
              onPress={() =>
                navigation.navigate('EquipmentRemark', { equipmentId: item.id })
              }
            >
              <Text style={styles.equipmentName}>{item.name}</Text>
              <Text style={styles.remark}>{item.remark || 'No remark'}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.buttonContainer}>
          <Button title="Mark Complete" onPress={handleMarkComplete} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  equipmentItem: {
    backgroundColor: '#eee',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  equipmentName: {
    fontWeight: 'bold',
  },
  remark: {
    color: '#555',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default JobDetailScreen;
