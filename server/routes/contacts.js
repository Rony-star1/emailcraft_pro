import express from 'express';
import { databases } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';
import { ID } from 'node-appwrite';

const router = express.Router();

// Get all contacts for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { documents: contacts } = await databases.listDocuments(
            'db',
            'contacts',
            [`userId=${userId}`]
        );
        res.json({ contacts });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ error: 'Failed to get contacts' });
    }
});

// Create a new contact
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, name, tags } = req.body;
        const contact = await databases.createDocument(
            'db',
            'contacts',
            ID.unique(),
            {
                userId,
                email,
                name,
                tags
            }
        );
        res.status(201).json({ contact });
    } catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

// Update a contact
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, tags } = req.body;
        const contact = await databases.updateDocument(
            'db',
            'contacts',
            id,
            {
                email,
                name,
                tags
            }
        );
        res.json({ contact });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// Delete a contact
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await databases.deleteDocument(
            'db',
            'contacts',
            id
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

export default router;
