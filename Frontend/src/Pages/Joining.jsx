import React, {useState, useEffect} from "react";
import { Grid } from "@mui/material";
import StatusBar from "../Components/StatusBar";
import MemberBar from "../Components/MemberBar";
import ChatBar from "../Components/ChatBar";
import "./Joining.css";
import WaitDraw from "../Components/WaitDraw";
import WaitArea from "../Components/WaitArea";
import { Link } from "react-router-dom";
import {useParams, useLocation} from "react-router-dom";
import callAPI from "../utils/callAPI";
import useSocket from "../utils/useSocket";
import CustomButton from "../Components/CustomButton";
import DrawingTurn from "../Components/DrawingTurn";
import "../Components/WaitDraw.css";

function Joining() {
  const [showDraw, setshowDraw] = useState(true);
  const [start, setStart] = useState(false);

  const params = useParams();

  const location = useLocation();

  const user_id = location.state

  const [messages, setMessages] = useState([]);
  const [drawing, setDrawing] = useState([]);
  const [userSelfMessage, setUserSelfMessage] = useState("");
  const [turn, setTurn] = useState("");

  const ChatMessageTypes = {
    USER_JOINED: 1,
    USER_LEFT: 2,
    GUESS_MESSAGE: 3,
    CANVAS_DRAWING: 4,
    USER_SELF_MESSAGE: 5,
    START_DRAWING_MESSAGE: 6
  };

  const message = async () => {
      let response_obj = await callAPI({
          endpoint: `/game_turn/${params.roomID}/${user_id}`,
      });
      setTurn(response_obj.data)
      console.log("Turn: ", response_obj.data)
    };

  useEffect(() => {
      message();
  }, []);

  const [ws] = useSocket({
    endpoint: `ws://localhost:8000/ws/${user_id}/${params.roomID}`,
    onMessage: (e) => {
      const data = JSON.parse(e.data);
      console.log("Data ", data)

      if (data.msg_type == ChatMessageTypes.GUESS_MESSAGE || data.msg_type == ChatMessageTypes.USER_JOINED || data.msg_type == ChatMessageTypes.USER_LEFT) {
        for (var i = 0; i < messages.length+1; i++){
          if(messages.length == 0) {
            setMessages([...messages, data]);
          } else {
            console.log(messages)
            console.log(i)
            console.log(messages[i])
            if(messages[i].username == data.username && messages[i].data == data.data) {
            } else {
              setMessages([...messages, data]);
            }
          }
        }
        // setMessages([...messages, data]);
      } else if (data.msg_type == ChatMessageTypes.CANVAS_DRAWING) {
        setDrawing([...drawing, data]);
      } else if (data.msg_type == ChatMessageTypes.USER_SELF_MESSAGE) {
        setUserSelfMessage(data)
      } else if(data.msg_type == ChatMessageTypes.START_DRAWING_MESSAGE) {
        setStart(true);
      }
    }

  })

  const sendMessage = (ws, data) => {
    ws.send(JSON.stringify(data));
  };

  async function startFun() {
    ws.send(JSON.stringify({msg_type:6, data:true}))
    setStart(true)
  }

  return (
    <Grid item className="joining_root">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction={"column"}
        className="joining_main"
      >
        <Grid item className="inside_name">
          <img height={50} src={require("../assets/logo.png")} />
        </Grid>
        <Grid item className="joining_statusbar">
          <StatusBar message="Waiting" />
        </Grid>
        <Grid item className="main_area">
          <Grid
            container
            direction="row"
            // justifyContent="center"
            // alignItems="center"
          >
            <Grid item>
              <MemberBar userSelfMessage={userSelfMessage} roomID={params.roomID}/>
            </Grid>
            { start ? 
              <DrawingTurn user_id={user_id} turn={turn} roomID={params.roomID}/>
            :
            <Grid item className="kheni_draw">
              <Grid item className="waitdraw_root">
                <Grid container direction="column">
                  <Grid item className="waiting_draw"></Grid>
                  <Grid item className="waiting_start">
                    {turn.user_id == user_id && turn.turn == true ?
                    <CustomButton name="Start" addStyles={"waiting_start"} onClicked={startFun}/> :
                    <CustomButton name="Start" addStyles={"waiting_start_dont_join"}/>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            }
            <Grid item>
              <ChatBar messages={messages} user_id={user_id} sendMessage={sendMessage} ws={ws}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Joining;
