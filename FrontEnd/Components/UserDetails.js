import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CiUser } from "react-icons/ci";

export default function UserDetails({
  UserDetail,
  setIsAuthenticated,
  setChnagePasswordPopUp,
  setDeActivateUser,
  setChangeProfilePic,
}) {
  const [userSettings, setUserSettings] = useState(false);
  const { firstName, lastName, email, imageLink } = UserDetail;
  const [loading, setLoading] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  let newImageLink;

  if (imageLink !== undefined) {
    newImageLink = imageLink.replace('}', '');
  }

  useEffect(() => {
    setLoading(false);
    setOpenModel(true);
  }, []);

  function openUserSettings() {
    setUserSettings((prevState) => !prevState);
  }

  function logOutUser() {
    sessionStorage.removeItem('cookies');
    setIsAuthenticated(false);
  }

  function ChangePassword() {
    setChnagePasswordPopUp(true);
    setUserSettings(false);
  }

  function ChangeProfile() {
    setChangeProfilePic(true);
    setUserSettings(false);
  }

  function DeActiveUser() {
    setDeActivateUser(true);
    setUserSettings(false);
  }

  return (
    <>
      {!loading ? (
        <div className={`relative z-50`}>
          <div className="flex gap-1 justify-center items-center">
           {imageLink ? <button onClick={openUserSettings}>
              <Image
                className="rounded-full object-contain border-2 border-amber-900"
                src={newImageLink} // Replace backslashes with forward slashes
                width={50}
                height={50}
                alt="user image"
              />
            </button> : <CiUser />          }

            <h3>{firstName}</h3>
          </div>

          {userSettings && (
            <div className="absolute right-0 p-3 scale-100 duration-300">
              <div
                className={`bg-gradient-to-t from-amber-200 via-amber-500 to-amber-200 h-[500px] w-80 rounded-[20px] border-[5px] border-white ${
                  openModel ? '' : 'scale-0'
                }`}
              >
                <div className="flex flex-col justify-center items-center">
                  <h3 className="mt-1">{email}</h3>
                  {newImageLink && (
                    <div>
                      <Image
                        className="rounded-full object-cover mt-8 border-4 border-amber-500"
                        src={newImageLink} // Replace backslashes with forward slashes
                        width={45}
                        height={45}
                        alt="user image"
                      />
                    </div>
                  )}

                  <h3>{firstName + ' ' + lastName}</h3>
                </div>

                <ul className="absolute mt-5 left-8 flex flex-col gap-3 items-center text-center h-72 w-72 justify-center bg-slate-200 border-[2px] border-white  text-xl rounded-[15px]">
                  <div className="rounded w-full">
                    <h3 className="mt-1 ">Settings</h3>

                    <li className="border-b border-gray-300 w-full py-2">
                      <button
                        className="hover:bg-slate-100 w-full h-10 rounded-full"
                        onClick={ChangeProfile}
                      >
                        Update Picture
                      </button>
                    </li>

                    <li className="border-b border-gray-300 w-full py-2">
                      <button
                        className="hover:bg-slate-100 w-full h-10 rounded-full"
                        onClick={ChangePassword}
                      >
                        Update Password
                      </button>
                    </li>

                    <li className="border-b border-gray-300 w-full py-2">
                      <button
                        className="hover:bg-slate-100 w-full h-10 rounded-full"
                        onClick={DeActiveUser}
                      >
                        Deactivate Account
                      </button>
                    </li>

                    <li className="border-b border-gray-300 w-full py-2">
                      <button
                        className="hover:bg-slate-100 w-full h-10 rounded-full"
                        onClick={logOutUser}
                      >
                        Log Out
                      </button>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
