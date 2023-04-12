
import {VacationersList} from '../components/VacationersList'


export const VacationersListPage = (): JSX.Element => (
    <main className={'main page'}>
        <h1>List of vacationers</h1>
        <h2>This info is available only for medicals and admins</h2>
        <VacationersList/>
    </main>
)
