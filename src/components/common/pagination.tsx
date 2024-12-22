import { PaginationItem, styled } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

type PaginationProps = {
  totalPage: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};
function PaginationComponent({ totalPage, onChange }: PaginationProps) {
  return (
    <Wrapper>
      <Stack spacing={2}>
        <Pagination
          color={"secondary"}
          showFirstButton
          showLastButton
          count={totalPage}
          defaultPage={1}
          shape="rounded"
          defaultValue={1}
          onChange={onChange}
          renderItem={item => (
            <PaginationItem
              {...item}
              sx={{
                "fontSize": "16px",
                "fontWeight": 500,
                "color": "black",
                "&.Mui-selected": {
                  backgroundColor: "#30B4FF",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "700",
                },
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            />
          )}
        />
      </Stack>
    </Wrapper>
  );
}
export default PaginationComponent;

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
`;
