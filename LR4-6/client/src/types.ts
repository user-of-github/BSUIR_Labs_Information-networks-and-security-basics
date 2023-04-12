import {stringify} from 'querystring'

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

export interface ServerResponse {
    status: string
    data: any
}

export interface Medical {
    name: string
    surname: string
    job_title: string
    cabinet: number
    room: number
    id: number
}


export interface Admin {
    name: string
    surname: string
    room: number
}

export interface Vacationer {
    name: string
    surname: string
    rests_from: string
    rests_to: string
    room: number
    id: number
}

export interface Entertainment {
    title: string
    description: string
    price: string
}

export interface RequestType {
    authentication: CheckAuthorizationBody
    body: any
}

export interface Procedure {
    title: string
    description: string
    price: string
}


export interface FreeRoom {
    number: number
    places_left: number
}
