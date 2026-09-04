import {
  GetDeposit,
  GetInputPaymethods,
  GetOutputPaymethods,
  GetPayment,
  GetPaywayInfo,
  PostDeposit,
  PostPayment,
} from "@/api/requests";
import {localized} from "@/mocks/localized";
import {
  demoInputPaymethods,
  demoOutputPaymethods,
} from "@/mocks/paymentMethods";
import {
  createDemoDeposit,
  createDemoPayment,
  getDemoDepositQuote,
  getDemoPaymentQuote,
} from "@/mocks/transactions";

import {demoDelay} from "./utils";

export async function getInputPaymethods(): Promise<GetInputPaymethods.Response> {
  await demoDelay();

  return GetInputPaymethods.Schema.parse(demoInputPaymethods);
}

export async function getOutputPaymethods(): Promise<GetOutputPaymethods.Response> {
  await demoDelay();

  return GetOutputPaymethods.Schema.parse(demoOutputPaymethods);
}

export async function getPaywayInfoAndWarning(props: {
  info_id: number | null;
  warning_id: number | null;
}): Promise<{
  info: GetPaywayInfo.Response | null;
  warning: GetPaywayInfo.Response | null;
}> {
  await demoDelay(250);

  return {
    info:
      props.info_id === null
        ? null
        : {
            text: localized(
              "Demo mode: no real payment provider is contacted.",
            ),
          },
    warning:
      props.warning_id === null
        ? null
        : {
            text: localized(
              "Demo operation only. Do not enter real payment data.",
            ),
          },
  };
}

export async function getDeposit(
  params: GetDeposit.Params,
): Promise<GetDeposit.Response> {
  await demoDelay();

  return GetDeposit.Schema.parse(getDemoDepositQuote(params));
}

export async function postDeposit(params: {
  data: PostDeposit.BodyRequired;
  config: PostDeposit.BodyOptional;
}): Promise<PostDeposit.Response> {
  await demoDelay(700);

  return PostDeposit.Schema.parse(createDemoDeposit(params));
}

export async function getPayment(
  params: GetPayment.Params,
): Promise<GetPayment.Response> {
  await demoDelay();

  return GetPayment.Schema.parse(getDemoPaymentQuote(params));
}

export async function postPayment(params: {
  data: PostPayment.BodyRequired;
  config: PostPayment.BodyOptional;
}): Promise<PostPayment.Response> {
  await demoDelay(700);

  return PostPayment.Schema.parse(createDemoPayment(params));
}
