export interface Employee {
    id: number,
    id_user: number,
    id_enterprise: number,
    name: string,
    email: string,
    address: string,
    city: string,
    state: string,
    country: string,
    date: string,
    phone: string,
    mobile: string,
    role: number,
    working_hours: string,
    name_er: string,
    phone_er: string,
    status: number,
    name_role: string,
    list_of_permissions: string,
    created: string
}

export const empty_employee: Employee = {
    id: 0,
    id_user: 0,
    id_enterprise: 0,
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    date: '',
    phone: '',
    mobile: '',
    role: 0,
    working_hours: '',
    name_er: '',
    phone_er: '',
    status: 0,
    name_role: '',
    list_of_permissions: '',
    created: ''
}