import {LS_AUTH_STATUS} from '../constants'
import {Link, Redirect, useHistory} from 'react-router-dom'
import {
    createNewProcedure,
    createNewRoom,
    getAuthDataFromLocalStorage,
    tryAuthorize,
    updateMedicalCabinet
} from '../utils'
import React from 'react'
import {AuthorizationResponse} from '../types'


export const AddNewProcedure = (): JSX.Element => {
    const title = React.useRef<string>('')
    const description = React.useRef<string>('')
    const price = React.useRef<number>(0)

    const onTitleChange = (event: any): void => {
        title.current = event.currentTarget.value.trim()
    }

    const onDescriptionChange = (event: any): void => {
        description.current = event.currentTarget.value.trim()
    }

    const onPriceChange = (event: any): void => {
        price.current = Number(event.currentTarget.value)
    }

    const createButtonPressed = async () => {
        const confirm: boolean = window.confirm('Wanna create such procedure ?')
        if (!confirm) return


        if (Number(price.current) < 0 ) {
            window.alert('Invalid price')
            return
        }

        if (title.current === '') {
            window.alert('Invalid title')
            return
        }

        if (description.current === '') {
            window.alert('Invalid description')
            return
        }

        await createNewProcedure(title.current, description.current, price.current)
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
               <input type="text" onChange={onTitleChange} className={'form__input'} placeholder={'Procedure title'}/>
               <input type="text" onChange={onDescriptionChange} className={'form__input'} placeholder={'Proceure description'}/>
               <input type="number" onChange={onPriceChange} className={'form__input'} placeholder={'Price'} defaultValue={0}/>

               <button className={'button'} onClick={() => createButtonPressed()}>Create such procedure</button>
           </form>
        </main>
    )
}
