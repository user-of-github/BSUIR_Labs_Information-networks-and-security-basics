import {Link, Redirect} from 'react-router-dom'
import {LS_AUTH_STATUS} from '../constants'
import {getAuthDataFromLocalStorage} from '../utils'


export const AddNewPage = (): JSX.Element => {
    const isAuthorized: boolean = JSON.parse(localStorage.getItem(LS_AUTH_STATUS) || 'false')

    //console.log(isAuthorized)
    if (!isAuthorized) {
        window.alert('You are not authorized')
        return <Redirect to={'/'}/>
    }

    const authStatus = getAuthDataFromLocalStorage()
    if (authStatus.type === 'vacationer') {
        window.alert('You are not allowed to visit this page')
        return <Redirect to={'/'}/>
    }

    return (
       <main className={'main page'}>
           <h1>Page for admins or medicals only</h1>
           <h2>Be careful: some actions available only for administrators</h2>

           <div className={'addNewContainer'}>
               <Link to={'addnewroom'}>
                   <button className={'button'}>Create new room</button>
               </Link>

               <Link to={'newprocedure'}>
                   <button className={'button'}>Create new procedure</button>
               </Link>
           </div>
       </main>
    )
}
