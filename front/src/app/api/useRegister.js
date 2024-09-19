import useSWR, { mutate } from 'swr';
import { Authfetcher } from './Authfetcher';

export function useRegister() {
  const { data, error, mutate: swrMutate } = useSWR(null);

  const register = async (email, password) => {
    try {
      const result = await Authfetcher('https://127.0.0.1:8000/register', 'POST', { email, password });
      // Optionally, you can mutate the SWR cache or trigger any updates you need here
      swrMutate(); // This can be used to re-fetch or update data if necessary      
      return result;
    } catch (err) {        
      throw err;
    }
  };

  return { data, error, register };
}