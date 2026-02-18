const BASE_URL = 'http://localhost:8000/api';
let token = '';

const login = async () => {
    try {
        console.log('Testing Login...');
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'jane@example.com',
                password: 'password123'
            })
        });

        if (!res.ok) throw new Error(`Status: ${res.status}`);

        const data = await res.json();
        token = data.token;
        console.log('✅ Login Successful');
    } catch (error) {
        console.error('❌ Login Failed:', error.message);
        process.exit(1);
    }
};

const testSearch = async () => {
    try {
        console.log('Testing Advanced Search...');
        const res = await fetch(`${BASE_URL}/users/search?query=developer&location=New York`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`Status: ${res.status}`);

        const data = await res.json();
        console.log(`✅ Search returned ${data.length} results`);
    } catch (error) {
        console.error('❌ Search Failed:', error.message);
    }
};

const testPagination = async () => {
    try {
        console.log('Testing Post Pagination...');
        const res = await fetch(`${BASE_URL}/posts?page=1&limit=5`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`Status: ${res.status}`);

        const data = await res.json();
        console.log(`✅ Fetched ${data.length} posts (Page 1)`);
    } catch (error) {
        console.error('❌ Pagination Failed:', error.message);
    }
};

const testForgotPassword = async () => {
    try {
        console.log('Testing Forgot Password...');
        const res = await fetch(`${BASE_URL}/users/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'jane@example.com' })
        });

        if (!res.ok) throw new Error(`Status: ${res.status}`);

        const data = await res.json();
        console.log('✅ Forgot Password Request/Simulated Email:', data.data || 'Success');
    } catch (error) {
        console.error('❌ Forgot Password Failed:', error.message);
    }
};

const run = async () => {
    await login();
    await testSearch();
    await testPagination();
    await testForgotPassword();
};

run();
