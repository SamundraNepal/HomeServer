import { apiLink, GetLogedUserData } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import { useEffect, useState } from 'react';

export default function AddPhotosToAlbumBox({
  setUploadBox,
  Type,
  photoToAdd,
  setIsFullScreen,
  Amount = 'Single',
  setIsSelected,
  resizeAllFiles,
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState({ imageToAlbumName: '' });
  const [message, setMessage] = useState('');
  const [albumName, setAlbumNames] = useState([]);

  useEffect(() => {
    setModelOpen(true);
    async function getAlbums() {
      const data = await GetLogedUserData();
      if (Type === 'Photos') {
        setAlbumNames(data.message.getUser.photoAlbums);
      } else {
        setAlbumNames(data.message.getUser.videoAlbums);
      }
    }
    getAlbums();
  }, []);

  function ClosePopUp() {
    setModelOpen(false);
    setIsSelected('');
    const timer = setTimeout(() => {
      if (Amount === 'Single') {
        setIsFullScreen(false);
      }

      setUploadBox(false);
    }, [1000]);
  }

  // this is doing dual api request based on type of files that is beign uploaded.
  //e.g if the type is photos it will fetch image api path if the type is video it will fecth the video api path
  async function addSingleImageToAlbum() {
    const videoPath = 'videos/addVideoToAlbum/';
    const imagePath = 'images/addAlbumToImage/';
    try {
      const token = sessionStorage.getItem('cookies');
      const data = await fetch(
        `${apiLink}/${Type == 'Photos' ? imagePath : videoPath}${
          photoToAdd._id
        }`,
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
        setMessage(error.message);
        throw new Error(error.message);
      } else {
        ClosePopUp();
        resizeAllFiles();
      }
    } catch (err) {
      throw new Error('Failed to add to album ' + err.message);
    }
  }

  async function addManyImagesToAlbum() {
    const videoPath = 'videos/addVideoToAlbum/';
    const imagePath = 'images/addAlbumToImage/';
    try {
      const token = sessionStorage.getItem('cookies');

      const promises = photoToAdd.map(async (id) => {
        const data = await fetch(
          `${apiLink}/${Type == 'Photos' ? imagePath : videoPath}${id._id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(uploadFiles),
          }
        );

        return data;
      });

      const responses = await Promise.all(promises);
      responses.forEach(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          setMessage(error.message);
          throw new Error('Error processing the request');
        } else {
          ClosePopUp();
          resizeAllFiles();
        }
      });
    } catch (err) {
      throw new Error('Failed to add to album ' + err.message);
    }
  }

  return (
    <div
      className={`relative flex justify-center items-center h-4/5 w-4/5 ${
        modelOpen ? 'scale-100' : 'scale-0'
      } transition duration-500 ease-in-out max-sm:h-full`}
    >
      <div className=" w-full h-full rounded-[50px] bg-amber-300 flex flex-col gap-4 items-center justify-center border-8 border-yellow-200">
        <span className="font-bold mt-4">Add {Type} to Album </span>
        <div className="flex flex-col gap-5 justify-center items-center">
          <span className="font-sm text-slate-500">Albums Avaliable</span>
          <select
            className="rounded-full p-4 w-full text-center font-bold border-slate-500 focus:bg-slate-100 uppercase"
            onChange={(e) =>
              setUploadFiles({ imageToAlbumName: e.target.value })
            }
            value={uploadFiles.imageToAlbumName}
          >
            <option value="" disabled>
              Select an album...
            </option>
            {albumName.length > 0 &&
              albumName.map((items, index) => (
                <option key={index}>{items}</option>
              ))}
          </select>
          {albumName.length > 0 && (
            <U_Button
              b_name={'Add'}
              b_function={
                Amount != 'Many' ? addSingleImageToAlbum : addManyImagesToAlbum
              }
            />
          )}

          <U_Button b_name={'Cancel'} b_function={ClosePopUp} />
          <span className="font-bold text-red-600 uppercase">{message}</span>
        </div>
      </div>
    </div>
  );
}
