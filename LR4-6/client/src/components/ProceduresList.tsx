import {getEntertainmentsList, getProceduresList} from '../utils'
import React from 'react'
import {Entertainment, Procedure, ServerResponse} from '../types'


export const ProceduresList = (): JSX.Element => {

    const [procedures, setProcedures] = React.useState<Array<Procedure>>([])
    const loadedCallback = (data: ServerResponse) => {
        if (data.status !== 'OK') {
            window.alert(data.status)
        } else {
            setProcedures(data.data)
        }
    }
    React.useEffect(() => {
        getProceduresList(loadedCallback)
    }, [])

    return (
        <table className={'table-procedures'}>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {
                    procedures.map((e: Entertainment, i: number) => (
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
