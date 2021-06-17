import React from "react";
import styled from "styled-components";
import RecordControl from "./RecordControl";
import UserControls from "./UserControls";

const Styles = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: orange;
  justify-content: space-between;
  color: white;
`;

const BottomBar: React.FC = () => {
  return (
    <Styles>
      <UserControls />
      <RecordControl />
    </Styles>
  );
};

export default BottomBar;
