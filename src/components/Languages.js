import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import styled from "styled-components";

export default function Languages({ languageprop }) {
  const [langDB, setLangDB] = useState([]);
  useEffect(() => {
    db.collection("languages").onSnapshot((snapshot) => {
      let lng = [];
      lng = snapshot.docs.map((doc) => doc.data()).map((e) => e.name);
      console.log(lng);
      setLangDB(lng);
    });
  }, []);

  return (
    <LanguageItemContainer>
      {!languageprop ? (
        langDB.map((lang) => (
          <Fragment key={lang}>
            <LanguageItem>
              <Link className="language" to={`/draw/${lang}`}>
                {lang.toUpperCase()}
              </Link>
            </LanguageItem>
          </Fragment>
        ))
      ) : (
        <LanguageItem key={languageprop}>
          <Link className="language" to={`/draw/${languageprop}`}>
            {languageprop.toUpperCase()}
          </Link>
        </LanguageItem>
      )}
    </LanguageItemContainer>
  );
}

const LanguageItem = styled.div`
  height: 30px;
  color: white;
  text-align: center;
  vertical-align: center;
  font-size: 150%;
  padding-right: 10px;
`;
const LanguageItemContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;
