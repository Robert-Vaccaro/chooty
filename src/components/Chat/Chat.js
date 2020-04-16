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
import Tooltip from '../../../node_modules/@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
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
  $(".buttonStack").hide()
  $(".onlineContainer").hide();
  $(".disableCustomLayout").hide();
  $(".enableCustomLayout").hide();
  $(".button-down").hide();
  $(".grabButton").hide();
  $(".onlineButton").click(function(){
   $(".onlineContainer").toggle();
  });

  $(".customLayout").click(function(){
    $(".disableCustomLayout").show();
    $(".customLayout").hide();
    $(".grabButton").show();
    $(".button-down").show();
    $( ".videoContainer" ).resizable();
    $( ".videoContainer").draggable();
    $( ".container" ).resizable();
    $( ".container").draggable();
    $( "#textNotes" ).resizable();
    $( "#wrapper").draggable();
  });
  $(".toggleChat").click(function(){
    $(".container").toggle();
  });
  $(".toggleNotes").click(function(){
    $(".noteSection").toggle();
    $(".noteSection").css("position", "absolute");
    $(".noteSection").css("top", "0px");
  });
  $(".menu").click(function(){
    $(".buttonStack").toggle();
  });
  $(".disableCustomLayout").click(function(){
    $(".disableCustomLayout").hide();
    $(".enableCustomLayout").show();
    $(".grabButton").hide();
    $(".button-down").hide();
    $( ".videoContainer" ).resizable("disable");
    $( ".videoContainer").draggable("disable");
    $( ".container" ).resizable("disable");
    $( ".container").draggable("disable");
    $( "#textNotes" ).resizable("disable");
    $( "#wrapper").draggable("disable");
    $(".noteSection").removeAttr('style');
  });
  $(".enableCustomLayout").click(function(){
    $(".disableCustomLayout").show();
    $(".enableCustomLayout").hide();
    $(".grabButton").show();
    $(".button-down").show();
    $( ".videoContainer" ).resizable("enable");
    $( ".videoContainer").draggable("enable");
    $( ".container" ).resizable("enable");
    $( ".container").draggable("enable");
    $( "#textNotes").resizable("enable");
    $( "#wrapper").draggable("enable");
    $(".noteSection").removeAttr('style');
  });

  return (
    <div className="outerContainer">
      <div className="menu">Menu</div>
      <div className="buttonStack">
      <div className="layoutButtons">
      <button className="customLayout">Change Layout</button>
      <button className="disableCustomLayout">Keep Layout</button>
      <button className="enableCustomLayout">Change Layout Again</button>
      </div>
      <button className="toggleChat">Show/Hide Chat</button>
      <button className="toggleNotes">Show/Hide Notes</button>
      </div>
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
      <div className="noteSection">
        <div id="wrapper">
        <div className="grabButton">Move Notes</div>
            <form id="paper">
              <textarea placeholder="Enter something funny." id="textNotes" name="text" rows={4} style={{overflow: 'auto', wordWrap: 'break-word', resize: 'none', height: '160px'}} defaultValue={""} />  
              <Tooltip title="Delete"><div className="button-down"></div></Tooltip>
              <button id="submitNotes">Submit</button>
            </form>
            
          </div>
      </div>
    </div>
  );
}

export default Chat;
