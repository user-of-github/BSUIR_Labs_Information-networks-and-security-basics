import {MedicalsList} from '../components/MedicalsList'
import {getAuthDataFromLocalStorage} from '../utils'


export const MedicalsListPage = (): JSX.Element => {
    return (
        <main className={'main page'}>
            <h1>List of our doctors, medicals</h1>
            <h2>They are professionals of their deal</h2>
            <MedicalsList/>
        </main>
    )
}
