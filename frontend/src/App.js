import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "./components/navbar/Navbar";
import Materials from "./pages/Materials";
import Blueprints from "./pages/Blueprints";


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      isAuthenticated: false,
    };
  }

  componentDidMount = () => {
    this.getSession();
  };

  getSession = () => {
    fetch("/api/session/", {
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.isAuthenticated) {
        this.setState({isAuthenticated: true});
      } else {
        this.setState({isAuthenticated: false});
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  logout = () => {
    fetch("/api/logout", {
      credentials: "same-origin",
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({ isAuthenticated: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    let page;
    return (
      <ChakraProvider>
        <BrowserRouter>
          <Navbar isAuthenticated={this.state.isAuthenticated} />
          <Routes>
            <Route path="/" element={<Blueprints />} />
            <Route path="materials" element={<Materials />} />
          </Routes>
          {page}
        </BrowserRouter>
      </ChakraProvider>
    );
  }
}

export const cookies = new Cookies();
export default App;
// export {cookies};
