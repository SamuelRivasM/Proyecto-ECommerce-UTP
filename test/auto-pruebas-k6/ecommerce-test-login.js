
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
        http_req_duration: ['p(95)<3000'],           // 95% de requests bajo 3 segundos
        'http_req_duration{endpoint:login}': ['p(95)<3000'], // login bajo 3 segundos en p95
    },
};

const FRONTEND = 'http://localhost:3001';
const BACKEND = 'http://localhost:3000';

export default function () {
    const home = http.get(`${FRONTEND}/`, {
        tags: { endpoint: 'frontend' },
    });

    check(home, {
        'Frontend responde con estado 200': (res) => res.status === 200,
        'Frontend responde en menos de 3 segundos': (res) => res.timings.duration < 3000,
    });

    const payload = JSON.stringify({
        email: 'cliente@utp.edu.pe',
        password: 'cliente123',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        tags: {
            endpoint: 'login',
        },
    };

    const login = http.post(`${BACKEND}/api/auth/login`, payload, params);

    check(login, {
        'Login responde correctamente': (res) => res.status === 200,
        'Login responde en menos de 3 segundos': (res) => res.timings.duration < 3000,
    });

    sleep(1);
}
