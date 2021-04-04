import { useContext, useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { UserContext } from "../providers/UserProvider";
import { db } from "../firebase";
import firebase from "firebase/app";

export default function VoteButtons({ letter, userId }) {
  const user = useContext(UserContext);
  const [voteCount, setVoteCount] = useState();
  const [upvoteDisabled, setUpvoteDisabled] = useState(false);
  const [downvoteDisabled, setDownvoteDisabled] = useState(false);
  const canvasDBObj = db
    .collection("canvasObjects")
    .doc(letter)
    .collection("users")
    .doc(userId);
  useEffect(() => {
    db.collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .doc(userId)
      .onSnapshot(function (doc) {
        setVoteCount(doc.data().voteCount);
        let votedByObj = doc.data().votedBy ? doc.data().votedBy : undefined;
        resetVoteButtonsUtil(letter, votedByObj);
      });

    return cleanup();
  }, [letter, userId]);
  const cleanup = () => {
    setVoteCount(0);
    setUpvoteDisabled(false);
    setDownvoteDisabled(false);
  };
  const resetVoteButtonsUtil = (letter, votedByObj) => {
    // console.log("*******" + letter + "********" + userId);
    // console.log("checking ");
    // console.table(votedByObj);
    let maxvotedByObj =
      votedByObj &&
      votedByObj.reduce(function (prev, current) {
        return prev.voteUser === user.uid &&
          current.voteUser === user.uid &&
          prev.votedAt > current.votedAt
          ? prev
          : current;
      });
    // console.log("max voted at ");
    // maxvotedByObj &&
    //   console.log("max voted at ", new Date(maxvotedByObj.votedAt.toDate()));

    // console.table(maxvotedByObj);

    if (
      votedByObj &&
      votedByObj.some(
        (item) =>
          item.voteUser === user.uid &&
          item.voteUp &&
          maxvotedByObj.votedAt === item.votedAt
      )
    ) {
      setUpvoteDisabled(true);
      setDownvoteDisabled(false);
    }
    if (
      votedByObj &&
      votedByObj.some(
        (item) =>
          item.voteUser === user.uid &&
          !item.voteUp &&
          maxvotedByObj.votedAt === item.votedAt
      )
    ) {
      setDownvoteDisabled(true);
      setUpvoteDisabled(false);
    }
  };
  const resetVoteButtons = () => {
    canvasDBObj.get().then((doc) => {
      if (doc.exists) {
        let votedByObj = doc.data().votedBy ? doc.data().votedBy : undefined;
        resetVoteButtonsUtil(doc.data().letter, votedByObj);
      }
    });
  };
  const vote = (voteUp) => {
    canvasDBObj.get().then((doc) => {
      if (doc.exists) {
        let canvas = doc.data();
        let timeNow = firebase.firestore.Timestamp.now();
        let voteCount = canvas.voteCount ? canvas.voteCount : 0;
        let votedByNow = {
          voteUser: user.uid,
          votedAt: timeNow,
          voteUp: voteUp
        };

        canvasDBObj.update({
          votedBy: firebase.firestore.FieldValue.arrayUnion(votedByNow),
          voteCount: voteUp ? voteCount + 1 : voteCount - 1
        });
      }
    });
    resetVoteButtons();
  };
  return (
    <div>
      Votes {voteCount ? voteCount : 0}
      <button disabled={upvoteDisabled} onClick={() => vote(true)}>
        <span role="img" aria-label="Upvote">
          👍
        </span>
      </button>
      <button disabled={downvoteDisabled} onClick={() => vote(false)}>
        <span role="img" aria-label="Downvote">
          👎
        </span>
      </button>
    </div>
  );
}
