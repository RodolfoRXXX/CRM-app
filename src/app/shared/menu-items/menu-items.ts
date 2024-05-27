import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

const MENUSETTINGS = [
    { state: 'index', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: 'user-data', name: 'Mi cuenta', type: 'employee', icon: 'fingerprint', children: [] },
    { state: 'enterprise-data', name: 'Mi empresa', type: '1', icon: 'business', children: [] },
    { state: 'billing', name: 'Facturación', type: '2', icon: 'attach_money', children: [] },
    { state: 'security', name: 'Seguridad', type: '', icon: 'vpn_key', children: [] },
    { state: 'roles', name: 'Roles y permisos', type: '3', icon: 'security', children: [] },
];

const MENUMANAGEMENT = [
    { state: 'dashboard', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: '', name: 'Gestión de pedidos', type: '', icon: 'assignment', children: [
        { state: 'operation', name: 'Lista de pedidos', type: '', icon: '' }
    ] },
    { state: 'indicators-management', name: 'Facturación', type: '', icon: 'assessment', children: [
        { state: 'indicator1', name: 'Indicador 1', type: '', icon: '' },
        { state: 'indicator2', name: 'Indicador 2', type: '', icon: '' },
        { state: 'indicator3', name: 'Indicador 3', type: '', icon: '' }
    ] },
    { state: '', name: 'Productos', type: '', icon: 'storage', children: [
        { state: 'product/product-list', name: 'Lista de productos', type: '', icon: '' },
        { state: 'product/add-product', name: 'Agregar producto nuevo', type: '', icon: '' },
        { state: 'categories', name: 'Categorías', type: '', icon: '' },
        { state: 'depo', name: 'Depósito', type: '', icon: '' }
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