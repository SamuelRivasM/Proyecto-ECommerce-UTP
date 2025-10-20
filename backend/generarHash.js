
// backend/generarHash.js
const bcrypt = require('bcryptjs');

const contraseñas = [
  { rol: 'cliente', pass: 'cliente123' },
  { rol: 'admin', pass: 'admin123' },
  { rol: 'cocina', pass: 'cocina123' }
];

const saltRounds = 10;

(async () => {
  for (let user of contraseñas) {
    try {
      const hash = await bcrypt.hash(user.pass, saltRounds);
      console.log(`${user.rol} -> ${user.pass} => ${hash}`);
    } catch (err) {
      console.error('Error generando hash:', err);
    }
  }
})();
