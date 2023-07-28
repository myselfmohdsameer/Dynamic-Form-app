import { FormEvent, ReactNode, useState } from "react";
import {
  Box,
  Stack,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Text
} from "@chakra-ui/react";

import { useSession } from "next-auth/react";

export default function Form() {
  const { data: session } = useSession({ required: true });
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let form = {
      name,
      authorEmail: session?.user?.email,
      email,
      age,
      address,
    };

    const rawResponse = await fetch("/api/kafka/topic/form-saved/producer", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    setShowAlert(true);
    console.log(rawResponse);

    setAddress("");
    setAge("");
    setName("");
    setEmail("");
  };

  return (
    <Box rounded="lg" bg={useColorModeValue("white", "gray.700")} boxShadow="lg" p={8}>
      <Text>This is a sample form which pushes data to a Kafka topic.</Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <label htmlFor="name">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
          />

          <label htmlFor="email">Email</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
          />

          <label htmlFor="age">Age</label>
          <Input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            type="text"
            name="age"
            id="age"
            placeholder="Your age"
          />

          <label htmlFor="address">Address</label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            id="address"
            placeholder="Your Address"
          />

          <Button type="submit">Save</Button>
        </Stack>
      </form>

      {showAlert && (
        <Alert status="success" mt={4}>
          <AlertIcon />
          <AlertTitle>Done!</AlertTitle>
          <AlertDescription>Your form has been submitted.</AlertDescription>
        </Alert>
      )}
    </Box>
  );
}
