import {
  getAlbumImages,
  getAlbumVideos,
  GetLogedUserData,
  getStorageSize,
  loadImages,
  loadTrashImages,
  loadTrashVideos,
  loadVideos,
} from '@/API/API CALLS';
import { useEffect, useState } from 'react';
import { TiCloudStorageOutline } from 'react-icons/ti';

export const TotalSize = () => {
  const [sizes, setSizes] = useState('');

  useEffect(() => {
    async function getAllFileSizes() {
      try {

        const size = await getStorageSize();

        const totalSizes = (
          (size.message?.totalSize || 0) +
          (size.message?.totalSizeVideo || 0)).toFixed(2);

        // Convert to GB if larger than 100MB
        if (totalSizes > 100) {
          const gbSize = (totalSizes / 1024).toFixed(2);
          setSizes(gbSize + 'GB');
        } else {
          setSizes((totalSizes || 0) + 'MB');
        }
      } catch (err) {
        console.error('Failed to get the size data', err);
        setSizes('Error');
      }
    }

    getAllFileSizes();
  }, []);

  return sizes;
};

export default function StorageTotal() {
  const size = TotalSize();
  const [tSize, setTotalSize] = useState('');

  useEffect(() => {
    async function getStorageData() {
      try {
        const storage = await GetLogedUserData();
        setTotalSize(storage.message.getUser.storage);
      } catch (err) {
        console.log('failed to get the storage' + err.message);
      }
    }

    getStorageData(tSize, size);
  }, []);


  return (
    <div className="flex flex-col justify-center items-center border-4 rounded-[10px] border-amber-500 bg-slate-50">
      <div className="flex">
        <TiCloudStorageOutline className="text-5xl" />
      </div>
      <span className="text-black font-sm ">Storage:</span>
      <span className="text-black font-sm ">
        {size}/{tSize}
      </span>
    </div>
  );
}
