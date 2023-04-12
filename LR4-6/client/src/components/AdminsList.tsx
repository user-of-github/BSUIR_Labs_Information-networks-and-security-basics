import {Admin, ServerResponse} from '../types'
import React from 'react'
import {getAdminsList} from '../utils'
import {AdminCard} from './AdminCard'
import {useHistory} from 'react-router-dom'


export const AdminsList = (): JSX.Element => {
    const [admins, setAdmins] = React.useState<Array<Admin>>([])
    const history = useHistory()

    const loadedCallback = (data: ServerResponse) => {
        if (data.status !== 'OK') {
            window.alert(data.status)
            history.push('/')
        } else {
            setAdmins(data.data)
        }
    }
    React.useEffect(() => {
        getAdminsList(loadedCallback)
    }, [])

    return (
        <section className={'admins-list'}>
            {
                admins.map((admin: Admin) =>
                    <AdminCard name={admin.name}
                               room={admin.room}
                               key={admin.surname + admin.name}
                               surname={admin.surname}
                    />
                )
            }
        </section>
    )
}
