import ChatWindow from "@/components/ChatWindow";
import ChatWindowAdminOfficial from "@/components/ChatWindowAdminOfficial";
import ForgetPassword from "@/components/ForgetPassword";
import Signup from "@/components/Signup";

export default function chatScreen() {
  return (
    <>
      <ChatWindowAdminOfficial userId='acf63603-eb12-4851-aad1-ce2e11c95b18' userRole='admin' />
    </>
  );
}
