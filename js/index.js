import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail"
import Lister from "./components/Lister"
import Detail from "./components/Detail"
import NavBar from "./components/NavBar"
import React, { Component  } from 'react';
import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react'
import {BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom'

const container = document.getElementById("root");
render(
    <Router basename = "/market/">
        <div>
            {
            // <Route exact path = "/" component = {UserList} />
            // <Route path = "/users/:userId" component = {UserDetail} />
            }
            <NavBar />
            <Switch>
                <Route exact path = "/">
                    <Redirect to="/users" />
                </Route>
                <Route exact path = "/:endpoint" component = {Lister} />
                <Route exact path = "/:endpoint/:item_id" render = {(props) => <Detail {...props} key = {props.location.key} />} />
            </Switch>
        </div>
    </Router>
    ,
container);