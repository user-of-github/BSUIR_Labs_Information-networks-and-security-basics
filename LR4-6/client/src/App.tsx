import React from 'react'
import './App.css'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import {Main} from './pages/Main'
import {Navigation} from './components/Navigation'
import {Authorize} from './pages/Authorize'
import {MedicalsListPage} from './pages/MedicalsListPage'
import {AdminsListPage} from './pages/AdminsListPage'
import {EntertainmentsListPage} from './pages/EntertainmentsListPage'
import {VacationersListPage} from './pages/VacationersListPage'
import {ProceduresListPage} from './pages/ProceduresListPage'
import {FreeRoomsListPage} from './pages/FreeRoomsListPage'
import {AddNewPage} from './pages/AddNew'
import {AddNewRoomPage} from './pages/AddNewRoom'
import {AddNewProcedure} from './pages/AddNewProcedure'
import { JsInjectionPage } from './pages/JsInjection';


export const App = (): JSX.Element => {
    return (
        <div className="container">
            <Router>
                <Navigation/>
                <Switch>
                    <Route exact path="/">
                        <Main/>
                    </Route>
                    <Route path="/auth">
                       <Authorize/>
                    </Route>
                    <Route path="/medicals">
                        <MedicalsListPage/>
                    </Route>
                    <Route path={'/admins'}>
                        <AdminsListPage/>
                    </Route>
                    <Route path={'/entertainments'}>
                        <EntertainmentsListPage/>
                    </Route>
                    <Route path={'/vacationers'}>
                        <VacationersListPage/>
                    </Route>
                    <Route path={'/procedures'}>
                        <ProceduresListPage/>
                    </Route>
                    <Route path={'/freerooms'}>
                        <FreeRoomsListPage/>
                    </Route>
                    <Route path={'/addnew'}>
                        <AddNewPage/>
                    </Route>
                    <Route path={'/addnewroom'}>
                        <AddNewRoomPage/>
                    </Route>
                    <Route path={'/newprocedure'}>
                        <AddNewProcedure/>
                    </Route>

                    <Route path={'/jsinjection'}>
                        <JsInjectionPage/>
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

