import { test, expect } from '@playwright/test';
import {
  API_BASE_URL, createAuthToken, createBooking, uniqueBooking
} from '../../utils/api';

test.describe('Restful-Booker API', () => {
  test('01 creates a booking and returns an identifier', async ({ request }) => {
    const payload = uniqueBooking();
    const response = await request.post(`${API_BASE_URL}/booking`, { data: payload });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking.firstname).toBe(payload.firstname);
    expect(body.booking.lastname).toBe(payload.lastname);
  });

  test('02 reads an existing booking by ID', async ({ request }) => {
    const id = await createBooking(request);
    const response = await request.get(`${API_BASE_URL}/booking/${id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('firstname');
    expect(body).toHaveProperty('bookingdates');
  });

  test('03 returns 404 for a non-existent booking ID', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/booking/0`);
    expect(response.status()).toBe(404);
  });

  test('04 updates a booking using PUT and a valid token', async ({ request }) => {
    const id = await createBooking(request);
    const token = await createAuthToken(request);
    const updated = { ...uniqueBooking('Updated'), totalprice: 250 };
    const response = await request.put(`${API_BASE_URL}/booking/${id}`, {
      headers: { Cookie: `token=${token}` }, data: updated
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(updated.firstname);
    expect(body.totalprice).toBe(250);
  });

  test('05 partially updates a booking using PATCH', async ({ request }) => {
    const id = await createBooking(request);
    const token = await createAuthToken(request);
    const response = await request.patch(`${API_BASE_URL}/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
      data: { firstname: 'PatchedName' }
    });
    expect(response.status()).toBe(200);
    expect((await response.json()).firstname).toBe('PatchedName');
  });

  test('06 deletes a booking using a valid token', async ({ request }) => {
    const id = await createBooking(request);
    const token = await createAuthToken(request);
    const response = await request.delete(`${API_BASE_URL}/booking/${id}`, {
      headers: { Cookie: `token=${token}` }
    });
    expect(response.status()).toBe(201);
    const readAfterDelete = await request.get(`${API_BASE_URL}/booking/${id}`);
    expect(readAfterDelete.status()).toBe(404);
  });

  test('07 rejects a PUT update when the token is missing', async ({ request }) => {
    const id = await createBooking(request);
    const response = await request.put(`${API_BASE_URL}/booking/${id}`, {
      data: uniqueBooking('NoToken')
    });
    expect(response.status()).toBe(403);
  });

  test('08 rejects a DELETE when the token is missing', async ({ request }) => {
    const id = await createBooking(request);
    const response = await request.delete(`${API_BASE_URL}/booking/${id}`);
    expect(response.status()).toBe(403);
  });

  test('09 rejects an update with an invalid token', async ({ request }) => {
    const id = await createBooking(request);
    const response = await request.patch(`${API_BASE_URL}/booking/${id}`, {
      headers: { Cookie: 'token=invalid-token' },
      data: { firstname: 'ShouldNotUpdate' }
    });
    expect(response.status()).toBe(403);
  });

  test('10 rejects an update for an invalid booking ID', async ({ request }) => {
    const token = await createAuthToken(request);
    const response = await request.put(`${API_BASE_URL}/booking/0`, {
      headers: { Cookie: `token=${token}` },
      data: uniqueBooking('MissingId')
    });
    expect([400, 404, 405]).toContain(response.status()); // Verify the service-specific status in a live run
  });
});
