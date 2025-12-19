(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/mfsn/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'pw',
        aid: 'aid',
        mobile: '555-5555',
        streetAddress1: '1 Main St',
        zip: '12345',
        city: 'City',
        state: 'ST',
        ssn: '000-00-0000',
        dob: '1990-01-01',
        type: 'consumer',
        product: 'credit'
      })
      {"error":"Enrollment failed","status":401,"detail":{"message":"Invalid token"}}
    });

    const text = await res.text();
    console.log('STATUS:', res.status);
    try {
      console.log('BODY:', JSON.parse(text));
    } catch (e) {
      console.log('BODY:', text);
    }
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
})();
