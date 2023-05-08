import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

const MENUSETTINGS = [
    { state: 'user-data', name: 'Datos del usuario', type: 'link', icon: 'fingerprint' },
    { state: 'billing', name: 'Facturación', type: 'link', icon: 'attach_money' },
    { state: 'edit-username', name: 'Editar nombre de usuario', type: 'link', icon: 'account_circle' },
    { state: 'edit-password', name: 'Editar contraseña', type: 'link', icon: 'vpn_key' },
    { state: 'edit-email', name: 'Editar correo de ingreso', type: 'link', icon: 'email' },
    { state: 'delete-account', name: 'Eliminar cuenta', type: 'link', icon: 'power_settings_new' }
];

const MENUMANAGEMENT = [
    { state: 'user-data', name: 'Prueba 1', type: 'link', icon: 'fingerprint' },
    { state: 'billing', name: 'Prueba 2', type: 'link', icon: 'attach_money' },
    { state: 'edit-username', name: 'Prueba 3', type: 'link', icon: 'account_circle' },
    { state: 'edit-password', name: 'Prueba 4', type: 'link', icon: 'vpn_key' },
    { state: 'edit-email', name: 'Prueba 5', type: 'link', icon: 'email' },
    { state: 'delete-account', name: 'Prueba 6', type: 'link', icon: 'power_settings_new' }
];

const MENUOPERATION = [
    { state: 'user-data', name: 'Prueba 7', type: 'link', icon: 'fingerprint' },
    { state: 'billing', name: 'Prueba 8', type: 'link', icon: 'attach_money' },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle' },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key' },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email' },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new' }
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

}