export interface User {
    _id: string;
    username: string;
    password: string;
    code: string;
    prefix: string;
    firstname: string;
    lastname: string;
    level: string;
    isActive: boolean;
    isDel: boolean;
}