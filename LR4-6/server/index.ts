import * as express from 'express'
import { Express } from 'express'
import { Sequelize, QueryTypes } from 'sequelize'
import { AuthorizationResponse, CheckAuthorizationBody } from './types'
import { isAuthorized } from './utils'
import { UNAUTHORIZED_STRING_MESSAGE, INVALID_QUERY_ARGUMENT_MESSAGE } from './constants'
import * as cors from 'cors'


const app: Express = express()
const port: number = 8000

const sequelize: Sequelize = new Sequelize('postgres://postgres:root@localhost:5432/SanatoriumResort')

app.use(express.json())
app.use(cors());

// require('http').globalAgent.maxSockets = 1;
/*
app.use(express.json({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 500000}));*/

app.post('/allrooms', async (request, response) => {
    const authorized: AuthorizationResponse = await isAuthorized(request, sequelize)

    if (!authorized.authorized) {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }

    const rooms = await sequelize.query('SELECT * FROM rooms', { type: QueryTypes.SELECT })
    response.send(rooms)
})

app.post('/allvacationers', async (request, response) => {
    const authorized: AuthorizationResponse = await isAuthorized(request, sequelize)

    if (!authorized.authorized || authorized.type === 'vacationer') {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }

    const users = await sequelize.query(`
    SELECT vacationers.id, abstract_users.name, abstract_users.surname, abstract_users.email, rooms.number as room, vacationers.rests_from, vacationers.rests_to  FROM vacationers
    INNER JOIN abstract_users ON abstract_users.user_id = vacationers.id
    INNER JOIN rooms ON vacationers.room = rooms.room_id
    `, { type: QueryTypes.SELECT })

    response.status(200).send({ status: 'OK', data: users })
})

app.post('/allmedicals', async (request, response) => {
    const authorized: AuthorizationResponse = await isAuthorized(request, sequelize)

    if (!authorized.authorized) {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }

    const users = await sequelize.query(`
        SELECT medical_employees.id, abstract_users.name, abstract_users.surname, abstract_users.email, rooms.number as room, medical_employees.cabinet, medical_jobs.job_title  FROM medical_employees
        INNER JOIN abstract_users ON abstract_users.user_id = medical_employees.id
        INNER JOIN medical_jobs ON medical_jobs.medical_job_id = medical_employees.job
        INNER JOIN rooms ON medical_employees.room = rooms.room_id
    `, { type: QueryTypes.SELECT })

    response.status(200).send({ status: 'OK', data: users })
})

app.post('/alladmins', async (request, response) => {
    const authorized: AuthorizationResponse = await isAuthorized(request, sequelize)

    if (authorized.authorized) {
        const users = await sequelize.query(`
            SELECT abstract_users.name, abstract_users.surname, abstract_users.email, rooms.number as room  FROM administrators
            INNER JOIN abstract_users ON abstract_users.user_id = administrators.id
            INNER JOIN rooms ON administrators.room = rooms.room_id
    `,
            { type: QueryTypes.SELECT }
        )
        response.status(200).send({ status: 'OK', data: users })
        return
    }

    response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
})

app.post('/allusers', async (request, response) => {
    const authorized: AuthorizationResponse = await isAuthorized(request, sequelize)

    console.log(authorized)
    if (authorized.authorized && authorized.type === 'administrator') {
        const users = await sequelize.query(`
            (SELECT abstract_users.name, abstract_users.surname, abstract_users.email, rooms.number FROM administrators
            INNER JOIN abstract_users ON abstract_users.user_id = administrators.id
            INNER JOIN rooms ON rooms.room_id = administrators.room)
            UNION
            (SELECT abstract_users.name, abstract_users.surname, abstract_users.email, rooms.number FROM medical_employees
            INNER JOIN abstract_users ON abstract_users.user_id = medical_employees.id
            INNER JOIN rooms ON rooms.room_id = medical_employees.room)
            UNION
            (SELECT abstract_users.name, abstract_users.surname, abstract_users.email, rooms.number FROM vacationers
            INNER JOIN abstract_users ON abstract_users.user_id = vacationers.id
            INNER JOIN rooms ON rooms.room_id = vacationers.room)
    `,
            { type: QueryTypes.SELECT }
        )

        response.status(200).send({ status: 'OK', data: users })
        return
    }

    response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
})

app.post('/roomswithplaces', async (request, response) => {
    const authorized: AuthorizationResponse = await isAuthorized(request, sequelize)

    //console.log(authorized)
    if (authorized.authorized && authorized.type === 'administrator') {
        const roomsWithPlaces = await sequelize.query(`SELECT * FROM get_rooms_with_free_places()`,
            { type: QueryTypes.SELECT })
        response.status(200).send({ status: 'OK', data: roomsWithPlaces })
        return
    }

    response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
})

app.post('/checkauthorization', async (request, response) => {
    const authorized = await isAuthorized(request, sequelize)

    if (authorized.authorized) {
        response.status(200).send(authorized)
        return
    }

    response.status(403).send(authorized)
})

app.get('/allentertainments', async (request, response) => {
    const data = await sequelize.query(`
            SELECT title, description, price FROM entertainments
    `,
        { type: QueryTypes.SELECT }
    )
    response.status(200).send({ status: 'OK', data: data })
})

app.put('/updateusername/:id', async (request, response) => {
    const authorized = await isAuthorized(request, sequelize)

    if (!authorized.authorized || authorized.type !== 'administrator') {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }

    const id = request.params.id
    const newName = request.query.newname || ''

    if (!newName || newName === '') {
        response.status(400).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE })
        return
    }

    await sequelize.query(`UPDATE abstract_users SET name = '${newName}' WHERE user_id = ${id}`, { type: QueryTypes.UPDATE })

    response.send({ status: 'OK' })
})

