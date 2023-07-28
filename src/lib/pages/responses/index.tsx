import {
  Flex,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useColorModeValue,
  Container,
  Stack,
  Heading,
  Text,
  Box,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useState } from "react";

import React from "react";

export default function ResponsesPage({ responses }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const [sid, setSid] = useState("");

  const exportHandler = async (e) => {
    e.preventDefault();

    let form = {
      data: responses.data,
    };

    const rawResponse = await fetch(`/api/export/${sid}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    onClose();
    if (rawResponse.status == 201) {
      setShowAlertSuccess(true);
    } else {
      setShowAlertError(true);
    }
    console.log(rawResponse);
  };
  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Responses
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              responses submitted by users
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            w="100%"
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            //   p={8}
          >
            <TableContainer>
              <Table variant="simple">
                <TableCaption>
                  <Button onClick={onOpen}>Export Data</Button>
                  {showAlertSuccess && (
                    <Alert status="success">
                      <AlertIcon />
                      <AlertTitle>Done!</AlertTitle>
                      <AlertDescription>
                        Your data has been exported!
                      </AlertDescription>
                    </Alert>
                  )}
                  {showAlertError && (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertTitle>Oops!</AlertTitle>
                      <AlertDescription>
                        Something went wrong! Probably you entered wrong Sheets
                        ID or your session expired, kindly login again.
                      </AlertDescription>
                    </Alert>
                  )}
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>SNo.</Th>
                    <Th>Name</Th>
                    <Th isNumeric>Age</Th>
                    <Th>Email</Th>
                    <Th>Address</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {responses.data?.length > 0 ? (
                    responses.data.map((response, i) => (
                      <Tr key={i}>
                        <Td>{i + 1}</Td>
                        <Td>{response.name}</Td>
                        <Td>{response.yob}</Td>
                        <Td>{response.email}</Td>
                        <Td>{response.address}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7}>No Responses yet</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>{" "}
          </Box>
        </Stack>
      </Flex>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Export to Google Sheets</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Sheets ID</FormLabel>
              <Input
                ref={initialRef}
                placeholder="enter your sheets id"
                type="text"
                onChange={(e) => setSid(e.target.value)}
                name="sid"
                id="sid"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            Similarly here we can plug and play with other integrations.
            <Button colorScheme="blue" mr={3} onClick={exportHandler}>
              Export
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
