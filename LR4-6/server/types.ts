export interface CheckAuthorizationBody {
    email: string
    password: string
}

export type UserType = 'vacationer' | 'administrator' | 'medicalEmployee' | 'unknown'

export interface AuthorizationResponse {
    authorized: boolean
    type?: UserType
    email?: string
    name?: string
    surname?: string
    password?: string
}
