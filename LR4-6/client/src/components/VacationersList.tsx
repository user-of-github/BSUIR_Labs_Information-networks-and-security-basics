import {Vacationer, ServerResponse, Entertainment} from '../types'
import React from 'react'
import {getVacationersList, onlyLetters, updateUsername, updateUserRoom, updateUserSurname} from '../utils'
import {useHistory} from 'react-router-dom'


export const VacationersList = (): JSX.Element => {
    const [vacationers, setVacationers] = React.useState<Array<Vacationer>>([])
    const history = useHistory()

    const loadedCallback = (data: ServerResponse) => {
        if (data.status !== 'OK') {
            window.alert(data.status)
            history.push('/')
        } else {
            setVacationers(data.data)
        }
    }
    React.useEffect(() => {
        getVacationersList(loadedCallback)
    }, [])

    const changeRoom = async (vacationer: Vacationer) => {
        const confirm: boolean = window.confirm('Wanna change this user room ?')
        if (!confirm) return

        const newRoom = Number.parseInt(window.prompt('Enter new room number') || 'undefined')

        if (Number.isNaN(newRoom)) {
            window.alert('Invalid room number value')
            return
        }

        await updateUserRoom(vacationer.id, newRoom)
    }

    const changeName = async (vacationer: Vacationer) => {
        const confirm: boolean = window.confirm('Wanna change this vacationer name ?')
        if (!confirm) return

        let newName: string = window.prompt('Enter new name') || ''
        newName = newName.trim()
        newName = newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase()

        if (newName === '' || !onlyLetters(newName)) {
            window.alert('Invalid new name value')
            return
        }

        await updateUsername(vacationer.id, newName)
    }

    const changeSurname = async (vacationer: Vacationer) => {
        const confirm: boolean = window.confirm('Wanna change this vacationer surname ?')
        if (!confirm) return

        let newSurname: string = window.prompt('Enter new name') || ''
        newSurname = newSurname.trim()
        newSurname = newSurname.charAt(0).toUpperCase() + newSurname.slice(1).toLowerCase()

        if (newSurname === '' || !onlyLetters(newSurname)) {
            window.alert('Invalid new name value')
            return
        }

        await updateUserSurname(vacationer.id, newSurname)
    }



    return (
        <table className={'table-users'}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Room #</th>
                    <th>From</th>
                    <th>To</th>
                </tr>
            </thead>
            <tbody>
                {
                    vacationers.map((v: Vacationer, i: number) => (
                        <tr key={i}>
                            <td className={'scalable'} onClick={() => changeName(v)} title={'Change name'}>{v.name}</td>
                            <td className={'scalable'} onClick={() => changeSurname(v)} title={'Change surname'}>{v.surname}</td>
                            <td className={'scalable'} onClick={() => changeRoom(v)} title={'Change room'}>{v.room}</td>
                            <td>{v.rests_from}</td>
                            <td>{v.rests_to}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
