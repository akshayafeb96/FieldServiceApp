# 🛠️ Field Service App

A full-stack React Native app with offline-first capabilities, built for field technicians to manage job assignments, complete equipment inspections, and sync job statuses with a backend API.

---

## 🚀 Features

- 🔐 **Login** screen with token-based authentication
- 📦 **SQLite** for offline job and equipment storage
- 📡 **Sync** button to:
  - Fetch assigned jobs and equipment from server
  - Upload completed jobs back to the API
- 📋 **Job Details** screen with equipment list and completion feature
- 📝 **Equipment Remarks** with local persistence
- 📶 **Offline Mode** indicator

---

## 📱 Screens Overview

### 🔐 Login Screen

- Username & password fields
- Sends credentials to `/login` endpoint
- Stores token locally

### 🏠 Home Screen

- Sync button to call `/sync_job` and `/upload_completed_jobs`
- Lists assigned and completed jobs from local DB
- Blue "Sync" button, grey offline indicator

### 📄 Job Details Screen

- Shows job ID, description, location, and status
- Lists equipment for the job
- Navigates to Equipment Remark screen on equipment tap
- “Mark Complete” button updates local DB

### 🛠️ Equipment Remark Screen

- Displays equipment name
- Input field to enter or update remarks
- "Save" button stores remarks locally

---

## 🌐 API Configuration

The app uses a local Express server for login, sync, and uploads.

### 🔧 Set your local IP:

1. Open `utils/config.ts`
2. Replace this line with your IP address:

```
export const API_BASE_URL = 'http://192.168.0.110:3000';
```

3. Your phone and PC must be on the same Wi-Fi network.
4. Start the server:

```bash
node server.js
```

To get your IP (Windows):

```bash
ipconfig
```

Then look for `IPv4 Address` (e.g., `192.168.1.23`).

---

## 🧪 Testing

- Use multiple jobs
- Complete equipment remarks
- Tap "Mark Complete" and test that it updates status
- Reopen the job to verify remarks persist

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/your-username/FieldServiceApp.git
cd FieldServiceApp

# Install dependencies
npm install

# Start Expo app
npx expo start

# Start Express server
node server.js
```

---

## ❗ Known Limitations / Assumptions

- Works only when phone and server are on the same network
- No token expiration logic
- No advanced job filtering
- Data is stored in SQLite and synced only manually
- Server is mock-based, using in-memory dummy jobs

---

## 📁 Folder Structure

```
.
├── App.tsx
├── utils/
│   └── config.ts            # 🔧 API base URL (edit this for testing)
│   └── database.ts          # SQLite logic
├── screens/
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── JobDetailScreen.tsx
│   ├── EquipmentRemarkScreen.tsx
├── server.js                # Express API server (for sync & login)
├── README.md                # ← You are here
```

---

## 🧑‍💻 Author

Built by AKSHAYA MOHAN for the technical assessment.