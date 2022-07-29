import React from "react";
import ReactDOM from "react-dom";
import { Route, Routes,Navigate } from "react-router-dom";
import auth from "./Auth";

export const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        <Routes>
        <Route {...rest}
            render={props => {
                if (auth.isAuthenticated()) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Navigate to={{pathname: "/", state: { from: props.location } }} />
                    );
                }
            }}
            />
        </Routes>
    );
};