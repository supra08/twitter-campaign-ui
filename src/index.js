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
function AirbnbExample() {
  const property = {
    imageUrl: "https://bit.ly/2Z4KKcF", // Twitter logo if not logged in else user image
    imageAlt: "bla bla",
    title: "Twitter Campaigns",
    name: "Kanav Gupta",
    username: "@kanavgupta99",
    Followings: 184,
    Followers: 47,
  };

  const campaigns = {
    list: "bla bla" //list of campingns
  }
  return (
    // <Box maxW="sm" borderWidth="1px" rounded="lg" overflow="hidden">
    //   <Image src={property.imageUrl} alt={property.imageAlt} />
    // </Box>
    <ThemeProvider>
       <CSSReset />
    <Box bg="black" color="White" d="flex" w="100%" h= "100%" p={4} d= "flex">
      
      <Box d= "flex" w= "40%" alignItems= "center" flexDirection="column">
        <Box>Your Campaigns</Box>
        <Divider />
        <Box><Button leftIcon="view" bg="black" variant="outline" color="white">Campaign 1</Button></Box>
        <Divider />
        <Box><Button bg="black" variant="outline" color="white">Campaign 1</Button></Box>
      </Box>
      <Divider orientation="vertical" />
      <Box d= "flex" w= "60%" alignItems="center" flexDirection="column" justifyContent="center">
        <Box d="flex" alignItems="center" justifyContent="center">
        <Image size="20%" src={property.imageUrl} alt={property.imageAlt} />
        </Box>
        <Box d="flex" alignItems="center">
            biwark
        </Box>
        <Box>
        <Button bg="grey" variant="solid" color="white">
          Login
      </Button>
        </Box>
      </Box>
    </Box>
    </ThemeProvider>
  );
};

function AddCampaign() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <ThemeProvider>
   <CSSReset />
      <Button ref={btnRef} bg="black" variant="solid" color="white" onClick={onOpen} leftIcon="add">
        New Campaign
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="top"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
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
      </ThemeProvider>
  );
}

const bodyElement = document.getElementById("body");
ReactDOM.render(<AirbnbExample />, bodyElement);


const headerElement = document.getElementById("header");
ReactDOM.render(<AddCampaign />, headerElement);