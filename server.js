const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let completedJobIds = [];

const dummyJobs = [
  {
    id: 'JOB001',
    description: 'Fix generator',
    location: 'Factory A',
    status: 'assigned',
    equipment: [
      { id: 'equip-JOB001-1', job_id: 'JOB001', name: 'Generator', remark: '' },
      { id: 'equip-JOB001-2', job_id: 'JOB001', name: 'Control Panel', remark: '' }
    ]
  },
  {
    id: 'JOB002',
    description: 'Inspect HVAC',
    location: 'Office B',
    status: 'assigned',
    equipment: [
      { id: 'equip-JOB002-1', job_id: 'JOB002', name: 'AC Unit', remark: '' }
    ]
  }
];

app.post('/sync_job', (req, res) => {
  const jobs = dummyJobs.map(job => {
    const isCompleted = completedJobIds.includes(job.id);
    return {
      id: job.id,
      description: job.description,
      location: job.location,
      status: isCompleted ? 'completed' : job.status
    };
  });

  const allEquipment = dummyJobs.flatMap(job => job.equipment);

  res.json({
    status: 'success',
    jobs,
    equipment: allEquipment
  });
});

app.post('/upload_completed_jobs', (req, res) => {
  const completedJobs = req.body;
  console.log('📤 Received completed jobs:', completedJobs);
  completedJobs.forEach(job => {
    if (!completedJobIds.includes(job.id)) {
      completedJobIds.push(job.id);
    }
  });

  res.json({ status: 'received', count: completedJobs.length });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'test' && password === '1234') {
    res.json({ status: 'success', token: 'abcd1234' });
  } else {
    res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
