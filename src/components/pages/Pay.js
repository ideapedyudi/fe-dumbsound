// ------------------ react -------------
import { useContext, useEffect, useState } from "react";

// -------------- bootrasp --------------
import { Container, Navbar, Button, Card, Form } from 'react-bootstrap';

// --------------- ant -----------------
import { Popover } from 'antd';

// -------------- avatar ---------------
import Avatar from 'react-avatar';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faHome, faPaperclip } from '@fortawesome/free-solid-svg-icons';

// -------- router -------------
import { Link } from "react-router-dom";

// -------------- styles --------------
import '../styles/Berandano.css';
import '../styles/Pay.css';

// ------------- components ------------
import Logo from '../assets/logo.png';
import Konfirmasi from '../assets/undraw_season_change_f99v 1.png'
import Approved from '../assets/undraw_compose_music_ovo2 1.png'

// ----------- function ----------------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';

export default function Pay() {

    //  states
    const [state, dispatch] = useContext(UserContext);
    const [user, setUser] = useState({})
    const [userTrnas, setUserTrans] = useState({})
    const [startDate, setStartDate] = useState("")
    const [dueDate, setDueDate] = useState("")

    const loadUser = async () => {
        try {
            const response = await API.get(`user/${state.user.id}`)
            setUser(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    const loadUserTrans = async () => {
        try {
            const response = await API.get(`userTrans/${state.user.id}`)
            setUserTrans(response.data.data.user.transaction)
        } catch (error) {
            console.log(error)
        }
    }

    console.log(userTrnas)

    // klik logout
    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
    }

    // dropdown profile
    const content = (
        <div>
            <Link className="linkProfile" to={`/`}>
                <p className="text-white cursorin"><FontAwesomeIcon className="iconLogout" icon={faHome} size="80px" /> &nbsp;  Beranda</p>
            </Link>
            <p className="text-white cursorin" onClick={handleLogout}><FontAwesomeIcon className="iconLogout" icon={faSignInAlt} size="80px" /> &nbsp; Logout</p>
        </div>
    );


    // --------------------- menentukan start date -----------------------------
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    const loadStartDate = async () => {
        var date = new Date();
        var month = date.getMonth();
        let Tanggal = new Date().getDate();
        let Tahun = new Date().getFullYear();

        setStartDate(Tahun + "-" + months[month] + "-" + Tanggal)
    }

    // ------------------ menentukan due date --------------------------------------
    const loadDueDate = async () => {
        var d = new Date(startDate);
        console.log(d.toLocaleDateString());
        d.setDate(d.getDate() + 30);
        const options1 = { year: 'numeric' };
        const options2 = { month: '2-digit' };
        const options3 = { day: '2-digit' };
        let dueDateYear = d.toLocaleDateString('id-id', options1)
        let dueDateMonth = d.toLocaleDateString('id-id', options2)
        let dueDateDay = d.toLocaleDateString('id-id', options3)

        setDueDate(dueDateYear + "-" + dueDateMonth + "-" + dueDateDay);
    }


    // ------------------------------------ add transaction ------------------------------------
    const [form, setForm] = useState({
        // startDate: '',
        // dueDate: '',
        userId: `${state.user.id}`,
        fileName: '',
        status: 'Panding'
    })

    const { name, desc, image, price } = form

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value
        })
    }

    const handleOnSubmit = async () => {
        try {

            const config = {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            }

            console.log(startDate)
            console.log(dueDate)

            const formData = new FormData()
            formData.set("startDate", `${startDate}`)
            formData.set("dueDate", `${dueDate}`)
            formData.set("userId", form.userId)
            formData.set("imageSong", form.fileName[0], form.fileName[0].name)
            formData.set("status", form.status)

            await API.post('/transaction', formData, config)

            loadUserTrans()
        } catch (error) {
            console.log(error)
        }
    }

    // ------------------------------------ edit transaction ------------------------------------
    const [form2, setForm2] = useState({
        status: 'Panding'
    })

    const onChangeCencel = (e) => {
        setForm2({
            ...form2,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value
        })
    }

    const handleOnSubmitCancel = async () => {
        console.log("klil")
        try {

            const config = {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            }

            const formData = new FormData()
            formData.set("startDate", `${startDate}`)
            formData.set("dueDate", `${dueDate}`)
            formData.set("imageSong", form2.fileName[0], form2.fileName[0].name)
            formData.set("status", form2.status)

            await API.patch(`/transactionCancel/${state.user.id}`, formData, config)

            loadUserTrans()
        } catch (error) {
            console.log(error)
        }
    }

    // setTimeout(() => {
    //     loadUserTrans()
    // }, 10000);

    useEffect(() => {
        loadUser()
    }, [])

    useEffect(() => {
        loadUserTrans()
    }, [])

    useEffect(() => {
        loadStartDate()
    }, [])

    useEffect(() => {
        loadDueDate()
    }, [startDate])

    return (
        <div>
            <div className="pay">
                {/* --------------------------------------------- Navbar ------------------------------------------- */}
                <Navbar className="bg-transparent">
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

                {/* --------------------------------------------- Form Premium ------------------------------------------- */}
                <Container className="payFunction">
                    {userTrnas === null ?
                        <>
                            <h5 className="premiumText">Premium</h5>
                            <p className="titleText">
                                Bayar sekarang dan nikmati streaming music yang kekinian dari <b><span className="dumb">DUMB</span>SOUND</b> <br />
                                <div className="numberacc"><b><span className="dumb">DUMB</span>SOUND</b> : 40Ribu / Bulan</div>
                            </p>
                            {/* form */}
                            <Form className="formPremium" onSubmit={(e) => {
                                e.preventDefault()
                                handleOnSubmit()
                            }}>
                                {/* input number account  */}
                                <Form.Control className="inputNumber" type="number" placeholder="Input Yaour account Number" />
                                {/* upload file */}
                                <center>
                                    <div class='file file--upload mt-2'>
                                        <label for='input-file'>
                                            Attache proof of transfer
                                            <FontAwesomeIcon className="iconPin" icon={faPaperclip} />
                                        </label>
                                        <input id='input-file' type='file' onChange={onChange} name="fileName" accept="image/*" />
                                    </div>
                                </center>
                                <Button className="btnSend text-center" type="submit">Send</Button>
                            </Form>
                            {/* button send */}
                        </> :
                        <>
                            {userTrnas.status === "Panding" ?
                                <>
                                    <Card.Img variant="top" className="paddingBanner" src={Konfirmasi} />
                                    <h5 className="text-white">Tunggu Proses Konfirmasi...</h5>
                                </>
                                :
                                <>
                                    {userTrnas.status === "Approved" ?
                                        <>
                                            <Card.Img variant="top" className="paddingBanner" src={Approved} />
                                            <h5 className="text-white">Anda Telah Berlangganan di DumbSound</h5>
                                        </> :
                                        <>
                                            {userTrnas.status === "Cancel" ?
                                                <>
                                                    <div class="alert alert-danger cencelAlert" role="alert">
                                                        Kirim Bukti Transfer Yang Benar
                                                    </div><br /><br />
                                                    <h5 className="premiumText">Premium</h5>
                                                    <p className="titleText">
                                                        Bayar sekarang dan nikmati streaming music yang kekinian dari <b><span className="dumb">DUMB</span>SOUND</b> <br />
                                                        <div className="numberacc"><b><span className="dumb">DUMB</span>SOUND</b> : 40Ribu / Bulan</div>
                                                    </p>
                                                    {/* form */}
                                                    <Form className="formPremium" onSubmit={(e) => {
                                                        e.preventDefault()
                                                        handleOnSubmitCancel()
                                                    }}>
                                                        {/* input number account  */}
                                                        <Form.Control className="inputNumber" type="number" placeholder="Input Yaour account Number" />
                                                        {/* upload file */}
                                                        <center>
                                                            <div class='file file--upload mt-2'>
                                                                <label for='input-file'>
                                                                    Attache proof of transfer
                                                                    <FontAwesomeIcon className="iconPin" icon={faPaperclip} />
                                                                </label>
                                                                <input id='input-file' type='file' onChange={onChangeCencel} name="fileName" accept="image/*" />
                                                            </div>
                                                        </center>
                                                        <Button className="btnSend text-center" type="submit">Send</Button>
                                                    </Form>
                                                </> :
                                                <div></div>
                                            }
                                        </>
                                    }
                                </>
                            }
                        </>
                    }
                </Container>
            </div>
        </div>
    )
}