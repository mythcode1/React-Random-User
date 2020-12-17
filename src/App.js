import React, { useCallback, useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
// import 'bootstrap/'

const apiEndpoint = "https://randomuser.me/api/";
let globalUserObjects = [];

export default function App() {
  // let [greetings, setName] = useState("Loading...");
  // let [username, setUsername] = useState("");
  // let [thumbnail, setThumbnail] = useState("");
  let [input, setInput] = useState("");
  let [isSending, setIsSending] = useState(false);
  let [isLoading, setIsLoading] = useState(true);
  let isMounted = useRef(false);
  let [userObjects, setUserObjects] = useState([]);

  let fetchData = () =>
    axios.get(apiEndpoint).then((response) => {
      let data = response.data.results[0];
      let { title, first, last } = data.name;
      let { email } = data;
      let { username: uname } = data.login;
      let { large: tbn } = data.picture;
      let out = [first, last].join(" ");

      return {
        greetings: out,
        thumbnail: tbn,
        title: title,
        first: first,
        last: last,
        email: email,
        username: uname
      };
    });
  let renderData = (resp) => {
    globalUserObjects.unshift(resp);
    setUserObjects(globalUserObjects);
  };

  useEffect(() => {
    isMounted.current = true;
    fetchData()
      .then(renderData)
      .then(() => setIsLoading(false));
  }, []);

  const sendRequest = useCallback(() => {
    setIsSending(true);
    fetchData()
      .then(renderData)
      .then(() => setIsSending(false))
      .catch((e) => {
        console.log(e);
        setIsSending(false);
      });
  }, []);

  const handleOnChange = (e) => {
    setInput(e.target.value);
    setUserObjects(
      globalUserObjects.filter((user) =>
        user.greetings.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div className="App">
      <div className="row">
        <input
          onChange={handleOnChange}
          value={input}
          className="col-6 searchBar"
          placeholder="Search added users"
        ></input>
        <button
          onClick={sendRequest}
          disabled={isSending}
          className="btn btn-primary addUserButton col-3"
        >
          Add New User
        </button>
      </div>
      <div className="row">
        <div className="col-auto">
          <p>Displaying {userObjects.length} results.</p>
        </div>
      </div>
      <div className="row">
        {isLoading
          ? "Loading"
          : userObjects.map((user, idx) => (
              <div className="col-md-4 col-sm-6 col-xl-3" key={idx}>
                <div className="card usercard">
                  <img
                    src={user.thumbnail}
                    className="card-img-top"
                    alt="user thumbnail"
                  ></img>
                  <div className="card-body">
                    <h4 className="card-title">{user.greetings}</h4>
                    <h5 className="card-text username">@{user.username}</h5>
                    <a href={`mailto:${user.email}`}>
                      Email
                      {/* <i className="fas fa-envelope" /> */}
                    </a>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
