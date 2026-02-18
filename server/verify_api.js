
const loginUser = async () => {
    const baseURL = 'http://127.0.0.1:5000';

    console.log('1. Testing Root Endpoint...');
    try {
        const rootRes = await fetch(baseURL + '/');
        const rootText = await rootRes.text();
        console.log(`   Status: ${rootRes.status}`);
        console.log(`   Response: ${rootText}`);
    } catch (e) {
        console.error('   Failed to connect to root endpoint:', e.message);
        return;
    }

    console.log('\n2. Testing Login (john@example.com)...');
    try {
        const loginRes = await fetch(baseURL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'john@example.com',
                password: 'password123'
            })
        });

        if (loginRes.status !== 200) {
            console.error(`   Login Failed: ${loginRes.status}`);
            const err = await loginRes.text();
            console.error(`   Error: ${err}`);
            return;
        }

        const userData = await loginRes.json();
        console.log('   Login Successful!');
        console.log(`   User: ${userData.name}`);
        console.log(`   Token: ${userData.token ? 'Received generic authentication token' : 'No token received'}`);

        if (userData.token) {
            console.log('\n3. Testing Protected Route (Get User Profile via Token)...');
            // Assuming there's a route to get own profile or we can use the ID
            // userController.js has getUser which is /api/users/:id
            const profileRes = await fetch(`${baseURL}/api/users/${userData._id}`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            if (profileRes.status === 200) {
                const profile = await profileRes.json();
                console.log(`   Profile Fetched: ${profile.name} (${profile.email})`);
                console.log('   SUCCESS: Authentication flow is working.');
            } else {
                console.error(`   Failed to fetch profile: ${profileRes.status}`);
            }
        }

    } catch (e) {
        console.error('   Login Error:', e.message);
    }
};

loginUser();
