const OrdenCompraService = require('../services/OrdenCompra.service');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const OrdenCompraController = {
  // Crear una nueva orden de compra
  async crearOrdenCompra(req, res) {
    try {
      const orden = await OrdenCompraService.crearOrdenCompra(req.body);
      res.status(201).json(orden);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la orden de compra' });
    }
  },

  // Actualizar el estado de una orden de compra
  async actualizarEstadoOrdenCompra(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const ordenActualizada = await OrdenCompraService.actualizarEstadoOrdenCompra(id, estado);
      res.status(200).json(ordenActualizada);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la orden de compra' });
    }
  },

  // Listar todas las órdenes de compra
  async listarOrdenesCompra(req, res) {
    try {
      const ordenes = await OrdenCompraService.listarOrdenesCompra();
      res.status(200).json(ordenes);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar las órdenes de compra' });
    }
  },
  async obtenerOrdenCompraPorId(req, res) {
    try {
      const ordenCompra = await OrdenCompraService.obtenerOrdenCompraPorId(req.params.id);
      res.json(ordenCompra);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  uploadFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se ha proporcionado ningún archivo' });
      }

      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const ordenCompraData = {
        fecha: new Date(),
        archivo_url: `/uploads/ordenes-compra/${req.file.filename}`, // Guardar la URL del archivo
        detalles: data.map(row => ({
          id_producto: row.id_producto,
          cantidad: row.cantidad,
          pre_unitario: row.precio_unitario
        }))
      };

      const nuevaOrden = await OrdenCompraService.crearOrdenCompra(ordenCompraData);
      
      res.status(201).json(nuevaOrden);
    } catch (error) {
      // Si hay error, eliminar el archivo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Error al procesar el archivo:', error);
      res.status(500).json({ message: 'Error al procesar el archivo' });
    }
  },

  uploadFichaTecnica: async (req, res) => {
    try {
        console.log('Request received:', {
            body: req.body,
            file: req.file,
            path: req.file?.path
        });

        if (!req.file) {
            return res.status(400).json({ 
                message: 'No se ha proporcionado ningún archivo'
            });
        }

        const { id_ordcompra } = req.body;
        console.log('ID de orden recibido:', id_ordcompra);

        if (!id_ordcompra) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: 'Se requiere el ID de la orden de compra'
            });
        }

        // Verificar que la orden existe
        const orden = await OrdenCompraService.obtenerOrdenCompraPorId(id_ordcompra);
        if (!orden) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({
                message: 'Orden de compra no encontrada'
            });
        }

        // Asegurarse de que el directorio existe
        const uploadDir = path.join(__dirname, '../public/uploads/fichas-tecnicas');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Crear el nombre del archivo final
        const fileName = `${id_ordcompra}.pdf`;
        const finalPath = path.join(uploadDir, fileName);

        // Si ya existe un archivo con ese nombre, eliminarlo
        if (fs.existsSync(finalPath)) {
            fs.unlinkSync(finalPath);
        }

        // Mover el archivo a su ubicación final
        fs.renameSync(req.file.path, finalPath);

        console.log('Archivo guardado en:', finalPath);

        const fichaTecnica = {
            nombre_archivo: fileName,
            ruta_archivo: `/uploads/fichas-tecnicas/${fileName}`,
            id_ordcompra
        };

        res.status(201).json({
            message: 'Ficha técnica subida exitosamente',
            fichaTecnica
        });

    } catch (error) {
        console.error('Error completo:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ 
            message: 'Error al procesar la ficha técnica',
            error: error.message
        });
    }
  }
};

module.exports = OrdenCompraController;
