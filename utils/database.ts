import * as SQLite from 'expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Platform } from 'react-native';

const db = Platform.OS !== 'web' ? openDatabaseSync('field_service.db') : null;

export const createTables = async () => {
  if (!db) return;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY NOT NULL,
      description TEXT,
      location TEXT,
      status TEXT
    );
  `);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS equipment (
      id TEXT PRIMARY KEY NOT NULL,
      job_id TEXT,
      name TEXT,
      remark TEXT
    );
  `);
};

export const insertJob = async (job: {
  id: string;
  description: string;
  location: string;
  status: string;
}) => {
  if (!db) return;
  await db.runAsync(
    `INSERT OR REPLACE INTO jobs (id, description, location, status) VALUES (?, ?, ?, ?);`,
    [job.id, job.description, job.location, job.status]
  );
};


// Insert or update an equipment
export const insertEquipment = async (equipment: {
  id: string;
  job_id: string;
  name: string;
  remark: string;
}) => {
  if (!db) return;

  await db.runAsync(
    `INSERT OR REPLACE INTO equipment (id, job_id, name, remark) VALUES (?, ?, ?, ?);`,
    [equipment.id, equipment.job_id, equipment.name, equipment.remark]
  );
};


export const getAllJobs = async (): Promise<{
  id: string;
  description: string;
  location: string;
  status: string;
}[]> => {
  if (!db) return [];
  return await db.getAllAsync('SELECT * FROM jobs;');
};

export default db;
