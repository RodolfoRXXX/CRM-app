import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

const MENUSETTINGS = [
    { state: 'index', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: '', name: 'Mi perfíl', type: 'employee', icon: 'fingerprint', children: [
        { state: 'profile/profile-detail', name: 'Detalle de mi perfíl', type: '', icon: '' },
        { state: 'profile/profile-edit', name: 'Editar perfíl', type: '', icon: '' }
    ] },
    { state: '', name: 'Mi empresa', type: '1', icon: 'business', children: [
        { state: 'enterprise-info/enterprise-detail', name: 'Detalle', type: '', icon: '' },
        { state: 'enterprise-info/enterprise-edit', name: 'Edición de datos', type: '', icon: '' },
        { state: 'enterprise-info/roles', name: 'Roles y permisos', type: '', icon: '' },
        { state: 'enterprise-info/configuration', name: 'Configuración', type: '', icon: '' }
    ] },
    { state: 'security', name: 'Seguridad', type: '', icon: 'vpn_key', children: [] },
    { state: '', name: 'Configuración', type: '', icon: 'settings', children: [
        { state: 'configuration/configuration-detail', name: 'Detalles', type: '', icon: '' },
        { state: 'configuration/pricing', name: 'Planes de pago', type: '1', icon: '' }
    ] },
];

const MENUMANAGEMENT = [
    { state: 'dashboard', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: '', name: 'Pedidos', type: '', icon: 'receipt', children: [
        { state: 'order/order-list', name: 'Lista de pedidos', type: '', icon: '' },
        { state: 'order/order-detail', name: 'Edición de pedido', type: '', icon: '' }
    ] },
    { state: '', name: 'Productos', type: '', icon: 'assignment', children: [
        { state: 'product/product-list', name: 'Lista de productos', type: '', icon: '' },
        { state: 'product/add-product', name: 'Edición de producto', type: '6', icon: '' },
        { state: 'product/category', name: 'Categorías', type: '', icon: '' }
    ] },
    { state: '', name: 'Proveedores', type: '5', icon: 'group', children: [
        { state: 'provider/provider-list', name: 'Lista de proveedores', type: '', icon: '' },
        { state: 'provider/provider-edit', name: 'Edición de proveedor', type: '', icon: '' }
    ] },
    { state: '', name: 'Depósito', type: '', icon: 'storage', children: [
        { state: 'storage/storage-list', name: 'Lista de depósitos', type: '', icon: '' },
        { state: 'storage/storage-edit', name: 'Edición de depósitos', type: '1', icon: '' }
    ] }
];

@Injectable()
export class MenuItems {
    getMenuSettings(): Menu[] {
        return MENUSETTINGS;
    }
    getMenuManagement(): Menu[] {
        return MENUMANAGEMENT;
    }
}