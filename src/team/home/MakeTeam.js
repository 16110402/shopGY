import { React, useState } from 'react'
import './maketeam.css'

const MakeTeam = () => {

  const [pin, setPin] = useState()
  const [playPlace, setPlayPlace] = useState([]);
  const [service, setService] = useState(false);
  const checkArea = async () => {
    let pins = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
    let pinJson = await pins.json()
    //  console.log(pinJson,"pinJson");
    let location
    Object.entries(pinJson).forEach(([key, value]) => {
      location = value;
      // console.log(location,"location");
    })
    let loc;
    Object.entries(location).forEach(([key, value]) => {
      if (key === "PostOffice") {
        loc = value;
        // console.log(value);
      }
    })
    let place = [];
    for (let i = 0; i < loc.length; i++) {
      // place = loc[i].Name;
      place.push(loc[i].Name)
      // console.log(loc[i].Name)
    }
    setPlayPlace(place);
    setService(true);
  }


  const onChangePin = (e) => {
    setPin(e.target.value)
  }

  const [playPlayers1, setPlayPlayers1] = useState([]);
  const [playPlayers2, setPlayPlayers2] = useState([]);
  const [playPlayers3, setPlayPlayers3] = useState([]);
  const [mapfriend, setMapfriend] = useState(new Map());
  const searchPlayer = async (event) => {
    let p = localStorage.getItem('user_id');
    let grname = event.target.value;
    console.log(grname);
    const response = await fetch(
      `http://localhost:5000/api/searchplayer/getplayer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groundname: grname, groundpin: pin, user_id: p })
      }
    );
    const json = await response.json();
    const json1 = json.user;
    const json2 = json.pending_friends_send;
    const json3 = json.pending_friends_reci;
    const json4 = json.confirm_friends_send;
    console.log(json1, json2, json3, json4, "json1")
    const pending_friends = new Map();
    let newjson = json1.filter((item) => item.signupEmail !== p);

    // list of confirm friend
    let con_fri = [];
    newjson.map(players => {
      json4.map(player_obj => {
        if (player_obj.friend_id == players.signupEmail) {
          con_fri.push(players);
        }
      })
    })
    setPlayPlayers1(con_fri);

    // list of not friend and also find pending recieve and sender friend store in pen_fri.
    let not_fri = newjson;
    let pen_fri = [];
    json2.map(player_obj => {
      pen_fri.push(player_obj);
      pending_friends.set(player_obj.friend_id, false)
      not_fri = not_fri.filter((item) => item.signupEmail !== player_obj.friend_id);
    })
    json3.map(player_obj => {
      pen_fri.push(player_obj);
      pending_friends.set(player_obj.friend_id, true)
      not_fri = not_fri.filter((item) => item.signupEmail !== player_obj.friend_id);
    })
    json4.map(player_obj => {
      not_fri = not_fri.filter((item) => item.signupEmail !== player_obj.friend_id);
    })
    setPlayPlayers2(pen_fri)
    setPlayPlayers3(not_fri)
    // pending_friends.set(players.signupEmail, false)
    setMapfriend(pending_friends);
  }

  const PendingFriend = async (event) => {
    let p1 = event.target.value;
    let p2 = localStorage.getItem('user_id');
    // console.log(p1, p2, "p");
    const response = await fetch(
      `http://localhost:5000/api/friends/pendingfriend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender_id: p2, reciver_id: p1 })
      }
    );
    const json = await response.json();
    // console.log(json);
  }

  const addFriend = async (event) => {
    let p1 = event.target.value;
    let p2 = localStorage.getItem('user_id');
    console.log(p1, p2,"p2");
    const response = await fetch(
        `http://localhost:5000/api/friends/confirmfriend`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reciever_id: p2, sender_id: p1 })
        }
    );
    const json = await response.json();
    console.log(json);
}

  return (
    <div>
      <div className="my-1">
        <div className="row">
          <div className="col-sm text-center" style={{
            backgroundImage: `url(../img/world_map_hd.jpg)`
          }}>
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-center mb-4 text-blue-300 my-5" style={{ "color": "#3F51B5" }}><u>Find Players</u></h1>
              <h3 className="font-normal mt-2 text-center text-blue-300 font-weight-bold my-5" style={{ "color": "#3F51B5" }}><u>Find players by filling this form. </u></h3>

              <input onChange={onChangePin} type="text" name="" placeholder="Enter Your Pincode" id="" className="border-b-2 p-4" /><br />
              <button type="submit" onClick={checkArea} className="w-30 my-3 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700">
                Search
              </button>
            </div>
            <div className="row">
              {playPlace.map(place => <button type="button" key={place} onClick={searchPlayer} value={place} className="btn btn-primary my-2"><h5>{place}</h5></button>)}
            </div>

          </div>
          <div className="col-sm" id="plDetail">
            <div
              className="100 items-center justify-center leading-7 space-y-8 p-8 h-full">
              {playPlayers1.map(players => <div>
                <div className="row">
                  <div className="col-md-2">
                    <img style={{ width: "60px", height: "60px" }} className="rounded-circle my-2" alt="avatar1" src="https://mdbcdn.b-cdn.net/img/new/avatars/9.webp" />
                  </div>
                  <div className="col-md-2 my-3">
                    <p style={{ fontSize: "15x", fontWeight: "bold" }}>{players.name}</p>
                  </div>
                </div>
                <p>Make Change in thought, life automatically will Change . . .</p>
                <img src="https://images.unsplash.com/photo-1466112928291-0903b80a9466?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=873&q=80/200x100/d4d4d4/000000" alt="" className="" />
                <div className="row">
                  <div className="col my-3">
                    <form>
                      <div className="row">
                        <div className="col-md-4">
                          <input style={{ width: "150px" }} type="text" className="form-control" placeholder="Message" />
                        </div>
                        <div className="col-md-4">
                          <input style={{ width: "150px" }} type="text" className="form-control" placeholder="DD-MM-YYYY" />
                        </div>
                        <div className="col-md-4">
                          <button type="button" className="btn btn-primary" style={{ width: "150px" }}>Send</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>)}
              {playPlayers2.map(players => <div>
                <div className="row">
                  <div className="col-md-2">
                    <img style={{ width: "60px", height: "60px" }} className="rounded-circle my-2" alt="avatar1" src="https://mdbcdn.b-cdn.net/img/new/avatars/9.webp" />
                  </div>
                  <div className="col-md-2 my-3">
                    <p style={{ fontSize: "15x", fontWeight: "bold" }}>{players.name}</p>
                  </div>
                </div>
                <p>Make Change in thought, life automatically will Change . . .</p>
                <img src="https://images.unsplash.com/photo-1466112928291-0903b80a9466?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=873&q=80/200x100/d4d4d4/000000" alt="" className="" />
                <div className="row">
                  {mapfriend.get(players.friend_id) === false ?
                    (<div className="col-md-3 my-2">
                      <button type="button" onClick={PendingFriend} value={players.signupEmail} className="btn btn-success my-2" style={{ width: "150px" }}>Pending</button>
                    </div>) :
                    (<div className="col-md-3 my-2">
                    <button type="button" onClick={addFriend} value={players.friend_id} className="btn btn-primary my-2" style={{ width: "150px" }}>Confirm</button>
                  </div>)}
                </div>
              </div>)}
                {playPlayers3.map(players => <div>
                <div className="row">
                  <div className="col-md-2">
                    <img style={{ width: "60px", height: "60px" }} className="rounded-circle my-2" alt="avatar1" src="https://mdbcdn.b-cdn.net/img/new/avatars/9.webp" />
                  </div>
                  <div className="col-md-2 my-3">
                    <p style={{ fontSize: "15x", fontWeight: "bold" }}>{players.name}</p>
                  </div>
                </div>
                <p>Make Change in thought, life automatically will Change . . .</p>
                <img src="https://images.unsplash.com/photo-1466112928291-0903b80a9466?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=873&q=80/200x100/d4d4d4/000000" alt="" className="" />
                <div className="row">
                  <div className="col-md-3 my-2">
                      <button type="button" onClick={PendingFriend} value={players.signupEmail} className="btn btn-primary my-2" style={{ width: "150px" }}>Add Friend +</button>
                    </div>
                </div>
              </div>)}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MakeTeam
