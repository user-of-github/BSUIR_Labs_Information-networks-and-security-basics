import React from 'react'
import {tryAuthorize} from '../utils'
import {useHistory} from 'react-router-dom'
import {AuthorizationResponse} from '../types'
import * as EmailValidator from 'email-validator';


export const AuthForm = (): JSX.Element => {
    const email = React.useRef<string>('')
    const password = React.useRef<string>('')
    const history = useHistory()

    const onEmailChange = (event: any): void => {
        email.current = event.currentTarget.value
    }

    const onPasswordChange = (event: any): void => {
        password.current = event.currentTarget.value
    }

    const authButtonPressed = async () => {
        console.log(email.current)
        if (!EmailValidator.validate(email.current)) {
           window.alert('Incorrect email')
           return
        }

        const response: AuthorizationResponse = await tryAuthorize({email: email.current, password: password.current})

        if (response.authorized) {
            window.alert(`Authorization successful\nGlad to see you, ${response.name} ${response.surname} !`)
            history.push('/')
        } else {
            window.alert('Authorization failed')
        }
    }

    return (
        <form onSubmit={e => e.preventDefault()} action='#' className={'form'}>
            <h1>Authorization</h1>
            <input maxLength={30} className={'form__input'} onChange={onEmailChange} type={'email'} required={true} placeholder={'Email'}/>
            <input maxLength={30} className={'form__input'} onChange={onPasswordChange} type={'password'} required={true} placeholder={'Password'}/>

            <button className={'button'} onClick={() => authButtonPressed()}>Authorize</button>
        </form>
    )
}
