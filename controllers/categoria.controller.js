const CategoriaService = require('../services/categoria.service');

// Obtener todos los clientes
exports.getAllCategoria = async (req, res) => {
    try {
        const categorias = await CategoriaService.getAllCategoria();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorias' });
    }
}

// Crear un nuevo cliente
exports.createCategoria = async (req, res) => {
    try {
        const catData = req.body;
        const nuevoCat = await CategoriaService.createCategoria(catData);
        res.status(201).json(nuevoCat);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoria' });
    }
}

// Obtener un cliente por ID
exports.getCategoriaById = async (req, res) => {
    try {
        const id = req.params.id;
        const categoria = await CategoriaService.getCategoriaById(id);
        if (!categoria) {
            return res.status(404).json({ message: 'Categoria no encontrada' });
        }
        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente' });
    }
}

// Actualizar un cliente
exports.updateCategoria = async (req, res) => {
    try {
        const id = req.params.id;
        const catData = req.body;
        const catctualizado = await CategoriaService.updateCategoria(id, catData);
        if (!catctualizado) {
            return res.status(404).json({ message: 'categoria no encontrada' });
        }
        res.status(200).json(catctualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la marca' });
    }
}
