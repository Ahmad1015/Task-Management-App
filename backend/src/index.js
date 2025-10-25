const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Task Manager Backend is Running ✅');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
