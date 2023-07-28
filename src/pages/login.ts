import LoginPage from "../lib/pages/login";
import { getProviders, useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
