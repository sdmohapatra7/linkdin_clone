const express = require('express');
const router = express.Router();
const {
    sendConnectionRequest,
    acceptConnectionRequest,
    withdrawConnectionRequest,
    getConnectionRequests,
    getConnections
} = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, sendConnectionRequest);
router.put('/accept/:id', protect, acceptConnectionRequest);
router.delete('/withdraw/:id', protect, withdrawConnectionRequest);
router.get('/requests', protect, getConnectionRequests);
router.get('/', protect, getConnections);

module.exports = router;
