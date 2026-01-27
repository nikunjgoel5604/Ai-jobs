const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/risk', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT `Job Title` as job_title, `Predicted Risk (XGB)` as risk_percent FROM `automation_master` ORDER BY `Predicted Risk (XGB)` DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// This route is needed for the "Job Growth Projection" chart
router.get('/growth', async (req, res) => {
    try {
        // This query now orders randomly to get a mix of high and low growth
        const [rows] = await db.query(
            'SELECT `Job Title` as job_title, `Job Openings (2024)` as openings_2024, `Projected Openings (2030)` as openings_2030 FROM `automation_master` ORDER BY RAND() LIMIT 10'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;