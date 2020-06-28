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
import Logo from "./logo.png"
import Dummy from "./dummy.png"
import { List, ListItem, ListIcon } from "@chakra-ui/core";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/core";
import { Textarea } from "@chakra-ui/core";
import { Select } from "@chakra-ui/core";

const BACKEND_URL = "http://ec2-54-161-90-135.compute-1.amazonaws.com:5000";

function getCampaignInfo(id) {
  fetch('http://127.0.0.1:5000/campaign?id=' + id, {
    method: 'GET',
  })
  .then(res => res.json())
}

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState(false);
  const [me, setMe] = useState(null);

  function handleLogin() {
    fetch(BACKEND_URL + '/request_token', {
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
  
  function handleLogout(user_id) {
    fetch(BACKEND_URL + '/logout?user_id=' + user_id, {
      method: 'GET',
    })
    .then(res => res.json())
    .then(response => {
      if (response.status == "true") {
        setMe(null);
        window.location.replace(
          "http://ec2-54-161-90-135.compute-1.amazonaws.com:8080"
        );
      } else {
        console.log("Logout failed");
      }
    })
  }

  function createCampaign(e) {
    e.preventDefault()
    const data = new FormData(e.target);
    fetch(BACKEND_URL + '/campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'name': data.get('name'), 'id': data.get('id'), 'strategy': data.get('strategy'), 'message': data.get('message'), 'user_id': me.id })
    })
    .then(res => res.json()
    .then(data => {
      if (data.status == "success") {
        setNewCampaign(false);
        fetchCampaigns(me.id);
      }
    })
  )}

  function fetchCampaigns(user_id) {
    console.log('here -1')
    console.log(user_id)
    fetch(BACKEND_URL + '/campaigns?user_id=' + user_id, {
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
  }

  useEffect(() => {
    if (me) {
      fetch(BACKEND_URL + '/campaigns?user_id=' + me.id, {
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
    }
  }, [])

  let oauth_token = ""
  let oauth_verifier = ""

  const [loginButton, setLogin] = useState( <Button onClick={handleLogin}> Login </Button> );
  const urlParams = new URLSearchParams(window.location.search);
  oauth_token = urlParams.get('oauth_token');
  oauth_verifier = urlParams.get('oauth_verifier')
  
  useEffect(() => {
      if (oauth_token && oauth_verifier) {
        fetch(BACKEND_URL + "/access_token?oauth_token=" + oauth_token + "&oauth_verifier=" + oauth_verifier, {
          method: 'GET',
        })
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result)
            if (result.status == "success") {
              setLogin(<Button onClick={() => handleLogout(result.user_id)}> Logout </Button>);
              setMe({ name: result.me.name, handle: result.screen_name, followers: result.me.followers_count, following: result.me.friends_count, id: result.user_id })
              fetchCampaigns(result.user_id);
            }
          },
          (error) => {
            setLogin(false);
            setError(error);
          }
        )
      }
      // setMe({ name: "palak", handle: "palak_goenka", followers: 34, following: 67, id: 98 })
      fetchCampaigns(result.user_id);
    }, [])

    function showCampaign(name) { 
        items.map(campaign => {
          if (campaign.name === name) {
            setCurrentCampaign(campaign);
            setNewCampaign(false);
          }
      })
    }

    function toggleNewCampaign() {
      if (newCampaign) {
        setNewCampaign(false);
      } else {
        setNewCampaign(true);
      }
    }

    function startCampaign(id) {
      fetch(BACKEND_URL + '/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id': id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status == "success") {
          // 
          let c_campaign = currentCampaign
          c_campaign.started = true
          setCurrentCampaign(c_campaign)
        }
      })
    }

    function stopCampaign(id) {
      fetch(BACKEND_URL + '/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id': id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status == "success") {
          // fetchCampaigns()
          let c_campaign = currentCampaign
          c_campaign.started = false
          setCurrentCampaign(c_campaign)
        }
      })
    }

    function deleteCampaign(id) {
      fetch(BACKEND_URL + '/campaign', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id': id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status == "success") {
          // fetchCampaigns()
          let newitems = items
          items.map(campaign => {
            if (campaign.id == id) {
              const index = items.indexOf(campaign);
              if (index > -1) {
                items.splice(index, 1);
                newitems = items
                setItems(newitems)
              }
            }
          })
        }
      })
    }

  
  return (
    <ThemeProvider>
   <CSSReset />
      <Box w="100vw" h="100vh" d="flex" flexDirection="row" bg="grey.50">
          <Box h= "100%" w= "20%" d="flex" flexDirection="column">
            <Box position="static" p="5%" w="100%" d="flex" justifyContent= "center"  border="1px" borderRadius="md" borderColor="gray.200">
            <Heading as="h3" size="lg">My Campaigns</Heading>
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
            <Box> { me ? 
              <Button ref={btnRef} onClick={toggleNewCampaign} leftIcon="add">
                New Campaign
              </Button> : '' }
            </Box>
            <Box ml="1em">{loginButton}</Box>
            {/* <Drawer isOpen={isOpen} placement="top" onClose={onClose} finalFocusRef={btnRef}>
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
            </Drawer> */}
            </Box> 
            { newCampaign == true ? ( 
              <Box d="flex" flexDirection="column" justifyContent = "flex-start" alignItems= "center" w="100%" mt="2em">
                <form style={{width : '100%'}} onSubmit={createCampaign}>
                  <FormControl isRequired>
                  <Box w="100%" d="flex" flexDirection="row" justifyContent="space-between">
                    <Box w="20%" pl="1em"><FormLabel htmlFor="name">Campaign Name</FormLabel></Box>
                    <Box w="70%" pr="1em"><Input id="name" name="name" placeholder="Campaign Name" /></Box>
                  </Box>
                  </FormControl>
                  <FormControl isRequired>
                  <Box w="100%" d="flex" flexDirection="row" justifyContent="space-between" mt="1em">
                    <Box w="20%" pl="1em"><FormLabel htmlFor="id">Campaign ID</FormLabel></Box>
                    <Box w="70%" pr="1em"><Input id="id" name="id" placeholder="Campaign ID" /></Box>
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
                          <option value="tweet">tweet</option>
                          <option value="friend">friend</option>
                          <option value="follower">follower</option>
                        </Select>
                      </Box>
                    </Box>
                  </Box>
                  </FormControl>
                  <Box d="flex" flexDirection="column" justifyContent = "flex-start" alignItems= "center" w="100%" mt="2em">
                    <Box w="100%" d="flex" flexDirection="row" justifyContent="space-between">
                      <Box w="20%" pl="1em">Status</Box>
                      <Box w="70%" pr="1em">0/2</Box>
                    </Box>
                  </Box>
                  <Box width="100%" display="flex" justifyContent="space-between" pr="1em" pl="1em" mt="20em">
                    <Box d="flex" flexDirection="row">
                      <Box ml="1em"><Button type="submit">Start Campaign</Button></Box>
                    </Box>
                  </Box>
                </form>
              </Box> 
            ) : 
              <Box d="flex" width="100%">
                <Box d="flex" width="100%"> { currentCampaign == null ? (
                  <Box d="flex" flexDirection="column" justifyContent = "center" alignItems= "center" mt="8em" w="100%">
                  {/* <Box d="flex" w="100%" justifyContent = "center">
                    <Image size="40%" justifyContent = "center" src={Logo} alt="App logo" />
                  </Box> */}
                  { me ? (
                  <Box d="flex" w="100%" justifyContent= "center" flexDirection="column">
                    <Box d="flex" w="100%" justifyContent = "center">
                      <Image justifyContent = "center" src={Dummy} alt="App logo" />
                    </Box>
                    <Box d="flex" justifyContent = "center" w="100%" mt="2em">
                      <Heading as="h4" size="md">{me.name}</Heading>
                    </Box>
                    <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">
                      <Heading as="h3" size="lg">@{me.handle}</Heading>
                      </Box>
                      <Box d="flex" flexDirection="row" justifyContent = "center" w="100%" mt="0.5em">
                        <Box><Heading as="h4" size="sm">{me.following} Following </Heading></Box>
                        <Box ml="4%"><Heading as="h4" size="sm">{me.followers} Followers </Heading></Box>
                      </Box>
                    </Box>)  : (
                      <Box d="flex" w="100%" justifyContent = "center" flexDirection = "column" alignItems="center">
                        <Box d="flex" justifyContent="center"><Image size="40%" justifyContent = "center" src={Logo} alt="App logo" /></Box>
                        <Box mt="1em"><Heading as="h3" size="md">v1.0</Heading></Box>
                      </Box>
                    )}
                  </Box>
                ): (<Box> { me ? 
                      <Box>
                        
                        <Box d="flex" justifyContent = "center" w="100%" mt="2em">{currentCampaign.name}</Box>
                        <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.id}</Box>
                        <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.strategy}</Box>
                        <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.message}</Box>
                        <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.followers}</Box>
                        <Box d="flex" justifyContent = "center" w="100%" mt="0.5em">{currentCampaign.started}</Box>
                        <Box width="100%" display="flex" justifyContent="space-between" pr="1em" pl="1em" mt="20em">
                          <Box d="flex" flexDirection="row">
                            <Box><Button onClick={() => deleteCampaign(currentCampaign.id)}>Delete Campaign</Button></Box>
                            <Box ml="1em"><Button onClick={() => startCampaign(currentCampaign.id)}>Resume</Button></Box>
                            <Box ml="1em"><Button onClick={() => stopCampaign(currentCampaign.id)}>Pause</Button></Box>
                          </Box>
                        </Box>
                      </Box> : '' }
                  </Box>)
                }
              </Box>  
            </Box>
            }
          </Box>
      </Box>
      </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);