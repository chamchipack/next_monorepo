import SigninBackgroundLayout from "@/components/sign/server/SigninBackgroundLayout";
import Signin from "@/components/sign/client/Signin";

export default function Page() {
  return (
    <SigninBackgroundLayout>
      <Signin />
    </SigninBackgroundLayout>
  );
}
