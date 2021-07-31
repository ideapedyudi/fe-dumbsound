// -------------- react ----------------
import { useEffect, useState } from "react";
import { Container, Navbar, Button, Jumbotron, Row, Col, Card } from 'react-bootstrap';

// -------------- styles ---------------
import '../styles/Berandano.css';

// ------------- Aos -----------------
import Aos from "aos";
import "aos/dist/aos.css";

// ------------ components -------------
import Logo from '../assets/logo.png';
import Login from '../organisms/Login';
import Register from '../organisms/Register';

// ------------ config ---------------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';

// ------------ path ------------------
const path = "https://github.com/ideapedyudi/be-dumbsound/tree/stable/uploads/";

export default function Berandano() {

    // login
    const [isClickLogin, setClickLogin] = useState(false);
    const handleClickLogin = () => setClickLogin(!isClickLogin);

    // registerasi
    const [isClickRegister, setClickRegister] = useState(false);
    const handleClickRegister = () => setClickRegister(!isClickRegister);

    // useState
    const [musics, setMusics] = useState([])

    // load Feed
    const loadMusic = async () => {
        try {
            const response = await API.get(`musics`)
            setMusics(response.data.data.musics)
            console.log(response.data.data.musics)
        } catch (error) {
            console.log(error)
        }
    }

    // Load data ketika pertama kali
    useEffect(() => {
        loadMusic()
    }, [])

    // aos duration
    useEffect(() => {
        Aos.init({ duration: 1500 });
    }, [])

    return (
        <div>
            <div className="fixed-top">
                {/* ------------------------------------------- navbar ------------------------------------- */}
                <nav className="bg">
                    <Navbar>
                        <Container>
                            <img
                                src={Logo}
                                className="d-inline-block align-top"
                                alt="React Bootstrap logo"
                            />
                            <Navbar.Toggle />
                            <Navbar.Collapse className="justify-content-end">
                                <Navbar.Text>
                                    <Button className="btnLogin bg-transparent" onClick={handleClickLogin}><p className="logName">Login</p></Button> &nbsp;
                                    <Button className="btnRegis"> <p className="regisName" onClick={handleClickRegister}>Registrasi</p> </Button>
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </nav>
            </div>

            {/* ------------------------------------- Jumbotron --------------------------------------- */}
            <Jumbotron className="banner">
                <Container className="textBeranda" data-aos="zoom-in">
                    <div className="jumbotronText">
                        <h1 className="conn text-white">Connect on DumbSound</h1>
                        <p className="dis">
                            Discovery, Stream, and share a constantly expanding mix of music <br /> from emerging and major artists around the world
                        </p>
                    </div>
                </Container>
                {isClickLogin ? <Login isOpen={isClickLogin} /> : null}
                {isClickRegister ? <Register isOpen={isClickRegister} /> : null}
            </Jumbotron>

            {/* ------------------------------------------- card song ----------------------------------------- */}
            <div className="cardSong">
                <Container>
                    <p className="dengarkan">Dengarkan Dan Rasakan</p>
                    {/* card song */}
                    <Row>
                        {musics?.map((msc, index) => (
                            <Col lg="2" md="4" sm="6" className="mt-3">
                                <Card className="cardThumb" onClick={handleClickLogin}>
                                    <div class="boxthumb">
                                        <Card.Img className="imageThumb" variant="top" src={path + msc.thumbnail} />
                                    </div>
                                    <Card.Body className="cardBody">
                                        <Card.Title className="titleCard">
                                            <div className="boxTitle">
                                                <p className="artis">{(msc.title.length > 12) ? msc.title.substring(0, 12) + '...' : msc.title}</p>
                                            </div>
                                            <p className="year">{msc.year}</p>
                                        </Card.Title>
                                        <Card.Text className="textThumb">
                                            {msc.artis.name}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <br /><br />
                </Container>
            </div>
        </div>
    )
}
