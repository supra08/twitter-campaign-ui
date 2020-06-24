import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, CSSReset, Box, Heading } from "@chakra-ui/core";
import { Button, ButtonGroup } from "@chakra-ui/core";

function App() {
  return (
    <ThemeProvider>
      <CSSReset />
      <Box padding={4}>
        <Heading>
          Welcome to{" "}
          <span role="img" aria-label="logo">
            ⚡️
          </span>{" "}
          Chakra UI
        </Heading>
      </Box>

        <ButtonGroup spacing={4}>
            <Button variantColor="teal" variant="solid">
                Button
            </Button>
            <Button variantColor="teal" variant="outline">
                Button
            </Button>
            <Button variantColor="teal" variant="ghost">
                Button
            </Button>
            <Button variantColor="teal" variant="link">
                Button
            </Button>
        </ButtonGroup>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
