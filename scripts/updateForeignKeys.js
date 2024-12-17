require('dotenv').config();
const db = require('../config/bd.config');

async function updateForeignKeys() {
    try {
        console.log('Iniciando actualización de foreign keys...');
        
        await db.query('SET FOREIGN_KEY_CHECKS = 0');

        // Obtener todas las foreign keys (modificado para usar el nombre de la base de datos directamente)
        const [foreignKeys] = await db.query(`
            SELECT 
                TABLE_NAME,
                COLUMN_NAME,
                CONSTRAINT_NAME
            FROM
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE
                REFERENCED_TABLE_NAME = 'OrdenCompra'
                AND TABLE_SCHEMA = '${process.env.DB_NAME}'
        `);

        console.log('Foreign keys encontradas:', foreignKeys);

        // Eliminar foreign keys
        for (const fk of foreignKeys) {
            console.log(`Eliminando foreign key: ${fk.CONSTRAINT_NAME}`);
            await db.query(`
                ALTER TABLE ${fk.TABLE_NAME}
                DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}
            `);
        }

        // Modificar columnas
        console.log('Modificando columna en OrdenCompra...');
        await db.query(`
            ALTER TABLE OrdenCompra 
            MODIFY COLUMN id_ordcompra VARCHAR(15) NOT NULL
        `);

        // Modificar columnas en tablas relacionadas
        for (const fk of foreignKeys) {
            console.log(`Modificando columna en ${fk.TABLE_NAME}...`);
            await db.query(`
                ALTER TABLE ${fk.TABLE_NAME}
                MODIFY COLUMN ${fk.COLUMN_NAME} VARCHAR(15) NOT NULL
            `);
        }

        // Recrear foreign keys
        for (const fk of foreignKeys) {
            console.log(`Recreando foreign key: ${fk.CONSTRAINT_NAME}`);
            await db.query(`
                ALTER TABLE ${fk.TABLE_NAME}
                ADD CONSTRAINT ${fk.CONSTRAINT_NAME}
                FOREIGN KEY (${fk.COLUMN_NAME}) 
                REFERENCES OrdenCompra(id_ordcompra)
            `);
        }

        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('Actualización completada exitosamente');
    } catch (error) {
        console.error('Error detallado:', error);
        if (error.original) {
            console.error('Error SQL:', error.original.sqlMessage);
        }
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
    } finally {
        process.exit();
    }
}

// Verificar que tenemos el nombre de la base de datos
if (!process.env.DB_NAME) {
    console.error('Error: DB_NAME no está definido en las variables de entorno');
    process.exit(1);
}

console.log('Usando base de datos:', process.env.DB_NAME);
updateForeignKeys(); 