import type { Cookies } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';

export const MAX_AGE_MINUTES = 60;
const MAX_AGE_SECONDS = 60 * MAX_AGE_MINUTES;

export const COOKIE_NAME_SESSION = 'session';
export const COOKIE_NAME_NAMETAG = 'nametag';

const opts: CookieSerializeOptions = {
  maxAge: MAX_AGE_SECONDS,
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
};

export const getSessionCookie = (cookies: Cookies) => {
  return cookies.get(COOKIE_NAME_SESSION);
};

export const createSessionCookie = (cookies: Cookies, val: string) => {
  cookies.set(COOKIE_NAME_SESSION, val, opts);
};

export const destroySessionCookie = (cookies: Cookies) => {
  cookies.delete(COOKIE_NAME_SESSION, { path: opts.path });
};

export const getNametagCookie = (cookies: Cookies) => {
  return cookies.get(COOKIE_NAME_NAMETAG);
};

export const createNametagCookie = (cookies: Cookies, val: string) => {
  cookies.set(COOKIE_NAME_NAMETAG, val, opts);
};

export const destroyNametagCookie = (cookies: Cookies) => {
  cookies.delete(COOKIE_NAME_NAMETAG, { path: opts.path });
};
