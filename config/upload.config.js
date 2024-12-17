const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorios si no existen
const createUploadDirs = () => {
    const dirs = [
        path.join(__dirname, '../public/uploads/fichas-tecnicas'),
        path.join(__dirname, '../public/uploads/ordenes-compra')
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createUploadDirs();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.mimetype === 'application/pdf' 
            ? 'fichas-tecnicas'
            : 'ordenes-compra';
        
        const uploadPath = path.join(__dirname, `../public/uploads/${folder}`);
        
        // Asegurarse de que el directorio existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        console.log('Upload path:', uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        console.log('Request body:', req.body);
        if (file.mimetype === 'application/pdf') {
            // Usar un nombre temporal primero
            const tempName = `temp_${Date.now()}.pdf`;
            console.log('Generating temp filename:', tempName);
            cb(null, tempName);
        } else {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }
});

const excelFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Solo se permiten archivos Excel (.xls, .xlsx)');
        error.code = 'INVALID_FILE_TYPE';
        cb(error, false);
    }
};

const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        const error = new Error('Solo se permiten archivos PDF');
        error.code = 'INVALID_FILE_TYPE';
        cb(error, false);
    }
};

const uploadExcel = multer({ 
    storage: storage,
    fileFilter: excelFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadPDF = multer({ 
    storage: storage,
    fileFilter: pdfFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB para PDFs
});

module.exports = {
    uploadExcel,
    uploadPDF
}; 