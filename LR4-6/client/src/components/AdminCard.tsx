import {Admin, Medical} from '../types'
import {getAuthDataFromLocalStorage} from '../utils'


export const AdminCard = (admin: Admin): JSX.Element => {

    return (
        (
            <article className={'admin-card'}>
                <span><ins>Name:</ins> &nbsp; {admin.name}</span>
                <hr/>
                <span><ins>Surname:</ins> &nbsp; {admin.surname}</span>
                {
                    getAuthDataFromLocalStorage().type === 'administrator'
                    &&
                    <>
                        <hr/>
                        <span><ins>Room:</ins>&nbsp; {admin.room}</span>
                    </>
                }
            </article>
        )
    )
}
