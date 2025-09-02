import { apiLink } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import Sppiner from '@/Components/Spiner';
import { useEffect, useState } from 'react';

export default function DeActiveUser({
  setDeActivateUser,
  setIsAuthenticated,
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setModelOpen(true);
  }, []);

  function ClosePopUp() {
    setModelOpen(false);

    setTimeout(() => {
      setDeActivateUser(false);
    }, [1000]);
  }

  function logOutUserAfter() {
    setModelOpen(false);
    sessionStorage.removeItem('cookies');

    setTimeout(() => {
      setDeActivateUser(false);
      setIsAuthenticated(false);
    }, [1000]);
  }

  async function DeActiveAccount() {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiLink}/user/deleteUser`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${sessionStorage.getItem('cookies')}`,
          },
        }
      );

      console.log(response);
      if (!response.ok) {
        const errorResponse = await response.json();
        setLoading(false);

        setFailed(true);
        setResponse(errorResponse.message);
        throw new Error(errorResponse.message);
      } else {
        const data = response.json();
        setLoading(false);

        setResponse(data.message);
        logOutUserAfter();
        setFailed(false);
      }
    } catch (err) {
      setLoading(false);
      setFailed(false);
      setResponse('Something went wrong ', err.message);
      throw new Error('Something went wrong');
    }
  }

  return (
    <div
      className={`absolute flex justify-center items-center mt-40 h-2/5 p-10 w-2/5 ${
        modelOpen ? 'scale-100' : 'scale-0'
      } transition duration-500 ease-in-out max-sm:w-[450px]`}
    >
      <div className="w-full h-full rounded-[50px] bg-gradient-to-t from-amber-50 via-amber-500 to-amber-50">
        {!loading ? (
          <div className="flex flex-col justify-center items-center h-full">
            <div className=" mt-10 flex items-center border-b-2 ">
              <div className="flex flex-col font-bold">
                <span>Deactivate Account?</span>
                <span className="text-slate-500">
                  You can log back in to reactivate your account at any time!
                </span>
              </div>
            </div>
            <div
              className={`flex w-full mt-5 p-2 ${
                failed ? 'text-red-500' : 'text-white'
              }`}
            >
              <span>{response}</span>
            </div>
            <div className="flex gap-2 justify-center items-center h-full">
              <U_Button b_name={'Yes'} b_function={DeActiveAccount} />
              <U_Button b_name={'Cancel'} b_function={ClosePopUp} />
            </div>
          </div>
        ) : (
          <Sppiner Size="p-20" />
        )}
      </div>
    </div>
  );
}
