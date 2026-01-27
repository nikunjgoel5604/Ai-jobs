const express = require('express');
const router = express.Router();
const db = require('../db');

// Route for "Future-Proof" Career Identifier (ENHANCED)
router.get('/future-proof-careers', async (req, res) => {
    try {
        // This new query ranks careers by the lowest automation risk, making it a stable and meaningful list.
        const [rows] = await db.query(`
            SELECT 
                gs.Job_Title,
                gs.Job_Growth_Projection,
                a.\`Predicted Risk (XGB)\` AS Automation_Risk
            FROM \`Gap skills 4.1\` gs
            JOIN \`automation_master\` a ON gs.Job_Title = a.\`Job Title\`
            WHERE gs.Job_Growth_Projection = 'Growth' 
              AND a.\`Predicted Risk (XGB)\` < 50
            GROUP BY gs.Job_Title, gs.Job_Growth_Projection, a.\`Predicted Risk (XGB)\`
            ORDER BY a.\`Predicted Risk (XGB)\` ASC
            LIMIT 15;
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route for Salary Benchmarking Tool
router.get('/salary-benchmark', async (req, res) => {
    const { jobTitle, location } = req.query;
    if (!jobTitle || !location) {
        return res.status(400).json({ error: 'Job title and location are required.' });
    }

    try {
        const query = `
            SELECT Salary_USD FROM \`Gap skills 4.1\` WHERE Job_Title = ? AND Location = ?
            UNION ALL
            SELECT salary_usd FROM \`adoption 3.2\` WHERE job_title = ? AND company_location = ?
        `;
        const [rows] = await db.query(query, [jobTitle, location, jobTitle, location]);
        
        if (rows.length === 0) {
            return res.json({ count: 0 });
        }

        const salaries = rows.map(r => r.Salary_USD);
        const stats = {
            count: salaries.length,
            min: Math.min(...salaries),
            max: Math.max(...salaries),
            avg: salaries.reduce((a, b) => a + b, 0) / salaries.length,
        };
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;