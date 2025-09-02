import { apiLink, GetLogedUserData } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import U_input from '@/Components/Input';
import { useEffect, useState } from 'react';

export default function AlbumBox({ setUploadBox, Type }) {
  const [modelOpen, setModelOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState({ albumName: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    setModelOpen(true);
  }, []);

  function ClosePopUp() {
    setModelOpen(false);

    setTimeout(() => {
      setUploadBox(false);
    }, [1000]);
  }

  async function createAlbum() {
    try {
      const token = sessionStorage.getItem('cookies');

      const data = await fetch(`${apiLink}/user/addAlbum/${Type}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(uploadFiles),
      });

      if (!data.ok) {
        const error = await data.json();
        throw new Error(error.message);
      } else {
        ClosePopUp();
      }
    } catch (err) {
      throw new Error('Failed to create album' + err.message);
    }
  }

  return (
    <div
      className={`relative flex justify-center items-center h-4/5 w-4/5 mb-40 ${
        modelOpen ? 'scale-100' : 'scale-0'
      } transition duration-500 ease-in-out max-sm:h-full w-full max-sm:mt-40`}
    >
      <div className=" w-full h-full rounded-[50px] bg-amber-300 flex flex-col gap-4 items-center justify-center border-8 border-yellow-200">
        <span className="font-bold">Create {Type} Album </span>
        <div className="flex flex-col gap-5 justify-center items-center">
          <U_input
            Type="text"
            PlaceHolder={'Name of the Album'}
            OnChange={(e) => setUploadFiles({ albumName: e.target.value })}
            value={uploadFiles.albumName}
          />

          <U_Button b_name={'Create'} b_function={createAlbum} />

          <U_Button b_name={'Cancel'} b_function={ClosePopUp} />
          <span className="font-bold text-red-600 uppercase">{message}</span>
        </div>
      </div>
    </div>
  );
}
