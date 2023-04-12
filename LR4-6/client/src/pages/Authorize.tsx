import {AuthForm} from '../components/Form'
import {LS_AUTH_STATUS} from '../constants'
import {Redirect} from 'react-router-dom'


export const Authorize = (): JSX.Element => {
    //console.log(localStorage.getItem(LS_AUTH_STATUS))
    const isAuthorized: boolean = JSON.parse(localStorage.getItem(LS_AUTH_STATUS) || 'false')
    //console.log(isAuthorized)
    if (isAuthorized) {
        window.alert('You are already authorized')
        return <Redirect to={'/'}/>
    }

    return (
        (
            <main className={'main page'}>
                <AuthForm/>
            </main>
        )
    )
}
