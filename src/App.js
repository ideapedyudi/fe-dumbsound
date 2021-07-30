import './App.css';
import { useContext, useEffect } from 'react';

// ---- rounter -----
import { Switch, Route, useHistory } from "react-router-dom";

import Berandano from '../src/components/pages/Berandano';
import BerandaLog from './components/pages/BerandaLog';
import Pay from './components/pages/Pay';
import ListTrans from './components/pages/ListTrans';
import AddMusic from './components/pages/AddMusic';
import AddArtis from './components/pages/AddArtis';

// --------- component ----------
import { UserContext } from "./components/contexts/UserContext"
import { API, setAuthToken } from './components/config/api';

// init token pada axios setiap kali aplikasi direfresh
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  const router = useHistory();
  const [state, dispatch] = useContext(UserContext);


  const levels = (state.user.level)
  // ketika reload jika masih login
  useEffect(() => {
    console.log(levels)
    if (state.isLogin === false) {
      router.push('/auth')
    } else if (state.isLogin === true && levels === "1") {
      router.push('/ListTrans')
    } else {
      router.push('/')
    }
  }, [state])

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth')

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR"
        })
      }

      let payload = response.data.data.user
      payload.token = localStorage.token

      dispatch({
        type: "USER_SUCCESS",
        payload
      })


    } catch (error) {
      console.log(error)
    }
  }

  // loading data

  useEffect(() => {
    checkUser()
  }, [])
  return (
    <Switch>
      {/* landing page */}
      <Route exact path="/" component={BerandaLog} />
      <Route exact path="/Auth" component={Berandano} />
      <Route exact path="/Pay" component={Pay} />
      {levels == "1" &&
        <>
          <Route exact path="/ListTrans" component={ListTrans} />
          <Route exact path="/AddMusic" component={AddMusic} />
          <Route exact path="/AddArtis" component={AddArtis} />
        </>
      }
      {/* <Route path="/ExplorePage" component={ExplorePage} /> */}
    </Switch>

  );
}

export default App;
