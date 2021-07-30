// ------------- react -----------------
import { useEffect, useState, useContext } from "react";

// ------------ bootstrap --------------
import { Container, Navbar, Jumbotron, Row, Col, Card } from 'react-bootstrap';

// ---------------- ant ----------------
import { Popover } from 'antd';

// ---------------- avatar --------------
import Avatar from 'react-avatar';

// --------------- styles ----------------
import '../styles/Berandano.css';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faMoneyCheckAlt, faHeart } from '@fortawesome/free-solid-svg-icons';

// ---------=----- Aos -----------------
import Aos from "aos";
import "aos/dist/aos.css";

// -------------- router ---------------
import { Link } from "react-router-dom";

// ----------- components --------------
import PlayerMusic from '../organisms/PlayerMusic';
import Logo from '../assets/logo.png';
import MusicApproved from "../organisms/MusicApproved";

// ----------- function ----------------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';

// ------------- path -----------------
const path = "http://localhost:5000/uploads/";

export default function BerandaLog() {

    // states
    const [state, dispatch] = useContext(UserContext);

    const [musics, setMusics] = useState([])
    const [musicId, setMusicId] = useState("")
    const [user, setUser] = useState({})
    const [userTrnas, setUserTrans] = useState({})

    // load user
    const loadUser = async () => {
        try {
            const response = await API.get(`user/${state.user.id}`)
            setUser(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    // load transaksion
    const loadUserTrans = async () => {
        try {
            const response = await API.get(`userTrans/${state.user.id}`)
            setUserTrans(response.data.data.user.transaction)
        } catch (error) {
            console.log(error)
        }
    }


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

    // logout
    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
    }

    // dropdown profile
    const content = (
        <div>
            <Link className="linkProfile" to={`/Pay`} musicId={musicId}>
                <p className="text-white cursorin"><FontAwesomeIcon className="iconLogout" icon={faMoneyCheckAlt} size="80px" /> &nbsp;  Pay</p>
            </Link>
            <p className="text-white cursorin" onClick={handleLogout}><FontAwesomeIcon className="iconLogout" icon={faSignInAlt} size="80px" /> &nbsp; Logout</p>
        </div>
    );

    // Load data ketika pertama kali
    useEffect(() => {
        loadMusic()
    }, [])

    useEffect(() => {
        loadUser()
    }, [])

    useEffect(() => {
        loadUserTrans()
    }, [])


    // aos duration
    useEffect(() => {
        Aos.init({ duration: 1500 });
    }, [])

    return (
        <div>
            <div className="fixed-top">
                {/* ------------------------------------------ navbar -----------------------------------------  */}
                <nav className="bg">
                    <Navbar>
                        <Container>
                            <img
                                src={Logo}
                                className="d-inline-block align-top"
                                alt="React Bootstrap logo"
                            />
                            <always-avatar source="mr.hokid@gmail.com" size="40"></always-avatar>
                            <Navbar.Toggle />
                            <Navbar.Collapse className="justify-content-end">
                                <Navbar.Text>
                                    <Popover placement="bottomRight" content={content} trigger="click">
                                        {user.fullName === undefined ?
                                            <div> </div> :
                                            <Avatar name={user.fullName} className="avatarProfile" size="35" />
                                        }
                                    </Popover>
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </nav>
            </div>

            {/* ------------------------------------------ jumbotron -----------------------------------------  */}
            <Jumbotron className="banner">
                <Container className="textBeranda" data-aos="zoom-in">
                    <div className="jumbotronText">
                        <h1 className="conn text-white">Connect on DumbSound</h1>
                        <p className="dis">
                            Discovery, Stream, and share a constantly expanding mix of music <br /> from emerging and major artists around the world
                        </p>
                    </div>
                </Container>
            </Jumbotron>

            {/* ------------------------------------------ card song -----------------------------------------  */}
            <div className="cardSong">
                <Container>
                    <p className="dengarkan">Dengarkan Dan Rasakan</p>
                    {/* card song */}
                    {userTrnas === null ?
                        <Row>
                            {musics?.map((msc, index) => (
                                <Col lg="2" md="6" sm="4" className="mt-3">
                                    <Link className="linkProfile" to={`/Pay`}>
                                        <Card className="cardThumb">
                                            <div class="boxthumb">
                                                <Card.Img className="imageThumb" variant="top" src={path + msc.thumbnail} />
                                            </div>
                                            <Card.Body className="cardBody">
                                                <Card.Title className="titleCard">
                                                    <div className="boxTitle">
                                                        <p className="artis">{msc.title}</p>
                                                    </div>
                                                    <p className="year">{msc.year}</p>
                                                </Card.Title>
                                                <Card.Text className="textThumb">
                                                    {msc.artis.name}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row> :

                        <>
                            {userTrnas.status === "Approved" ?

                                <Row>
                                    {musics?.map((msc, index) => (
                                        <Col lg="2" md="4" sm="6" className="mt-3">
                                            <Card className="cardThumb">
                                                <div class="boxthumb" onClick={() => setMusicId(msc)}>
                                                    <Card.Img className="imageThumb" variant="top" src={path + msc.thumbnail} />
                                                </div>
                                                <MusicApproved msc={msc} loadMusic={loadMusic} setMusics={setMusics} />
                                            </Card>
                                        </Col>
                                    ))}
                                </Row> :

                                <Row>
                                    {musics?.map((msc, index) => (
                                        <Col lg="2" md="4" sm="6" className="mt-3">
                                            <Link className="linkProfile" to={`/Pay`}>
                                                <Card className="cardThumb">
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
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>




                            }
                        </>

                    }
                    <br /><br />
                    <br /><br />
                </Container>
            </div>
            {/* playing music */}
            {musicId === "" ?
                <div></div> :
                <Navbar className="fixed-bottom">
                    <PlayerMusic musicId={musicId} />
                </Navbar>
            }
        </div>
    )
}
