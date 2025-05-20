const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');
const path = require('path');
const fs = require('fs');

// Middleware
app.use(express.static("public")); // Sirve archivos estáticos (index.html, img, css, js...)
app.use(express.json()); // Permite leer JSON del frontend

// =======================
// RUTA: Registro de usuario
// =======================
app.post("/registrar", (req, res) => {
  const { nombre, telefono, password } = req.body;

  const query = `INSERT INTO usuarios (nombre, telefono, password) VALUES (?, ?, ?)`;
  db.run(query, [nombre, telefono, password], function (err) {
    if (err) {
      console.error("❌ Error:", err.message);
      return res.status(500).send("Error al registrar");
    }
    res.send("Usuario registrado correctamente");
  });
});

// =======================
// RUTA: Login
// =======================
app.post('/login', (req, res) => {
  const { nombre, password } = req.body;

  const sql = `
    SELECT * FROM usuarios 
    WHERE (telefono = ? OR nombre = ?) AND password = ?
  `;

  db.get(sql, [nombre, nombre, password], (err, row) => {
    if (err) {
      console.error('❌ Error en login:', err.message);
      return res.status(500).json({ success: false });
    }

    if (row) {
      res.json({
        success: true,
        usuario: {
          id: row.id,
          nombre: row.nombre,
          telefono: row.telefono
        }
      });
    } else {
      res.json({ success: false });
    }
  });
});

// =======================
// RUTA: Obtener vehículos (solo con imagen existente)
// =======================
app.get('/vehiculos', (req, res) => {
  db.all('SELECT * FROM vehiculos', [], (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener vehículos:', err.message);
      return res.status(500).send('Error al consultar vehículos');
    }

    // Filtrar solo los que tienen imagen y archivo existente
    const vehiculosConImagen = rows.filter(coche => {
      if (!coche.imagen || coche.imagen.trim() === '') return false;

      const rutaAbsoluta = path.join(__dirname, 'public', coche.imagen);
      return fs.existsSync(rutaAbsoluta);
    });

    res.json(vehiculosConImagen);
  });
});

// =======================
// RUTA: Inicio sesción ADMIN
// =======================
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM administrador WHERE email = ? AND password = ?`;

  db.get(sql, [email, password], (err, administrador) => {
    if (err) {
      console.error('❌ Error en login admin:', err.message);
      return res.status(500).json({ success: false });
    }

    if (administrador) {
      res.json({
        success: true,
        administrador: {
          id: administrador.id,
          nombre: administrador.nombre,
          email: administrador.email
        }
      });
    } else {
      res.json({ success: false, mensaje: 'Credenciales incorrectas' });
    }
  });
});

// =======================
// INICIO DEL SERVIDOR
// =======================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚗 Servidor en marcha: http://localhost:${PORT}`);
});
