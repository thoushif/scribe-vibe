import MousePaintPreview from "../MousePaintPreview";
import styled from "styled-components";
import Languages from "../Languages";

export default function LetterPreview({
  match: {
    params: { lang, letter }
  }
}) {
  // return <MousePaintPreview lang={lang} letter={letter} />;
  return (
    <MousePaintPreviewContainer>
      <Languages languageprop={lang} />
      {letter}

      <MousePaintPreviewItem key={lang + letter}>
        <MousePaintPreview lang={lang} letter={letter} />
      </MousePaintPreviewItem>
    </MousePaintPreviewContainer>
  );
}

const MousePaintPreviewContainer = styled.div`
  /* display: flex; */
  margin: 10px auto;
`;
const MousePaintPreviewItem = styled.div`
  background-color: white;
  border-radius: 5px;
  border: 2px solid #aea7a1;
  font-size: 120%;
  padding: 20px;
`;
