import axios from 'axios';

export default async function getProducts(): Promise<any> {
    const { data } = await axios.get('https://fakestoreapi.com/products');
    
    const modifiedProductData = data.map((product: any) => ({
        id: product.id,
        name: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: Math.floor(Math.random() * (99 - 11 + 1)) + 11 // Ensuring quantity is a whole number
    }));

    return modifiedProductData;
}
