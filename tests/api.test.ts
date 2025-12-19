import { test, expect } from 'vitest';

// These integration-style tests expect the Next dev server to be running at http://localhost:3000
// Run the dev server manually before running `npm test`.

test('POST /api/mfsn/test-invalid-json returns 400', async () => {
  const res = await fetch('http://localhost:3000/api/mfsn/test-invalid-json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: ''
  });

  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.status).toBe('error');
  expect(json.message).toBe('Invalid JSON body');
});
