import Edit from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Team } from "@opensystemslab/planx-core/types";
import React from "react";
import { Link } from "react-navi";

import { useStore } from "./FlowEditor/lib/store";

interface Props {
  teams: Array<Team>;
}

const Root = styled(Box)(() => ({
  backgroundColor: "#2C2C2C",
  color: "#fff",
  width: "100%",
  flex: 1,
  justifyContent: "flex-start",
  alignItems: "center",
}));

const Dashboard = styled(Box)(({ theme }) => ({
  backgroundColor: "#2C2C2C",
  color: "#fff",
  width: "100%",
  maxWidth: 600,
  margin: "auto",
  padding: theme.spacing(8, 0, 4, 0),
}));

const StyledLink = styled(Link)(() => ({
  textDecoration: "none",
}));

const Teams: React.FC<Props> = ({ teams }) => {
  return (
    <Root>
      <Dashboard>
        <Box pl={2} pb={2}>
          <Typography variant="h2" component="h1" gutterBottom>
            Select a team
          </Typography>
        </Box>
        {teams.map(({ name, slug }) => (
          <StyledLink href={`/${slug}`} key={slug} prefetch={false}>
            <Box
              mb={2.5}
              px={2.5}
              py={3}
              mx={2}
              component={Card}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="h4" component="h2">
                {name}
              </Typography>
              {useStore.getState().canUserEditTeam(slug) ? (
                <Edit />
              ) : (
                <Visibility />
              )}
            </Box>
          </StyledLink>
        ))}
      </Dashboard>
    </Root>
  );
};

export default Teams;
