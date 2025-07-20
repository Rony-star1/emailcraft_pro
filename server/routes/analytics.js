import express from 'express';
import { databases } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get campaign analytics
router.get('/campaigns/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { documents: [campaign] } = await databases.listDocuments(
            'db',
            'campaigns',
            [`$id=${id}`]
        );

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // This is a simplified analytics implementation.
        // In a real-world scenario, you would have more complex logic to track opens, clicks, etc.
        const analytics = {
            recipients: campaign.contacts.length,
            opens: Math.floor(Math.random() * campaign.contacts.length),
            clicks: Math.floor(Math.random() * campaign.contacts.length / 2),
            bounces: Math.floor(Math.random() * campaign.contacts.length / 10),
        };

        res.json({ analytics });
    } catch (error) {
        console.error('Get campaign analytics error:', error);
        res.status(500).json({ error: 'Failed to get campaign analytics' });
    }
});

export default router;
