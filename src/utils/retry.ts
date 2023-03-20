export default async function retry(maxRetries: number, fn: () => Promise<any>): Promise<any> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Error: ${error}`);
      retries++;
    }
  }
  throw new Error('Max retries exceeded');
}