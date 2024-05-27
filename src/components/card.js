import './../App.css';
import { useEffect, useState } from 'react';
import socket from '../socket';

const Card = ({cardValue, cardName, cardID }) => {

    const selectCard = () => {
        socket.emit("chosen-card", cardID);
        console.log(cardID);
    }

        
    return (
        <>
        <div onClick={selectCard} className="card-container">
            <div>{cardName}</div>
            <div>{cardValue}</div>
        </div>
        </>
    );
}

export default Card;
