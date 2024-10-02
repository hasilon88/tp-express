import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
    static async getProducts(req: Request, res: Response) {
        const { minPrice, maxPrice, minStock, maxStock } = req.query;
        if (
            (minPrice !== undefined && isNaN(Number(minPrice))) ||
            (maxPrice !== undefined && isNaN(Number(maxPrice))) ||
            (minStock !== undefined && isNaN(Number(minStock))) ||
            (maxStock !== undefined && isNaN(Number(maxStock)))
        ) {
            return res.status(400).json({ message: 'Requête invalide' });
        }

        const filteredProducts = await ProductService.getAllProducts(
            minPrice ? Number(minPrice) : undefined,
            maxPrice ? Number(maxPrice) : undefined,
            minStock ? Number(minStock) : undefined,
            maxStock ? Number(maxStock) : undefined
        );

        res.status(200).json(filteredProducts);
    }
}
