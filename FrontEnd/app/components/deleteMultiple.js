import { apiLink } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import Sppiner from '@/Components/Spiner';
import { useEffect, useState } from 'react';

export default function DeleteMultipleFiles({
  setDeleteFile,
  imageDetails,
  boxHeader = 'Delete',
  dialogBox = ' You can retrive this file from the trash folder',
  choice = 'Delete',
  resizeAllDeletedFiles,
  Type = 'Photos',
}) {
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

    try {
      setLoading(true);

      const promises = imageDetails.map(async (id) => {
        const endPoint =
          Type === 'Photos'
            ? `${apiLink}/images/${
                choice === 'Delete'
                  ? 'deleteImage'
                  : choice === 'Restore'
                  ? 'restoreImage'
                  : 'hardDeleteImage'
              }/${id._id}`
            : `${apiLink}/videos/${
                choice === 'Delete'
                  ? 'deleteVideo'
                  : choice === 'Restore'
                  ? 'restoreVideo'
                  : 'hardDeleteVideo'
              }/${id._id}`;

        const method = choice === 'P_Delete' ? 'DELETE' : 'PATCH';

        return fetch(endPoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      });

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        if (!response.ok) {
          console.log('Error processing the request', response);
          setLoading(false);
        } else {
          if (choice === 'Delete') {
            resizeAllDeletedFiles();
          } else if (choice === 'Restore' || choice === 'P_Delete') {
            resizeAllDeletedFiles();
          }
          setLoading(false);
          close();
        }
      });
    } catch (err) {
      setLoading(false);
      throw new Error(err.message);
    }
  }

  return (
    <div
      className={`absolute z-50 flex justify-center items-center h-2/5 p-10 w-2/5 ${
        modelOpen ? 'scale-100' : 'scale-0'
      } transition duration-500 ease-in-out max-sm:w-full`}
    >
      <div className="w-full h-full rounded-[50px] bg-amber-300">
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
            <div className="flex gap-2 justify-center items-center h-full w-full">
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
