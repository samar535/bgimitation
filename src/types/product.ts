export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    images: string[];   // अब ये Cloudinary public_id या URL होंगे
    category: string;
    tags: string[];
    inStock: boolean;
    stockQuantity: number;
    // rating: number;
    // reviewCount: number;
    customizable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
  
export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    category: string;
    tags: string[];
    inStock: boolean;
    stockQuantity: number;
    customizable: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    productCount?: number;
    order?: number;
    createdAt?: any;
}

export interface PopularSearch {
    id: string;
    term: string;
    order: number;
}