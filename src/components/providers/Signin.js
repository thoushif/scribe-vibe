import { signInWithGoogle } from "../firebase";
import styled from "styled-components";

const Signin = () => {
  return (
    <Container>
      <SignIn>
        <p>Sign in to scribe-vibe</p>
        <input
          type="submit"
          onClick={signInWithGoogle}
          value="Sign In with Google"
        />
      </SignIn>
    </Container>
  );
};

export default Signin;

const Container = styled.div`
  background: transparent;
  border-radius: 3px;
  border: 2px solid lightgreen;
  margin: 50px;
  display: flex;
  justify-content: center;
`;

const SignIn = styled.div`
  color: green;
  margin: 50px;
  padding: 0.25em 1em;
  align-self: center;
  text-align: center;
  input {
    background: transparent;
    border-radius: 3px;
    border: 2px solid palevioletred;
    color: palevioletred;
  }
`;
