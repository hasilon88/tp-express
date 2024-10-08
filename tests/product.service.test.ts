import { ProductService } from '../src/services/product.service';
import { Product } from '../src/models/product.model';
import JsonModifier from '../src/utils/json_modifier.utils';

jest.mock('../utils/json_modifier.utils');
jest.mock('../utils/logger.utils');

const mockJsonModifier = JsonModifier as jest.MockedClass<typeof JsonModifier>;

describe('ProductService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockJsonModifier.prototype.readJsonToData.mockResolvedValue([]);
    });

    test('should load products correctly', async () => {
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([
            new Product(1, 'Product 1', 10, 'Description 1', 5),
            new Product(2, 'Product 2', 20, 'Description 2', 10),
        ]);

        await ProductService['loadProducts']();
        const products = await ProductService.getAllProducts();
        
        expect(products).toHaveLength(2);
        expect(ProductService['idCount']).toBe(3); 
    });

    test('should return all products without filters', async () => {
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([
            new Product(1, 'Product 1',10, 'Description 1', 5),
            new Product(2, 'Product 2', 20, 'Description 2', 10),
        ]);

        const products = await ProductService.getAllProducts();
        expect(products).toHaveLength(2);
    });

    test('should add a new product', async () => {
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([]);
        mockJsonModifier.prototype.writeDataToJsonFile.mockResolvedValueOnce();

        const result = await ProductService.addProduct('New Product', 'New Description', 30, 15);
        expect(result).toBe(true);

        const products = await ProductService.getAllProducts();
        expect(products).toHaveLength(1);
        expect(products[0].name).toBe('New Product');
    });

    test('should not add a product if write fails', async () => {
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([]);
        mockJsonModifier.prototype.writeDataToJsonFile.mockRejectedValueOnce(new Error('Write failed'));

        const result = await ProductService.addProduct('New Product', 'New Description', 30, 15);
        expect(result).toBe(false);
    });

    test('should get a product by ID', async () => {
        const testProduct = new Product(1, 'Product 1', 10, 'Description 1', 5);
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([testProduct]);

        const product = await ProductService.getProduct(1);
        expect(product).toEqual(testProduct);
    });

    test('should return null for non-existent product ID', async () => {
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([]);

        const product = await ProductService.getProduct(999);
        expect(product).toBeNull();
    });

    test('should delete a product by ID', async () => {
        const testProduct = new Product(1, 'Product 1', 10, 'Description 1', 5);
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([testProduct]);
        mockJsonModifier.prototype.writeDataToJsonFile.mockResolvedValueOnce();

        const result = await ProductService.deleteProduct(1);
        expect(result).toBe(true);

        const products = await ProductService.getAllProducts();
        expect(products).toHaveLength(0);
    });

    test('should not delete a product if it does not exist', async () => {
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([]);
        const result = await ProductService.deleteProduct(999);
        expect(result).toBe(false);
    });

    test('should update an existing product', async () => {
        const testProduct = new Product(1, 'Product 1', 10, 'Description 1', 5);
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([testProduct]);
        mockJsonModifier.prototype.writeDataToJsonFile.mockResolvedValueOnce();

        const updatedProduct = await ProductService.updateProduct(1, 'Updated Product', 'Updated Description', 15, 10);
        expect(updatedProduct).not.toBeNull();
        expect(updatedProduct?.name).toBe('Updated Product');
    });

    test('should return null when trying to update a non-existent product', async () => {
        mockJsonModifier.prototype.readJsonToData.mockResolvedValueOnce([]);
        const updatedProduct = await ProductService.updateProduct(999, 'Updated Product', 'Updated Description', 15, 10);
        expect(updatedProduct).toBeNull();
    });
});
