import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

import {RegularDelete} from "@/assets/icons";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import useGetAccount from "@/pages/hooks/useGetAccount";
import DeleteAccountForm from "@/pages/Profile/components/DeleteAccount/DeleteAccountForm";
import ProfileOption from "@/pages/Profile/components/ProfileOption";

const DeleteAccountButton: React.FC = () => {
  const [isPlateOpened, setIsPlateOpened] = useState<boolean>(false);

  const [accountIsDeleting, setAccountIsDeleting] = useState(false);

  const [token] = useCloudStorage();

  const {data: account} = useGetAccount(token);

  useEffect(() => {
    const deletedTag = account?.tags.find(el => el.name === "DELETE_USER");
    setAccountIsDeleting(!!deletedTag);
  }, [account]);

  const {t} = useTranslation();

  if (accountIsDeleting) {
    return null;
  }

  return (
    <>
      <ProfileOption
        onClick={() => {
          setIsPlateOpened(true);
        }}
        testId="profile-delete"
        title={t`delete_account_label`}
        icon={<RegularDelete />}
      />
      {isPlateOpened && <DeleteAccountForm onClose={setIsPlateOpened} />}
    </>
  );
};

export default DeleteAccountButton;
