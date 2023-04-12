import {AuthorizationResponse, CheckAuthorizationBody, RequestType, ServerResponse} from './types'
import {LS_AUTH_DATA, LS_AUTH_STATUS} from './constants'

export const requestToServer = async (url: string, callback: any, method: string, body?: RequestType) => {
    const response: Response = await fetch(url, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: body ? JSON.stringify(body) : null
    })
    const answer = await response.json()

    return callback(answer)
}

export const tryAuthorize = async (authData: CheckAuthorizationBody) => {
    const callback = (answer: any): void => {
        changeLocalAuthStatus(answer)
        return answer
    }

    const result: AuthorizationResponse = await requestToServer('http://localhost:8000/checkauthorization', callback, 'POST', {
        authentication: authData,
        body: null
    })

    return result
}


export const changeLocalAuthStatus = (authorizationResponse: AuthorizationResponse): void => {
    localStorage.setItem(LS_AUTH_STATUS, JSON.stringify(authorizationResponse.authorized))

    localStorage.setItem(LS_AUTH_DATA, JSON.stringify(authorizationResponse))
}

export const logOutFromLocalStorage = (): void => {
    localStorage.removeItem(LS_AUTH_DATA)
    localStorage.setItem(LS_AUTH_STATUS, JSON.stringify(false))
}

export const getAuthDataFromLocalStorage = (): AuthorizationResponse => {
    const tryGetStatus: string = localStorage.getItem(LS_AUTH_STATUS) || 'false'
    if (JSON.parse(tryGetStatus) === false) return {authorized: false}

    const tryGetData: string = localStorage.getItem(LS_AUTH_DATA)!

    return JSON.parse(tryGetData)
}


export const getMedicalsList = async (setToComponent: any) => {
    const callback = (answer: any): void => {
        setToComponent(answer)
    }

    const currentlyAuthorized = getAuthDataFromLocalStorage()

    const result: ServerResponse = await requestToServer('http://localhost:8000/allmedicals', callback, 'POST', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: null
    })

    return result
}

export const getAdminsList = async (setToComponent: any) => {
    const callback = (answer: any): void => {
        setToComponent(answer)
    }

    const currentlyAuthorized = getAuthDataFromLocalStorage()

    const result: ServerResponse = await requestToServer('http://localhost:8000/alladmins', callback, 'POST', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: null
    })

    return result
}


export const getEntertainmentsList = async (setToComponent: any) => {
    const callback = (answer: any) => setToComponent(answer)

    const result: ServerResponse = await requestToServer('http://localhost:8000/allentertainments', callback, 'GET')

    return result
}

export const getProceduresList = async (setToComponent: any) => {
    const callback = (answer: any) => setToComponent(answer)

    const result: ServerResponse = await requestToServer('http://localhost:8000/allprocedures', callback, 'GET')

    return result
}

export const getVacationersList = async (setToComponent: any) => {
    const callback = (answer: any): void => {
        setToComponent(answer)
    }

    const currentlyAuthorized = getAuthDataFromLocalStorage()

    const result: ServerResponse = await requestToServer('http://localhost:8000/allvacationers', callback, 'POST', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: null
    })

    return result
}

export const updateUsername = async (id: number, newName: string) => {
    const callback = (answer: any): void => {
        if (answer.status === 'OK') {
            window.alert('Successfully updated')
            window.location.reload()
        } else {
            window.alert(answer.status)
        }
    }

    const currentlyAuthorized = getAuthDataFromLocalStorage()

    const result: ServerResponse = await requestToServer(`http://localhost:8000/updateusername/${id}?newname=${newName}`, callback, 'PUT', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: null
    })

    return result
}

export const updateUserSurname = async (id: number, newSurname: string) => {
    const callback = (answer: any): void => {
        if (answer.status === 'OK') {
            window.alert('Successfully updated')
            window.location.reload()
        } else {
            window.alert(answer.status)
        }
    }

    const currentlyAuthorized = getAuthDataFromLocalStorage()

    const result: ServerResponse = await requestToServer(`http://localhost:8000/updateusersurname/${id}?newsurname=${newSurname}`, callback, 'PUT', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: null
    })

    return result
}


export const updateUserRoom = async (id: number, newRoom: number) => {
    const callback = (answer: any): void => {
        if (answer.status === 'OK') {
            window.alert('Successfully updated')
            window.location.reload()
        } else {
            window.alert(answer.status)
        }
    }

    const currentlyAuthorized = getAuthDataFromLocalStorage()

    const result: ServerResponse = await requestToServer(`http://localhost:8000/updateuserroom/${id}?room=${newRoom}`, callback, 'PUT', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: null
    })

    return result
}

export const updateMedicalCabinet = async (id: number, newCabinet: number) => {
    const callback = (answer: any): void => {
        if (answer.status === 'OK') {
            window.alert('Successfully updated')
            window.location.reload()
        } else {
            window.alert(answer.status)
        }
    }

    const currentlyAuthorized = getAuthDataFromLocalStorage()

    const result: ServerResponse = await requestToServer(`http://localhost:8000/updatemedicalcabinet/${id}?cabinet=${newCabinet}`, callback, 'PUT', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: null
    })

    return result
}

export const getRoomsWithFreePlacesList = async (setToComponent: any) => {
    const callback = (answer: any): void => {
        setToComponent(answer)
    }

    const currentlyAuthorized: AuthorizationResponse = getAuthDataFromLocalStorage()

    const result: ServerResponse = await requestToServer('http://localhost:8000/freerooms', callback, 'POST', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: null
    })

    return result
}

export const createNewRoom = async (number: string, peopleCount: string) => {
    const callback = (answer: ServerResponse): void => {
        if (answer.status !== 'OK') {
            window.alert(answer.status)
        } else {
            window.alert('Successfully created room № ' + number)
        }
    }

    const currentlyAuthorized: AuthorizationResponse = getAuthDataFromLocalStorage()

    const result: ServerResponse = await requestToServer('http://localhost:8000/createroom', callback, 'POST', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: {
            number: Number(number),
            peopleCount: Number(peopleCount)
        }
    })

    return result
}

export const createNewProcedure = async (title: string, description: string, price: number) => {
    const callback = (answer: ServerResponse): void => {
        if (answer.status !== 'OK') {
            window.alert(answer.status)
        } else {
            window.alert('Successfully created procedure ' + title)
        }
    }

    const currentlyAuthorized: AuthorizationResponse = getAuthDataFromLocalStorage()

    console.log(title, description, price)
    const result: ServerResponse = await requestToServer('http://localhost:8000/createprocedure', callback, 'POST', {
        authentication: {email: currentlyAuthorized.email || '0', password: currentlyAuthorized.password || '0'},
        body: {
            title: title,
            description: description,
            price: price
        }
    })

    return result
}

export const onlyLetters = (str: string): boolean => {
    return /^[A-Za-z]*$/.test(str);
}
