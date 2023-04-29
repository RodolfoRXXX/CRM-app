export interface User {
    'id': number,
    'name': string,
    'email': string,
    'password': string,
    'role': Role,
    'state': string,
    'thumbnail': string
}

export interface Role {
    'main': string,
    'second': string,
    'third': string,
    'fourth': string,
    'fifth': string
}