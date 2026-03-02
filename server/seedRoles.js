const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('./models/Role');

dotenv.config();

const seedRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected...');

        await Role.deleteMany({});
        console.log('Roles deleted');

        const roles = [
            { name: 'Job Seeker' },
            { name: 'Recruiter' },
            { name: 'Admin' },
        ];

        await Role.insertMany(roles);
        console.log('Roles inserted');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedRoles();
