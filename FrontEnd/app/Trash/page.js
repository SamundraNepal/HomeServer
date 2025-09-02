'use client';
import { loadTrashImages, loadTrashVideos } from '@/API/API CALLS';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineDelete } from 'react-icons/md';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';

import Sppiner from '@/Components/Spiner';

import FullScreen from '../components/fullScreenMode';
import TrashFilesVideo from '../components/trashFileVideo';
import DeleteRestoreFiles from '../components/deleteRestore';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [viewImageFullScreen, setViewImageFullScreen] = useState({});
  const [totalFiles, setTotalFiles] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isSelected, setIsSelected] = useState([]);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [Type, setType] = useState('Delete');

  useEffect(() => {
    async function getImages() {
      const data = await loadTrashImages();
      const vData = await loadTrashVideos();

      const combineData = [
        ...data.message.deleteImages,
        ...vData.message.deleteVideos,
      ];

      setTotalFiles(combineData);

      setLoading(false);
    }
    getImages();
  }, []);

  function resizeFiles() {
    const updatedFiles = [...totalFiles];
    updatedFiles.splice(currentIndex, 1);
    setTotalFiles(updatedFiles);
    setIsFullScreen(false);
  }

  function viewImage(items, index) {
    setCurrentIndex(index);
    setViewImageFullScreen(items);
    setIsFullScreen(true);
    setIsSelected([]);
  }

  function viewVideos(items, index) {
    setCurrentIndex(index);
    setViewImageFullScreen(items);
    setIsSelected([]);
    setIsFullScreen(true);
  }

  function handleSelectedFiles(currentFile) {
    // Get the selected file data
    const selectedFile = totalFiles[currentFile];

    setIsSelected((prevData) => {
      // Check if the file is already in the state
      const alreadySelected = prevData.some((item) => item === selectedFile);

      if (!alreadySelected) {
        // Add the new file to the state if it's not selected
        return [...prevData, selectedFile];
      } else {
        // Remove the duplicate file if it already exists in the state
        return prevData.filter((item) => item !== selectedFile);
      }
    });
  }

  function changeType(type) {
    if (type === 'Restore') {
      setType('Restore');
    } else {
      setType('Delete');
    }
    setIsDeleteAll(true);
  }

  function resizeAllDeletedFiles() {
    const updatedFiles = [...isSelected];
    const totalFile = [...totalFiles];

    const newFiles = totalFile.filter(
      (items) => !updatedFiles.some((sEl) => items._id === sEl._id)
    );
    setTotalFiles(newFiles);
    setIsSelected([]);
  }

  return (
    <>
      {!loading ? (
        <div className="h-full w-full">
          {isDeleteAll && (
            <div className="absolute w-4/5 h-4/5 flex justify-center items-center">
              <DeleteRestoreFiles
                resizeAllDeletedFiles={resizeAllDeletedFiles}
                Type={Type}
                setDeleteFile={setIsDeleteAll}
                imageDetails={isSelected}
                boxHeader={Type === 'Restore' ? 'Restore' : 'Delete'}
                choice={Type === 'Restore' ? 'Restore' : 'P_Delete'}
                dialogBox={
                  Type === 'Restore'
                    ? 'These files will be restored'
                    : 'These files will be permanently deleted'
                }
              />
            </div>
          )}
          {!isFullScreen ? (
            <div>
              {/* Header with gradient background */}
              <div className="p-4 border-b-2 border-amber-800 bg-gradient-to-r from-amber-50 via-amber-500 to-amber-50">
                <div className="flex justify-between items-center">
                  {isSelected.length > 0 && (
                    <div className="flex flex-row gap-4 text-slate-900 max-sm:flex-row">
                      <span className="font-bold">
                        Selected : {isSelected.length}
                      </span>
                      <div
                        className="text-4xl cursor-pointer hover:text-slate-100"
                        onClick={() => setIsDeleteAll(true)}
                      >
                        <MdOutlineDelete />
                      </div>

                      <div
                        className="text-4xl cursor-pointer hover:text-slate-100"
                        onClick={() => changeType('Restore')}
                      >
                        <MdOutlineSettingsBackupRestore />
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <div className="uppercase font-bold text-xl text-center flex-grow">
                    <span>Trash 🗑️</span>
                  </div>
                </div>
              </div>
              <div className="h-full w-full">
                {totalFiles.length > 0 ? (
                  <div
                    key={1}
                    className="h-[650px] w-full overflow-y-auto grid grid-cols-6 gap-2 p-2 max-sm:grid-cols-2 max-sm:h-[700px]"
                  >
                    {/* Combine video and image files */}
                    {totalFiles.slice(0,15).map((item, index) => (
                      <div key={index}>
                        <TrashFilesVideo
                          index={index}
                          item={item}
                          viewVideos={viewVideos}
                          viewImage={viewImage}
                          handleSelectedFiles={handleSelectedFiles}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className=" flex justify-center items-center   h-[600px] text-slate-300 text-6xl uppercase max-sm:text-2xl">
                    <span className="-rotate-45">Nothing available</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
              <FullScreen
                setIsFullScreen={setIsFullScreen}
                currentIndex={currentIndex}
                filesData={totalFiles}
                setCurrentIndex={setCurrentIndex}
                resizeFiles={resizeFiles}
                viewImageFullScreen={viewImageFullScreen}
              />
            </div>
          )}
        </div>
      ) : (
        <Sppiner Size="p-20" />
      )}
    </>
  );
}
