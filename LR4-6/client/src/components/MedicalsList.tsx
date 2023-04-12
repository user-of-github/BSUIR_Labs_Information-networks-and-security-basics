import {Medical, ServerResponse} from '../types'
import React from 'react'
import {getMedicalsList} from '../utils'
import {MedicalEmployeeCard} from './MedicalEmployeeCard'
import {useHistory} from 'react-router-dom'


export const MedicalsList = (): JSX.Element => {
    const [medicals, setMedicals] = React.useState<Array<Medical>>([])
    const history = useHistory()
    const loadedCallback = (data: ServerResponse) => {
        if (data.status !== 'OK') {
            window.alert(data.status)
            history.push('/')
        } else {
            setMedicals(data.data)
        }
    }
    React.useEffect(() => {
        getMedicalsList(loadedCallback)
    }, [])

    return (
        <section className={'medicals-list'}>
            {
                medicals.map((medical: Medical) =>
                    <MedicalEmployeeCard name={medical.name}
                                         cabinet={medical.cabinet}
                                         job_title={medical.job_title}
                                         key={medical.surname + medical.name}
                                         surname={medical.surname}
                                         room={medical.room}
                                         id={medical.id}
                    />
                )
            }
        </section>
    )
}
