import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

const MENUSETTINGS = [
    { state: 'user-data', name: 'Datos del usuario', type: '', icon: 'fingerprint' },
    { state: 'enterprise-data', name: 'Datos de la empresa', type: 'admmin', icon: 'business' },
    { state: 'billing', name: 'Facturación', type: 'admin', icon: 'attach_money' },
    { state: 'edit-userphoto', name: 'Editar imagen de usuario', type: '', icon: 'add_a_photo' },
    { state: 'edit-username', name: 'Editar nombre de usuario', type: '', icon: 'account_circle' },
    { state: 'edit-password', name: 'Editar contraseña', type: '', icon: 'vpn_key' },
    { state: 'edit-email', name: 'Editar correo de ingreso', type: '', icon: 'email' },
    { state: 'delete-account', name: 'Eliminar cuenta', type: 'admin', icon: 'power_settings_new' }
];

const MENUMANAGEMENT = [
    { state: 'management', name: 'Tablero', type: '', icon: 'dashboard' },
    { state: 'billing', name: 'Prueba 2', type: 'link', icon: 'attach_money' },
    { state: 'edit-username', name: 'Prueba 3', type: 'link', icon: 'account_circle' },
    { state: 'edit-password', name: 'Prueba 4', type: 'link', icon: 'vpn_key' },
    { state: 'edit-email', name: 'Prueba 5', type: 'link', icon: 'email' },
    { state: 'delete-account', name: 'Prueba 6', type: 'link', icon: 'power_settings_new' }
];

const MENUOPERATION = [
    { state: 'operation', name: 'Tablero', type: '', icon: 'dashboard' },
    { state: 'billing', name: 'Prueba 8', type: 'link', icon: 'attach_money' },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle' },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key' },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email' },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new' }
];

const MENUDEPO = [
    { state: 'depo', name: 'Tablero', type: '', icon: 'dashboard' },
    { state: 'billing', name: 'Prueba 8', type: 'link', icon: 'attach_money' },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle' },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key' },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email' },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new' }
];

const MENUPURCHASE = [
    { state: 'purchase', name: 'Tablero', type: '', icon: 'dashboard' },
    { state: 'billing', name: 'Prueba 8', type: 'link', icon: 'attach_money' },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle' },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key' },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email' },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new' }
];

const MENUADMINISTRATION = [
    { state: 'administration', name: 'Tablero', type: '', icon: 'dashboard' },
    { state: 'billing', name: 'Prueba 8', type: 'link', icon: 'attach_money' },
    { state: 'edit-username', name: 'Prueba 9', type: 'link', icon: 'account_circle' },
    { state: 'edit-password', name: 'Prueba 10', type: 'link', icon: 'vpn_key' },
    { state: 'edit-email', name: 'Prueba 11', type: 'link', icon: 'email' },
    { state: 'delete-account', name: 'Prueba 12', type: 'link', icon: 'power_settings_new' }
];

const MENUCHAT = [
    { state: 'chat', name: 'Tablero', type: '', icon: 'dashboard' },
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