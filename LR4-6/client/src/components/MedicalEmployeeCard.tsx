import {Medical, Vacationer} from '../types'
import {
    getAuthDataFromLocalStorage,
    onlyLetters,
    updateMedicalCabinet,
    updateUsername,
    updateUserRoom,
    updateUserSurname
} from '../utils'


export const MedicalEmployeeCard = (medical: Medical): JSX.Element => {
    const changeRoom = async () => {
        const confirm: boolean = window.confirm('Wanna change this medical employee room ?')
        if (!confirm) return

        const newRoom = Number.parseInt(window.prompt('Enter new room number') || 'undefined')

        if (Number.isNaN(newRoom)) {
            window.alert('Invalid room number value')
            return
        }

        await updateUserRoom(medical.id, newRoom)
    }

    const changeCabinet = async () => {
        const confirm: boolean = window.confirm('Wanna change this medical employee cabinet ?')
        if (!confirm) return

        const newCabinet = Number.parseInt(window.prompt('Enter new room number') || 'undefined')

        if (Number.isNaN(newCabinet)) {
            window.alert('Invalid room number value')
            return
        }

        await updateMedicalCabinet(medical.id, newCabinet)
    }

    const changeName = async () => {
        const confirm: boolean = window.confirm('Wanna change this medical employee name ?')
        if (!confirm) return

        let newName: string = window.prompt('Enter new name') || ''
        newName = newName.trim()
        newName = newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase()

        if (newName === '' || !onlyLetters(newName)) {
            window.alert('Invalid new name value')
            return
        }

        await updateUsername(medical.id, newName)
    }

    const changeSurname = async () => {
        const confirm: boolean = window.confirm('Wanna change this vacationer surname ?')
        if (!confirm) return

        let newSurname: string = window.prompt('Enter new name') || ''
        newSurname = newSurname.trim()
        newSurname = newSurname.charAt(0).toUpperCase() + newSurname.slice(1).toLowerCase()

        if (newSurname === '' || !onlyLetters(newSurname)) {
            window.alert('Invalid new name value')
            return
        }

        await updateUserSurname(medical.id, newSurname)
    }

    return (
        <article className={'medical-employee-card'}>
            <span className={'scalable'} onClick={() => changeName()} title={'edit name'}><ins>Name:</ins>
                &nbsp; {medical.name}</span>
            <hr/>
            <span className={'scalable'} onClick={() => changeSurname()} title={'edit surname'}><ins>Surname:</ins>
                &nbsp; {medical.surname}</span>
            <hr/>
            <span><ins>Job:</ins>
                &nbsp; {medical.job_title}</span>
            <hr/>
            <span className={'scalable'} onClick={() => changeCabinet()} title={'edit cabinet'}><ins>Cabinet:</ins>
                &nbsp; {medical.cabinet}</span>

            {
                getAuthDataFromLocalStorage().type !== 'vacationer'
                &&
                <>
                    <hr/>
                    <span className={'scalable'} onClick={() => changeRoom()} title={'edit room'}><ins>Room:</ins>
                        &nbsp; {medical.room}</span>
                </>
            }
        </article>
    )
}
