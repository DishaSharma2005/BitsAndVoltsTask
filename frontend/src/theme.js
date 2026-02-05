import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#7A2D2D", // maroon
    },
    secondary: {
      main: "#7A2D2D",
    },
    background: {
      default: "#f4f4f4",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  },
});
