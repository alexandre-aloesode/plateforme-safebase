import useSWR, { mutate } from 'swr';
import { fetcher } from './fetcher';

export function useRegister() {
  const { data, error, mutate: swrMutate } = useSWR(null);
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

  const register = async (email, password) => {
    try {
      const result = await fetcher(`${authUrl}/register`, 'POST', { email, password });
      // Optionally, you can mutate the SWR cache or trigger any updates you need here
      swrMutate(); // This can be used to re-fetch or update data if necessary      
      return result;
    } catch (err) {        
      throw err;
    }
  };

  return { data, error, register };
}