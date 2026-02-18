
const http = require('http');

const postRequest = (path, data) => {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data);
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length,
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve(body);
                    }
                } else {
                    reject({ status: res.statusCode, body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(dataString);
        req.end();
    });
};

const getRequest = (path, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve(body);
                    }
                } else {
                    reject({ status: res.statusCode, body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
};

const verify = async () => {
    console.log('1. Testing Login...');
    try {
        const loginData = await postRequest('/api/auth/login', {
            email: 'john@example.com',
            password: 'password123'
        });
        console.log('   Login Successful!');
        console.log(`   User: ${loginData.name}`);

        if (loginData.token) {
            console.log('\n2. Testing Protected Route (Get User)...');
            const profile = await getRequest(`/api/users/${loginData._id}`, loginData.token);
            console.log(`   Profile Fetched: ${profile.name} (${profile.email})`);
            console.log('   SUCCESS: Authentication flow is working.');
        }
    } catch (e) {
        console.error('   Verification Failed:', e);
    }
};

verify();
