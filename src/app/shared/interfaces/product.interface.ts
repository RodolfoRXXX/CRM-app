export interface Product {
    id: number,
    id_enterprise: number,
    image: string,
    name: string,
    description: string,
    category: number,
    category_item: string,
    category_color: string,
    filters: string,
    id_option_1: number,
    id_option_2: number,
    option_1_name: string,
    option_2_name: string,
    sku: string,
    stock_real: number,
    is_stock: string,
    stock_available: number,
    storage_location: number,
    storage_name: string,
    sale_price: GLfloat,
    purchase_price: GLfloat,
    provider: number,
    provider_name: string,
    purchase_date: string,
    sale_date: string,
    state: string
}

export const empty_product: Product = {
    id: 0,
    id_enterprise: 0,
    image: '',
    name: '',
    description: '',
    category: 0,
    category_item: '',
    category_color: '',
    filters: '',
    id_option_1: 0,
    id_option_2: 0,
    option_1_name: '',
    option_2_name: '',
    sku: '',
    stock_real: 0,
    is_stock: '',
    stock_available: 0,
    storage_location: 0,
    storage_name: '',
    sale_price: 0.00,
    purchase_price: 0.00,
    provider: 0,
    provider_name: '',
    purchase_date: '',
    sale_date: '',
    state: 'inactivo'
}