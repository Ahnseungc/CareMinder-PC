import { styled } from "@mui/material";

export default function MemoBox() {
  const mock = [
    { name: "간호사1", contents: "음...이거 뭐 해야합니다!!", isMine: false },
    { name: "간호사1", contents: "음...이거 뭐 해야합니다!!", isMine: false },
    { name: "간호사1", contents: "음...이거 뭐 해야합니다!!", isMine: false },
    { name: "간호사1", contents: "음...이거 뭐 해야합니다!!", isMine: false },
  ];
  return (
    <MemoWrapper>
      {mock.map(el => (
        <Memo>{el.name}</Memo>
      ))}
    </MemoWrapper>
  );
}

const MemoWrapper = styled("div")`
  background-color: red;
`;
const Memo = styled("div")`
  background-color: red;
`;
