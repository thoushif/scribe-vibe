import { useContext, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import { UserContext } from "./providers/UserProvider";
import { db } from "./firebase";
import firebase from "firebase/app";

export default function MousePaint(props) {
  const userObj = useContext(UserContext);
  const letter = props.paintCanvas.letter;
  const lang = props.paintCanvas.lang;
  const thisCanvas = useRef(null);

  const state = {
    color: "#ffc600",
    width: 150,
    height: 150,
    brushRadius: 2,
    lazyRadius: 6
  };

  const saveDrawingToDB = (canvasData, letter) => {
    console.log("here goes code to save ", canvasData, letter, userObj.uid);
    const canvasDBObj = db
      .collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .doc(userObj.uid);
    canvasDBObj.get().then((doc) => {
      if (doc.exists) {
        canvasDBObj.update({
          canvasData: canvasData,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        db.collection("letters-written")
          .doc(lang + letter + userObj.uid)
          .set({
            letter: letter,
            userId: userObj.uid
          });
        db.collection("canvasObjects")
          .doc(letter)
          .collection("users")
          .doc(userObj.uid)
          .set({
            letter: letter,
            canvasData: canvasData,
            userId: userObj.uid,
            userName: userObj.displayName,
            voteCount: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
      }
    });
  };

  // if (!userCanvasExists) {
  //   db.collection("canvasObjects")
  //     .doc(lang)
  //     .collection("letters")
  //     .doc(letter)
  //     .collection("users")
  //     .doc(userObj.uid)
  //     .set({
  //       canvasData: canvasData,
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //     });
  // }

  // const canvasDBObj = db.collection("canvasObjects").doc(letter + userId);
  // canvasDBObj.get().then((doc) => {
  //   if (doc.exists) {
  //     canvasDBObj.update({
  //       canvasData: canvasData,
  //       updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  //     });
  //   } else {
  //     db.collection("canvasObjects")
  //       .doc(letter + userId)
  //       .set({
  //         name: letter,
  //         canvasData: canvasData,
  //         userId: userId,
  //         createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //       });
  //   }
  // });

  function setShowCanvas() {
    props.setShowCanvas("false");
    props.setOtherPaints([]);
  }
  return (
    <div className="App">
      <h3>Drawing...{letter}</h3>
      <CanvasDraw
        canvasWidth={state.width}
        canvasHeight={state.height}
        brushRadius={state.brushRadius}
        lazyRadius={state.lazyRadius}
        // ref={(canvasDraw) => (this.saveableCanvas = canvasDraw)}
        ref={thisCanvas}
        saveData={props.paintCanvas.saveData}
      />
      <button
        onClick={() => {
          thisCanvas.current.clear();
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          thisCanvas.current.undo();
        }}
      >
        UNDO
      </button>
      <button
        onClick={() => {
          if (!thisCanvas.current.getSaveData().includes("points")) {
            setShowCanvas();
          } else if (window.confirm("Are you sure you dont want to save?"))
            setShowCanvas();
        }}
      >
        Cancel
      </button>
      <button
        onClick={() => {
          if (!thisCanvas.current.getSaveData().includes("points")) {
            return false;
          }
          // localStorage.setItem(
          //   "savedDrawing" + letter,
          //   thisCanvas.current.getSaveData()
          // );
          saveDrawingToDB(
            thisCanvas.current.getSaveData(),
            letter,
            userObj.uid
          );
          setShowCanvas();
        }}
      >
        save
      </button>
    </div>
  );
}
