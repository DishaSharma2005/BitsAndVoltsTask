import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#1e1e1e" }}>
      <Toolbar sx={{ minHeight: 52 }}>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Typography
            sx={{
              fontSize: 14,
              letterSpacing: 0.5,
              fontWeight: 600,
              color: "white",
              textTransform: "uppercase",
            }}
          >
            MERN stack developer practical task by Disha
          </Typography>
        </Box>

        
      </Toolbar>
    </AppBar>
  );
}
