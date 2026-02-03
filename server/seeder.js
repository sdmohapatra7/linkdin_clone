const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const ConnectionRequest = require('./models/ConnectionRequest');
const Chat = require('./models/Chat');
const Message = require('./models/Message');
const Job = require('./models/Job');
const Notification = require('./models/Notification');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Post.deleteMany();
        await ConnectionRequest.deleteMany();
        await Chat.deleteMany();
        await Message.deleteMany();

        console.log('Data Destroyed...');

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const createdUsers = await User.insertMany([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: password,
                headline: 'Software Engineer',
                about: 'Passionate about building scalable web applications.',
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                profilePicture: '',
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: password,
                headline: 'Product Manager',
                about: 'Driving product vision and strategy.',
                skills: ['Product Management', 'Agile', 'Scrum', 'UX'],
                profilePicture: '',
            },
            {
                name: 'Bob Jones',
                email: 'bob@example.com',
                password: password,
                headline: 'UX Designer',
                about: 'Designing intuitive and user-friendly interfaces.',
                skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
                profilePicture: '',
            },
        ]);

        const adminUser = createdUsers[0];
        const user2 = createdUsers[1];
        const user3 = createdUsers[2];

        // Create Connection: John <-> Jane
        user2.connections.push(adminUser._id);
        adminUser.connections.push(user2._id);
        await user2.save();
        await adminUser.save();

        await ConnectionRequest.create({
            sender: adminUser._id,
            receiver: user2._id,
            status: 'accepted',
        });

        // Pending Request: Bob -> John
        await ConnectionRequest.create({
            sender: user3._id,
            receiver: adminUser._id,
            status: 'pending',
        });

        // Create Posts
        await Post.insertMany([
            {
                user: adminUser._id,
                text: 'Just finished a great project using the MERN stack! #webdev #coding',
            },
            {
                user: user2._id,
                text: 'Excited to announce our new product launch next week! Stay tuned.',
            },
            {
                user: user3._id,
                text: 'Loving the new features in Figma. Makes design so much easier.',
            },
        ]);

        // Create Chat: John & Jane
        const chat = await Chat.create({
            chatName: 'sender',
            isGroupChat: false,
            users: [adminUser._id, user2._id],
        });

        // Create Messages
        const msg1 = await Message.create({
            sender: adminUser._id,
            content: 'Hey Jane, how is the product launch going?',
            chat: chat._id,
        });

        const msg2 = await Message.create({
            sender: user2._id,
            content: 'Hi John! It is going great. Just wrapping up some final details.',
            chat: chat._id,
        });

        chat.latestMessage = msg2._id;
        await chat.save();

        // Create Jobs
        await Job.create([
            {
                title: 'Senior React Developer',
                company: 'Tech Corp',
                location: 'Remote',
                description: 'Looking for an experienced React developer to lead our frontend team.',
                type: 'Full-time',
                postedBy: adminUser._id,
            },
            {
                title: 'Node.js Backend Engineer',
                company: 'Startup Inc',
                location: 'New York, NY',
                description: 'Join our fast-paced startup building scalable APIs.',
                type: 'Contract',
                postedBy: user2._id,
            },
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Post.deleteMany();
        await ConnectionRequest.deleteMany();
        await Chat.deleteMany();
        await Message.deleteMany();
        await Job.deleteMany();
        await Notification.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
