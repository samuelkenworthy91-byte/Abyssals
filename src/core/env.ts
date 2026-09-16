// Environment helper — abstracts import.meta.env for TypeScript without vite types

export function isProd(): boolean {
  try {
    // @ts-ignore
    return (import.meta as any).env?.PROD === true;
  } catch {
    return false;
  }
}

export function isDev(): boolean {
  return !isProd();
}
