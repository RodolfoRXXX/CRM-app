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
    { state: 'tickets-management', name: 'Tickets', type: '', icon: 'assignment', children: [
        { state: 'ticket/create-ticket', name: 'Crear ticket', type: '', icon: '' },
        { state: 'ticket/list-ticket', name: 'Lista de tickets', type: '', icon: '' },
        { state: 'ticket/historic-ticket', name: 'Histórico de tickets', type: '', icon: '' }
    ] },
    { state: 'indicators-management', name: 'Indicadores', type: '', icon: 'assessment', children: [
        { state: 'indicator1', name: 'Indicador 1', type: '', icon: '' },
        { state: 'indicator2', name: 'Indicador 2', type: '', icon: '' },
        { state: 'indicator3', name: 'Indicador 3', type: '', icon: '' }
    ] },
    { state: 'users-management', name: 'Empleados', type: '', icon: 'people', children: [
        { state: 'employee/employee-list', name: 'Lista de empleados', type: '', icon: '' }
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