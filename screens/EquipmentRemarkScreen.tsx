import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import db from '../utils/database';

type EquipmentRemarkRouteProp = RouteProp<RootStackParamList, 'EquipmentRemark'>;

const EquipmentRemarkScreen = () => {
  const route = useRoute<EquipmentRemarkRouteProp>();
  const navigation = useNavigation();
  const { equipmentId } = route.params;

  const [remark, setRemark] = useState('');
  const [equipmentName, setEquipmentName] = useState('');

  useEffect(() => {
    const loadRemark = async () => {
      if (!db) return;
      const rows = await db.getAllAsync('SELECT * FROM equipment WHERE id = ?', [equipmentId]);
      if (rows.length > 0) {
          const equipment = rows[0] as { name: string; remark: string };
          setRemark(equipment.remark || '');
          setEquipmentName(equipment.name);
}

    };
    loadRemark();
  }, [equipmentId]);

  const saveRemark = async () => {
    if (!db) return;
    await db.runAsync('UPDATE equipment SET remark = ? WHERE id = ?', [remark, equipmentId]);
    Alert.alert('Saved', 'Remark saved successfully');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{equipmentName}</Text>
      <TextInput
        placeholder="Enter remark"
        value={remark}
        onChangeText={setRemark}
        style={styles.input}
        multiline
      />
      <Button title="Save" onPress={saveRemark} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default EquipmentRemarkScreen;
