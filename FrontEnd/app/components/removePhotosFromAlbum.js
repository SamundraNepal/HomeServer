import { apiLink, GetLogedUserData } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import { useEffect, useState } from 'react';

export default function RemovePhotosFromAlbumBox({
  setUploadBox,
  Type,
  photoToAdd,
  setIsFullScreen,
  Amount = 'Single',
  setIsSelected,
  resizeAllFiles,
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setModelOpen(true);
  }, []);

  function ClosePopUp() {
    setModelOpen(false);
    setIsSelected('');
    setTimeout(() => {
      setIsFullScreen(false);

      setUploadBox(false);
    }, [1000]);
  }

  // this is doing dual api request based on type of files that is beign uploaded.
  //e.g if the type is photos it will fetch image api path if the type is video it will fecth the video api path
  async function removeSingleImageToAlbum() {
    const videoPath = 'videos/removeVideoFromAlbum/';
    const imagePath = 'images/removeAlbumToImage/';

    try {
      const token = sessionStorage.getItem('cookies');
      const data = await fetch(
        `${apiLink}/${Type === 'Photos' ? imagePath : videoPath}${
          photoToAdd._id
        }`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.ok) {
        const error = await data.json();
        throw new Error(error.message);
      } else {
        ClosePopUp();
        resizeAllFiles();
      }
    } catch (err) {
      throw new Error('Failed to remove from the album ' + err.message);
    }
  }

  // this is doing dual api request based on type of files that is beign uploaded.
  //e.g if the type is photos it will fetch image api path if the type is video it will fecth the video api path
  async function removeManyImagesFromAlbum() {
    const videoPath = 'videos/removeVideoFromAlbum/';
    const imagePath = 'images/removeAlbumToImage/';
    try {
      const token = sessionStorage.getItem('cookies');

      const promises = photoToAdd.map(async (id) => {
        const data = await fetch(
          `${apiLink}/${Type === 'Photos' ? imagePath : videoPath}${id._id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
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
      throw new Error('Failed to remove images from the album ' + err.message);
    }
  }
  return (
    <div
      className={`relative flex justify-center items-center h-4/5 w-4/5 ${
        modelOpen ? 'scale-100' : 'scale-0'
      } transition duration-500 ease-in-out max-sm:h-full`}
    >
      <div className=" w-full h-full rounded-[50px] bg-amber-300 flex flex-col gap-4 items-center justify-center text-center border-8 border-yellow-200">
        <span className="font-bold mt-4 text-slate-500">
          Remove {Type} from the Album{' '}
        </span>
        <div className="flex flex-col gap-5 justify-center items-center">
          <U_Button
            b_name={'Remove'}
            b_function={
              Amount === 'Single'
                ? removeSingleImageToAlbum
                : removeManyImagesFromAlbum
            }
          />
          <U_Button b_name={'Cancel'} b_function={ClosePopUp} />
          <span className="font-bold text-red-600 uppercase">{message}</span>
        </div>
      </div>
    </div>
  );
}
