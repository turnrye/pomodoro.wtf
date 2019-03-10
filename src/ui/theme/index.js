// src/ui/theme/index.js

import { createMuiTheme } from "@material-ui/core/styles";

const palette = { primary: { main: "#ff6347" } };
const themeName = "Persimmon Razzmatazz Cats";

export default createMuiTheme({
  palette,
  themeName,
  typography: {
    useNextVariants: true
  }
});
