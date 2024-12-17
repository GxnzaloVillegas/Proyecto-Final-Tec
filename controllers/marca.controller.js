const MarcaService = require('../services/marca.service');

// Obtener todos los clientes
exports.getAllMarca = async (req, res) => {
    try {
        const marcas = await MarcaService.getAllMarca();
        res.status(200).json(marcas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las marcas' });
    }
}

// Crear un nuevo cliente
exports.createMarca = async (req, res) => {
    try {
        const marcaData = req.body;
        const nuevoMarca = await MarcaService.createMarca(marcaData);
        res.status(201).json(nuevoMarca);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la marca' });
    }
}

// Obtener un cliente por ID
exports.getMarcaById = async (req, res) => {
    try {
        const id = req.params.id;
        const marca = await MarcaService.getMarcaById(id);
        if (!marca) {
            return res.status(404).json({ message: 'Marca no encontrado' });
        }
        res.status(200).json(marca);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente' });
    }
}

// Actualizar un cliente
exports.updateMarca = async (req, res) => {
    try {
        const id = req.params.id;
        const marcaData = req.body;
        const marcaActualizado = await MarcaService.updateMarca(id, marcaData);
        if (!marcaActualizado) {
            return res.status(404).json({ message: 'Marca no encontrada' });
        }
        res.status(200).json(marcaActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la marca' });
    }
}
