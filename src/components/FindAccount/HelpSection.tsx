import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import styled from "@emotion/styled";
import { ReactComponent as Arrow } from "@/assets/DownArrow.svg";
import { Typography } from "@mui/material";

export default function HelpSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer", textAlign: "center" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Text isOpen={isOpen}>
          아이디/비밀번호를 찾는데 어려움이 있으신가요?
          <Arrow />
        </Text>
      </motion.div>

      <ContentWrapper>
        <AnimatePresence>
          {isOpen && (
            <HelpContent
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            >
              <Typography variant="subtitle1">케어마인더로 연락해주세요.</Typography>
              번호: 010-1234-5678
              <br />
              이메일:{" "}
              <span style={{ textDecoration: "underline", paddingBottom: "3px" }}>
                salescareminder@gmail.com
              </span>
            </HelpContent>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 30px;
  position: relative;
`;

const Text = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ isOpen }) => (isOpen ? "#5D6DBE" : "#5E5F65")};
  svg {
    transition: transform 0.3s ease;
    transform: rotate(${({ isOpen }) => (isOpen ? "180deg" : "0deg")});
  }
`;

const ContentWrapper = styled.div`
  transition: height 0.2s ease-out;
`;

const HelpContent = styled(motion.div)`
  width: 428px;
  padding: 20px;
  margin-top: 10px;
  background-color: #eff1f9;
  border-radius: 8px;
  text-align: center;
  position: absolute;
  left: -80px;
  transform: translateX(-50%);
`;
