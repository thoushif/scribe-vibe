import { Fragment, useContext } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import ReadAlphabets from "./Alphabets/ReadAlphabets";
import { logOut } from "./firebase";
import Languages from "./Languages";
import { UserContext } from "./providers/UserProvider";

import ShowNames from "./ShowNames/ShowNames";
import LetterPreview from "./ShowNames/LetterPreview";

export default function Home() {
  const user = useContext(UserContext);
  return (
    <Router>
      <Container>
        <Link className="name-title" to="/">
          Hello, {user.displayName}
        </Link>
        <MenuItemContainer>
          {/* <Link to="/see-your-name">See Your Name</Link> */}
          <LanguageItem key="all-languages">
            <Link className="language" to={`/draw`}>
              ALL LANGUAGES
            </Link>
          </LanguageItem>
          <Button className="logout" onClick={logOut}>
            Logout
          </Button>
        </MenuItemContainer>
        <Switch>
          <Route path="/" exact component={Header} />
          <Route path="/see-your-name/:lang" component={ShowNames} />
          <Route path="/draw/:lang/:letter" component={LetterPreview} />
          <Route path="/draw/:lang" component={ReadAlphabets} />
          <Route path="/draw" component={Draw} />
          <Route render={() => <h1>404: page not found</h1>} />
        </Switch>
      </Container>
    </Router>
  );
}
// Home Page
const Header = () => (
  <Fragment>
    <FakeText />
  </Fragment>
);
// Draw Page
const Draw = () => (
  <Fragment>
    <Languages />
  </Fragment>
);

const FakeText = () => (
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
);

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;
`;
const Container = styled.div`
  margin: 0 100px 10px 100px;
  /* display: inline-flex; */
`;

const MenuItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LanguageItem = styled.div`
  height: 30px;
  color: white;
  text-align: center;
  vertical-align: center;
  font-size: 150%;
  padding-right: 10px;
`;
