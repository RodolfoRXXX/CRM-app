export interface Employee {
    id: number,
    id_user: number,
    id_enterprise: number,
    name: string,
    email: string,
    address: string,
    date: string,
    phone: string,
    mobile: string,
    role: string,
    working_hours: string,
    name_er: string,
    phone_er: string,
    state: number
}

export const empty_employee: Employee = {
    id: 0,
    id_user: 0,
    id_enterprise: 0,
    name: '',
    email: '',
    address: '',
    date: '',
    phone: '',
    mobile: '',
    role: '{"gestion": false, "operacion": false, "deposito": false, "administracion": false}',
    working_hours: '',
    name_er: '',
    phone_er: '',
    state: 0
}

export interface Role {
    gestion: boolean,
    operacion: boolean,
    deposito: boolean,
    administracion: boolean
}