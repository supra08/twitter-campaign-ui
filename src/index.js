import React, { useEffect, useState } from "react";
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
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/core";
import { Textarea } from "@chakra-ui/core";
import { Select } from "@chakra-ui/core";


function getCampaignInfo(id) {
  fetch('http://127.0.0.1:5000/campaign?id=' + id, {
    method: 'GET',
  })
  .then(res => res.json())
}

function createCampaign(name, id, strategy, message) {
  fetch('http://127.0.0.1:5000/campaign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'name': name, 'id': id, 'strategy': strategy, 'message': message })
  })
  .then(res => res.json())
}

function handleLogin() {
  fetch('http://127.0.0.1:5000/request_token', {
    method: 'GET',
  })
  .then(res => res.json())
  .then(response => {
    if (response.oauth_callback_confirmed == "true") {
      const token = response.oauth_token;
      window.location.replace(
        "https://api.twitter.com/oauth/authenticate?oauth_token=" + token
      );
    } else {
      console.log("Request token can not be retrieved.");
    }
  })
}

function handleLogout() {
  fetch('http://127.0.0.1:5000/logout', {
    method: 'GET',
  })
  .then(res => res.json())
  .then(response => {
    if (response.status == "true") {
      window.location.replace(
        "http://localhost:3000/"
      );
    } else {
      console.log("Logout failed");
    }
  })
}

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/campaigns', {
      method: 'GET',
    })
    .then(res => res.json())
    .then(
      (result) => {
        setItems(result.campaign_list);
      },
      (error) => {
        setError(error);
      }
    )
  }, [])

  let oauth_token = ""
  let oauth_verifier = ""

  const [loginButton, setLogin] = useState( <Button size="lg" onClick={handleLogin}> Login </Button> );
  const [me, setMe] = useState({ name: '', handle: '', followers: '', following: '' })
  const urlParams = new URLSearchParams(window.location.search);
  oauth_token = urlParams.get('oauth_token');
  oauth_verifier = urlParams.get('oauth_verifier')
  
  useEffect(() => {
      if (oauth_token && oauth_verifier) {
        fetch("http://127.0.0.1:5000/access_token?oauth_token=" + oauth_token + "&oauth_verifier=" + oauth_verifier, {
          method: 'GET',
        })
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result)
            if (result.status == "success") {
              setLogin(<Button size="lg" onClick={handleLogout}> Logout </Button>);
              setMe({ name: result.me.name, handle: result.screen_name, followers: result.me.followers_count, following: result.me.friends_count })
            }
          },
          (error) => {
            setLogin(false);
            setError(error);
          }
        )
      }
    }, [])

    function showCampaign(name) {
      
        items.map(campaign => {
          if (campaign.name === name) {
            setCurrentCampaign(campaign);
          }
       
      })
      // items.map(campaign => {
      //   if (campaign.id === id) {
      //     setCurrentCampaign(campaign);
      //   }
      // })
    }

  
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
            {console.log(items)}
            {items.map(campaign => (
              <Box>
                <Button w="100%"leftIcon="check-circle" color="green.500" onClick={() => showCampaign(campaign.name)} >{campaign.name}</Button>
              </Box>
            ))}
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
                  <Button color="blue" onClick={createCampaign()}>Save</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            </Box>
            <Box d="flex" flexDirection="column" justifyContent = "flex-start" alignItems= "center" w="100%" mt="2em">
            <form style={{width : '100%'}}>
              <FormControl isRequired>
              <Box w="100%" d="flex" flexDirection="row" justifyContent="space-between">
                <Box w="20%" pl="1em"><FormLabel htmlFor="name">Campaign Name</FormLabel></Box>
                <Box w="70%" pr="1em"><Input id="name" name="name" placeholder="Campaign Name" /></Box>
              </Box>
              </FormControl>
              <FormControl isRequired>
              <Box w="100%" d="flex" flexDirection="row" justifyContent="space-between" mt="1em">
                <Box w="20%" pl="1em"><FormLabel htmlFor="message">Message Text</FormLabel></Box>
                <Box w="70%" pr="1em">
                <Textarea name="message" id="message" placeholder="Type your message here....." />
                </Box>
              </Box>
              </FormControl>
              <FormControl isRequired>
              <Box w="100%" d="flex" flexDirection="row" justifyContent="space-between" mt="1em">
                <Box w="20%" pl="1em"><FormLabel htmlFor="strategy">Strategy</FormLabel></Box>
                <Box w="70%" pr="1em">
                  <Box w="30%">
                    <Select placeholder="Select strategy" id="strategy" name="strategy">
                      <option value="option1">strategy 1</option>
                      <option value="option2">strategy 2</option>
                      <option value="option3">strategy 3</option>
                    </Select>
                  </Box>
                </Box>
              </Box>
              </FormControl>
            </form>
            <Box d="flex" flexDirection="column" justifyContent = "flex-start" alignItems= "center" w="100%" mt="2em">
              <Box w="100%" d="flex" flexDirection="row" justifyContent="space-between">
                <Box w="20%" pl="1em">Status</Box>
                <Box w="70%" pr="1em">0/2</Box>
              </Box>
            </Box>
            </Box>
            <Box width="100%" display="flex" justifyContent="space-between" pr="1em" pl="1em" mt="20em">
              <Box>
                <Button>Delete Campaign</Button>
              </Box>
              <Box d="flex" flexDirection="row">
                <Box><Button>Reset</Button></Box>
                <Box ml="1em"><Button>Pause</Button></Box>
                <Box ml="1em"><Button>Start Campaign</Button></Box>
            </Box>
            </Box>
            <Box> { currentCampaign == null ? (
              <Box d="flex" flexDirection="column" justifyContent = "center" alignItems= "center" mt="8em">
              <Box d="flex" w="100%" justifyContent = "center">
                <Image size="20%" justifyContent = "center" src={Twitter} alt="Twitter logo" />
              </Box>
              <Box d="flex" justifyContent = "center" w="100%" mt="2em">{me.name}</Box>
              <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">@{me.handle}</Box>
                <Box d="flex" flexDirection="row" justifyContent = "center" w="100%" mt="0.5em">
                  <Box>{me.following} Following</Box>
                  <Box ml="4%">{me.followers} Followers</Box>
                </Box>
              </Box>
            ): <Box>
                <Box d="flex" justifyContent = "center" w="100%" mt="2em">{currentCampaign.name}</Box>
                <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.id}</Box>
                <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.strategy}</Box>
                <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.message}</Box>
                <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.followers}</Box>
                <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.started}</Box>
               </Box>
            }
              
            </Box>
            <Box mt="10em" width="100%" display="flex" justifyContent="flex-end" pr="1em">
            {loginButton}
              </Box>
          </Box>
      </Box>
      </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);