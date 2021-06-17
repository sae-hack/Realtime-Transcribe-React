import logo from "./logo.svg";
import "./App.css";
import { API, Auth } from "aws-amplify";
import React, { useEffect } from "react";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

const App = () => {
  useEffect(() => {
    Auth.currentSession().then((session) => {
      const jwtToken = session.getIdToken().getJwtToken();
      console.log("jwtToken", jwtToken);

      API.get("SAMAPI", "/start-session", {
        headers: { Authorization: "Bearer " + jwtToken },
      })
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    });
  }, []);

  return (
    <AmplifyAuthenticator>
      <div>
        My App
        <AmplifySignOut />
      </div>
    </AmplifyAuthenticator>
  );
};

export default App;
