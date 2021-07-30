// -------------------- react ---------------------
import React from 'react';
import { useEffect, useState, useContext } from "react";

// -------------------- bootstrap ------------------------
import { Container, Navbar, Button, Form } from 'react-bootstrap';

// -------------------- ant -------------------------
import { Popover, message } from 'antd';

// ---------------- avatar --------------
import Avatar from 'react-avatar';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faPaperclip, faCreditCard, faUserPlus } from '@fortawesome/free-solid-svg-icons';

// -------- router -------------
import { Link } from "react-router-dom";

// ----------------- components ----------------------
import Logo from '../assets/logo.png';

// -------------------- styles ------------------------------
import '../styles/ListTrans.css';
import '../styles/AddMusic.css';

// -------------------- config ----------------------------
import { UserContext } from "../contexts/UserContext";

import { API } from '../config/api';

export default function AddMusic() {

    // useState
    const [state, dispatch] = useContext(UserContext);
    const [user, setUser] = useState({});
    const [artiss, setArtiss] = useState([])

    const loadUser = async () => {
        try {
            const response = await API.get(`user/${state.user.id}`)
            setUser(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    const loadArtis = async () => {
        try {
            const response = await API.get('artiss')
            setArtiss(response.data.data.artiss)
        } catch (error) {
            console.log(error)
        }
    }

    console.log(artiss)

    message.config({
        duration: 4,
    });

    // form pertama kali di load
    const [form, setForm] = useState({
        title: '',
        year: '',
        thumbnail: '',
        attache: '',
        idArtis: ''
    })

    // view image upload
    const [preview, setPreview] = useState('')

    const { title, year, thumbnail, attache, idArtis } = form

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.id === "attache" ? e.target.files : e.target.value && e.target.id === "thumbnail" ? e.target.files : e.target.value,
        })

        if (e.target.id === "input-file") {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
            console.log(url)
        }
    }

    const handleOnSubmit = async () => {
        console.log('submit')
        try {

            const config = {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            }


            const formData = new FormData()
            formData.set("title", form.title)
            formData.set("year", form.year)
            console.log(form.attache[0].name)
            console.log(form.thumbnail[0].name)
            formData.set("fileSong", form.attache[0], form.attache[0].name)
            formData.set("imageSong", form.thumbnail[0], form.thumbnail[0].name)
            formData.set("idArtis", form.idArtis)

            await API.post('/musics', formData, config)

            message.success('Add Song Success');

            setForm(
                {
                    title: '',
                    year: '',
                    thumbnail: '',
                    attache: '',
                    idArtis: ''
                }
            )

        } catch (error) {
            console.log(error)
        }
    }

    // klik logout
    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
    }

    // dropdow profile
    const content = (
        <div>
            <Link className="linkProfile" to={`/AddArtis`}>
                <p className="text-white cursorin"><FontAwesomeIcon className="iconLogout" icon={faUserPlus} size="80px" /> &nbsp;  Add Artis</p>
            </Link>
            <Link className="linkProfile" to={`/ListTrans`}>
                <p className="text-white cursorin"><FontAwesomeIcon className="iconLogout" icon={faCreditCard} size="80px" /> &nbsp;  List Trans</p>
            </Link>
            <hr className="hr" />
            <p className="text-white cursorin" onClick={handleLogout}><FontAwesomeIcon className="iconLogout" icon={faSignInAlt} size="80px" /> &nbsp; Logout</p>
        </div>
    );

    useEffect(() => {
        loadUser()
    }, [])

    useEffect(() => {
        loadArtis()
    }, [])

    return (
        <div className="bgTrans">
            {/* ------------------------------------------------ Navbar -----------------------------------------  */}
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

            {/* ------------------------------------------- form ----------------------------------------------- */}
            <Container className="mt-5">
                <h6 className="text-white textMusic">Add Music</h6><br />
                <Form className="formAddSong" onSubmit={(e) => {
                    e.preventDefault()
                    handleOnSubmit()
                }}>
                    <div className="inputflex">
                        <Form.Control className="inputaddmusic inputflex" type="text" onChange={onChange} name="title" value={title} placeholder="Title" required autoComplete="off" />
                        <div class='files file--upload mt-2'>
                            <label for='thumbnail'>
                                <span className="AttachImage">Attach Thumbnail</span>
                                <FontAwesomeIcon className="iconPins" icon={faPaperclip} />
                            </label>
                            <input id='thumbnail' type='file' onChange={onChange} name="thumbnail" accept="image/*" />
                        </div>
                    </div><br />
                    <Form.Control className="inputaddmusic" type="number" onChange={onChange} name="year" placeholder="Year" value={year} required autoComplete="off" /> <br />
                    {/* <Form.Control className="inputaddmusic" type="number" onChange={onChange} name="idArtis" placeholder="idArtis" value={idArtis} required autoComplete="off" /> <br /> */}

                    <select className="inputaddmusic selectInput" type="text" onChange={onChange} value={idArtis} name="idArtis" as="select">
                        <option value="" selected disabled>Artis</option>
                        {artiss?.map((art, index) => (
                            <>
                                <option name="idArtis" value={art.id}>{art.name}</option>
                                {/* <option name="idArtis" value="2">fsf</option> */}
                            </>
                        ))}
                    </select>


                    <div class='filex file--upload mt-4 me-auto'>
                        <label for='attache'>
                            Attache
                        </label>
                        <input id='attache' type='file' onChange={onChange} name="attache" accept="audio/*" />
                    </div> <br /><br />
                    <Button className="addSong" type="submit">Add Song</Button>
                </Form>
            </Container>
        </div>
    )
}
