import { React, useState, useContext } from "react";
import { Avatar, Grid } from "@mui/material";
import "./LandingPageContainer.css";
import CustomButton from "./CustomButton";
import Image from "./Image.jsx";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import callAPI from "../utils/callAPI";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";

function LandingPageContainer() {
  const [username, setusername] = useState("");
  const [avatarimg, setavatarimg] = useState(1);
  const [joinRoom, setJoinRoom] = useState(false);
  const [joinRoomID, setJoinRoomID] = useState("");
  const [validRoomID, setValidRoomID] = useState(true);
  // const [userID, setUserID] = useState("");
  const { setUserId } = useContext(WebSocketContext);

  async function handleChange(e) {
    // console.log(e.target.value);
    setusername(e.target.value);
  }

  async function handleJoinRoom(e) {
    setJoinRoomID(e.target.value);
  }

  async function handleRoomChange(e) {
    console.log(e.target.value);
  }

  const handlePrevious = () => {
    if (avatarimg == 1) {
      setavatarimg(10);
    } else {
      setavatarimg(avatarimg - 1);
    }
  };

  const handleNext = () => {
    if (avatarimg == 10) {
      setavatarimg(1);
    } else {
      setavatarimg(avatarimg + 1);
    }
  };

  let navigate = useNavigate();

  async function createRoom() {
    // create url for the room
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let room_id = "";
    let url;
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      room_id += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    url = "Joining/" + room_id;

    // User creation
    if (username != "") {
      let userDataForm = new FormData();
      userDataForm.append("username", username);
      userDataForm.append("avatar", avatarimg);

      let response_obj = await callAPI({
        endpoint: "/user/create",
        method: "POST",
        data: userDataForm,
      });

      if (response_obj.data.msg == "success") {
        // console.log("success");

        // console.log(response_obj.data)

        // console.log(response_obj.data.user_info.id)

        // setUserID(response_obj.data.user_info.id);

        // Room creation
        let roomDataForm = new FormData();
        roomDataForm.append("room_id", room_id);
        roomDataForm.append("creator", username);
        roomDataForm.append("state", "new");

        let response_obj2 = await callAPI({
          endpoint: "/room/create",
          method: "POST",
          data: roomDataForm,
        });

        if (response_obj2.data.msg === "success") {
          setUserId(response_obj.data.user_info.id);
          navigate(url);
        }
      }
    } else {
      console.log("Enter username...");
    }
  }

  async function joinRoomFun() {
    if (username != "") {
      let userDataForm = new FormData();
      userDataForm.append("username", username);
      userDataForm.append("avatar", avatarimg);

      let response_obj4 = await callAPI({
        endpoint: "/user/create",
        method: "POST",
        data: userDataForm,
      });

      if (response_obj4.data.msg == "success") {
        setUserId(response_obj4.data.user_info.id);
        setJoinRoom(true);
      }
    }
  }

  async function onJoinRoom() {
    let url;
    url = "Joining/" + joinRoomID;

    let response_obj3 = await callAPI({
      endpoint: `/room/check_room_id/${joinRoomID}`,
    });

    if (response_obj3.data == true) {
      setValidRoomID(true);
      navigate(url);
    } else {
      setValidRoomID(false);
    }
  }

  return (
    <Grid
      container
      className="LandingContainer"
      justifyContent={"center"}
      alignItems="center"
      direction={"column"}
    >
      <Grid item>
        <form>
          <input
            className="input_field"
            type="text"
            // value={this.state.value}
            placeholder="Enter your Name"
            onChange={handleChange}
          />
        </form>
      </Grid>
      {/* <Grid item className="avatar_title">
        Choose an avatar.
      </Grid> */}
      <Grid item>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent={"space-between"}
        >
          <Grid item className="icon_button">
            <GrPrevious onClick={handlePrevious} size={21} />
          </Grid>
          <Grid item className="avatar_class">
            <Avatar
              src={require(`./../assets/${avatarimg}.svg`)}
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item className="icon_button">
            <GrNext onClick={handleNext} size={21} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <CustomButton
          addStyles="createroombtn"
          name="Create a Room"
          onClicked={createRoom}
        />
      </Grid>
      <Grid item>
        <CustomButton
          addStyles="joinroombtn"
          name="Join a Room"
          onClicked={joinRoomFun}
        />
      </Grid>

      {joinRoom ? (
        <Grid item>
          <form>
            <input
              className="input_field"
              type="text"
              // value={this.state.value}
              placeholder="Enter room code"
              onChange={handleJoinRoom}
            />
          </form>
          <button onClick={onJoinRoom}>Join</button>
        </Grid>
      ) : null}

      {validRoomID ? null : <Grid item>Invalid Room ID</Grid>}
    </Grid>
  );
}

export default LandingPageContainer;
