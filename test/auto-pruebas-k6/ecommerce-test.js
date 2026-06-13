import http from 'k6/http';
import { check, sleep } from 'k6';

function cleanUrl(value, fallback) {
  return (value || fallback).replace(/\/$/, '');
}

const FRONTEND_URL = cleanUrl(__ENV.K6_FRONTEND_URL, 'http://localhost:3001');
const BACKEND_URL = cleanUrl(__ENV.K6_BACKEND_URL, 'http://localhost:3000');
const PROFILE = (__ENV.K6_PROFILE || 'smoke').toLowerCase();

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
    suite: 'catalogo',
    profile: PROFILE,
  },
};

export default function () {
  const frontendResponse = http.get(FRONTEND_URL, {
    tags: { endpoint: 'frontend' },
    timeout: '10s',
  });

  check(frontendResponse, {
    'frontend responde HTTP 200': (response) => response.status === 200,
  });

  const productsResponse = http.get(`${BACKEND_URL}/api/productos/cliente`, {
    tags: { endpoint: 'productos-cliente' },
    timeout: '10s',
  });

  check(productsResponse, {
    'productos responde HTTP 200': (response) => response.status === 200,
    'productos devuelve contenido': (response) => Boolean(response.body),
  });

  sleep(1);
}
