import { auth } from "@/firebase-config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import PropTypes from "prop-types";
import { toast } from "sonner";
import gIcon from '../../assets/google_g_icon.png';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Toaster } from "../ui/sonner";

SignInWithGoogle.propTypes = {
  signInSuccess: PropTypes.func.isRequired, // Ensure this prop is required
};

function SignInWithGoogle({ signInSuccess }) {
  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        localStorage.setItem("userDetails", JSON.stringify(result.user));
        toast.success("Signed in successfully");
        signInSuccess(); // Call the success callback
      }
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("Sign-in popup was closed by the user.");
        toast.error("Sign-in canceled. Please try again.");
      } else {
        console.error("Error during sign-in:", error);
        toast.error("Failed to sign in. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Toaster className="dark" position="top-right" />
      <Card className="dark sign-in-card w-max">
        <CardHeader>
          <CardTitle>Sign in with Google</CardTitle>
          <CardDescription>Sign in with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="default" className="dark" onClick={handleSignInWithGoogle}>
            <img src={gIcon} style={{ width: "30px", marginRight: "0px" }} alt="" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignInWithGoogle;
