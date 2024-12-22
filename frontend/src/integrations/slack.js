// slack.js;

// TODO;

import { useState, useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import axios from "axios";

const endpointMapping = {
  Notion: "notion",
  Airtable: "airtable",
  HubSpot: "hubspot",
};

const SlackIntegration = ({
  user,
  org,
  integrationParams,
  setIntegrationParams,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Function to open OAuth in a new window
  const handleConnectClick = async () => {
    try {
      setIsConnecting(true);
      const formData = new FormData();
      formData.append("user_id", user);
      formData.append("org_id", org);
      const response = await axios.post(
        `http://localhost:8000/integrations/slack/authorize`,
        formData
      );
      const authURL = response?.data;

      const newWindow = window.open(
        authURL,
        "Slack Authorization",
        "width=600, height=600"
      );

      // Polling for the window to close
      const pollTimer = window.setInterval(() => {
        if (newWindow?.closed !== false) {
          window.clearInterval(pollTimer);
          handleWindowClosed();
        }
      }, 200);
    } catch (e) {
      setIsConnecting(false);
      alert(e?.response?.data?.detail);
    }
  };

  // Function to handle logic when the OAuth window closes
  const handleWindowClosed = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", user);
      formData.append("org_id", org);
      const response = await axios.post(
        `http://localhost:8000/integrations/slack/credentials`,
        formData
      );
      const credentials = response.data;
      if (credentials) {
        setIsConnecting(false);
        setIsConnected(true);
        setIntegrationParams((prev) => ({
          ...prev,
          credentials: credentials,
          type: "Slack",
        }));
      }
      setIsConnecting(false);
    } catch (e) {
      setIsConnecting(false);
      alert(e?.response?.data?.detail);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      width="100%"
    >
      <Box display="flex" flexDirection="column" width="100%">
        <TextField
          label="User"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Organization"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          sx={{ mt: 2 }}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleConnectClick}
        sx={{ mt: 2 }}
        disabled={isConnecting}
      >
        {isConnecting ? <CircularProgress size={24} /> : "Connect to Slack"}
      </Button>
    </Box>
  );
};

export default SlackIntegration;
