import { AuthorizationResponse, CheckAuthorizationBody, UserType } from './types'
import { QueryTypes, Sequelize } from 'sequelize'
import { Request } from 'express'


export const isAuthorized = async (request: Request, sequelize: Sequelize): Promise<AuthorizationResponse> => {
    const data: CheckAuthorizationBody = request.body.authentication

    if (!data || (!('email' in data) || !('password' in data))) return { authorized: false }


    const found: Array<any> = await sequelize.query(`
                SELECT * FROM abstract_users 
                WHERE abstract_users.email = '${data.email}' 
                AND abstract_users.password = '${data.password}'
    `,
        { type: QueryTypes.SELECT }
    )

    if (found.length === 0) return { authorized: false }

    let type: UserType = 'unknown'

    const vacationersTry = (await sequelize.query(`SELECT * FROM vacationers WHERE vacationers.id = ${found[0].user_id}`))[0]
    const adminsTry = (await sequelize.query(`SELECT * FROM administrators WHERE administrators.id = ${found[0].user_id}`))[0]
    const medicalsTry = (await sequelize.query(`SELECT * FROM medical_employees WHERE medical_employees.id = ${found[0].user_id}`))[0]

    if (vacationersTry.length > 0) {
        type = 'vacationer'
    } else if (adminsTry.length > 0) {
        type = 'administrator'
    } else if (medicalsTry.length > 0) {
        type = 'medicalEmployee'
    }

    return { authorized: true, type: type, email: found[0].email, password: data.password, name: found[0].name, surname: found[0].surname }
}
