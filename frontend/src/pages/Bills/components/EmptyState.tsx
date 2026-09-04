import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import {RegularHistory} from "@/assets/icons";
import {StatusDone} from "@/assets/img/status";
import Button from "@/components/Button/Button";
import Img from "@/components/Img/Img";
import {menuRoutes} from "@/routes";

const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  const {t} = useTranslation();

  return (
    <div
      className="flex h-full flex-grow flex-col items-center justify-center p-4 text-center"
      data-testid="bills-empty-container">
      <Img
        alt="status done"
        size="lg"
        src={StatusDone}
        data-testid="bills-empty-image"
      />
      <p
        className="mt-8 text-h3 font-h3 dark:text-dark-text-primary"
        data-testid="bills-empty-title">
        {t`bills_empty_placeholder_title`}
      </p>
      <p
        className="mb-8 mt-4 text-p1 font-p1 text-grey-500 dark:text-dark-text-secondary"
        data-testid="bills-empty-description">
        {t`bills_empty_placeholder_description`}
      </p>
      <Button
        testId="bills-empty-button"
        onClick={() => {
          navigate(menuRoutes.history, {
            state: "bills",
          });
        }}
        size="lg"
        color="white">
        <RegularHistory />
        {t`bills_empty_placeholder_button`}
      </Button>
    </div>
  );
};

export default EmptyState;
