import http from 'k6/http';
import { check, sleep } from 'k6';

function cleanUrl(value, fallback) {
  return (value || fallback).replace(/\/$/, '');
}

const BACKEND_URL = cleanUrl(__ENV.K6_BACKEND_URL, 'http://localhost:3000');
const LOGIN_EMAIL = __ENV.K6_LOGIN_EMAIL;
const LOGIN_PASSWORD = __ENV.K6_LOGIN_PASSWORD;
const PROFILE = (__ENV.K6_PROFILE || 'smoke').toLowerCase();

if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
  throw new Error('K6_LOGIN_EMAIL y K6_LOGIN_PASSWORD son obligatorios para la prueba de login.');
}

const profiles = {
  smoke: {
    vus: 1,
    duration: '20s',
  },
  load: {
    stages: [
      { duration: '30s', target: 10 },
      { duration: '1m', target: 25 },
      { duration: '30s', target: 50 },
      { duration: '30s', target: 0 },
    ],
  },
  stress: {
    stages: [
      { duration: '30s', target: 25 },
      { duration: '30s', target: 50 },
      { duration: '1m', target: 100 },
      { duration: '1m', target: 100 },
      { duration: '30s', target: 0 },
    ],
  },
};

export const options = {
  ...(profiles[PROFILE] || profiles.smoke),
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<3000'],
    checks: ['rate>0.95'],
  },
  tags: {
    suite: 'login',
    profile: PROFILE,
  },
};

export default function () {
  const payload = JSON.stringify({
    correo: LOGIN_EMAIL,
    contrasena: LOGIN_PASSWORD,
  });

  const response = http.post(`${BACKEND_URL}/api/auth/login`, payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'auth-login' },
    timeout: '10s',
  });

  check(response, {
    'login responde HTTP 200': (res) => res.status === 200,
    'login devuelve cuerpo JSON': (res) => {
      try {
        return Boolean(res.json());
      } catch (_) {
        return false;
      }
    },
    'login devuelve token o datos de usuario': (res) => {
      try {
        const body = res.json();
        return Boolean(body.token || body.usuario || body.user);
      } catch (_) {
        return false;
      }
    },
  });

  sleep(1);
}
