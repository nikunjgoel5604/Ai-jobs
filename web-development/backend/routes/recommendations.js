const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/skills', async (req, res) => {
    try {
        const { industry } = req.query;
        let query = 'SELECT required_skills FROM `adoption 3.2`';
        const queryParams = [];

        if (industry) {
            query += ' WHERE industry = ?';
            queryParams.push(industry);
        }

        const [rows] = await db.query(query, queryParams);
        
        const skillCounts = {};
        rows.forEach(row => {
            if (row.required_skills) {
                row.required_skills.split(',').forEach(skill => {
                    const trimmedSkill = skill.trim();
                    if (trimmedSkill) {
                        skillCounts[trimmedSkill] = (skillCounts[trimmedSkill] || 0) + 1;
                    }
                });
            }
        });

        const sortedSkills = Object.entries(skillCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5)
            .map(([skill, count]) => ({ skill, count })); // Return objects with skill and count

        res.json({ top_skills: sortedSkills });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;