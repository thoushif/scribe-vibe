import "../../styles.css";
import { useContext, useEffect, useState } from "react";
import langData from "../../data/languagedata.json";
import Languages from "../Languages";
import { ShowAlphabets } from "./ShowAlphabets";
import styled from "styled-components";
import MousePaintPreview from "../MousePaintPreview";
import { db } from "../firebase";
import firebase from "firebase/app";
import { UserContext } from "../providers/UserProvider";
export default function ReadAlphabets({
  match: {
    params: { lang }
  }
}) {
  const [alphabets, setAlphabets] = useState();
  const [showOnlyDrawn, setShowOnlyDrawn] = useState(false);
  const [alphabetsFiltered, setAlphabetsFiltered] = useState("");
  const userObj = useContext(UserContext);

  const canvasDBObj = db.collection("letters-written");
  // .where("userId", "==", userObj.uid);
  useEffect(() => {
    if (showOnlyDrawn) {
      console.log("showOnlyDrawn, true");
      canvasDBObj.get().then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log("letterssssss", alphabetsFiltered);

          if (doc.data().userId === userObj.uid) {
            setAlphabetsFiltered((alphabetsFiltered) => {
              return alphabetsFiltered + "," + doc.data().letter;
            });
          }
        });
      });
      console.log("serttingb letterssssss", alphabetsFiltered);
      setAlphabets(alphabetsFiltered.substring(1));
    } else {
      console.log("showOnlyDrawn, false");
      let langDataFiltered = langData.find(
        (langEach) => langEach.language.toLowerCase() === lang.toLowerCase()
      );
      langDataFiltered
        ? setAlphabets(langDataFiltered.alphabets)
        : setAlphabets();
    }
    return cleanUp;
  }, [lang, showOnlyDrawn]);
  const cleanUp = () => {
    setAlphabets();
    setAlphabetsFiltered("");
  };
  return (
    <div>
      <p>Language : {lang.toUpperCase()}</p>
      {/* <p>Alphabets Filtered : {alphabetsFiltered.substring(1)}</p> */}
      Alphabets : {showOnlyDrawn ? "Showing only drawn by you" : "Showing all"}
      <ShowAlphabets
        alphabets={showOnlyDrawn ? alphabetsFiltered.substring(1) : alphabets}
        lang={lang}
      />
      <FilterContainer>
        <button
          onClick={() => {
            setShowOnlyDrawn(!showOnlyDrawn);
          }}
        >
          {showOnlyDrawn ? "Show all 👁️ " : "Show only drawn by me 👁️"}
        </button>
      </FilterContainer>
      {/* todo: this will be the social feed  NOT for all alphabets*/}
      <MousePaintPreviewContainer>
        {(showOnlyDrawn ? alphabetsFiltered.substring(1) : alphabets) &&
          (showOnlyDrawn ? alphabetsFiltered.substring(1) : alphabets)
            .split(",")
            .map((a) => (
              <MousePaintPreviewItem key={lang + a}>
                {a}
                <MousePaintPreview lang={lang} letter={a} />
              </MousePaintPreviewItem>
            ))}
      </MousePaintPreviewContainer>
    </div>
  );
}

const MousePaintPreviewContainer = styled.div`
  /* display: flex; */
  align-content: center;
`;

const FilterContainer = styled.div`
  /* display: flex; */
  float: right;
  margin-bottom: 10px;
  button {
    color: blue;
    border-radius: 6px;
    border: 2px solid #aea7a1;
  }
`;
const MousePaintPreviewItem = styled.div`
  background-color: white;
  border-radius: 5px;
  border-color: black;
  border: 2px solid #aea7a1;
  flex-direction: column;
  margin: 20px auto;
  color: black;
  font-size: 120%;
  padding: 20px;
  :hover {
    background-color: #aea7a1;
  }
`;
