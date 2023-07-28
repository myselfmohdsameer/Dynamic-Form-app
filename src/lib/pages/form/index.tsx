import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import Form from "../../components/Form";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSession, signOut, SessionProvider } from "next-auth/react";

export default function FormPage() {
  const { data: session } = useSession({ required: true });

  return (
    <Flex minH={"70vh"} align={"center"} justify={"center"}>
      <Form />
    </Flex>
  );
}
