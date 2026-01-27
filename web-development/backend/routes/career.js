const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/skill-gap', async (req, res) => {
    const { userSkills, jobTitle } = req.body;
    if (!userSkills || !jobTitle) {
        return res.status(400).json({ error: 'User skills and job title are required.' });
    }
    try {
        const [rows] = await db.query('SELECT Required_Skills FROM `Gap skills 4.1` WHERE LOWER(Job_Title) = LOWER(?) LIMIT 1', [jobTitle]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Job title not found.' });
        }
        
        // --- FIX IS HERE ---
        // 1. Create a Set of all user skills, converted to lowercase
        const userSkillsSet = new Set(userSkills.map(skill => skill.trim().toLowerCase()));
        
        // 2. Get the list of required skills
        const requiredSkills = rows[0].Required_Skills.split(',').map(skill => skill.trim());
        
        // 3. Filter by checking the lowercase version of the required skill against the lowercase Set
        const skillGaps = requiredSkills.filter(skill => !userSkillsSet.has(skill.toLowerCase()));
        // --- END OF FIX ---

        res.json({
            required: requiredSkills,
            gaps: skillGaps,
            suggestions: skillGaps, 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Career Path Recommendation Engine
router.get('/career-path', async (req, res) => {
    const { jobTitle } = req.query;
    if (!jobTitle) {
        return res.status(400).json({ error: 'Job title is required.' });
    }
    try {
        const [rows] = await db.query(`
            SELECT job_title, required_skills 
            FROM \`adoption 3.2\` 
            WHERE LOWER(job_title) != LOWER(?) 
            ORDER BY RAND()
            LIMIT 10
        `, [jobTitle]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;