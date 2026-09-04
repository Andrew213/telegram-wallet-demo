import {RegularNotificationNo} from "@/assets/icons";
import {useOpenLink} from "@/hooks";

const NotVerifiedNotification: React.FC = () => {
  const openLink = useOpenLink();

  return (
    <div className="mx-4 flex items-start gap-2 rounded-8 bg-white p-4">
      <div className="flex size-10 items-center rounded-full bg-yellow-100 p-2">
        <RegularNotificationNo className="text-yellow-300" />
      </div>
      <div>
        <p className="text-p1 font-p1">Ваш аккаунт не верифицирован</p>
        <p className="text-p3 font-p3">
          К сожалению, вам недоступно безлимитное пополнение счёта в месяц.
          Чтобы увеличить лимит и получить доступ ко всем платёжным методам,
          пройдите верификацию на нашем сайте
        </p>
        <button
          onClick={() => {
            openLink("#demo-verification");
          }}
          className="mt-[22px] rounded-4 bg-grey-200 px-4 py-[6px] text-p1 font-p1">
          Пройти верификацию
        </button>
      </div>
    </div>
  );
};

export default NotVerifiedNotification;


