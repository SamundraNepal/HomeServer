import { apiLink, GetLogedUserData } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import U_input from '@/Components/Input';
import { useEffect, useState } from 'react';
import UploadFilesNotifications from './uploadingFiles';
import { TotalSize } from './storage';

export default function UploadFiles({
  setUploadBox,
  Type,
  albumName,
  viewAlbums,
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [progress, setProgress] = useState(0); // Track upload progress
  const [progressTrue, setProgressTrue] = useState(false);
  const userCurrentSize = TotalSize();
  const [message, setMessage] = useState('');
  const [storage, setStorage] = useState('');

  useEffect(() => {
    setModelOpen(true);
    async function getStorage() {
      const storageData = await GetLogedUserData();
      setStorage(storageData.message.getUser?.storage);
    }

    getStorage();
  }, []);

  function ClosePopUp() {
    setModelOpen(false);

    setTimeout(() => {
      setUploadBox(false);
    }, [1000]);
  }

  async function UploadImagesandVideos() {
    let totalMb = 0;
    for (let index = 0; index < uploadFiles.length; index++) {
      const sizeCheck = uploadFiles[index].size;
      const convertToMb = (sizeCheck / 1024 / 1024).toFixed(2);
      totalMb += convertToMb / 1024;
    }

    if (Number(totalMb) >= Number(storage?.split('G')[0])) {
      setMessage('This file size exceeds the total storage');
      return console.log('Exceeds size');
    }

    if (
      Number(userCurrentSize?.split('G')[0]) >= Number(storage?.split('G')[0])
    ) {
      setMessage('Storage is Full. Contact the admin');
      return console.log('Strorage Full');
    }
    setProgressTrue(true);

    if (uploadFiles.length < 1) {
      return console.log('this is empty');
    }

   if(uploadFiles.length > 50){
      setMessage("Cannot upload files more than 50");
      console.log(message);
      return console.log('Cannot upload files more than 50');
    }


    

    let chunkSize; // 20MB per chunk
    if (Type === 'Photos') {
      chunkSize = 2 * 1024 * 1024; // 2mb
    } else {
      chunkSize = 20 * 1024 * 1024; // 5 mb
    }


    let totalProgress = 0;
    let totalChunksUploaded = 0;
    let totalChunks = 0;


    const token = sessionStorage.getItem('cookies');
    if (!token) {
      setMessage('Authentication error: No token found');
      return;
    }


    setProgressTrue(true);


    if (uploadFiles.length > 50) {
      setMessage('Cannot upload files more than 50');
      return console.log('Cannot upload files more than 50');
    }


    for (let index = 0; index < uploadFiles.length; index++) {
      totalChunks += Math.ceil(uploadFiles[index].size / chunkSize);
    }


    for (let fileIndex = 0; fileIndex < uploadFiles.length; fileIndex++) {
      const file = uploadFiles[fileIndex];


      const fileChunks = Math.ceil(file.size / chunkSize);


      for (let chunkIndex = 0; chunkIndex < fileChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);

        let fileType = file.type || 'image/heic'; // Set default if empty

        const chunk = new Blob([file.slice(start, end)], { type: fileType }); // ✅ Ensures correct MIME type


        const formData = new FormData();


        if (viewAlbums) {
          formData.append('albumName', albumName);
        }
        formData.append('chunk', chunk);
        formData.append('fileName', file.name);
        formData.append('chunkIndex', chunkIndex);
        formData.append('totalChunks', fileChunks);


        try {
     
          const data = await fetch(
            Type === 'Photos'
              ? `${apiLink}/images/upload?filename=${encodeURIComponent(file.name)}&chunkIndex=${chunkIndex}`
              : `${apiLink}/videos/upload?filename=${encodeURIComponent(file.name)}&chunkIndex=${chunkIndex}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );


          totalChunksUploaded++;
          totalProgress = Math.round((totalChunksUploaded / totalChunks) * 100);
          setProgress(totalProgress);


          if (totalProgress >= 100) {
            ClosePopUp();
          }
        } catch (err) {
          console.log(err.message);
        }
      }
    }
  }
  return (
    <div
      className={`relative flex justify-center items-center h-4/5 w-full mt-20 ${
        modelOpen ? 'scale-100' : 'scale-0'
      } transition duration-500 ease-in-out max-sm:h-2/5  max-sm:mt-40`}
    >
      <div className=" w-full h-full rounded-[50px] bg-amber-300 flex flex-col items-center justify-center border-8 border-yellow-200">
        <span className="font-bold">
          {progress > 0 ? 'Uploading ' : 'Upload'} {Type}
        </span>
        {!progressTrue ? (
          <div className="flex flex-col gap-5 justify-center items-center">
            <U_input
              Type="file"
              accept={Type === 'Photos' ? '.jpg, .jpeg, .png, .heic, .HEIC, image/heic' : 'video/*'}
              OnChange={(e) => setUploadFiles(e.target.files)}
            />
            {uploadFiles.length > 0 &&  (
              <U_Button b_name={'Upload'} b_function={UploadImagesandVideos} />
            )}{' '}
            <U_Button b_name={'Cancel'} b_function={ClosePopUp} />

            <span className="font-bold text-red-600 uppercase">{message}</span>
          </div>
        ) : (
          <div className='text-center flex flex-col justify-center items-center'>
          <span className="font-bold text-red-600 uppercase">{message}</span>
{uploadFiles.length > 50 &&        <U_Button b_name={'Cancel'} b_function={ClosePopUp} />
}
            </div>
        )}

        <UploadFilesNotifications progress={progress} />
      </div>
    </div>
  );

}
