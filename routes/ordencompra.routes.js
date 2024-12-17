const express = require('express');
const router = express.Router();
const ordenCompraController = require('../controllers/ordenCompra.controller');
const { uploadExcel, uploadPDF } = require('../config/upload.config');
const path = require('path');

// Rutas para órdenes de compra
router.post('/', ordenCompraController.crearOrdenCompra);
router.put('/:id/estado', ordenCompraController.actualizarEstadoOrdenCompra);
router.get('/', ordenCompraController.listarOrdenesCompra);
router.get('/:id', ordenCompraController.obtenerOrdenCompraPorId);
router.post('/upload-file', uploadExcel.single('file'), ordenCompraController.uploadFile);
router.post('/upload-ficha-tecnica', uploadPDF.single('file'), ordenCompraController.uploadFichaTecnica);
router.get('/download-ficha-tecnica/:id', (req, res) => {
  const filePath = path.join(__dirname, `../public/uploads/fichas-tecnicas/${req.params.id}.pdf`);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: 'Archivo no encontrado' });
    }
  });
});
module.exports = router;
