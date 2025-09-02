import { IoLockClosedOutline } from 'react-icons/io5';
import { IoLockOpenOutline } from 'react-icons/io5';
import { IoMdImages } from 'react-icons/io';

import U_Button from '@/Components/Button';
import U_input from '@/Components/Input';

import { useEffect, useState } from 'react';
import { apiLink, GetLogedUserData } from '@/API/API CALLS';

export default function LockAndUnlock({ HandleViewAlbums, items }) {
  const [isLocked, setIsLocked] = useState(false);
  const [createPin, setCreatePin] = useState(false);
  const [lockedData, setLockedData] = useState([]);
  const [openLock, setOpenLock] = useState(false);
  const [removeLock, setRemoveLock] = useState(false);
  useEffect(() => {
    handleAlbumLock();
  }, []);
  useEffect(() => {
    handleLocked();
  }, [lockedData]);
  async function handleAlbumLock() {
    try {
      const data = await GetLogedUserData();
      if (!data) {
        console.log('something is wromg');
      } else {
        setLockedData(data.message.getUser.lockedAlbums);
      }
    } catch (err) {
      console.log('something is wromg ' + err.message);
    }
  }

  function handleLocked() {
    const lockedAlbums = lockedData.map((items) => items.albumName);
    const isLocked = lockedAlbums.includes(items);
    if (isLocked) {
      setIsLocked(true);
    }
  }

  function handleLocks() {
    setCreatePin(true);
  }

  function handleOpenAlbums() {
    if (!isLocked) {
      HandleViewAlbums(items);
    } else {
      setOpenLock(true);
    }
  }

  return (
    <>
      {!createPin && (
        <div className="absolute top-8 text-[30px] text-slate-500 z-20 border-2 p-2 right-4 hover:text-slate-800 max-sm:right-16">
          {isLocked ? (
            <div>
              {!openLock && (
                <IoLockClosedOutline onClick={(e) => setRemoveLock(true)} />
              )}
            </div>
          ) : (
            <IoLockOpenOutline onClick={handleLocks} />
          )}
        </div>
      )}

      <div>
        {!createPin ? (
          <div>
            {!openLock ? (
              <div>
                {!removeLock ? (
                  <div>
                    <div
                      className="bg-slate-300 flex flex-row gap-4 mt-4 rounded-[10px] ml-4 flex-wrap w-72 h-72 border-8 justify-center items-center text-8xl hover:border-amber-500"
                      onClick={handleOpenAlbums}
                    >
                      <IoMdImages className="text-amber-500" />
                    </div>
                    <span className="text-xl">{items}</span>
                  </div>
                ) : (
                  <div className="bg-slate-300 flex flex-row gap-4 mt-4 rounded-[10px] ml-4 flex-wrap w-72 h-72 border-8 justify-center items-center text-8xl hover:border-amber-500">
                    <RemovePassword
                      setRemoveLock={setRemoveLock}
                      items={items}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-300 flex flex-row gap-4 mt-4 rounded-[10px] ml-4 flex-wrap w-72 h-72 border-8 justify-center items-center text-8xl hover:border-amber-500">
                <OpenAlbum
                  setOpenLock={setOpenLock}
                  items={items}
                  HandleViewAlbums={HandleViewAlbums}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-300 flex flex-row gap-4 mt-4 rounded-[10px] ml-4 flex-wrap w-72 h-72 border-8 justify-center items-center text-8xl hover:border-amber-500">
            <SetPassword setCreatePin={setCreatePin} items={items} />
          </div>
        )}
      </div>
    </>
  );
}

function SetPassword({ setCreatePin, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isForm, submitForm] = useState({
    password: '',
    confirmPassword: '',
    albName: '',
  });

  const [message, setMessage] = useState('');
  useEffect(() => {
    submitForm((prev) => ({ ...prev, albName: items }));
    setIsOpen((prev) => !prev);
  }, []);
  function handleCancle() {
    setCreatePin((prev) => !prev);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = sessionStorage.getItem('cookies');
    try {
      const response = await fetch(`${apiLink}/user/album/addAlbumPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(isForm),
      });
      if (!response.ok) {
        const error = await response.json();
        setMessage(error.message);
      } else {
        setCreatePin(false);
        setMessage('');
      }
    } catch (err) {
      throw new Error('Failed to set the password because  ' + err.message);
    }
  }
  return (
    <div
      className={`text-lg z-20 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      } transition-all duration-500`}
    >
      <span className="font-bold mb-4">Set Password</span>
      <form
        className="flex flex-col items-center gap-2"
        onSubmit={handleSubmit}
      >
        <U_input
          PlaceHolder={'Enter Password'}
          Type={'Password'}
          OnChange={(e) =>
            submitForm((prev) => ({ ...prev, password: e.target.value }))
          }
          Value={isForm.password}
        />
        <U_input
          PlaceHolder={'Confirm Password'}
          Type={'Password'}
          OnChange={(e) =>
            submitForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
          }
          Value={isForm.confirmPassword}
        />
        <U_Button b_name={'Create'} />
        <U_Button b_name={'Cancel'} b_function={handleCancle} />
      </form>
      <div>
        <span className="text-red-500 font-bold text-sm">{message}</span>
      </div>
    </div>
  );
}

function OpenAlbum({ setOpenLock, items, HandleViewAlbums }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isForm, submitForm] = useState({
    password: '',
    albName: '',
  });

  const [message, setMessage] = useState('');
  useEffect(() => {
    submitForm((prev) => ({ ...prev, albName: items }));
    setIsOpen((prev) => !prev);
  }, []);
  function handleCancle() {
    setOpenLock((prev) => !prev);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = sessionStorage.getItem('cookies');
    try {
      const response = await fetch(`${apiLink}/user/album/openAlbumLocked`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(isForm),
      });
      if (!response.ok) {
        const error = await response.json();
        setMessage(error.message);
      } else {
        HandleViewAlbums(items);
        setMessage('Success login');
      }
    } catch (err) {
      throw new Error('Failed to set the password because  ' + err.message);
    }
  }

  return (
    <div
      className={`text-lg z-20 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      } transition-all duration-500`}
    >
      <span className="font-bold mb-4">Enter Password</span>
      <form
        className="flex flex-col items-center gap-2"
        onSubmit={handleSubmit}
      >
        <U_input
          PlaceHolder={'Enter Password'}
          Type={'Password'}
          OnChange={(e) =>
            submitForm((prev) => ({ ...prev, password: e.target.value }))
          }
          Value={isForm.password}
        />

        <U_Button b_name={'Open'} />
        <U_Button b_name={'Cancel'} b_function={handleCancle} />
      </form>
      <div>
        <span className="text-red-500 font-bold text-sm">{message}</span>
      </div>
    </div>
  );
}

function RemovePassword({ setRemoveLock, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isForm, submitForm] = useState({
    password: '',
    albName: '',
  });

  const [message, setMessage] = useState('');
  useEffect(() => {
    submitForm((prev) => ({ ...prev, albName: items }));
    setIsOpen((prev) => !prev);
  }, []);
  function handleCancle() {
    setRemoveLock((prev) => !prev);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = sessionStorage.getItem('cookies');
    try {
      const response = await fetch(`${apiLink}/user/album/RemoveAlbumLocked`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(isForm),
      });
      if (!response.ok) {
        const error = await response.json();
        setMessage(error.message);
      } else {
        setRemoveLock(false);
        setMessage('');
      }
    } catch (err) {
      throw new Error('Failed to remove the password because  ' + err.message);
    }
  }
  return (
    <div
      className={`text-lg z-20 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      } transition-all duration-500`}
    >
      <span className="font-bold mb-4">Remove Password</span>
      <form
        className="flex flex-col items-center gap-2"
        onSubmit={handleSubmit}
      >
        <U_input
          PlaceHolder={'Enter Password'}
          Type={'Password'}
          OnChange={(e) =>
            submitForm((prev) => ({ ...prev, password: e.target.value }))
          }
          Value={isForm.password}
        />

        <U_Button b_name={'Remove'} />
        <U_Button b_name={'Cancel'} b_function={handleCancle} />
      </form>
      <div>
        <span className="text-red-500 font-bold text-sm">{message}</span>
      </div>
    </div>
  );
}
