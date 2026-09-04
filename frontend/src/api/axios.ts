type DemoRequestConfig = {
  data?: unknown;
  method?: string;
  params?: unknown;
  url?: string;
};

async function request(_options: DemoRequestConfig): Promise<never> {
  throw new Error(
    "Demo mode does not perform network requests. Use src/api/mock services instead.",
  );
}

export const client = {
  request,
};

export default request;
