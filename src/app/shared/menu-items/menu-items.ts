import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

const MENUSETTINGS = [
    { state: 'user-data', name: 'Datos del usuario', type: 'employee', icon: 'fingerprint', children: [] },
    { state: 'enterprise-data', name: 'Datos de la empresa', type: 'admin', icon: 'business', children: [] },
    { state: 'billing', name: 'Facturación', type: 'admin', icon: 'attach_money', children: [] },
    { state: 'edit-userphoto', name: 'Editar imagen de usuario', type: '', icon: 'add_a_photo', children: [] },
    { state: 'edit-username', name: 'Editar nombre de usuario', type: '', icon: 'account_circle', children: [] },
    { state: 'edit-password', name: 'Editar contraseña', type: '', icon: 'vpn_key', children: [] },
    { state: 'edit-email', name: 'Editar correo de ingreso', type: '', icon: 'email', children: [] },
    { state: 'delete-account', name: 'Eliminar cuenta', type: 'admin', icon: 'power_settings_new', children: [] }
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

const MENUOPERATION = [
    { state: 'operation', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: 'tickets-management', name: 'Tickets', type: '', icon: 'assignment', children: [
        { state: 'ticket-list-operator', name: 'Mis tickets', type: '', icon: 'assignment_ind' },
        { state: 'ticket-historic-operator', name: 'Histórico de tickets', type: '', icon: 'dashboard' }
    ] },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle', children: [] },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key', children: [] },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email', children: [] },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new', children: [] }
];

const MENUDEPO = [
    { state: 'depo', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: 'billing', name: 'Prueba 8', type: 'link', icon: 'attach_money', children: [] },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle', children: [] },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key', children: [] },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email', children: [] },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new', children: [] }
];

const MENUPURCHASE = [
    { state: 'purchase', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: 'billing', name: 'Prueba 8', type: 'link', icon: 'attach_money', children: [] },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle', children: [] },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key', children: [] },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email', children: [] },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new', children: [] }
];

const MENUADMINISTRATION = [
    { state: 'administration', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: 'billing', name: 'Prueba 8', type: 'link', icon: 'attach_money', children: [] },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle', children: [] },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key', children: [] },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email', children: [] },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new', children: [] }
];

const MENUCHAT = [
    { state: 'chat', name: 'Tablero', type: '', icon: 'dashboard', children: [] },
    { state: 'billing', name: 'Prueba 8', type: 'link', icon: 'attach_money', children: [] },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle', children: [] },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key', children: [] },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email', children: [] },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new', children: [] }
];

@Injectable()
export class MenuItems {
    getMenuSettings(): Menu[] {
        return MENUSETTINGS;
    }
    getMenuManagement(): Menu[] {
        return MENUMANAGEMENT;
    }
    getMenuOperation(): Menu[] {
        return MENUOPERATION;
    }
    getMenuDepo(): Menu[] {
        return MENUDEPO;
    }
    getMenuPurchase(): Menu[] {
        return MENUPURCHASE;
    }
    getMenuAdministration(): Menu[] {
        return MENUADMINISTRATION;
    }
    getMenuChat(): Menu[] {
        return MENUCHAT;
    }
}