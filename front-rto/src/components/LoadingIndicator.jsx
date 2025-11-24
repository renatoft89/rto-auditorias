import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingIndicator = ({ message = "Carregando dados...", fullHeight = false, size = 48 }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 2,
      py: fullHeight ? 8 : 4,
      minHeight: fullHeight ? "60vh" : "auto",
      textAlign: "center",
    }}
  >
    <CircularProgress size={size} thickness={4} sx={{ color: '#660c39' }} />
    {message && (
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        {message}
      </Typography>
    )}
  </Box>
);

export default LoadingIndicator;
