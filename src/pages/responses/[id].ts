import ResponsesPage from "lib/pages/responses";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const rawResponse = await fetch("http://localhost:3000/api/responses", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ authorEmail: context.query.id }),
  });
  const responses = await rawResponse.json();
  return {
    props: { responses },
  };
};

export default ResponsesPage;
