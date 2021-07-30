import { useState, useContext } from "react";
import { Modal, Button, Form, Alert } from 'react-bootstrap';

import '../styles/Login.css';
import Login from '../organisms/Login';

// ---------- config -----------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';

export default function Register(props) {
    const [state, dispatch] = useContext(UserContext);
    const [show, setShow] = useState(props.isOpen);
    const handleClose = () => setShow(false);

    // login
    const [showLogin, setShowLogin] = useState(false);
    const handleLoginModal = () => {
        setShow(!show);
        setShowLogin(!showLogin);
    }

    // message gagal
    const [messageGagal, setMessageGagal] = useState('')

    // message success
    const [message, setMessage] = useState('')


    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        level: '',
        gender: '',
        phone: '',
        address: '',
        image: 'profile.jpg',
    })

    const { fullName, email, password, gender, phone, address, level } = form

    // name dan value form sama
    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // ketika tombol submit di tekan
    const handleOnSubmit = async (e) => {

        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({
                ...form
            })

            // link config
            const response = await API.post('/register', body, config)

            console.log(response)

            // jika success
            if (response.data.status === 'success') {
                setMessageGagal('')

                // ketika success
                setMessage(response.data.message)

                // kosongkan data
                setForm({
                    fullName: '',
                    email: '',
                    password: '',
                    level: '',
                    gender: '',
                    phone: '',
                    address: '',
                    image: '',
                })

                handleClose()


                // jika kesalahan inputan
            } else if (response.data.status === 'Validation Faileds') {
                setMessage('')
                setMessageGagal(response.data.message)
                // jika email sudah ada di database
            } else if (response.data.status === 'Failed') {
                setMessage('')
                setMessageGagal(response.data.message)
            }

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data.data.user
            })

            // server error
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            {showLogin ? <Login isOpen={true} /> : null}
            <Modal show={show} onHide={handleClose}>
                <Modal.Body className="modalLogin modalRegister">
                    <Modal.Title className="text-white">Registerasi</Modal.Title>
                    {/* alert ketika success */}
                    {message &&
                        <Alert className="message-notice" variant="success">
                            {message}
                        </Alert>
                    }

                    {/* alert ketika gagal dan email sudah ada */}
                    {messageGagal &&
                        <Alert className="message-notice" variant="danger">
                            {messageGagal}
                        </Alert>
                    }
                    <Form onSubmit={handleOnSubmit}>
                        <Form.Group >
                            <Form.Control className="mt-3 inputLogin" type="email" onChange={handleOnChange} value={email} name="email" placeholder="Email" required autoComplete="off" />
                            <Form.Control className="mt-3 inputLogin" type="password" onChange={handleOnChange} value={password} name="password" placeholder="Password" required autoComplete="off" />
                            <Form.Control className="mt-3 inputLogin" type="text" onChange={handleOnChange} value={fullName} name="fullName" placeholder="Full Name" required autoComplete="off" />
                            {/* <Form.Control className="mt-3 inputLogin" type="text" onChange={handleOnChange} value={gender} name="gender" placeholder="Gender" required /> */}

                            <Form.Control className="mt-3 inputLogin genderOption" type="text" onChange={handleOnChange} value={gender} name="gender" as="select">
                                <option value="" selected disabled>Gender</option>
                                <option name="gender">male</option>
                                <option name="gender">female</option>
                            </Form.Control>

                            <Form.Control className="mt-3 inputLogin" type="text" onChange={handleOnChange} value={phone} name="phone" placeholder="Phone" required autoComplete="off" />
                            <Form.Control className="mt-3 inputLogin" type="text" onChange={handleOnChange} value={level} name="level" placeholder="Level" required autoComplete="off" />
                            {/* <Form.Control className="mt-3 inputLogin" type="text" onChange={handleOnChange} value={address} name="address" placeholder="Address" required /> */}
                            <Form.Control className="mt-3 inputLogin" type="text" onChange={handleOnChange} value={address} name="address" placeholder="Address" required as="textarea" rows={3} />
                        </Form.Group>
                        <Button className="mt-3 btnLogins" type="submit" variant="trasparant">
                            Register
                        </Button>
                        <center className="mt-2 loginend">Already have an account ? Klik  <span className="Reg" onClick={handleLoginModal}>Here</span></center>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
