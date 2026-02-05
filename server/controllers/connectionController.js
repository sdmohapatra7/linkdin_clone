const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Send connection request
// @route   POST /api/connections/request
// @access  Private
const sendConnectionRequest = async (req, res) => {
    const { receiverId } = req.body;

    if (req.user.id === receiverId) {
        res.status(400);
        throw new Error('You cannot connect with yourself');
    }

    // Check if request already exists
    const existingRequest = await ConnectionRequest.findOne({
        $or: [
            { sender: req.user.id, receiver: receiverId },
            { sender: receiverId, receiver: req.user.id },
        ],
    });

    if (existingRequest) {
        if (existingRequest.status === 'accepted') {
            return res.status(400).json({ message: 'Already connected' });
        }
        return res.status(400).json({ message: 'Connection request already sent' });
    }

    const request = await ConnectionRequest.create({
        sender: req.user.id,
        receiver: receiverId,
    });

    // Create Notification
    const notification = await Notification.create({
        recipient: receiverId,
        sender: req.user.id,
        type: 'connection',
    });

    await notification.populate('sender', 'name profilePicture');

    // Real-time update
    const io = req.app.get('io');
    if (io) {
        io.in(receiverId.toString()).emit('notification received', notification);
    }

    res.status(200).json(request);
};

// @desc    Accept connection request
// @route   PUT /api/connections/accept/:id
// @access  Private
const acceptConnectionRequest = async (req, res) => {
    const request = await ConnectionRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    if (request.receiver.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    request.status = 'accepted';
    await request.save();

    // Add to connections array for both users
    const sender = await User.findById(request.sender);
    const receiver = await User.findById(request.receiver);

    sender.connections.push(receiver._id);
    receiver.connections.push(sender._id);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Request accepted' });
};

// @desc    Get connection requests
// @route   GET /api/connections/requests
// @access  Private
const getConnectionRequests = async (req, res) => {
    const requests = await ConnectionRequest.find({
        receiver: req.user.id,
        status: 'pending',
    }).populate('sender', 'name headline profilePicture');

    res.json(requests);
};

// @desc    Get all connections
// @route   GET /api/connections
// @access  Private
const getConnections = async (req, res) => {
    const user = await User.findById(req.user.id).populate('connections', 'name headline profilePicture');
    res.json(user.connections);
}

module.exports = {
    sendConnectionRequest,
    acceptConnectionRequest,
    getConnectionRequests,
    getConnections
};
