import { apiLink } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import U_input from '@/Components/Input';
import Spiner from '@/Components/Spiner';
import { useEffect, useState } from 'react';

export default function ChangeProfilePicture({ setChangeProfilePic }) {
  const [modelOpen, setModelOpen] = useState(false);

  const [response, setResponse] = useState('');
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFromdata] = useState('');

  useEffect(() => {
    setModelOpen(true);
  }, []);

  function ClosePopUp() {
    setModelOpen(false);

    setTimeout(() => {
      setChangeProfilePic(false);
    }, [1000]);
  }

  async function submitForm(e) {
    e.preventDefault();
    const signUpToken = sessionStorage.getItem('cookies');

    // Create FormData and append the image file
    const fdata = new FormData();
    fdata.append('photo', formData); // Ensure 'photo' matches the field name expected by your backend

    try {
      setLoading(true);
      const response = await fetch(`${apiLink}/uploadImage/${signUpToken}`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${sessionStorage.getItem('cookies')}`,
        },
        body: fdata,
      });

      if (!response.ok) {
        const errResponse = await response.json();
        setLoading(false);
        setFailed(true);

        // Make sure errResponse.message is a string
        setResponse(
          typeof errResponse.message === 'string'
            ? errResponse.message
            : 'Unknown error occurred'
        );
        throw new Error(
          'Failed to update profile picture: ' + errResponse.message
        );
      } else {
        const data = await response.json();
        setFailed(false);

        // Make sure data.message is a string
        setResponse(
          typeof data.message === 'string' ? data.message : 'Upload successful'
        );
        setLoading(false);
        ClosePopUp();
      }
    } catch (err) {
      setLoading(false);
      setResponse('Something went wrong: ' + err.message);
      console.error(err);
    }
  }

  return (
    <div
      className={`absolute flex justify-center items-center h-3/5 p-10 w-3/5 mt-40
        ${
          modelOpen ? 'scale-100' : 'scale-0'
        } transition duration-500 ease-in-out max-sm:w-[450px] max-sm:h-[450px] max-sm:mt-40`}
    >
      <div className=" w-full h-full rounded-[50px] bg-gradient-to-t from-amber-50 via-amber-500 to-amber-50 ">
        {!loading ? (
          <div>
            <div className="flex justify-center font-bold mt-4">
              <h1>Change Profile Picture</h1>
            </div>

            <div className="flex flex-col justify-center items-center mt-20 ml-10 p-5 gap-2 ">
              <U_input
                Type="file"
                required
                accept="image/*"
                OnChange={(e) => setFromdata(e.target.files[0])}
              />
            </div>

            <div className="flex p-2">
              <span
                className={`${
                  failed ? 'text-red-500' : 'text-white'
                } font-bold`}
              >
                {response}
              </span>
            </div>

            <div className="flex justify-center gap-2">
              <U_Button b_name={'Cancel'} b_function={ClosePopUp} />
              <U_Button b_name={'Update'} b_function={submitForm} />
            </div>
          </div>
        ) : (
          <div className=" h-full">
            <Spiner Size="p-20" />
          </div>
        )}
      </div>
    </div>
  );
}
