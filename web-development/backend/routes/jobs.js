const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/search', async (req, res) => {
    const searchTerm = req.query.skill || '';
    
    // --- DEBUGGING LINE ---
    // This will show you in your backend terminal exactly what it's trying to search for.
    console.log(`Received search request for: "${searchTerm}"`);

    if (!searchTerm) {
        return res.json([]); // Return empty results if search is empty
    }

    try {
        const query = 'SELECT job_title, company_name, salary_usd, company_location, employment_type, required_skills FROM `adoption 3.2` WHERE job_title LIKE ? OR required_skills LIKE ?';
        const queryParams = [`%${searchTerm}%`, `%${searchTerm}%`];
        
        const [rows] = await db.query(query, queryParams);
        
        // Log how many results were found
        console.log(`Found ${rows.length} results.`);
        
        res.json(rows);

    } catch (err) {
        // --- IMPROVED ERROR HANDLING ---
        // If the database query fails, this will log the detailed error on your server
        // and send a clear error message to the frontend.
        console.error("Database query failed:", err);
        res.status(500).json({ 
            error: "An error occurred while searching the database.",
            details: err.message 
        });
    }
});

// The rest of the file remains unchanged.
router.get('/titles', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT DISTINCT Job_Title FROM `Gap skills 4.1`');
        res.json(rows.map(row => row.Job_Title));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/locations', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT DISTINCT Location FROM \`Gap skills 4.1\`
            UNION
            SELECT DISTINCT company_location FROM \`adoption 3.2\`
        `);
        res.json(rows.map(row => row.Location).filter(Boolean));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;