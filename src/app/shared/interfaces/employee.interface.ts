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

export interface Role {
    gestion: boolean,
    operacion: boolean,
    deposito: boolean,
    administracion: boolean
}