type CallbackFn<T> = () => T;

export function instrument<T>(
  ctx: { name: string },
  callback: CallbackFn<T>,
): T {
  return callback();
}

type CallbackAsyncFn<T> = () => Promise<T>;

export async function instrumentAsync<T>(
  ctx: { name: string },
  callback: CallbackAsyncFn<T>,
): Promise<T> {
  return callback();
}
