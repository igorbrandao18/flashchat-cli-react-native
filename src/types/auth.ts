export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
} 