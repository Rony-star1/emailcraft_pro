import express from 'express';
import { databases } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';
import { ID } from 'node-appwrite';

const router = express.Router();

// Get all campaigns for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { documents: campaigns } = await databases.listDocuments(
            'db',
            'campaigns',
            [`userId=${userId}`]
        );
        res.json({ campaigns });
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({ error: 'Failed to get campaigns' });
    }
});

// Create a new campaign
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, subject, content, contacts } = req.body;
        const campaign = await databases.createDocument(
            'db',
            'campaigns',
            ID.unique(),
            {
                userId,
                name,
                subject,
                content,
                contacts,
                status: 'draft'
            }
        );
        res.status(201).json({ campaign });
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

// Update a campaign
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subject, content, contacts, status } = req.body;
        const campaign = await databases.updateDocument(
            'db',
            'campaigns',
            id,
            {
                name,
                subject,
                content,
                contacts,
                status
            }
        );
        res.json({ campaign });
    } catch (error) {
        console.error('Update campaign error:', error);
        res.status(500).json({ error: 'Failed to update campaign' });
    }
});

// Delete a campaign
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await databases.deleteDocument(
            'db',
            'campaigns',
            id
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({ error: 'Failed to delete campaign' });
    }
});

export default router;