app.put('/updateusersurname/:id', async (request, response) => {
    const authorized = await isAuthorized(request, sequelize)

    if (!authorized.authorized || authorized.type !== 'administrator') {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }

    const id = request.params.id
    const newSurname = request.query.newsurname || ''

    if (!newSurname || newSurname === '') {
        response.status(400).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE })
        return
    }

    await sequelize.query(`UPDATE abstract_users SET surname = '${newSurname}' WHERE user_id = ${id}`, { type: QueryTypes.UPDATE })

    response.send({ status: 'OK' })
})

app.put('/updateuserroom/:id', async (request, response) => {
    const authorized = await isAuthorized(request, sequelize)

    if (!authorized.authorized || authorized.type !== 'administrator') {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }

    const id = request.params.id
    const newRoom = Number.parseInt(request.query.room as string)

    if (Number.isNaN(newRoom)) {
        response.status(400).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE + ' (not real room number)' })
        return
    }

    // 
    const foundRoom: Array<any> = await sequelize.query(`SELECT * FROM rooms WHERE number = ${newRoom}`, { type: QueryTypes.SELECT })
    if (foundRoom.length === 0) {
        response.status(404).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE + ' (room does not exist)' })
        return
    }

    const roomsWithFreePlaces = await sequelize.query('SELECT * FROM get_rooms_with_free_places()', { type: QueryTypes.SELECT })

    if (roomsWithFreePlaces.find((room: any) => room.number === newRoom) === undefined) {
        response.status(400).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE + ` (room # ${newRoom} has no free places)` })
        return
    }


    await sequelize.query(`UPDATE vacationers SET room = ${foundRoom[0].room_id} WHERE vacationers.id = ${id}`, {type: QueryTypes.UPDATE})
    await sequelize.query(`UPDATE administrators SET room = ${foundRoom[0].room_id} WHERE administrators.id = ${id}`, {type: QueryTypes.UPDATE})
    await sequelize.query(`UPDATE medical_employees SET room = ${foundRoom[0].room_id} WHERE medical_employees.id = ${id}`, {type: QueryTypes.UPDATE})

    response.send({ status: 'OK' })
})

app.put('/updatemedicalcabinet/:id', async (request, response) => {
    const authorized = await isAuthorized(request, sequelize)

    if (!authorized.authorized || authorized.type === 'vacationer') {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }

    const id = request.params.id
    const newCabinet = Number.parseInt(request.query.cabinet as string)

    if (Number.isNaN(newCabinet) || newCabinet <= 0) {
        response.status(400).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE + ' (not real cabinet number)' })
        return
    }

    await sequelize.query(`UPDATE medical_employees SET cabinet = ${newCabinet} WHERE medical_employees.id = ${id}`, {type: QueryTypes.UPDATE})

    response.send({ status: 'OK' })
})

app.get('/allprocedures', async (request, response) => {
    const data = await sequelize.query(`
            SELECT title, description, price FROM procedures
    `,
        { type: QueryTypes.SELECT }
    )
    response.status(200).send({ status: 'OK', data: data })
})

app.post('/freerooms', async (request, response) => {
    const authorized = await isAuthorized(request, sequelize)

    if (!authorized.authorized || authorized.type === 'vacationer') {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }

    const data = await sequelize.query(`
        SELECT * FROM get_rooms_with_free_places() 
    `,
        { type: QueryTypes.SELECT }
    )
    response.status(200).send({ status: 'OK', data: data })
})

app.post('/createroom', async (request, response) => {
    const authorized = await isAuthorized(request, sequelize)

    if (!authorized.authorized || authorized.type !== 'administrator') {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }
    const number = Number(request.body.body.number)
    const count = Number(request.body.body.peopleCount)

    console.log(request.body);
    

    if (Number.isNaN(number) || Number.isNaN(count) || number <= 0 || count <= 0 || number > 400 || count > 12) {
        response.status(400).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE + ' (wrong room number or possible people count))' })
        return
    }

    const tryRoomWithSuchNumber = await sequelize.query(`SELECT * FROM rooms WHERE rooms.number = ${number}`, {type: QueryTypes.SELECT})

    if (tryRoomWithSuchNumber.length !== 0) {
        response.status(400).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE + ' (such room already exists)' })
        return
    }

    await sequelize.query(`CALL add_room(${number}, ${count})`,{ type: QueryTypes.INSERT })
    response.status(200).send({ status: 'OK' })
})

app.post('/createprocedure', async (request, response) => {
    const authorized = await isAuthorized(request, sequelize)

    if (!authorized.authorized || authorized.type !== 'administrator') {
        response.status(403).send({ status: UNAUTHORIZED_STRING_MESSAGE })
        return
    }
    const title: string = request.body.body.title.trim()
    const description: string = request.body.body.description.trim()
    const price: number = Number(request.body.body.price)

    console.log(title, description, price);
    

    if (Number.isNaN(price) || price < 0 || title === '' || description === '') {
        response.status(400).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE })
        return
    }

    const tryProcWithSuchName = await sequelize.query(`SELECT * FROM procedures WHERE LOWER(procedures.title) = '${title.toLowerCase()}'`, {type: QueryTypes.SELECT})

    if (tryProcWithSuchName.length !== 0) {
        response.status(400).send({ status: INVALID_QUERY_ARGUMENT_MESSAGE + ' (procedure with such name exists)' })
        return
    }

    await sequelize.query(`CALL add_procedure('${title}', '${description}', ${price})`,{ type: QueryTypes.INSERT })
    response.status(200).send({ status: 'OK' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
