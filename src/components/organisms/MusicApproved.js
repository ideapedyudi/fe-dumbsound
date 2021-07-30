import { useEffect, useState, useContext } from 'react';

// ------------ bootstrap --------------
import { Card } from 'react-bootstrap';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

// ----------- Component ------------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';

function MusicApproved({ loadMusic, msc }) {

    // useState
    const [state, dispatch] = useContext(UserContext);
    const [likeUser, setLikeUser] = useState([])
    const [likes, setLike] = useState()

    // ---------- load like ---------
    const loadLike = async () => {
        try {
            const response = await API.get(`/like/${state.user.id}`)
            setLikeUser(response.data.like)
        } catch (error) {
            console.log(error)
        }
    }

    // --------- filter like ------------
    const filterLike = async () => {
        try {

            const find = likeUser.find((data) => data.idMusic == msc.id)
            if (find) {
                setLike(true)
            } else {
                setLike(false)
            }

        } catch (error) {
            console.log(error)
        }
    }

    // ----------- klik handleLike --------------
    const handleLike = async (id) => {
        try {

            const body = JSON.stringify({ id })
            const headers = {
                headers: { 'Content-Type': 'application/json' }
            }

            const response = await API.post('/like', body, headers)

            loadMusic()
            loadLike()

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        loadLike()
    }, [loadMusic])

    useEffect(() => {
        filterLike()
    }, [likeUser])


    return (
        <div>
            <Card.Body className="cardBody">
                <Card.Title className="titleCard">
                    <div className="boxTitle">
                        <p className="artis">{(msc.title.length > 12) ? msc.title.substring(0, 12) + '...' : msc.title}</p>
                    </div>
                    <p className="year">{msc.year}</p>
                </Card.Title>
                <Card.Text className="textThumb">
                    {msc.artis.name} <br />
                    {likes ?
                        <>
                            <FontAwesomeIcon className="iconLike text-danger" onClick={() => handleLike(msc.id)} icon={faHeart}></FontAwesomeIcon> <span> &nbsp; {msc.like}</span>
                        </> :
                        <>
                            <FontAwesomeIcon className="iconLike" onClick={() => handleLike(msc.id)} icon={faHeart}></FontAwesomeIcon> <span> &nbsp; {msc.like}</span>
                        </>
                    }
                </Card.Text>
            </Card.Body>
        </div>
    )
}

export default MusicApproved
