import { styled } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

type PaginationProps = {
  totalPage: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  customColor?: string; // 커스텀 색상 prop 추가
};

function PaginationComponent({ totalPage, onChange, customColor }: PaginationProps) {
  return (
    <Wrapper>
      <Stack spacing={2}>
        <StyledPagination
          customColor={customColor}
          showFirstButton
          showLastButton
          count={totalPage}
          defaultPage={1}
          shape="rounded"
          defaultValue={1}
          onChange={onChange}
        />
      </Stack>
    </Wrapper>
  );
}

export default PaginationComponent;

const StyledPagination = styled(Pagination)<{ customColor?: string }>`
  & .MuiPaginationItem-root {
    color: "#5E5F65";

    &.Mui-selected {
      background-color: ${props => props.customColor || "#5D6DBE"};
      color: white;

      &:hover {
        background-color: ${props => props.customColor || "#5D6DBE"}cc;
      }
    }
  }
`;

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
`;
