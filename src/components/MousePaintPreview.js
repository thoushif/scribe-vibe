import { Fragment, useContext, useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import MousePaint from "./MousePaint";
import { UserContext } from "./providers/UserProvider";
import { db } from "./firebase";
import VoteButtons from "./VoteActions/VoteButtons";
import styled from "styled-components";

export default function MousePaintPreview({ lang, letter }) {
  const userObj = useContext(UserContext);
  const paintCanvasInitialState = {
    letter: letter,
    lang: lang,
    showCanvas: "false",
    loadTime: new Date(),
    color: "#ffc600",
    width: 100,
    height: 100,
    brushRadius: 2,
    lazyRadius: 6,
    loadTimeOffset: 5,
    saveData: null,
    votes: 0
  };
  const [paintCanvas, setPaintCanvas] = useState(paintCanvasInitialState);
  const [otherPaints, setOtherPaints] = useState([]);
  const [showOtherPaints, setShowOtherPaints] = useState(false);
  const [showCanvas, setShowCanvas] = useState("false");

  useEffect(() => {
    getCanvasData(letter);
    getCanvasAllOthersData(letter);
    return setOtherPaints([]);
  }, [letter, lang, showCanvas, userObj]);

  const getCanvasData = (letter) => {
    let canvasDBObj;
    db.collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .doc(userObj.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          canvasDBObj = snapshot.data();
          setPaintCanvas({
            ...paintCanvas,
            saveData: canvasDBObj.canvasData,
            votes: canvasDBObj.voteCount
          });
        }
      });
    // db.collection("canvasObjects")
    //   .doc(letter + userObj.uid)
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       canvasDBObj = doc.data();
    //       setPaintCanvas({ ...paintCanvas, saveData: canvasDBObj.canvasData });
    //     }
    //   });
  };

  const getCanvasAllOthersData = (letter) => {
    console.log("working with letter ", letter);
    // const userObj = db.collection("users").doc(userId).collection("canvasObjects").doc(letter);
    let canvasDBObj;
    db.collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          canvasDBObj = doc.data();
          if (canvasDBObj.userId !== userObj.uid) {
            console.log(
              canvasDBObj.userId,
              "also wirteent ",
              canvasDBObj.letter
            );

            setOtherPaints((otherPaints) => [...otherPaints, canvasDBObj]);
          }
        });
      });
    // .doc(userObj.uid)
    // .collection("canvasObjects")
    // .doc(letter)
    // .onSnapshot((snapshot) => {
    //   if (snapshot.exists) {
    //     canvasDBObj = snapshot.data();
    //     console.log(canvasDBObj.canvasData);
    //   }
    // });
  };
  return (
    <div>
      {showCanvas === "true" && (
        <MousePaint
          paintCanvas={paintCanvas}
          setOtherPaints={setOtherPaints}
          setShowCanvas={setShowCanvas}
        />
      )}
      {paintCanvas.saveData && showCanvas === "false" ? (
        <Fragment>
          Your Drawing!
          <CanvasDraw
            disabled
            canvasWidth={paintCanvas.width + 50}
            canvasHeight={paintCanvas.height + 50}
            brushRadius={paintCanvas.brushRadius}
            lazyRadius={paintCanvas.lazyRadius}
            saveData={paintCanvas.saveData}
            gridColor="green"
            loadTimeOffset={paintCanvas.loadTimeOffset}
          />
          Votes:{paintCanvas.votes}
          {showCanvas === "false" && (
            <button
              onClick={() => {
                setShowCanvas("true");
              }}
            >
              Edit
            </button>
          )}
        </Fragment>
      ) : (
        showCanvas === "false" && (
          <Fragment>
            <p>You have not drawn {letter} yet! add in yours</p>
            <button
              onClick={() => {
                setShowCanvas("true");
              }}
            >
              Draw
            </button>
          </Fragment>
        )
      )}
      {otherPaints.length > 0 && (
        <OthersPaintsContianer>
          {otherPaints.length} other(s) drew
          <span
            onClick={() => {
              setShowOtherPaints(!showOtherPaints);
            }}
            role="img"
            aria-label="open"
          >
            📂
          </span>
          {showOtherPaints &&
            otherPaints.map((eachPaint) => {
              return (
                <Fragment key={letter + lang + eachPaint.userId}>
                  <hr></hr>
                  <CanvasDraw
                    className="canvas"
                    disabled
                    canvasWidth={paintCanvasInitialState.width}
                    canvasHeight={paintCanvasInitialState.height}
                    brushRadius={paintCanvasInitialState.brushRadius}
                    lazyRadius={paintCanvasInitialState.lazyRadius}
                    saveData={eachPaint.canvasData}
                    loadTimeOffset={paintCanvasInitialState.loadTimeOffset}
                  />
                  <small>by {eachPaint.userName}</small>
                  <VoteButtons
                    key={letter}
                    letter={letter}
                    userId={eachPaint.userId}
                  />
                </Fragment>
              );
            })}
        </OthersPaintsContianer>
      )}
    </div>
  );
}

const OthersPaintsContianer = styled.div`
  background-color: #edf5ef;
  box-shadow: inset 0 0 10px white;
  margin-top: 10px;
  .canvas {
    margin-left: 15px;
  }
`;
