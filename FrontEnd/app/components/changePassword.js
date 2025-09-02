import { apiLink } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import U_input from '@/Components/Input';
import Spiner from '@/Components/Spiner';
import { useEffect, useState } from 'react';

export default function ChangePassword({ setChnagePasswordPopUp }) {
  const [modelOpen, setModelOpen] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [viewNewPassword, setNewViewPassword] = useState(false);
  const [viewConfirmPassword, setConfrimViewPassword] = useState(false);

  const [response, setResponse] = useState('');
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFromdata] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    setModelOpen(true);
  }, []);

  function ClosePopUp() {
    setModelOpen(false);

    setTimeout(() => {
      setChnagePasswordPopUp(false);
    }, [1000]);
  }

  async function submitForm(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const Response = await fetch(`${apiLink}/user/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${sessionStorage.getItem('cookies')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!Response.ok) {
        const errResponse = await Response.json();
        setLoading(false);
        setFailed(true);
        setResponse(errResponse.message);
        throw new Error('Failed to update password', errResponse.message);
      } else {
        const data = await Response.json();
        setFailed(false);
        setResponse(data.message);
        setLoading(false);
        ClosePopUp();
      }
    } catch (err) {
      setLoading(false);
      throw new Error('Something went wrong ', err.message);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFromdata((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <div
      className={`absolute flex justify-center items-center mt-20 h-3/5 p-10 w-3/5 ${
        modelOpen ? 'scale-100' : 'scale-0'
      } transition duration-500 ease-in-out max-sm:w-[450px]`}
    >
      <div className=" w-full h-full rounded-[50px] bg-gradient-to-t from-amber-100 via-amber-600 to-amber-100 ">
        {!loading ? (
          <div>
            <div className="flex justify-center font-bold">
              <h1>Change Password</h1>
            </div>
            <div className="flex flex-col mt-5 ml-10 p-5 gap-2">
              <label>Current Password</label>
              <div className="flex items-center ">
                <U_input
                  name={'currentPassword'}
                  PlaceHolder="Enter Current Password"
                  Type={`${viewPassword ? 'text' : 'Password'}`}
                  Size={'w-full'}
                  Value={formData.currentPassword}
                  OnChange={handleChange}
                />
                <button
                  onClick={(e) => setViewPassword((prev) => !prev)}
                  className="transition-transform duration-300 ease-in-out"
                >
                  <span
                    className={`inline-block text-3xl ${
                      viewPassword ? ' scale-100' : ' scale-75'
                    } transition-all duration-300`}
                  >
                    {viewPassword ? '😲' : '🫣'}
                  </span>
                </button>
              </div>

              <label>New Password</label>
              <div className="flex items-center ">
                <U_input
                  name={'newPassword'}
                  PlaceHolder="Enter New Password"
                  Type={`${viewNewPassword ? 'text' : 'Password'}`}
                  Size={'w-full'}
                  Value={formData.newPassword}
                  OnChange={handleChange}
                />
                <button
                  onClick={(e) => setNewViewPassword((prev) => !prev)}
                  className="transition-transform duration-300 ease-in-out"
                >
                  <span
                    className={`inline-block text-3xl ${
                      viewNewPassword ? ' scale-100' : ' scale-75'
                    } transition-all duration-300`}
                  >
                    {viewNewPassword ? '😲' : '🫣'}
                  </span>
                </button>
              </div>

              <label>Confirm Password</label>
              <div className="flex items-center ">
                <U_input
                  name={'confirmNewPassword'}
                  PlaceHolder="Confrim Password"
                  Type={`${viewConfirmPassword ? 'text' : 'Password'}`}
                  Size={'w-full'}
                  Value={formData.confirmNewPassword}
                  OnChange={handleChange}
                />
                <button
                  onClick={(e) => setConfrimViewPassword((prev) => !prev)}
                  className="transition-transform duration-300 ease-in-out"
                >
                  <span
                    className={`inline-block text-3xl ${
                      viewConfirmPassword ? ' scale-100' : ' scale-75'
                    } transition-all duration-300`}
                  >
                    {viewConfirmPassword ? '😲' : '🫣'}
                  </span>
                </button>
              </div>
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
