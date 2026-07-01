"use client";

import { CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { googleLogin } from "@/services/authApi";
import { useAuth } from "./useAuth";

export const useGoogleAuth = () => {
  const router = useRouter();
  const { login } = useAuth();

  const handleGoogleAuth = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("Google Authentication Failed");
        return;
      }

      const response = await googleLogin(
        credentialResponse.credential
      );

      login(response.user);

      toast.success(
        `Welcome ${response.user.name}! 👋`
      );

      router.replace("/dashboard");

    } catch (error: any) {
      console.error(
        "Google Auth Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ??
        "Google Authentication Failed"
      );
    }
  };

  return {
    handleGoogleAuth,
  };
};