import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

const MENUSETTINGS = [
    { state: 'index', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: 'user-data', name: 'Mi cuenta', type: 'employee', icon: 'fingerprint', children: [] },
    { state: '', name: 'Mi empresa', type: '1', icon: 'business', children: [
        { state: 'enterprise-info/enterprise-detail', name: 'Detalle de la empresa', type: '', icon: '' },
        { state: 'enterprise-info/enterprise-edit', name: 'Editar empresa', type: '', icon: '' }
    ] },
    { state: 'billing', name: 'Facturación', type: '2', icon: 'attach_money', children: [] },
    { state: 'security', name: 'Seguridad', type: '', icon: 'vpn_key', children: [] },
    { state: 'roles', name: 'Roles y permisos', type: '3', icon: 'security', children: [] },
];

const MENUMANAGEMENT = [
    { state: 'dashboard', name: 'Tablero', type: '', icon: 'dashboard', children: [

    ] },
    { state: '', name: 'Gestión de pedidos', type: '', icon: 'receipt', children: [
        { state: 'operation', name: 'Lista de pedidos', type: '', icon: '' }
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