// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./db.sqlite');

// // Crear las tablas
// db.serialize(() => {
//   console.log('🛠️ Creando base de datos...');

//   // Tabla de usuarios
//   db.run(`
//     CREATE TABLE IF NOT EXISTS usuarios (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       telefono TEXT UNIQUE NOT NULL,
//       password TEXT NOT NULL
//     )
//   `, (err) => {
//     if (err) console.error('❌ Error creando tabla usuarios:', err.message);
//     else console.log('✅ Tabla "usuarios" creada.');
//   });

//   // Tabla de vehiculos
//   db.run(`
//     CREATE TABLE IF NOT EXISTS vehiculos (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       marca TEXT NOT NULL,
//       modelo TEXT NOT NULL,
//       año INTEGER NOT NULL,
//       precio REAL NOT NULL,
//       imagen TEXT
//     )
//   `, (err) => {
//     if (err) console.error('❌ Error creando tabla vehiculos:', err.message);
//     else console.log('✅ Tabla "vehiculos" creada.');
//   });

//   // Tabla de reservas
//   db.run(`
//     CREATE TABLE IF NOT EXISTS reservas (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       usuario_id INTEGER,
//       vehiculo_id INTEGER,
//       fecha_inicio TEXT,
//       fecha_fin TEXT,
//       FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
//       FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
//     )
//   `, (err) => {
//     if (err) console.error('❌ Error creando tabla reservas:', err.message);
//     else console.log('✅ Tabla "reservas" creada.');
//   });
// });

// // Cerrar la conexión cuando termine
// db.close(() => {
//   console.log('🏁 Base de datos lista y conexión cerrada.');
// });
