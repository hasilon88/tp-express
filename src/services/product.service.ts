import { config } from '../config/config';
import JsonModifier from '../utils/json_modifier';
import { Product } from '../models/product.model';

export class ProductService {
    static json_modifier = new JsonModifier();

    static async getAllProducts(minPrice?: number, maxPrice?: number, minStock?: number, maxStock?: number): Promise<Product[]> {
        const products: Product[] = await this.json_modifier.readJsonToData(config.DATA_PATH);

        const filteredProducts = products.filter(product => {
            const priceCondition = (
                (minPrice === undefined || product.price >= minPrice) &&
                (maxPrice === undefined || product.price <= maxPrice)
            );
            
            const stockCondition = (
                (minStock === undefined || product.quantity >= minStock) &&
                (maxStock === undefined || product.quantity <= maxStock)
            );

            return priceCondition && stockCondition;
        });

        return filteredProducts;
    }
}
