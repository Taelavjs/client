import './../App.css';
import { useEffect, useState } from 'react';
import socket from '../socket';
import Card from './card';

const UsernameComponent = () => {
    const [inputValue, setInputValue] = useState("");
    const [errText, setErrorText] = useState("");
    const [match, setMatch] = useState();
    const [gameStart, setGameStart] = useState(false);
    const [deck, setDeck] = useState();
    const onChangeHandler = event => {
        setInputValue(event.target.value);
      };
    
      const createLobby = (e) => {
        e.preventDefault();
        socket.emit("create-room", inputValue, cb => {
          if(!cb){
            setErrorText("Invalid Lobby Id");
            return;
          }
          socket.once("player-joined", ({hostUsn, opponentUsn}) => {
            setMatch({
                hostName : hostUsn,
                oppName : opponentUsn,
            });
            console.log(hostUsn, opponentUsn);
          })
    
          console.log(cb);
        });
    
      }
    
      const joinLobby = (e) => {
        socket.emit("join-room", inputValue, (values) => {
          if(values != false){
            let {hostUsn, opponentUsn} = values;
            setMatch({
                hostName : hostUsn,
                oppName : opponentUsn,
            });
          }
        })
      }

        const readyUp = () => {
            socket.emit('ready');

        }

        socket.on("game-start", deck => {
            setGameStart(true);
            setDeck(deck);
            console.log(deck);
            console.log("start her up");
            console.log(socket);
        })

        socket.on("wrong-card-id", deck => {
            setDeck(deck);
            console.log("wrong id");
        })

        socket.on("deck-update", deck => {
            setDeck(deck);
        })

        socket.on("winner-decided", (winner, newDeck) => {
            console.log(winner);
            setDeck(newDeck);
        })



        console.log(deck);
    return (
     <>{!match && <div className='flex flex-col justify-center h-screen  w-6/12 mr-auto'>
        <div className='flex flex-row justify-evenly items-center'>
          <input type="text" className='border' onChange={onChangeHandler}></input>
          <button onClick={createLobby}>Create Lobby</button>
        </div>
        <div className='flex flex-row justify-evenly items-center'>
          <input type="text" className='border' onChange={onChangeHandler}></input>
          <button onClick={joinLobby}>Join Lobby {socket.connected}</button>
          {errText}
        </div>
      </div>}


        {match && !gameStart &&
      
        <div className='flex flex-col justify-center items-center h-screen w-h/12 mr-auto'>
            <div className=''>
                {match.oppName}
            </div>
            <div>
                {match.hostName}
            </div>
            <button onClick={readyUp}>Ready?</button>
            
        </div>}

        {match && gameStart && 
        <div className='flex flex-row justify-center items-center'>
            <div className='border flex flex-col justify-center items-center'>
            {deck?.map((cardo, index) => (
                <Card cardValue={cardo.value} cardName ={cardo.suit} cardID = {cardo.id}/>
            ))}
            </div>

            
        </div>}
    </>
    );
}

export default UsernameComponent;
