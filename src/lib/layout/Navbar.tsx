import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  Image,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useSession, signOut, SessionProvider } from "next-auth/react";

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "#101C4C")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {colorMode === "light" ? (
            <Image
              alt={"Logo"}
              h={"1.2rem"}
              src={"/images/atlan-collect-blue.svg"}
              onClick={() => router.push("/")}
            />
          ) : (
            <Image
              alt={"Logo"}
              h={"1.2rem"}
              src={"/images/logo-white.png"}
              onClick={() => router.push("/")}
            />
          )}
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              {!session && (
                <>
                  <Button
                    variant={"solid"}
                    colorScheme={"blue"}
                    // size={"m"}
                    mr={4}
                    leftIcon={<AddIcon />}
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>
                </>
              )}
              {session && (
                <>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      <Avatar size={"sm"} src={session.user?.image!} />
                    </MenuButton>
                    <MenuList alignItems={"center"}>
                      <br />
                      <Center>
                        <Avatar size={"2xl"} src={session.user?.image!} />
                      </Center>
                      <br />
                      <Center>
                        <p>Welcome, {session.user?.name}</p>
                      </Center>
                      <br />
                      <MenuDivider />
                      <MenuItem
                        onClick={() =>
                          router.push(`/responses/${session.user?.email}`)
                        }
                      >
                        My Responses
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          signOut({ callbackUrl: "http://localhost:3000" })
                        }
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </>
              )}
              console.log(session)
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
