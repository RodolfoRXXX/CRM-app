export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    children: Submenu[]
    
}
export interface Submenu {
    state: string;
    name: string;
    type: string;
    icon: string;
}