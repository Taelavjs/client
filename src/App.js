import { useEffect, useState } from 'react';
import UsernameComponent from './components/usernameComponent';
import MatchMaking from './components/matchMaking';
import socket from './socket';


function App() {
  const [sessionID, setSessionId] = useState(sessionStorage.getItem("sessionId"));
  const [userID, setUserID] = useState(sessionStorage.getItem("userID"));
  const [room, setRoom] = useState('');

  
  useEffect(() => {
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      console.log(socket);
    }


  }, []);

  socket.on('connect', function () {
    console.log(socket);
  });
  socket.on('session', ({sessionID, userID, username})=> {
    sessionStorage.setItem("sessionId", sessionID);
    sessionStorage.setItem("userID", userID);
    setSessionId(parseInt(sessionID)); // Parse to integer
    setUserID(parseInt(userID)); // Parse to integer
  });



  
  return (
    <>
      {userID == null && sessionID == null && <UsernameComponent sessionId={sessionID} setSessionId={setSessionId} userID={userID} setUserID={setUserID} />}
      {<MatchMaking />}

    </>
  );
}

export default App;
