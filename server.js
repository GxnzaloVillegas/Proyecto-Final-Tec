const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bd = require('./config/bd.config');
const fs = require('fs');
// Importar las rutas
const clienteRoutes = require('./routes/cliente.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const productoRoutes = require('./routes/producto.routes');
const ventaRoutes = require('./routes/venta.routes');
const compraRoutes = require('./routes/ordencompra.routes');
const ubicacionRoutes = require('./routes/ubicacion.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const marcaRoutes = require('./routes/marca.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
// Configuración de la aplicación
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Crear carpetas si no existen
const uploadDirs = ['ordenes-compra', 'fichas-tecnicas'].map(dir => 
    path.join(__dirname, 'public/uploads', dir)
);

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Autenticación y sincronización de la base de datos
bd.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    return bd.sync({ alter: true }); // Sincroniza los modelos
  })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
  })
  .catch(err => {
    console.error('Error al conectar o sincronizar la base de datos:', err);
  });

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/ubicaciones', ubicacionRoutes);
app.use('/api/inventarios', inventarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/marcas', marcaRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
