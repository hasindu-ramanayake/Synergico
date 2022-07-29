import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
    auth,
    registerWithEmailAndPassword,
    signInWithGoogle,
    UseFetchLogin
} from "./../firebase";
import "./Register.css";




function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [company, setComapany] = useState("");
    const [type, setType] = useState("employee");
    let navigate = useNavigate();

    const onClickHandle = async (e, company, email, password, type) => {
        e.preventDefault();
        if (await registerWithEmailAndPassword(company, email, password, type) === "OK") {
            navigate('/login')
        } else {
            navigate('/register');
        }
    }
    const hadleSubmit = () => {
        
        
    }

    return (
        <div className="register">
            <form className="register__container" onSubmit={(e) => onClickHandle(e,company, email, password, type)}>
                <input
                    type="text"
                    className="register__textBox"
                    value={company}
                    onChange={(e) => setComapany(e.target.value)}
                    placeholder="Company Name" />

                <input
                    type="text"
                    className="register__textBox"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address" />

                <input
                    type="password"
                    className="register__textBox"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" />

                <select value={type} className="register__textBox" onChange={(e) => setType(e.target.value)}>
                    <option value="employee">employee</option>
                    <option value="vendor">vendor</option>
                </select>

                <input type="submit" className="register__btn"/>
                <div>
                    Already have an account? <Link to="/">Login</Link> now.
                </div>
            </form>
        </div>
    );
}
export default Register;