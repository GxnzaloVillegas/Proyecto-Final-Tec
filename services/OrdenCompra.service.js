const { OrdenCompra, DetalleOrdenCompra } = require('../models/index');
const InventarioUbicacion = require('../models/inventarioUbicacion.model');
const Proveedor = require('../models/proveedor.model');
const Producto = require('../models/producto.model');
const sequelize = require('../config/bd.config');
const { Op } = require('sequelize');

const OrdenCompraService = {
    async crearOrdenCompra(data) {
        const transaction = await sequelize.transaction();

        try {
            // Generar ID con formato OC-YYYY-NNNN
            const year = new Date().getFullYear();
            const lastOrder = await OrdenCompra.findOne({
                where: {
                    id_ordcompra: {
                        [Op.like]: `OC${year}%`
                    }
                },
                order: [['id_ordcompra', 'DESC']],
                transaction
            });

            let sequence = '0001';
            if (lastOrder) {
                const lastSequence = parseInt(lastOrder.id_ordcompra.slice(-4));
                sequence = (lastSequence + 1).toString().padStart(4, '0');
            }

            const id_ordcompra = `OC${year}${sequence}`;

            // Validar datos requeridos
            if (!data.id_proveedor || !data.id_ubicacion) {
                throw new Error('Faltan datos requeridos (proveedor o ubicación)');
            }

            // Validar que existan detalles
            if (!data.detalles || !Array.isArray(data.detalles) || data.detalles.length === 0) {
                throw new Error('La orden debe tener al menos un detalle');
            }

            // Calcular el total si no viene en los datos
            const total = data.detalles.reduce((sum, detalle) => 
                sum + (detalle.cantidad * detalle.pre_unitario), 0);

            // Crear la orden de compra
            const nuevaOrden = await OrdenCompra.create({
                id_ordcompra,
                id_proveedor: data.id_proveedor,
                id_ubicacion: data.id_ubicacion,
                fecha: data.fecha || new Date(),
                total: total,
                estado: '2' // Estado pendiente por defecto
            }, { transaction });

            // Procesar los detalles
            const detallesPromises = data.detalles.map(async detalle => {
                // Validar que el producto existe
                const producto = await Producto.findByPk(detalle.id_producto, { transaction });
                if (!producto) {
                    throw new Error(`Producto con ID ${detalle.id_producto} no existe`);
                }

                // Validar cantidades y precios
                if (detalle.cantidad <= 0 || detalle.pre_unitario <= 0) {
                    throw new Error('Cantidad o precio unitario inválido');
                }

                return {
                    id_ordcompra: nuevaOrden.id_ordcompra,
                    id_producto: detalle.id_producto,
                    cantidad: detalle.cantidad,
                    pre_unitario: detalle.pre_unitario,
                    subtotal: detalle.cantidad * detalle.pre_unitario
                };
            });

            const detalles = await Promise.all(detallesPromises);
            await DetalleOrdenCompra.bulkCreate(detalles, { transaction });

            await transaction.commit();
            
            // Retornar la orden con sus detalles
            return await OrdenCompra.findByPk(nuevaOrden.id_ordcompra, {
                include: [{
                    model: DetalleOrdenCompra,
                    as: 'detalles',
                    include: [{
                        model: Producto,
                        as: 'producto'
                    }]
                }]
            });

        } catch (error) {
            await transaction.rollback();
            console.error('Error detallado:', error);
            throw new Error(`Error al crear la orden de compra: ${error.message}`);
        }
    },

    async actualizarEstadoOrdenCompra(id, nuevoEstado) {
        const transaction = await sequelize.transaction(); // Iniciar la transacción
      
        try {
          const ordenCompra = await OrdenCompra.findByPk(id, { 
            include: [{ model: DetalleOrdenCompra, as: 'detalles' }] // Incluir los detalles
          });
      
          if (!ordenCompra) {
            throw new Error('Orden de compra no encontrada');
          }
      
          // Si el nuevo estado es "realizado" (estado = 1), se deben actualizar los inventarios
          if (nuevoEstado === '1') {
            for (const detalle of ordenCompra.detalles) { // Iterar sobre todos los detalles de la orden
              // Buscar si existe el producto en la ubicación del inventario
              let inventario = await InventarioUbicacion.findOne({
                where: {
                  id_producto: detalle.id_producto,
                  id_ubicacion: ordenCompra.id_ubicacion
                },
                transaction
              });
      
              if (inventario) {
                // Si existe, actualizar la cantidad en InventarioUbicacion
                inventario.cantidad += detalle.cantidad;
                await inventario.save({ transaction });
              } else {
                // Si no existe, crear un nuevo registro en InventarioUbicacion
                await InventarioUbicacion.create({
                  id_producto: detalle.id_producto,
                  id_ubicacion: ordenCompra.id_ubicacion,
                  cantidad: detalle.cantidad
                }, { transaction });
              }
      
              // Actualizar la cantidad en la tabla Producto
              const producto = await Producto.findByPk(detalle.id_producto, { transaction });
              producto.cantidad_total += detalle.cantidad;
              await producto.save({ transaction });
            }
          }
      
          // Actualizar el estado de la orden de compra
          ordenCompra.estado = nuevoEstado;
          await ordenCompra.save({ transaction });
      
          // Confirmar la transacción
          await transaction.commit();
      
          return ordenCompra;
        } catch (error) {
          // Si hay un error, hacemos rollback de todos los cambios
          await transaction.rollback();
          console.error('Error al actualizar el estado de la orden de compra:', error.message); // Muestra más detalles del error
          throw new Error('Error al actualizar el estado de la orden de compra');
        }
      },
      
  
      async listarOrdenesCompra() {
        try {
          const ordenesCompra = await OrdenCompra.findAll({
            include: [
              {
                model: DetalleOrdenCompra,
                as: 'detalles', // Alias correcto para los detalles de la orden
                include: {
                  model: Producto,
                  as: 'producto', // Alias correcto para la información del producto
                }
              }
            ]
          });
          return ordenesCompra;
        } catch (error) {
          console.error('Error al listar las órdenes de compra:', error.message);
          throw new Error('Error al listar las órdenes de compra');
        }
      },
      async obtenerOrdenCompraPorId(id_ordcompra) {
        try {
          const ordenCompra = await OrdenCompra.findByPk(id_ordcompra, {
            include: [
              {
                model: DetalleOrdenCompra,
                as: 'detalles', // Alias correcto para los detalles de la orden
                include: {
                  model: Producto,
                  as: 'producto', // Alias correcto para la información del producto
                }
              },
              {
                model: Proveedor,
                as: 'proveedor'
              }
            ]
          });
      
          if (!ordenCompra) {
            throw new Error('Orden de compra no encontrada');
          }
      
          return ordenCompra;
        } catch (error) {
          console.error('Error al obtener la orden de compra por ID:', error.message);
          throw new Error('Error al obtener la orden de compra por ID');
        }
      },
  };
  
  module.exports = OrdenCompraService;