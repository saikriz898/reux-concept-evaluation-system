const axios = require('axios');

async function testIdempotency() {
  try {
    const studentEmail = `fresh_${Date.now()}@gmail.com`;
    const password = 'Student@123';

    console.log('--- Registering ---');
    await axios.post('http://localhost:5001/api/auth/register', {
      name: 'Fresh Student',
      email: studentEmail,
      password: password,
      role: 'student'
    });

    console.log('--- Logging in ---');
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: studentEmail,
      password: password
    });
    const token = loginRes.data.accessToken;

    const examRes = await axios.get('http://localhost:5001/api/exams/student', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const exam = examRes.data[0];

    console.log('--- Starting Attempt 1 ---');
    const res1 = await axios.post('http://localhost:5001/api/attempts/start', { examId: exam.id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Attempt 1 ID:', res1.data.id);

    console.log('--- Starting Attempt 2 (Idempotency Test) ---');
    const res2 = await axios.post('http://localhost:5001/api/attempts/start', { examId: exam.id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Attempt 2 ID:', res2.data.id);

    if (res1.data.id === res2.data.id) {
      console.log('SUCCESS: Idempotency confirmed');
    } else {
      console.log('FAILURE: Different IDs');
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testIdempotency();
