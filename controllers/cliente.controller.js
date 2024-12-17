const clienteService = require('../services/cliente.service');

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
    try {
        const clientes = await clienteService.getAllClientes();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
}

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
    try {
        const clienteData = req.body;
        const nuevoCliente = await clienteService.createCliente(clienteData);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el cliente' });
    }
}

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
    try {
        const id = req.params.id;
        const cliente = await clienteService.getClienteById(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente' });
    }
}

// Actualizar un cliente
exports.updateCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const clienteData = req.body;
        const clienteActualizado = await clienteService.updateCliente(id, clienteData);
        if (!clienteActualizado) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
}

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
    try {
        const id = req.params.id;
        await clienteService.deleteCliente(id);
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        if (error.message === 'Cliente no encontrado') {
            res.status(404).json({ message: 'Cliente no encontrado' });
        } else {
            res.status(500).json({ message: 'Error al eliminar el cliente' });
        }
    }
};
