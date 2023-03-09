import express from 'express';
import productRepo from '../../repos/products.js';

const prodRouter = express.Router();

prodRouter.get('/admin/products', (req, res) => {});

prodRouter.get('/admin/products/new', (req, res) => {});

export default prodRouter;
