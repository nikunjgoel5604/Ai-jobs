const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const automationRoutes = require('./routes/automation');
const adoptionRoutes = require('./routes/adoption');
const jobsRoutes = require('./routes/jobs');
const skillsRoutes = require('./routes/skills');
const recommendationsRoutes = require('./routes/recommendations');
const dashboardRoutes = require('./routes/dashboard');
const careerRoutes = require('./routes/career');
const insightsRoutes = require('./routes/insights'); // ADD THIS LINE

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/automation', automationRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/insights', insightsRoutes); // ADD THIS LINE

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});