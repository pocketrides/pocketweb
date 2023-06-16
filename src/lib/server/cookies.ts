import type { Cookies } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';

export const MAX_AGE_MINUTES = 60 * 24 * 1.5;
const MAX_AGE_SECONDS = 60 * MAX_AGE_MINUTES;

export const COOKIE_NAME_SESSION = 'session0610';
export const COOKIE_NAME_ROOM_KEY = 'roomkey';
export const COOKIE_NAME_NAMETAG = 'nametag';

const opts: CookieSerializeOptions = {
  maxAge: MAX_AGE_SECONDS,
  path: '/',
  httpOnly: true,
  secure: false,
  sameSite: 'lax'
};

export const getSessionCookie = (cookies: Cookies) => {
  return cookies.get(COOKIE_NAME_SESSION);
};

export const createSessionCookie = (cookies: Cookies, val: string) => {
  cookies.set(COOKIE_NAME_SESSION, val, opts);
};

export const destroySessionCookie = (cookies: Cookies) => {
  cookies.delete(COOKIE_NAME_SESSION, opts);
};

// export const getRoomKeyCookie = (cookies: Cookies) => {
//   return cookies.get(COOKIE_NAME_ROOM_KEY);
// };

// export const createRoomKeyCookie = (cookies: Cookies, val: string) => {
//   cookies.set(COOKIE_NAME_ROOM_KEY, val, opts);
// };

// export const destroyRoomKeyCookie = (cookies: Cookies) => {
//   cookies.delete(COOKIE_NAME_ROOM_KEY, opts);
// };

// export const getNametagCookie = (cookies: Cookies) => {
//   return cookies.get(COOKIE_NAME_NAMETAG);
// };

// export const createNametagCookie = (cookies: Cookies, val: string) => {
//   cookies.set(COOKIE_NAME_NAMETAG, val, opts);
// };

// export const destroyNametagCookie = (cookies: Cookies) => {
//   cookies.delete(COOKIE_NAME_NAMETAG, opts);
// };
