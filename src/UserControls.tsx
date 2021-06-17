import { AmplifySignOut } from "@aws-amplify/ui-react";
import React from "react";
import styled from "styled-components";
import { useUser } from "./hooks";

const Styles = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  & > span {
    margin: 0 1rem;
  }
`;

const UserControls: React.FC = () => {
  const user = useUser();

  if (!user) return null;

  console.log(user);
  return (
    <Styles>
      <span>{user?.attributes?.email}</span>
      <AmplifySignOut />
    </Styles>
  );
};

export default UserControls;
