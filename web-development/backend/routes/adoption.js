const express = require('express');
const router = express.Router();
const db = require('../db');

// Corrected query to use the exact column name with backticks
router.get('/sentiment', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT `Employee Sentiment` as sentiment, COUNT(*) as count FROM `adoption 3.1` WHERE `Employee Sentiment` IS NOT NULL AND `Employee Sentiment` != '' GROUP BY `Employee Sentiment`");
        
        const sentimentCounts = rows.reduce((acc, row) => {
            // Basic sentiment categorization
            const sentimentText = row.sentiment.toLowerCase();
            if (sentimentText.includes('increased') || sentimentText.includes('improved') || sentimentText.includes('exciting') || sentimentText.includes('helped')) {
                acc.positive = (acc.positive || 0) + row.count;
            } else if (sentimentText.includes('anxiety') || sentimentText.includes('scary') || sentimentText.includes('struggling')) {
                acc.negative = (acc.negative || 0) + row.count;
            } else {
                acc.neutral = (acc.neutral || 0) + row.count;
            }
            return acc;
        }, {});

        res.json(sentimentCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NEW ROUTE FOR IDEA C ---
// This powers the sentiment feed on the homepage
router.get('/feed', async (req, res) => {
    try {
        // Fetches 10 posts from sentiment 2.1, cleaning up the text a bit
        const [rows] = await db.query(`
            SELECT 
                TRIM(SUBSTRING_INDEX(text, '...', 1)) as text, 
                TRIM(role) as role 
            FROM \`sentiment 2.1\` 
            WHERE 
                role IS NOT NULL AND text IS NOT NULL 
                AND role != '' AND text != ''
                AND text NOT LIKE '%#%' 
            LIMIT 10
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;