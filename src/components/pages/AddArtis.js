// ------------------ react ----------------------
import React from 'react';
import { useEffect, useState, useContext } from "react";

// ---------------------- bootrtrap --------------------------
import { Container, Navbar, Button, Form } from 'react-bootstrap';

// ------------------------ ant -------------------------------
import { Popover, message, Space } from 'antd';

// ---------------- avatar --------------
import Avatar from 'react-avatar';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faMusic, faCreditCard } from '@fortawesome/free-solid-svg-icons';

// -------- router -------------
import { Link } from "react-router-dom";

// --------------- components --------------
import Logo from '../assets/logo.png';

// ----------------- styles ----------------------
import '../styles/ListTrans.css';
import '../styles/AddMusic.css';
import '../styles/AddArtis.css';

// --------------- functions ----------------------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';

export default function AddArtis() {

    // useState
    const [state, dispatch] = useContext(UserContext);
    const [user, setUser] = useState({});

    const loadUser = async () => {
        try {
            const response = await API.get(`user/${state.user.id}`)
            setUser(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    message.config({
        duration: 4,
    });

    // klik logout
    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
    }

    // ------------------------------------------ tambah artis -------------------------------------
    const [form, setForm] = useState({
        name: '',
        old: '',
        type: '',
        startCareer: ''
    })

    const { name, old, type, startCareer } = form

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleOnSubmit = async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({ ...form })

            const response = await API.post('/artis', body, config)

            message.success('Add Artis Success');

            setForm(
                {
                    name: '',
                    old: '',
                    type: '',
                    startCareer: ''
                }
            )

        } catch (error) {
            console.log(error)
        }

    }

    // dropdown profile
    const content = (
        <div>
            <Link className="linkProfile" to={`/ListTrans`}>
                <p className="text-white cursorin"><FontAwesomeIcon className="iconLogout" icon={faCreditCard} size="80px" /> &nbsp;  List Trans</p>
            </Link>
            <Link className="linkProfile" to={`/AddMusic`}>
                <p className="text-white cursorin"><FontAwesomeIcon className="iconLogout" icon={faMusic} size="80px" /> &nbsp;  Add Music</p>
            </Link>
            <hr className="hr" />
            <p className="text-white cursorin" onClick={handleLogout}><FontAwesomeIcon className="iconLogout" icon={faSignInAlt} size="80px" /> &nbsp; Logout</p>
        </div>
    );

    useEffect(() => {
        loadUser()
    }, [])

    return (
        <div className="bgTrans">
            {/* -------------------------------------------- Navbar ----------------------------------------------- */}
            <Navbar className="NavbarTrans">
                <Container>
                    <img
                        src={Logo}
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Popover placement="bottomRight" content={content} trigger="click">
                                {/* <div className="boxProfile">
                                    <Card.Img className="imageProfile" variant="top" src={Song1} />
                                </div> */}
                                {user.fullName === undefined ?
                                    <div> </div> :
                                    <Avatar name={user.fullName} className="avatarProfile" size="35" />
                                }
                            </Popover>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* ----------------------------------------------- form ----------------------------------------------- */}
            <Container className="mt-5">
                <h6 className="text-white addText">Add Artis</h6><br />
                <Form onSubmit={handleOnSubmit} className="formInputJS">
                    <Form.Control className="inputaddmusic" required onChange={handleOnChange} value={name} name="name" type="text" placeholder="Name" required autoComplete="off" /><br />
                    <Form.Control className="inputaddmusic" required onChange={handleOnChange} value={old} name="old" type="number" placeholder="Old" required autoComplete="off" /> <br />
                    {/* <Form.Control className="inputaddmusic" required onChange={handleOnChange} value={type} name="type" type="solo" placeholder="Solo" required autoComplete="off" /> <br /> */}

                    {/* <Form.Control className="inputaddmusic" type="text" onChange={handleOnChange} value={type} name="type" placeholder="Type" as="select">
                        <option value="" selected disabled>Type</option>
                        <option name="type">Solo</option>
                        <option name="type">Band</option>
                    </Form.Control> */}

                    <select className="inputaddmusic selectInput" type="text" onChange={handleOnChange} value={type} name="type" placeholder="Type" >
                        <option value="" selected disabled>Type</option>
                        <option name="type">Solo</option>
                        <option name="type">Band</option>
                    </select>

                    <Form.Control className="inputaddmusic mt-4" required onChange={handleOnChange} value={startCareer} name="startCareer" type="text" placeholder="Start  a Career" required autoComplete="off" /> <br />
                    <Space>
                        <Button type="submit" className="btnArtis">Add Artis</Button>
                    </Space>
                </Form>
            </Container>
        </div>
    )
}
