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

@Injectable()
export class MenuSettings {
    getMenuSettings(): Menu[] {
        return MENUSETTINGS;
    }
}