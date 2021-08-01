import React from 'react';
import { Navbar } from 'react-bootstrap';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// path
const path = "https://raw.githubusercontent.com/ideapedyudi/BE-dumbsound/stable/uploads/";


function useWindowDimensions() {
    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);

    const updateWidthAndHeight = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    React.useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });

    return {
        width,
        height
    };
}

function PlayerMusic({ musicId }) {

    const { width, height } = useWindowDimensions();
    return (
        <div>
            <Navbar className="fixed-bottom navPlay">
                <div className="boxImgPlay">
                    <img src={path + musicId.thumbnail} alt="" className="imagmusci" />
                </div>
                <p className="text-white judulMusic">{musicId.title} - {musicId.artis.name}</p>
                <AudioPlayer
                    autoPlay
                    src={path + musicId.attache}
                    layout={width < 960 ? "" : "horizontal"}
                />
            </Navbar>
        </div>
    )
}

export default PlayerMusic;
