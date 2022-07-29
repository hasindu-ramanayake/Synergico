import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword } from "./../firebase";
import "./Login.css";
import auth from "./Auth";




function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const onClickHandle = async () => {
        let res = await logInWithEmailAndPassword(email, password)
        localStorage.setItem('token', JSON.stringify(res.token));

        if ( res.type === "employee") {
            navigate('/Dashboard')
        } else if (res.type === "admin") {
            navigate('/admin')
        } else if (res.type === "vendor") {
            navigate('/vendor')
        } else {
            navigate('/');
        }
    }

    if (auth.isAuthenticated()) {
        console.log(auth.isAuthenticated());
        /*navigate('/Dashboard')*/
    } else {
        return (
            <div className="login">
                <div className="login__container">
                    <input
                        type="text"
                        className="login__textBox"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail Address"
                    />
                    <input
                        type="password"
                        className="login__textBox"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button
                        className="login__btn"
                        onClick={onClickHandle}  >
                        Login
                    </button>
                    <div>
                        Don't have an account? <Link to="/register">Register</Link> now.
                    </div>
                </div>
            </div>
        );
    }

}
export default Login;