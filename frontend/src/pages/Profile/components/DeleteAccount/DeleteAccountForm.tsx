import {useState} from "react";
import {useTranslation} from "react-i18next";

import BottomPlate from "@/components/BottomPlate/BottomPlate";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import Input from "@/components/Input/Input";
import usePostDeleteAccount from "@/pages/Profile/hooks/usePostDeleteAccount";

interface Props {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountForm: React.FC<Props> = ({onClose}) => {
  const [reason, setReason] = useState("");

  const [error, setError] = useState("");

  const [agreement, setAgreement] = useState(false);

  const {mutateAsync: deleteAccount, isPending} = usePostDeleteAccount();

  const {t} = useTranslation();

  return (
    <BottomPlate title={t`deleting_account`} close={() => onClose(false)}>
      {close => (
        <div className="flex flex-col gap-4 p-4 pt-0">
          <p className="text-p2 font-p2 dark:text-dark-text-primary">{t`describe_reason`}</p>
          <Input
            type="text"
            textArea
            rows={1}
            value={reason}
            error={error}
            placeholder={t`describe_reason`}
            testId="profile-delete-reason-input"
            onChange={value => {
              setReason(value);
            }}
            onBlur={() => {
              setError(reason.length < 20 ? t`describe_reason_more` : "");
            }}
          />
          <label className="flex items-center gap-2">
            <Checkbox
              size="sm"
              testId="profile-delete-checkbox"
              inputProps={{
                checked: agreement,
                onChange: () => {
                  setAgreement(!agreement);
                },
              }}
            />

            <p className="text-p3 font-p3 dark:text-dark-text-primary">
              {t`sign_up_confirmation_title`}{" "}
              <a
                className="inline-block text-blue-300"
                data-testid="profile-delete-terms-link"
                href="#demo-user-agreement"
                target="_blank"
                rel="noreferrer">
                {t`sign_up_term_of_use_title`}
              </a>
            </p>
          </label>
          <Button
            size="lg"
            type="button"
            testId="profile-delete-submit-button"
            onClick={() => {
              if (reason.length > 20) {
                deleteAccount({comment: reason});
              }
            }}
            disabled={reason.length < 20 || !agreement}
            loading={isPending}
            color="primary">{t`delete_my_account`}</Button>
          <Button
            size="lg"
            type="button"
            testId="profile-delete-cancel-button"
            onClick={() => {
              close();
            }}
            color="secondary">{t`cancel_logout_label`}</Button>
        </div>
      )}
    </BottomPlate>
  );
};

export default DeleteAccountForm;
