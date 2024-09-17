import LanguageIcon from "@mui/icons-material/Language";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import OpenInNewOffIcon from "@mui/icons-material/OpenInNewOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import { hasFeatureFlag } from "lib/featureFlags";
import React, { useState } from "react";
import { rootFlowPath } from "routes/utils";
import Permission from "ui/editor/Permission";
import Reset from "ui/icons/Reset";

import Questions from "../../../Preview/Questions";
import { useStore } from "../../lib/store";
import { DebugConsole } from "./DebugConsole";
import EditHistory from "./EditHistory";
import { PublishFlowButton } from "./Publish/PublishFlowButton";
import Search from "./Search";
import StyledTab from "./StyledTab";

type SidebarTabs = "PreviewBrowser" | "History" | "Search" | "Console";

const Root = styled(Box)(({ theme }) => ({
  position: "relative",
  top: "0",
  right: "0",
  bottom: "0",
  width: "500px",
  display: "flex",
  flexShrink: 0,
  flexDirection: "column",
  borderLeft: `1px solid ${theme.palette.border.main}`,
  background: theme.palette.background.paper,
  "& iframe": {
    flex: "1",
  },
}));

const SidebarContainer = styled(Box)(() => ({
  overflow: "auto",
  flex: 1,
  background: "#fff",
  position: "relative",
}));

const Header = styled("header")(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  "& input": {
    flex: "1",
    padding: "5px",
    marginRight: "5px",
    background: theme.palette.common.white,
    border: "1px solid rgba(0, 0, 0, 0.2)",
  },
  "& svg": {
    cursor: "pointer",
    opacity: "0.7",
    margin: "6px 4px 1px 4px",
    fontSize: "1.2rem",
  },
}));

const ResetToggle = styled(Button)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: theme.spacing(3),
  padding: theme.spacing(1, 1, 1, 0),
  textDecorationStyle: "solid",
  color: theme.palette.text.primary,
}));

const TabList = styled(Box)(({ theme }) => ({
  position: "relative",
  // Use a pseudo element as border to allow for tab border overlap without excessive MUI overrides
  "&::after": {
    content: "''",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "1px",
    backgroundColor: theme.palette.border.main,
  },
  "& .MuiTabs-root": {
    minHeight: "0",
    padding: theme.spacing(0, 1.5),
  },
  // Hide default MUI indicator as we're using custom styling
  "& .MuiTabs-indicator": {
    display: "none",
  },
}));

const Sidebar: React.FC = React.memo(() => {
  const [resetPreview, isFlowPublished] = useStore((state) => [
    state.resetPreview,
    state.isFlowPublished,
  ]);

  const [activeTab, setActiveTab] = useState<SidebarTabs>("PreviewBrowser");

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: SidebarTabs,
  ) => {
    setActiveTab(newValue);
  };

  const baseUrl = `${window.location.origin}${rootFlowPath(false)}`;

  const urls = {
    preview: baseUrl + "/preview",
    draft: baseUrl + "/draft",
    analytics: baseUrl + "/published" + "?analytics=false",
  };

  return (
    <Root>
      <Header>
        <Box width="100%" display="flex">
          <input type="text" disabled value={urls.preview} />

          <Permission.IsPlatformAdmin>
            <Tooltip arrow title="Open draft service">
              <Link
                href={urls.draft}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <OpenInNewOffIcon />
              </Link>
            </Tooltip>
          </Permission.IsPlatformAdmin>

          <Tooltip arrow title="Open preview of changes to publish">
            <Link
              href={urls.preview}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              <OpenInNewIcon />
            </Link>
          </Tooltip>

          {isFlowPublished ? (
            <Tooltip arrow title="Open published service">
              <Link
                href={urls.analytics}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <LanguageIcon />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip arrow title="Flow not yet published">
              <Box>
                <Link component={"button"} disabled aria-disabled={true}>
                  <LanguageIcon />
                </Link>
              </Box>
            </Tooltip>
          )}
        </Box>
        <PublishFlowButton previewURL={urls.preview} />
      </Header>
      <TabList>
        <Tabs onChange={handleChange} value={activeTab} aria-label="">
          <StyledTab value="PreviewBrowser" label="Preview" />
          <StyledTab value="History" label="History" />
          {hasFeatureFlag("SEARCH") && (
            <StyledTab value="Search" label="Search" />
          )}
          <StyledTab value="Console" label="Console" />
        </Tabs>
      </TabList>
      {activeTab === "PreviewBrowser" && (
        <SidebarContainer>
          <ResetToggle
            variant="link"
            onClick={() => {
              resetPreview();
            }}
          >
            <Reset fontSize="small" />
            Restart
          </ResetToggle>
          <Questions previewEnvironment="editor" />
        </SidebarContainer>
      )}
      {activeTab === "History" && (
        <SidebarContainer py={3}>
          <Container>
            <EditHistory />
          </Container>
        </SidebarContainer>
      )}
      {activeTab === "Search" && (
        <SidebarContainer py={3}>
          <Search />
        </SidebarContainer>
      )}
      {activeTab === "Console" && (
        <SidebarContainer>
          <DebugConsole />
        </SidebarContainer>
      )}
    </Root>
  );
});

export default Sidebar;
