import DeleteAccountButton from "@/pages/Profile/components/DeleteAccount/DeleteAccountButton";
import Language from "@/pages/Profile/components/Language/Language";

import Biometry from "./components/Biometry";
import Info from "./components/Info";
import Logout from "./components/Logout";
import Theme from "./components/Theme/Theme";

const Profile: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center bg-white px-4 py-4 dark:bg-dark-bg">
      <Info />
      <Biometry />
      <Theme />
      <Language />
      <Logout />
      <DeleteAccountButton />
    </div>
  );
};

export default Profile;
