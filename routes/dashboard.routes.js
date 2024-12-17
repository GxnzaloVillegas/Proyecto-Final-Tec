const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.post('/top-selling-products', dashboardController.getTopSellingProducts);
router.get('/low-stock-products', dashboardController.getLowStockProducts);
router.get('/sales-summary', dashboardController.getSalesSummary);

module.exports = router;
