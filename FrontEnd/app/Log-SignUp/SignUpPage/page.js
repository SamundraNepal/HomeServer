// ClientComponent.js
'use client';
import { apiLink } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import U_input from '@/Components/Input';
import Sppiner from '@/Components/Spiner';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaRegUser } from 'react-icons/fa';

// This makes the component a Client Component

export default function Page({ setSignUp }) {
  const [formData, setformData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  });
  const [imageData, setImageData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  function back() {
    setSignUp(false);
  }

  const HandleChange = (event) => {
    const { name, value } = event.target;

    setformData((prevData) => ({ ...prevData, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${apiLink}/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        setMessage(errorMessage.message);
        setLoading(false);
        throw new Error(errorMessage.message || 'something went wrong');
      }

      const data = await response.json();
      sessionStorage.setItem('signUpToken', data.message.token);

      setResult(true);
      setMessage('Account created successfully ' + data.message.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      setLoading(false);
      setResult(false);
    }
  }

  async function handleUploadImage(e) {
    e.preventDefault();
    const signUpToken = sessionStorage.getItem('signUpToken');

    try {
      setMessage('');
      setLoading(true);

      // Create FormData and append the image file
      const formData = new FormData();
      formData.append('photo', imageData); // Ensure 'image' matches the field name expected by your backend

      const response = await fetch(`${apiLink}/uploadImage/${signUpToken}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error('Something went wrong ' + errorMessage.message);
      }

      const data = await response.json();
      setLoading(false);
      setMessage(data.message.message);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      throw new Error('Failed to upload the image ' + err.message);
    }
  }

  return (
    <>
         <div className="flex flex-col justify-center items-center h-screen w-screen bg-cover bg-center bg-no-repeat"
         style={{backgroundImage :'url("./BackGround-Image.jpg")'}}>
          <title>Memories/SignUp</title>

          {!result ? (
            <div className="bg-white/2 backdrop-blur-[20px] rounded-lg border-4 rounded-[10px] flex justify-center  text-slate-50 bg-opacity-50 w-fit sm:w-3/5 ">
              <div className="flex flex-col w-3/5 ">
                <div>
                  <h1 className="text-xl mt-5">
                    <strong>Sign Up </strong>
                  </h1>
                </div>

             {!loading ?    <form
                  className="flex flex-col text-start"
                  onSubmit={handleSubmit}
                >
                  <p>
                    <strong>First Name</strong>
                  </p>
                  <U_input
                    PlaceHolder="Enter your Name"
                    name="firstName"
                    Value={formData.firstName}
                    OnChange={HandleChange}
                  />

                  <p>
                    <strong>Last Name</strong>
                  </p>
                  <U_input
                    PlaceHolder="Enter your Last Name"
                    name="lastName"
                    value={formData.lastName}
                    OnChange={HandleChange}
                  />

                  <p>
                    <strong>Email Address</strong>
                  </p>
                  <U_input
                    PlaceHolder="Enter your Email Address"
                    name="email"
                    Value={formData.email}
                    OnChange={HandleChange}
                    Type="email"
                  />
                  <p>
                    <strong>Password</strong>
                  </p>

                  <U_input
                    PlaceHolder="Enter your Password"
                    name="password"
                    Value={formData.password}
                    OnChange={HandleChange}
                    Type="password"
                  />

                  <p>
                    <strong>Confirm Password</strong>
                  </p>

                  <U_input
                    PlaceHolder="Confirm Password"
                    Type="password"
                    name="confirmPassword"
                    Value={formData.confirmPassword}
                    OnChange={HandleChange}
                  />

                  <p>
                    <strong>Admin Code</strong>
                    <p>If applicable</p>
                  </p>

                  <input
                    placeholder="Enter Admin Password"
                    type="adminCode"
                    name="adminCode"
                    value={formData.adminCode}
                    onChange={HandleChange}
                    className={`p-2 rounded text-black bg-slate-200  border-none outline-none focus:ring focus:ring-green-50`}
                  />

                  <div>
                    <label
                      className={`${
                        !result ? 'text-red-500' : 'text-green-400'
                      }`}
                    >
                      <strong>{message}</strong>
                    </label>
                  </div>

                  <div className="flex justify-center items-center gap-3 p-10 text-black">
                    <Link href="/">
                      <U_Button b_name={'Back'} b_function={back} />
                    </Link>

                    <div>
                      <U_Button b_name={'Create Account'} />
                    </div>
                  </div>
                </form> : 
                        <Sppiner Size='sm:p-20' />
}
              </div>
            </div>
          ) : (
            <UploadImage
              handleUploadImage={handleUploadImage}
              setImageData={setImageData}
              imageData={imageData}
              loading={loading}
              message={message}
              success={success}
              setSignUp={setSignUp}
            />
          )}
        </div>
    </>
  );
}

function UploadImage({
  handleUploadImage,
  setImageData,
  loading,
  imageData,
  message,
  success,
  setSignUp,
}) {
  return (
    <div className="rounded-[10px] w-full flex justify-center item-center">
      <form
        onSubmit={handleUploadImage}
        className=" backdrop-blur-[20px] rounded-[10px] p-20"
      >
        {!loading ? (
          <div>
            {!success ? (
              <div className="flex flex-col justify-center items-center gap-5 ">
                <strong className='text-white'>Upload Image</strong>
                {imageData === '' ? (
                  <FaRegUser className="text-6xl text-white  p-2 rounded-full" />
                ) : (
                  <Image
                    className="rounded-full object-cover"
                    src={URL.createObjectURL(imageData)}
                    height={150}
                    width={150}
                    alt="user Image"
                  />
                )}
                <U_input
                  Type="file"
                  required
                  accept="image/*"
                  OnChange={(e) => setImageData(e.target.files[0])}
                />
                <button className="bg-cyan-300 p-2 rounded-[10px] hover:bg-cyan-200 font-bold">
                  Upload
                </button>
              </div>
            ) : (
              <div className="flex flex-row justify-center gap-10 items-center w-full">
                <h3 className="text-white uppercase">{message}</h3>
                <U_Button
                  b_name={'Log In'}
                  b_function={(e) => setSignUp(false)}
                />
              </div>
            )}
          </div>
        ) : (
          <Sppiner />
        )}
      </form>
    </div>
  );
}
