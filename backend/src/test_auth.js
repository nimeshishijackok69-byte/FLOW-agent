
const API_BASE = 'http://localhost:5001/api/v1/auth';

async function test() {
  console.log('--- Testing Admin Login ---');
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login-password',
        email: 'admin@school.edu',
        password: 'admin123'
      })
    });
    const data = await res.json();
    console.log('Admin Login Response:', JSON.stringify(data, null, 2));
    if (data.accessToken) console.log('✅ Admin Login Success');
    else console.log('❌ Admin Login Failed');
  } catch (err) {
    console.error('Error during Admin Login:', err.message);
  }

  console.log('\n--- Testing Request OTP ---');
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'request-otp',
        email: 'head.mh054@cbss.school.org'
      })
    });
    const data = await res.json();
    console.log('Request OTP Response:', JSON.stringify(data, null, 2));
    if (data.school_code === 'MH054') console.log('✅ Request OTP Success (School Code returned)');
    else console.log('❌ Request OTP Failed (School Code missing or wrong)');
  } catch (err) {
    console.error('Error during Request OTP:', err.message);
  }

  console.log('\n--- Testing Verify OTP ---');
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify-otp',
        email: 'head.mh054@cbss.school.org',
        otp: '123456'
      })
    });
    const data = await res.json();
    console.log('Verify OTP Response:', JSON.stringify(data, null, 2));
    if (data.accessToken) {
        console.log('✅ Verify OTP Success');
        // Check if token has role
        const payload = JSON.parse(Buffer.from(data.accessToken.split('.')[1], 'base64').toString());
        console.log('Token Payload:', JSON.stringify(payload, null, 2));
        if (payload.role === 'functionary' && payload.schoolCode === 'MH054') {
            console.log('✅ Token differentiation Success');
        } else {
            console.log('❌ Token differentiation Failed');
        }
    }
    else console.log('❌ Verify OTP Failed');
  } catch (err) {
    console.error('Error during Verify OTP:', err.message);
  }
}

test();
