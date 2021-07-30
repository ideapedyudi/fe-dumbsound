import { useState, useEffect } from 'react';
import { API } from '../config/api';

function Remaining({ dueDate, status, byId, DateAwal, loadTransaction }) {

    const [startDate, setStartDate] = useState("")

    // --------------------- menentukan start date hari ini -----------------------------
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    const loadStartDate = async () => {
        var date = new Date();
        var month = date.getMonth();
        let Tanggal = new Date().getDate();
        let Tahun = new Date().getFullYear();

        setStartDate(Tahun + "-" + months[month] + "-" + Tanggal)
    }

    // --------- menghotung selisih hari dari sekarang dengan due date --------------
    var date1 = new Date(startDate); // tanggal sekarang
    var date2 = new Date(dueDate); // tanggal masa berlangganan

    var Difference_In_Time = date2.getTime() - date1.getTime();

    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    // Delete ketika tanggal berlangganan lebih kecil sama dengan tanggal sekarang
    if (dueDate <= startDate) {
        console.log(byId)
        try {
            API.delete(`/transaction/${byId}`)

            // load transaction
            loadTransaction()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadStartDate()
    }, [])
    return (
        <div>
            {status === "Approved" ?
                <p>{Difference_In_Days} / Hari</p> :
                <p>0 / Hari</p>
            }
        </div>
    )
}

export default Remaining