import {useTranslation} from "react-i18next";

type Props = {
  hours: number;
  minutes: number;
  seconds: number;
};
const OperationRestriction: React.FC<Props> = ({hours, minutes, seconds}) => {
  const {t} = useTranslation();

  if (hours > 0 || minutes > 0 || seconds > 0) {
    return (
      <p className="pb-4 text-center text-p4 font-p4 text-rose-300">
        {t("hasTagsLimits", {
          hours: t(`time.hours.${hours === 0 || hours > 1 ? "other" : "one"}`, {
            count: hours,
          }),
          minutes: t(
            `time.minutes.${minutes === 0 || minutes > 1 ? "other" : "one"}`,
            {count: minutes},
          ),
          seconds: t(
            `time.seconds.${seconds === 0 || seconds > 1 ? "other" : "one"}`,
            {count: seconds},
          ),
        })}
      </p>
    );
  }
  return (
    <p className="pb-4 text-center text-p4 font-p4 text-rose-300">
      {t("hasTagsLimitsWithoutDate")}
    </p>
  );
};

export default OperationRestriction;
