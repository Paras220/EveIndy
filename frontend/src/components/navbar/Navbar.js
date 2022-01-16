import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import LoginButton from "./LoginButton";
import UserProfile from "./UserProfile";

const pages = ["Blueprints", "Materials"];

export default function Navbar(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnSize = useBreakpointValue({ base: "sm", md: "md" });
  
  const NavLinks = pages.map((page) => (
    <Link as={RouterLink} to={page === "Blueprints" ? "/" : page}>
      {page}
    </Link>
  ));

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />

          <HStack spacing={8}>
            <Box>Eve Indy</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {NavLinks}
            </HStack>
          </HStack>

          <Flex alignItems={"center"}>
            <Stack direction={"row"}>
              <Button
                mt={{ base: 0, md: 0.5 }}
                size={btnSize}
                onClick={toggleColorMode}
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              {props.isAuthenticated === false ? <LoginButton /> : <UserProfile />}
            </Stack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {NavLinks}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
