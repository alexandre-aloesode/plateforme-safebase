import useSWR, { mutate } from "swr";
import { fetcher } from "./fetcher";
import { useRouter } from "next/navigation";
// import Cookies from 'js-cookie';

export function useLogin() {
  const { data, error, mutate: swrMutate } = useSWR(null);
  const router = useRouter();
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
  //   const { login: createSession } = useContext(Context);

  const login = async (email, password) => {
    try {
      const result = await fetcher(`${authUrl}/login`, "POST", { email, password });

      if (result) {
        const token = result;
        // Cookies.set('authToken', token, { expires: 7 }); // Expires in 7 days
        localStorage.setItem("authToken", token);
        // createSession(token, userData);

        // Optionally, you can mutate the SWR cache or trigger any updates you need here
        swrMutate(); // This can be used to re-fetch or update data if necessary

        router.push("/database");
      }

      return result;
    } catch (err) {
      throw err;
    }
  };

  return { data, error, login };
}
