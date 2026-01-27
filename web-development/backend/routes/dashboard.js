const express = require('express');
const router = express.Router();
const db = require('../db');

// Job Growth Projections by Industry
router.get('/job-growth-by-industry', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                Industry, 
                SUM(\`Projected Openings (2030)\` - \`Job Openings (2024)\`) AS Growth 
            FROM \`automation_master\` 
            GROUP BY Industry 
            ORDER BY Growth DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Automation Risk vs. Salary
router.get('/automation-risk-vs-salary', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                \`Job Title\`, 
                \`Median Salary (USD)\` AS salary, 
                \`Automation Risk (%)\` AS risk 
            FROM \`automation_master\`
            LIMIT 50 
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Adoption Levels by Location
router.get('/ai-adoption-by-location', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                Location, 
                AVG(CASE 
                    WHEN AI_Adoption_Level = 'High' THEN 3 
                    WHEN AI_Adoption_Level = 'Medium' THEN 2 
                    ELSE 1 
                END) AS AvgAdoption 
            FROM \`Gap skills 4.1\` 
            GROUP BY Location 
            ORDER BY AvgAdoption DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NEW ROUTE: For the automation trends chart
// This query reads from your 'automation_trends' table
router.get('/automation-risk-trends', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                Industry, 
                AVG(\`Automation Risk 2020 (%)\`) as avg_2020,
                AVG(\`Automation Risk 2021 (%)\`) as avg_2021,
                AVG(\`Automation Risk 2022 (%)\`) as avg_2022,
                AVG(\`Automation Risk 2023 (%)\`) as avg_2023,
                AVG(\`Automation Risk 2024 (%)\`) as avg_2024
            FROM \`automation_trends\`
            GROUP BY Industry
            ORDER BY avg_2024 DESC
            LIMIT 5 
        `); // Limiting to top 5 for chart readability
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NEW ROUTES FOR IDEAS A & B ---

// IDEA A.1: Productivity Change vs. Training Hours (from adoption 3.1)
router.get('/productivity-vs-training', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT `Training Hours Provided`, `Productivity Change (%)` FROM `adoption 3.1` LIMIT 100"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// IDEA A.2: New Roles Created by Industry (from adoption 3.1)
router.get('/new-roles-by-industry', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT Industry, AVG(\`New Roles Created\`) as AvgNewRoles 
            FROM \`adoption 3.1\` 
            GROUP BY Industry 
            ORDER BY RAND()
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// IDEA A.3: Most Adopted GenAI Tools (from adoption 3.1)
router.get('/genai-tool-adoption', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT \`GenAI Tool\`, COUNT(*) as count 
            FROM \`adoption 3.1\` 
            WHERE \`GenAI Tool\` IS NOT NULL AND \`GenAI Tool\` != ''
            GROUP BY \`GenAI Tool\` 
            ORDER BY RAND()
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// IDEA B.1: Job Postings by Location (from adoption 3.2)
router.get('/postings-by-location', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT company_location, COUNT(*) as count 
            FROM \`adoption 3.2\` 
            GROUP BY company_location 
            ORDER BY count DESC 
            LIMIT 10
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// IDEA B.2: Experience Level Demand (from adoption 3.2)
router.get('/experience-level-demand', async (req, res) => {
    try {
        // This query now randomizes the 4 experience levels in the chart
        const [rows] = await db.query(
            "SELECT experience_level, COUNT(*) as count FROM `adoption 3.2` GROUP BY experience_level ORDER BY RAND()"
        );
        // Map codes to full names for the chart
        const levelMap = { 'EN': 'Entry-level', 'MI': 'Mid-level', 'SE': 'Senior-level', 'EX': 'Executive' };
        const mappedRows = rows.map(row => ({
            level: levelMap[row.experience_level] || row.experience_level,
            count: row.count
        }));
        res.json(mappedRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NEW ROUTE: Actual vs. Predicted Risk (NOW FIXED) ---
router.get('/actual-vs-predicted-risk', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                \`Automation Risk (%)\` as actual_risk, 
                \`Predicted Risk (XGB)\` as predicted_risk 
            FROM \`automation_master\`
            WHERE \`Automation Risk (%)\` IS NOT NULL AND \`Predicted Risk (XGB)\` IS NOT NULL
            LIMIT 200
        `);
        res.json(rows);
    } catch (err) { // <-- Added {
        res.status(500).json({ error: err.message });
    } // <-- Removed extra }
});
module.exports = router;