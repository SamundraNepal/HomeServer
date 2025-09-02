import { apiLink } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import U_input from '@/Components/Input';
import Sppiner from '@/Components/Spiner';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function HandleForgotPassword({
  setMessage,
  message,
  setForgotPassword,
}) {
  const [loading, setLoading] = useState(false);
  const [Email, setEmail] = useState({ email: '' });
  const [foundAccount, setFoundAccount] = useState(false);
  const [accountDetails, setAccountDetails] = useState({});

  async function findAccount() {
    try {
      setLoading(true);
      const response = await fetch(`${apiLink}/user/forgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Email),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(error.status);
        setLoading(false);
      } else {
        const data = await response.json();
        setMessage(data.status.message);
        setAccountDetails(data.message.identifyUser);
        setLoading(false);
        setFoundAccount(true); // Set to true once account is found
      }
    } catch (err) {
      setLoading(false);
      setMessage('Something went wrong. Please try again.' || err.message);
    }
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-10 h-full w-full">
        <title>Memories/ForgotPassword</title>

        <div>
          <header className="uppercase font-bold text-white">
            <h1> Forgot Password </h1>
          </header>
        </div>
        
        {!foundAccount ? (
          <div className="w-3/5 max-sm:w-full">
            {!loading ? (
              <div className="">
                <div className="flex flex-col gap-5 justify-center items-center backdrop-blur-[20px] border-4 rounded-[10px]">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <h3 className="text-white mt-2 font-bold">Find Account </h3>
                    <U_input
                      PlaceHolder="Enter your E-mail"
                      Type="email"
                      Value={Email.value}
                      OnChange={(e) => setEmail({ email: e.target.value })}
                    />

                    <h3 className="text-red-500">{message}</h3>
                    <div className="p-5 flex gap-2 ">
                      <U_Button
                        b_name="Back"
                        b_function={(e) => setForgotPassword(false)}
                      />
                      <U_Button b_name="Find" b_function={findAccount} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Sppiner Size='p-20' />
            )}
          </div>
        ) : (
          <AccountFound
            accountDetails={accountDetails}
            setForgotPassword={setForgotPassword}
          />
        )}
      </div>
    </>
  );
}

function AccountFound({ accountDetails, setForgotPassword }) {
  const [forgotPasswordData, setForgotPasswordData] = useState({
    code: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');

  const [success, setSuccess] = useState(false);
  async function updatePassword(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        `${apiLink}/resetPassword/${forgotPasswordData.code}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(forgotPasswordData),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        setMessage(errorMessage.message);
        setLoading(false);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setMessage('Password has been changed');
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);

      throw new Error('Failed to reset the password ' || err.message);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForgotPasswordData((prevData) => ({ ...prevData, [name]: value }));
  }

  if (accountDetails === undefined) return <div>Nothing avalaibe</div>;
  return (
    <div className="backdrop-blur-[5px] border-4 text-white h-4/5 w-3/5 rounded-[10px] max-sm:w-11/12">
      <title>Memories/ResetPassword</title>

      <div>
        <div className="flex justify-end items-center items-center p-2 gap-1 w-1/5 text-white w-full">
          <div>
            <h1>
              {accountDetails.firstName} {''} {accountDetails.lastName}
            </h1>
            <h2>{accountDetails.email}</h2>
          </div>
          <div className="bg-white rounded-full">
            <Image
              className="rounded-full relative
  "
              height={50}
              width={50}
              src={accountDetails?.imageLink?.replace('}', ' ')}
              alt="user image"
            />
          </div>
        </div>
        <div className="flex justify-center h-full w-full">
          {!loading ? (
            <div className=" w-3/5 max-sm:w-4/5">
              {!success ? (
                <form
                  className="flex flex-col gap-2 justify-center max-sm:mt-20"
                  onSubmit={updatePassword}
                >
                  <label>Code</label>
                  <U_input
                    PlaceHolder="Enter Six digit code"
                    Type="number"
                    name="code"
                    Value={forgotPasswordData.code}
                    OnChange={handleChange}
                  />

                  <label>New Password</label>
                  <U_input
                    PlaceHolder="Enter New Password"
                    name="password"
                    Type="password"
                    Value={forgotPasswordData.newPassword}
                    OnChange={handleChange}
                  />

                  <label>Confirm Password</label>
                  <U_input
                    PlaceHolder="Confrim Password"
                    Type="password"
                    name="confirmPassword"
                    OnChange={handleChange}
                    Value={forgotPasswordData.confirmPassword}
                  />

                  <h3 className="text-white text-xl p-2">{message}</h3>

                  <U_Button b_name="Reset" />
                </form>
              ) : (
                <div className=" flex w-full h-[400px] items-center justify-center">
                  <h2>{message} </h2>

                  <Link href="/">
                    <U_Button
                      b_name={'Log In'}
                      b_function={(e) => setForgotPassword(false)}
                    />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Sppiner Size='p-20' />
          )}
        </div>
      </div>
    </div>
  );
}
