const fs = require('fs');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');
const multer = require('multer');
const path = require('path');

// Asegurarse de que la carpeta exista
const imgDir = path.join(__dirname, 'public/img/coches');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Configuración de Multer para guardar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imgDir),
  filename: (req, file, cb) => {
    const nombreLimpio = file.originalname.replace(/\s+/g, '_').toLowerCase();
    const nombreFinal = `${Date.now()}_${nombreLimpio}`;
    cb(null, nombreFinal);
  }
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use(express.json());

// Ruta para añadir vehículo
app.post('/vehiculos', upload.single('imagen'), (req, res) => {
  const {
    marca = '',
    modelo = '',
    año = '',
    precio = '',
    estado = 'disponible',
    descripcion = '',
    velocidad = '',
    matricula = '',
    color = ''
  } = req.body;

  const imagen = req.file ? `/img/coches/${req.file.filename}` : null;

  const sql = `
    INSERT INTO vehiculos (
      marca, modelo, año, precio, imagen, estado,
      descripcion, velocidad, matricula, color
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    marca,
    modelo,
    año,
    precio,
    imagen,
    estado,
    descripcion,
    velocidad,
    matricula,
    color
  ];

  db.run(sql, valores, function (err) {
    if (err) {
      console.error('❌ Error al guardar vehículo:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, id: this.lastID });
  });
});
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
// Editar vehículo
// =======================
app.put('/vehiculos/:id', (req, res) => {
  const id = req.params.id;
  const { matricula, marca, modelo, año, color, velocidad, precio, estado } = req.body;

  const sql = `
    UPDATE vehiculos SET
      matricula = ?, 
      marca = ?, 
      modelo = ?, 
      año = ?, 
      color = ?, 
      velocidad = ?, 
      precio = ?, 
      estado = ?
    WHERE id = ?
  `;

  db.run(sql, [matricula, marca, modelo, año, color, velocidad, precio, estado, id], function (err) {
    if (err) {
      console.error('❌ Error al actualizar vehículo:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }

    res.json({ success: true, mensaje: "Vehículo actualizado correctamente" });
  });
});
// =======================
// RESERVA
// =======================
app.post('/reservas', (req, res) => {
  const {
    nombre_conductor,
    email,
    dni,
    modelo,          
    fecha_inicio,
    fecha_fin,
    entrega,
    recogida,
    matricula,
    id_coche         
  } = req.body;

  const estado = 'pendiente';

  const sql = `
    INSERT INTO reservas (
      nombre_conductor,
      email,
      dni,
      modelo_coche,
      fecha_inicio,
      fecha_fin,
      entrega,
      recogida,
      estado,
      matricula
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    nombre_conductor,
    email,
    dni,
    modelo,
    fecha_inicio,
    fecha_fin,
    entrega,
    recogida,
    estado,
    matricula
  ];

  db.run(sql, valores, function (err) {
    if (err) {
      console.error('❌ Error al guardar reserva:', err.message);
      return res.status(500).send('Error al guardar la reserva');
    }

    res.send('✅ Reserva guardada correctamente');
  });
});

// =======================
// SOLICITUDES
// =======================
// =======================
// OBTENER TODAS LAS RESERVAS
// =======================
app.get('/reservas', (req, res) => {
  db.all('SELECT * FROM reservas ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener reservas:', err.message);
      res.status(500).send('Error al consultar reservas');
    } else {
      res.json(rows);
    }
  });
});

// =======================
// ACTUALIZAR ESTADO DE UNA RESERVA
// =======================
app.put('/reservas/:id', (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  const sql = `UPDATE reservas SET estado = ? WHERE id = ?`;

  db.run(sql, [estado, id], function (err) {
    if (err) {
      console.error('❌ Error al actualizar estado de reserva:', err.message);
      return res.status(500).send('Error al actualizar');
    }
    res.send('✅ Estado actualizado');
  });
});


// =======================
// INICIO DEL SERVIDOR
// =======================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚗 Servidor en marcha: http://localhost:${PORT}`);
});
