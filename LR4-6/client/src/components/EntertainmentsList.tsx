import {getAdminsList, getEntertainmentsList} from '../utils'
import React from 'react'
import {Entertainment, ServerResponse} from '../types'

export const EntertainmentsList = (): JSX.Element => {

    const [entertainments, setEntertainments] = React.useState<Array<Entertainment>>([])
    const loadedCallback = (data: ServerResponse) => {
        if (data.status !== 'OK') {
            window.alert(data.status)
        } else {
            setEntertainments(data.data)
        }
    }
    React.useEffect(() => {
        getEntertainmentsList(loadedCallback)
    }, [])

    return (
        <table className={'table-entertainments'}>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {
                    entertainments.map((e: Entertainment, i: number) => (
                        <tr key={i}>
                            <td>{e.title}</td>
                            <td>{e.description}</td>
                            <td>{e.price !== '$0.00' ? e.price : 'Free'}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
