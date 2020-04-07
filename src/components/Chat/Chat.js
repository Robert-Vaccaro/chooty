import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { Player } from 'video-react';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import $ from 'jquery'
import 'jquery-ui'
import './Chat.css';
import '../../../node_modules/video-react/dist/video-react.css'
import "../../../node_modules/jquery-ui/ui/widgets/resizable.js"
import "../../../node_modules/jquery-ui/themes/base/resizable.css"
import "../../../node_modules/jquery-ui/ui/widgets/draggable"
import "../../../node_modules/jquery-ui/themes/base/draggable.css"
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }
  $(".onlineContainer").hide();
  $(".onlineButton").click(function(){
   $(".onlineContainer").toggle();
  });
 $(document).ready(function() {
  $( ".videoContainer" ).resizable();
  $( ".videoContainer").draggable();
  $( ".container" ).resizable();
  $( ".container").draggable();

 });
  return (
    <div className="outerContainer">
      <div className="videoContainer">
      <Player
      playsInline
      poster="/assets/poster.png"
      src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
      />
      </div>

      <div className="container">
          <InfoBar room={room} />
          <button className="onlineButton">See Who's Online</button>
          <div className="onlineContainer">
            <TextContainer users={users}/>
          </div>
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      
    </div>
  );
}

export default Chat;
