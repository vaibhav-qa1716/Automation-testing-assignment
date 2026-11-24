import { APIRequestContext, expect } from '@playwright/test';

export const API_BASE_URL =
  process.env.RESTFUL_BOOKER_BASE_URL ?? 'https://restful-booker.herokuapp.com';

export type BookingPayload = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

export function uniqueBooking(label = 'StackGuard'): BookingPayload {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
  return {
    firstname: label,
    lastname: `Test${suffix}`,
    totalprice: 175,
    depositpaid: true,
    bookingdates: { checkin: '2027-02-10', checkout: '2027-02-14' },
    additionalneeds: 'Breakfast'
  };
}

export async function createAuthToken(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${API_BASE_URL}/auth`, {
    data: { username: 'admin', password: 'password123' }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('token');
  return body.token as string;
}

export async function createBooking(
  request: APIRequestContext,
  payload = uniqueBooking()
): Promise<number> {
  const response = await request.post(`${API_BASE_URL}/booking`, { data: payload });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('bookingid');
  return body.bookingid as number;
}

export async function deleteBookingIfPresent(
  request: APIRequestContext,
  bookingId: number,
  token: string
): Promise<void> {
  await request.delete(`${API_BASE_URL}/booking/${bookingId}`, {
    headers: { Cookie: `token=${token}` }
  });
}
