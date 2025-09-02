'use client';
import Navigation from './components/Navigation';
import '../styles/globals.css'; // Adjust the path if necessary
import UserDetails from '@/Components/UserDetails';
import { useEffect, useState } from 'react';
import LogInPage from './Log-SignUp/LogInPage/page';
import SingUpPage from './Log-SignUp/SignUpPage/page';
import { GetLogedUserData, handleAdminData } from '@/API/API CALLS';
import Sppiner from '@/Components/Spiner';
import ChangePassword from './components/changePassword';
import DeActiveUser from './components/deActiveUser';
import ChangeProfilePicture from './components/profilePicture';

import SideBarHandler from './components/sidebarHandler';
import AdminNav from './adminPage/adminNavigation';

export default function RootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  //this is used somewhere else track it
  const [changeProfilePic, setChangeProfilePic] = useState(false);
  const [changePasswordPopUp, setChnagePasswordPopUp] = useState(false);
  const [deActivateuser, setDeActivateUser] = useState(false);
  const [UserDetail, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [sideBarOpen, setSideBar] = useState(true);
  // const router = useRouter();

  useEffect(() => {
    async function getUserdata() {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const data = await GetLogedUserData();
          setUserDetails(data.message.getUser);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        throw new Error(err.message);
      }
    }
    getUserdata();
  }, [isAdmin, isAuthenticated]);

  return (
    <html lang="en">
      <body className="h-screen w-screen">
        {isAuthenticated ? (
          <div className="grid grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr] h-full w-full">
            <Header
              UserDetail={UserDetail}
              setIsAuthenticated={setIsAuthenticated}
              changePasswordPopUp={changePasswordPopUp}
              setChnagePasswordPopUp={setChnagePasswordPopUp}
              setDeActivateUser={setDeActivateUser}
              setChangeProfilePic={setChangeProfilePic}
              sideBarOpen={sideBarOpen}
              setSideBar={setSideBar}
            />

            <SideBar
              isAdmin={isAdmin}
              sideBarOpen={sideBarOpen}
              setSideBar={setSideBar}
            />

            <div className="rounded-[10px] bg-green-50 flex justify-center">
              {!loading ? (
                <main className="w-full h-full bg-gradient-to-t from-amber-100 via-amber-50 to-amber-100">
                    {children}
                </main>
              ) : (
                <div>
                  <Sppiner Size="p-10" />
                </div>
              )}
              {changePasswordPopUp && (
                <ChangePassword
                  setChnagePasswordPopUp={setChnagePasswordPopUp}
                />
              )}
              {deActivateuser && (
                <DeActiveUser
                  setDeActivateUser={setDeActivateUser}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )}

              {changeProfilePic && (
                <ChangeProfilePicture
                  setChangeProfilePic={setChangeProfilePic}
                />
              )}
            </div>

            <footer className="bg-gradient-to-r from-amber-100 via-amber-500 to-amber-100 col-span-3 p-1 rounded flex justify-center border-t-4 border-amber-500">
              <strong>MEMORIES ©</strong>
            </footer>
          </div>
        ) : (
          <BeforeAuth
            signUp={signUp}
            setSignUp={setSignUp}
            setIsAuthenticated={setIsAuthenticated}
            setIsAdmin={setIsAdmin}
          />
        )}
      </body>
    </html>
  );
}

function Header({
  UserDetail,
  setIsAuthenticated,
  changePasswordPopUp,
  setChnagePasswordPopUp,
  setDeActivateUser,
  setChangeProfilePic,
  sideBarOpen,
  setSideBar,
}) {
  return (
    <header className="bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500 col-span-3 p-5 border-b-4 border-amber-500">
      <div className="flex justify-center items-center h-4/5 w-4/5 ">
        <strong>MEMORIES</strong>
      </div>
      {/*   {!isAdmin && (
    <SearchBar placeholder="Search for Photos and Videos" />
  )}*/}

      <div className=" absolute right-4 top-2">
        <UserDetails
          UserDetail={UserDetail}
          setIsAuthenticated={setIsAuthenticated}
          changePasswordPopUp={changePasswordPopUp}
          setChnagePasswordPopUp={setChnagePasswordPopUp}
          setDeActivateUser={setDeActivateUser}
          setChangeProfilePic={setChangeProfilePic}
        />
      </div>

      <div className="absolute top-8 left-4">
        <SideBarHandler sideBarOpen={sideBarOpen} setSideBar={setSideBar} />
      </div>
    </header>
  );
}

function SideBar({ isAdmin, sideBarOpen, setSideBar }) {
  return (
    <aside
      className={`bg-gradient-to-t from-amber-100 via-amber-500 to-amber-100 col-start-1 col-span-1 ${
        sideBarOpen ? 'w-40' : 'w-4'
      } duration-500  border-r-4 border-amber-500 max-sm: ${
        sideBarOpen ? 'w-[420px]' : 'w-1'
      }`}
    >
      <strong>
        {!isAdmin && sideBarOpen && <Navigation setSideBar={setSideBar} />}
        {isAdmin && sideBarOpen && <AdminNav setSideBar={setSideBar} />}

                
      </strong>
    </aside>
  );
}

function BeforeAuth({ signUp, setSignUp, setIsAuthenticated, setIsAdmin }) {
  return (
    <div className="flex justify-center items-center h-full">
      {signUp ? (
        <SingUpPage setSignUp={setSignUp} />
      ) : (
        <LogInPage
          setIsAuthenticated={setIsAuthenticated}
          setSignUp={setSignUp}
          setIsAdmin={setIsAdmin}
        />
      )}
    </div>
  );
}
                        