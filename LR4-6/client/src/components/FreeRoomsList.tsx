import {getAdminsList, getEntertainmentsList, getRoomsWithFreePlacesList} from '../utils'
import React from 'react'
import {Entertainment, FreeRoom, ServerResponse} from '../types'

export const FreeRoomsList = (): JSX.Element => {
    const [freeRooms, setFreeRooms] = React.useState<Array<FreeRoom>>([])
    const loadedCallback = (data: ServerResponse) => {
        if (data.status !== 'OK') {
            window.alert(data.status)
        } else {
            setFreeRooms(data.data)
        }
    }
    React.useEffect(() => {
        getRoomsWithFreePlacesList(loadedCallback)
    }, [])

    return (
        <div className='free-rooms-container'>
            {
                freeRooms.map((room: FreeRoom): JSX.Element => (
                    <article className={'free-room scalable'} key={room.number}>
                        <span>Room № {room.number}</span>
                        <span>Places left: {room.places_left}</span>
                    </article>
                ))
            }
        </div>
    )
}
