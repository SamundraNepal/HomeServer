import { apiLink } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import Sppiner from '@/Components/Spiner';
import { useEffect, useState } from 'react';

export default function DeleteFiles({
  setDeleteFile,
  imageDetails,
  boxHeader = 'Delete',
  dialogBox = ' You can retrive this file from the trash folder',
  choice = 'Delete',
  resizeFiles,
  setImageChanged,
  Type = 'Photos',
}) {
  //  console.log(imageDetails?.map((items) => items._id));
  const [modelOpen, setModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setModelOpen(true);
  }, []);

  function close() {
    setDeleteFile(false);
    setModelOpen(false);
  }

  async function handleDeleteFiles() {
    const token = sessionStorage.getItem('cookies');

    let response;
    try {
      setLoading(true);
      if (Type === 'Photos') {
        response = await fetch(
          `${apiLink}/images/${
            choice === 'Delete'
              ? `deleteImage`
              : choice === 'Restore'
              ? 'restoreImage'
              : 'hardDeleteImage'
          }/${imageDetails._id}`,
          {
            method: `${choice === 'P_Delete' ? 'DELETE' : 'PATCH'}`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (Type === 'Videos') {
        response = await fetch(
          `${apiLink}/videos/${
            choice === 'Delete'
              ? `deleteVideo`
              : choice === 'Restore'
              ? 'restoreVideo'
              : 'hardDeleteVideo'
          }/${imageDetails._id}`,
          {
            method: `${choice === 'P_Delete' ? 'DELETE' : 'PATCH'}`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (!response.ok) {
        const errorMessage = await response.json();
        setLoading(false);
        throw new Error(errorMessage.message);
      } else {
        if (choice === 'Delete') {
          setImageChanged(true);
          resizeFiles();
        } else if (choice === 'Restore' || choice === 'P_Delete') {
          setImageChanged(true);
          resizeFiles();
        }
        setLoading(false);
        close();
      }
    } catch (err) {
      setLoading(false);
      throw new Error(err.message);
    }
  }

  return (
    <div
      className={`absolute z-50 flex justify-center items-center h-2/5 p-10 w-3/5  ${
        modelOpen ? 'scale-100' : 'scale-0'
      } transition duration-500 ease-in-out max-sm:w-full`}
    >
      <div className="w-full h-full rounded-[50px] bg-amber-300 flex justify-center items-center">
        {!loading ? (
          <div className="flex flex-col justify-center items-center h-full">
            <div className=" mt-10 flex items-center border-b-2 ">
              <div className="flex flex-col font-bold">
                <span className="text-red-500">
                  {boxHeader}{' '}
                  {imageDetails?.imageName || imageDetails?.viodeoName}
                </span>
                <span className="text-slate-500">{dialogBox} </span>
              </div>
            </div>
            <div
              className={`flex w-full mt-5 p-2 ${
                failed ? 'text-red-500' : 'text-white'
              }`}
            ></div>
            <div className="flex gap-2 justify-center items-center h-full w-full max-sm:w-20">
              <U_Button
                b_name={'Yes'}
                b_function={handleDeleteFiles}
                red={'true'}
              />
              <U_Button b_name={'Cancel'} b_function={close} />
            </div>
          </div>
        ) : (
          <Sppiner Size="p-20" />
        )}
      </div>
    </div>
  );
}
