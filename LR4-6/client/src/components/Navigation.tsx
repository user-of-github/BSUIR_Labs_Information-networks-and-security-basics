import {Link, useHistory} from 'react-router-dom'
import {getAuthDataFromLocalStorage, logOutFromLocalStorage} from '../utils'

export const Navigation = (): JSX.Element => {
    const history = useHistory()

    const onLogOut = () => {
        if (getAuthDataFromLocalStorage().authorized) {
            logOutFromLocalStorage()
            history.push('/')
            window.alert('Successfully unauthorized')
        } else {
            window.alert('You\'re not authorized => impossible to log out')
        }
    }

    return (
        <nav className={'navigation'}>
            <div className="navigation__row">
                <Link to={'/auth'}>
                    <button className={'navigation__item'}>Authorize</button>
                </Link>
                <button className={'navigation__item'} onClick={() => onLogOut()}>Log out</button>
            </div>
            <div className="navigation__row">

                <Link to={'/'}>
                    <button className={'navigation__item'}>Main</button>
                </Link>
                <Link to={'/procedures'}>
                    <button className={'navigation__item'}>Procedures</button>
                </Link>
                ←— General info
            </div>
            <div className="navigation__row">

                <Link to={'/medicals'}>
                    <button className={'navigation__item'}>Medical personnel</button>
                </Link>
                ←— Current state of Sanatorium
            </div>
            <div className="navigation__row">

                <Link to={'/jsinjection'}>
                    <button className={'navigation__item'}>Safety check</button>
                </Link>
                ←— JS injection !!!
            </div>
        </nav>
    )
}
