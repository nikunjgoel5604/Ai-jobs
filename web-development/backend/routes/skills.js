const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/trending', async (req, res) => {
    try {
        // This query uses the correct `required_skills` column from the adoption 3.2 table
        const [rows] = await db.query('SELECT required_skills FROM `adoption 3.2`');
        
        const skillCounts = {};
        rows.forEach(row => {
            if (row.required_skills) {
                const skills = row.required_skills.split(',').map(skill => skill.trim());
                skills.forEach(skill => {
                    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                });
            }
        });

        const sortedSkills = Object.entries(skillCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([skill, count]) => ({ skill, count }));

        res.json(sortedSkills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;