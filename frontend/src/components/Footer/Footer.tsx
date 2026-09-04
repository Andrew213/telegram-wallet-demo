import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import {twJoin} from "tailwind-merge";

import {GetBills} from "@/api/requests";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import useGetBills from "@/pages/hooks/useGetBills";
import {menuRoutes, routes} from "@/routes";

const Footer: React.FC = () => {
  const {pathname} = useLocation();

  const [token] = useCloudStorage();

  const {t} = useTranslation();

  const {data: bills} = useGetBills(token, {
    status: GetBills.statusNameToStatusCodeMap.Waiting,
  });

  return (
    <nav className="p-4 pt-[7px]">
      <ul data-testid="footer-container" className="flex justify-center">
        {routes(t).map(({Icon, path, title}, i) => {
          const isActive = path === pathname;
          return (
            <li
              key={i}
              data-testid={`footer${path.replace(/\//g, "-")}-option`}
              className={twJoin(
                !isActive && "text-grey-400 dark:text-dark-text-tertiary",
                isActive && "dark:text-dark-text-primary",
              )}>
              <Link
                to={path}
                className={
                  "flex w-[75px] flex-col items-center justify-center gap-1"
                }>
                <div
                  className={twJoin(
                    "relative",
                    path === menuRoutes.bills &&
                      bills?.length &&
                      "before:absolute before:right-0 before:top-0 before:size-2 before:rounded-full before:bg-red-300 dark:before:bg-dark-red-text",
                  )}>
                  <Icon />
                </div>
                <span className="max-w-20 truncate text-p4">{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Footer;
