import { signInWithGoogle } from "../firebase";
import styled from "styled-components";

const Signin = () => {
  return (
    <Container>
      <SignIn>
        <p>Sign in to the application</p>
        <input
          type="submit"
          onClick={signInWithGoogle}
          value="Sign In with google"
        />
      </SignIn>
    </Container>
  );
};

export default Signin;

const Container = styled.div`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  margin: 50px;
  display: flex;
  justify-content: center;
`;

const SignIn = styled.div`
  color: palevioletred;
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
