import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, CSSReset, Box, Heading, Flex} from "@chakra-ui/core";
import { Button, ButtonGroup } from "@chakra-ui/core";
import {Image, Badge} from "@chakra-ui/core";
import { Divider } from "@chakra-ui/core";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/core";
import { Input,useDisclosure } from "@chakra-ui/core";
import Twitter from "./twitter.svg"
import { List, ListItem, ListIcon } from "@chakra-ui/core";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <ThemeProvider>
    <CSSReset />
      <Box w="100vw" h="100vh" d="flex" flexDirection="row">
        <Box h= "100%" w= "20%" d="flex" flexDirection="column">
            <Box position="static" p="5%" w="100%" d="flex" justifyContent= "center"  border="1px" borderRadius="md" borderColor="gray.200">
              My Campaigns
            </Box>
            <Box d="flex" flexDirection="column" w="100%">
            {/* list of all campings */}
            <Box>
            <Button w="100%"leftIcon="check-circle" color="green.500" >Campaign 1</Button>
            </Box>
            <Box mt="1px">
            <Button w="100%"leftIcon="check-circle" color="green.500" >Campaign 2</Button>
            </Box>
            <Box mt="1px">
            <Button w="100%"leftIcon="check-circle" color="green.500" >Campaign 3</Button>
            </Box>
            <Box mt="1px">
            <Button w="100%"leftIcon="check-circle" color="green.500" >Campaign 4</Button>
            </Box>
            </Box>
        </Box>
          <Divider mr="0" ml="0" orientation="vertical" />
          <Box h= "100%" w="80%" d="flex" flexDirection="column" alignItems= "center">
            <Box d="flex" flexDirection="column" justifyContent = "center" alignItems= "center" mt="8em">
              <Box d="flex" w="100%" justifyContent = "center">
              <Image size="20%" justifyContent = "center" src={Twitter} alt="Twitter logo" />
              </Box>
              <Box d="flex" justifyContent = "center" w="100%" mt="2em">Twitter campaigns</Box>
              <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">v1.0</Box>
            </Box>
            <Box mt="10em" >
            <Button size="lg">
              Login
            </Button>
 
              </Box>
          </Box>
      </Box>
      </ThemeProvider>
  );
}

function App1() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <ThemeProvider>
   <CSSReset />
      <Box w="100vw" h="100vh" d="flex" flexDirection="row">
          <Box h= "100%" w= "20%" d="flex" flexDirection="column">
            <Box position="static" p="5%" w="100%" d="flex" justifyContent= "center"  border="1px" borderRadius="md" borderColor="gray.200">
              My Campaigns
            </Box>
            <Box d="flex" flexDirection="column" w="100%">
            {/* list of all campings */}
            <Box>
            <Button w="100%"leftIcon="check-circle" color="green.500" >Campaign 1</Button>
            </Box>
            <Box mt="1px">
            <Button w="100%"leftIcon="check-circle" color="green.500" >Campaign 2</Button>
            </Box>
            <Box mt="1px">
            <Button w="100%"leftIcon="check-circle" color="green.500" >Campaign 3</Button>
            </Box>
            <Box mt="1px">
            <Button w="100%"leftIcon="check-circle" color="green.500" >Campaign 4</Button>
            </Box>
            </Box>
          </Box>
          <Divider mr="0" ml="0" orientation="vertical" />
          <Box h= "100%" w="80%" d="flex" flexDirection="column" alignItems= "center">
            <Box mt="10em" width="100%" display="flex" justifyContent="flex-end" pr="1em" mt="2em">
            <Button ref={btnRef} onClick={onOpen} leftIcon="add">
              New Campaign
            </Button>
            <Drawer isOpen={isOpen} placement="top" onClose={onClose} finalFocusRef={btnRef}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Campaign Name</DrawerHeader>

                <DrawerBody>
                  <Input placeholder="Type here..." />
                </DrawerBody>

                <DrawerFooter>
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button color="blue">Save</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            </Box>
            <Box d="flex" flexDirection="column" justifyContent = "center" alignItems= "center" mt="8em">
              <Box d="flex" w="100%" justifyContent = "center">
                <Image size="20%" justifyContent = "center" src={Twitter} alt="Twitter logo" />
              </Box>
              <Box d="flex" justifyContent = "center" w="100%" mt="2em">Kanav Gupta</Box>
              <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">@kanavgupta99</Box>
              <Box d="flex" flexDirection="row" justifyContent = "center" w="100%" mt="0.5em">
                <Box>184 Following</Box>
                <Box ml="4%">47 Followers</Box>
              </Box>
            </Box>
            <Box mt="10em" width="100%" display="flex" justifyContent="flex-end" pr="1em">
            <Button size="lg">
              Logout
            </Button>
              </Box>
          </Box>
      </Box>
      </ThemeProvider>
  );
}


const rootElement = document.getElementById("root");
ReactDOM.render(<App1 />, rootElement);