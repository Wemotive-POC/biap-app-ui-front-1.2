import styles from "./styles/globalStyles.module.scss";
import Routes from "./router";
import "./api/firebase-init";

import { ThemeProvider } from "@emotion/react";
import theme from "./utils/Theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.background}>
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;
