// -------------------- react ------------------
import React from 'react';
import { useContext, useState, useEffect } from "react";

// ----------------- bootrtrap -----------------
import { Container, Navbar, Card, Table, Dropdown, Modal, Button } from 'react-bootstrap';

// ------------------ ant -----------------------
import { Popover } from 'antd';

// ---------------- avatar --------------
import Avatar from 'react-avatar';

// -------- router -------------
import { Link } from "react-router-dom";

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faMusic, faUserPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons';

// --------------- components ----------------
import Logo from '../assets/logo.png';
import Remaining from '../organisms/Remaining';

// ----------------- styles -------------------
import '../styles/ListTrans.css'

// ---------------- fuction ---------------------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';

const path = "https://github.com/ideapedyudi/be-dumbsound/tree/stable/uploads"

export default function ListTrans() {

    // state
    const [state, dispatch] = useContext(UserContext);
    const [user, setUser] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [buktiById, getBuktiById] = useState({})
    const [startDate, setStartDate] = useState("")
    const [dueDates, setDueDate] = useState("")

    const loadUser = async () => {
        try {
            const response = await API.get(`user/${state.user.id}`)
            setUser(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    const loadTransaction = async () => {
        try {
            const response = await API.get(`transactions`)
            setTransactions(response.data.data.transactions)

        } catch (error) {
            console.log(error)
        }
    }

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


    // ------------------------------ selisih tanggal -------------------------------
    let dueDate = transactions.map((dates, index) => dates.dueDate)
    console.log(dueDate)


    // klik logout
    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
    }

    // ----------------------------- handle approved -----------------------------
    const handleApproved = (event) => {
        const id = event.target.getAttribute('content');
        console.log(id)
        approved(id);
    }
    const approved = async (id) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({
                "startDate": `${startDate}`,
                "dueDate": `${dueDates}`,
                "status": "Approved"
            })

            const response = await API.patch(`/transaction/${id}`, body, config)

            loadTransaction()
        } catch (error) {
            console.log(error);
        }
    }

    // ----------------------------- handle cancel -----------------------------
    const handleCancel = (event) => {
        const id = event.target.getAttribute('content');
        cancel(id);
    }

    const cancel = async (id) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({
                "status": "Cancel"
            })

            const response = await API.patch(`/transaction/${id}`, body, config)

            loadTransaction()
        } catch (error) {
            console.log(error);
        }
    }


    // dropdown profile
    const content = (
        <div>
            <div>
                <Link className="linkProfile" to={`/AddArtis`}>
                    <p className="text-white cursorin"><FontAwesomeIcon className="iconLogout" icon={faUserPlus} size="80px" /> &nbsp;  Add Artis</p>
                </Link>
                <Link className="linkProfile" to={`/AddMusic`}>
                    <p className="text-white cursorin"><FontAwesomeIcon className="iconLogout" icon={faMusic} size="80px" /> &nbsp;  Add Music</p>
                </Link>
                <hr className="hr" />
                <p className="text-white cursorin" onClick={handleLogout}><FontAwesomeIcon className="iconLogout" icon={faSignInAlt} size="80px" /> &nbsp; Logout</p>
            </div>
        </div>
    );


    useEffect(() => {
        loadTransaction()
    }, [])

    useEffect(() => {
        loadUser()
    }, [])

    useEffect(() => {
        loadStartDate()
    }, [])

    useEffect(() => {
        loadDueDate()
    }, [startDate])


    return (
        <div className="bgTrans">
            {/* ----------------------------------------- Navbar -------------------------------------  */}
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

            {/* --------------------------------------- table --------------------------------------------------- */}
            <Container className="mt-5">
                <h6 className="text-white" className="incom">Incoming Transaction</h6>
                <div className="tableContainer">
                    <Table striped hover className="mt-4 tables">
                        <thead>
                            <tr className="trheader">
                                <th>No</th>
                                <th>Users</th>
                                <th>Bukti Tranfer</th>
                                <th>Remaining Active</th>
                                <th>Status User</th>
                                <th>Status Payment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="thead">
                            {transactions.map((transaction, index) => (
                                <tr className="treven">
                                    <td>{index + 1}</td>
                                    <td>{transaction.user.fullName}</td>
                                    <td onClick={() => getBuktiById(transaction)}>
                                        <Card.Img className="attachetrans" variant="top" src={path + transaction.attache} onClick={handleShow} />
                                    </td>
                                    <td>
                                        <p>
                                            <Remaining transaction={transaction} dueDate={dueDate[index]} status={transaction.status} userId={transaction.userId} attache={transaction.attache} byId={transaction.id} DateAwal={transaction.startDate} loadTransaction={loadTransaction} />
                                        </p>
                                    </td>
                                    <td>
                                        {transaction.status == "Approved" ?
                                            <p className="text-success">Active</p> :
                                            <p className="text-danger">Not action</p>
                                        }
                                    </td>
                                    <td>
                                        {transaction.status == "Approved" ?
                                            <p className="text-success">{transaction.status}</p> :
                                            <>
                                                {transaction.status == "Panding" ?
                                                    <p className="text-warning">{transaction.status}</p> :
                                                    <p className="text-danger">{transaction.status}</p>
                                                }
                                            </>
                                        }
                                    </td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle className="btnDropdown" variant="transparant" id="dropdown-basic">
                                                <FontAwesomeIcon className="iconDropdown" icon={faCaretDown} size="90px" />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="boxDropdown">
                                                <Dropdown.Item className="linkDropdown1" onClick={handleApproved} content={transaction?.id}>Approved</Dropdown.Item>
                                                <Dropdown.Item className="linkDropdown2" onClick={handleCancel} content={transaction?.id}>Cancel</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body className="modalBukti">
                    <Card.Img className="buktiTrans" variant="top" src={path + buktiById.attache} />
                </Modal.Body>
            </Modal>
        </div>

    )
}
