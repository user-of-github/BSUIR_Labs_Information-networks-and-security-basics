
import {EntertainmentsList} from '../components/EntertainmentsList'
import {FreeRoomsList} from '../components/FreeRoomsList'


export const FreeRoomsListPage = (): JSX.Element => (
    <main className={'main page'}>
        <h1>List of rooms, where there are free places</h1>
        <h2>Don't worry, if there aren't free rooms now ! If so , return later and check our updates !</h2>
        <FreeRoomsList/>
    </main>
)
