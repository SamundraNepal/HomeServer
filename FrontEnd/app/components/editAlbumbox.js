import { apiLink, GetLogedUserData } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import U_input from '@/Components/Input';
import Sppiner from '@/Components/Spiner';
import { useEffect, useState } from 'react';

export default function EditAlbumBox({
  setUploadBox,
  Type,
  setAlbumName,
  prevAName,
  setViewAlbums,
  setPhotoAlbums,
  photoAlbums,
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState({
    albumName: '',
    prevAlnumName: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setModelOpen(true);
  }, []);

  useEffect(() => {
    setUploadFiles((prevState) => ({
      ...prevState,
      prevAlnumName: prevAName,
    }));
  }, [prevAName]);

  function rezizeTheAlbum() {
    const filterAlbum = photoAlbums.filter((albums) => albums != prevAName);
    setPhotoAlbums(filterAlbum);
  }

  function ClosePopUp() {
    setModelOpen(false);

    setTimeout(() => {
      setUploadBox(false);
    }, [1000]);
  }

  async function updateAlbum() {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('cookies');
      const data = await fetch(
        `${apiLink}/user/updateAlbum/${Type === 'Photo' ? 'photo' : 'video'}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(uploadFiles),
        }
      );

      if (!data.ok) {
        const error = await data.json();
        setIsLoading(false);

        throw new Error(error.message);
      } else {
        setAlbumName('');
        setIsLoading(false);
        ClosePopUp();
      }
    } catch (err) {
      throw new Error('Failed to create album' + err.message);
    }
  }

  async function deleteAlbum() {
    console.log(Type);
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('cookies');
      const data = await fetch(
        `${apiLink}/user/deleteAlbum/${Type === 'Photo' ? 'photo' : 'video'}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(uploadFiles),
        }
      );

      if (!data.ok) {
        const error = await data.json();
        setIsLoading(false);
        throw new Error('failed to delete the album beacuse ' + error.message);
      } else {
        setAlbumName(updateAlbum?.albumName);
        rezizeTheAlbum();
        setViewAlbums(false);
        setIsLoading(false);
        ClosePopUp();
      }
    } catch (err) {
      throw new Error('Failed to delete the album because ' + err.message);
    }
  }

  return (
    <div
      className={`relative flex justify-center items-center h-4/5 w-4/5 ${
        modelOpen ? 'scale-100' : 'scale-0'
      } transition duration-500 ease-in-out max-sm:h-4/5 max-sm:w-full`}
    >
      {!isLoading ? (
        <div className=" w-full h-full rounded-[50px] bg-amber-300 flex flex-col gap-4 items-center justify-center border-8 border-yellow-200">
          <span className="font-bold">Edit {Type} Album </span>
          <div className="flex flex-col gap-5 justify-center items-center">
            <U_input
              Type="text"
              PlaceHolder={'Name of the Album'}
              OnChange={(e) =>
                setUploadFiles((prevState) => ({
                  ...prevState,
                  albumName: e.target.value,
                }))
              }
              value={uploadFiles.albumName}
            />

            <U_Button b_name={'Update'} b_function={updateAlbum} />
            <U_Button b_name={'Delete'} b_function={deleteAlbum} />
            <U_Button b_name={'Cancel'} b_function={ClosePopUp} />

            <span className="font-bold text-red-600 uppercase">{message}</span>
          </div>
          <span className="text-slate-500 ml-2 text-bold">
            Note: Delete will delete all the files within the album
          </span>
        </div>
      ) : (
        <Sppiner Size="p-20" />
      )}
    </div>
  );
}
