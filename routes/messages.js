const express = require('express');
const Message = require('../models/message');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const router = express.Router();

router.post('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const { to_username, body } = req.body;
        const from_username = req.user.username;
        const message = await Message.create({ from_username, to_username, body });
        return res.json({ message });
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        const message = await Message.get(req.params.id);
        if (message.from_user.username !== req.user.username && message.to_user.username !== req.user.username) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.json({ message });
    } catch (err) {
        return next(err);
    }
});

router.post('/:id/read', ensureLoggedIn, async function (req, res, next) {
    try {
        const { id } = req.params;
        const message = await Message.get(id);
        if (message.to_user.username === req.user.username) {
            const updatedMessage = await Message.markRead(id);
            return res.json({ message: updatedMessage });
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
