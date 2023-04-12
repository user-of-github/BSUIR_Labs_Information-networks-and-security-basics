import {LS_AUTH_STATUS} from '../constants'
import {Link, Redirect, useHistory} from 'react-router-dom'
import {createNewRoom, getAuthDataFromLocalStorage, tryAuthorize, updateMedicalCabinet} from '../utils'
import React from 'react'
import {AuthorizationResponse} from '../types'


export const AddNewRoomPage = (): JSX.Element => {
    const number = React.useRef<string>('')
    const peopleCount = React.useRef<string>('')

    const onNumberChange = (event: any): void => {
        number.current = event.currentTarget.value
    }

    const onPeopleCountChange = (event: any): void => {
        peopleCount.current = event.currentTarget.value
    }

    const createButtonPressed = async () => {
        const confirm: boolean = window.confirm('Wanna create such room ?')
        if (!confirm) return


        if (Number(number.current) <= 0 || Number(peopleCount.current) <= 0) {
            window.alert('Invalid room number value')
            return
        }

        await createNewRoom(number.current, peopleCount.current)
    }


    const isAuthorized: boolean = JSON.parse(localStorage.getItem(LS_AUTH_STATUS) || 'false')

    //console.log(isAuthorized)
    if (!isAuthorized) {
        window.alert('You are not authorized')
        return <Redirect to={'/'}/>
    }

    const authStatus = getAuthDataFromLocalStorage()
    if (authStatus.type !== 'administrator') {
        window.alert('You are not allowed to visit this page')
        return <Redirect to={'/'}/>
    }



    return (
        <main className={'main page'}>
            <h1>Create new room</h1>
            <br/>
            <br/>
           <form className={'form'} action={'#'} onSubmit={e => e.preventDefault()}>
               <input type="number" onChange={onNumberChange} className={'form__input'} placeholder={'Room number'}/>
               <input type="number" onChange={onPeopleCountChange} className={'form__input'} placeholder={'Possible people count'}/>

               <button className={'button'} onClick={() => createButtonPressed()}>Create such room</button>
           </form>
        </main>
    )
}
