import { useState, useContext } from "react";
import { Modal, Button, Form } from 'react-bootstrap';

import '../styles/Login.css';

// ----------- component -----------
import { UserContext } from "../contexts/UserContext";
import { API, setAuthToken } from '../config/api';
import Register from '../organisms/Register';

export default function Login(props) {
    const [show, setShow] = useState(props.isOpen);
    const handleClose = () => setShow(false);

    // register
    const [showRegisterModal, setRegisterModal] = useState(false);
    const handleModalRegister = () => {
        setShow(!show);
        setRegisterModal(!showRegisterModal);
    }

    const [state, dispatch] = useContext(UserContext);
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const { email, password } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({
                email,
                password
            })

            const response = await API.post("/login", body, config)

            setMessage(response.data.message)

            setAuthToken(response.data.data.user.token)


            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data.data.user
            })

        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div>
            {showRegisterModal ? <Register isOpen={true} /> : null}
            <Modal show={show} onHide={handleClose}>
                <Modal.Body className="modalLogin">
                    <Modal.Title className="text-white">Login</Modal.Title>
                    <Form onSubmit={handleSubmit}>
                        {message &&
                            <div className="alert alert-danger message-login" role="alert">
                                {message}
                            </div>
                        }
                        <Form.Group >
                            <Form.Control className="mt-3 inputLogin" onChange={onChange} value={email} name="email" type="email" placeholder="Email" required autoComplete="off" />
                            <Form.Control className="mt-3 inputLogin" onChange={onChange} value={password} name="password" type="password" placeholder="Password" required autoComplete="off" />
                        </Form.Group>
                        <Button className="mt-3 btnLogins" type="submit" variant="trasparant">
                            Login
                        </Button>
                        <center className="mt-2 loginend">Don't have an account ? Klik <span className="Reg" onClick={handleModalRegister}>Here</span></center>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
