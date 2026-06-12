
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 25 },   // sube gradualmente a 25 usuarios
    { duration: '30s', target: 50 },   // sube a 50 usuarios
    { duration: '1m', target: 100 },   // sube hasta 100 usuarios
    { duration: '1m', target: 100 },   // mantiene 100 usuarios
    { duration: '30s', target: 0 },    // baja progresivamente a 0
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],              // menos del 5% de errores HTTP
    http_req_duration: ['p(95)<3000'],           // 95% de requests bajo 3 segundos,
  },
};

const FRONTEND = 'http://localhost:3001';
const BACKEND = 'http://localhost:3000';

export default function () {
  const home = http.get(`${FRONTEND}/`);

  check(home, {
    'Frontend responde con estado 200': (res) => res.status === 200,
    'Frontend responde en menos de 3 segundos': (res) => res.timings.duration < 3000,
  });

  const api = http.get(`${BACKEND}/api/productos/cliente`);

  check(api, {
    'Backend responde con estado 200': (res) => res.status === 200,
    'Backend responde en menos de 3 segundos': (res) => res.timings.duration < 3000,
  });

  sleep(1);
}
