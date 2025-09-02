import Image from 'next/image';
import DeleteFiles from './deleteFile';
import { useEffect, useState } from 'react';
import { CiCircleInfo, CiCircleChevLeft } from 'react-icons/ci';
import { MdOutlineDelete } from 'react-icons/md';

import { MdOutlineSettingsBackupRestore } from 'react-icons/md';
import { FaChevronRight } from 'react-icons/fa6';
import dynamic from 'next/dynamic';
import { base64Char } from '@/API/API CALLS';
// Dynamically import the VideoMapLocation component without SSR
const VideoMapLocation = dynamic(() => import('./videoMap'), {
  ssr: false,
});

const MapLocation = dynamic(() => import('./Maps'), {
  ssr: false,
});

export default function FullScreen({
  setIsFullScreen,
  currentIndex,
  filesData,
  setCurrentIndex,
  resizeFiles,
}) {
  const [imageDetails, setImageDetails] = useState({});
  const [details, setDetails] = useState(false);
  const [barAnimation, setBarAnimation] = useState(false);
  const [openAnim, setOpenAnim] = useState(false);
  const [deleteFile, setDeleteFile] = useState(false);
  const [restoreFile, setRestoreFile] = useState(false);

  const [imageChanged, setImageChanged] = useState(false);
  const [slider, setSlider] = useState(true);
  const [sliderL, setSliderL] = useState(true);
  //setting the image based on index
  useEffect(() => {
    setImageDetails(filesData[currentIndex]);
    // this adds images fade in and out effect
    setTimeout(() => {
      if (imageChanged) {
        setImageChanged(false);
      }
    }, 200);
    if (!openAnim) {
      setOpenAnim(true);
    }
  }, [currentIndex]);

  function openDetailPage() {
    if (!details) {
      setDetails(true);

      setTimeout(() => {
        setBarAnimation((prev) => !prev);
      }, 300);
    } else {
      setBarAnimation((prev) => !prev);

      setTimeout(() => {
        setDetails((prev) => !prev);
      }, 300);
    }
  }

  function imageCarasouleForward() {
    setImageChanged(true);
    setSlider(false);
    setTimeout(() => {
      if (currentIndex < filesData.length - 1) {
        setCurrentIndex((cur) => cur + 1);
      }
      setSlider(true);
      setImageChanged(false);
    }, 1000);
  }

  function imageCarasouleBackward() {
    setImageChanged(true);
    setSliderL(false);

    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex((cur) => cur - 1);
      }
      setImageChanged(false);
      setSliderL(true);
    }, 1000);
  }

  function close() {
    setDetails(false);
    setOpenAnim(false);
    setBarAnimation(false);

    setTimeout(() => {
      setIsFullScreen(false);
    }, 500);
  }

  return (
    <div
      className={`w-full h-full transition duration-200 ${
        openAnim ? 'scale-100' : 'scale-0'
      }`}
    >
      <div className="w-full h-full bg-black flex transition-all duration-300">
        {details ? (
          <div className="flex items-start max-sm:z-50 w-full h-full ">
            <div
              className={`text-black bg-slate-50 p-1 h-full rounded-[10px] gap-4 border-r-8 border-yellow-600 transition-transform duration-500 ease-in-out ${
                barAnimation ? 'scale-100' : 'scale-0'
              } max-sm:w-[410px] bg-opacity-80 z-20`}
            >
              <div className="flex flex-col gap-5">
                <div>
                  <button
                    className="text-6xl flex justify-center hover:text-slate-500"
                    onClick={openDetailPage}
                  >
                    <CiCircleChevLeft />
                  </button>
                </div>
                <div className="flex flex-col mt-5 gap-4 ">
                  <span className="font-bold border-b-4 border-yellow-200">
                    Details
                  </span>
                  <span>
                    Name : {imageDetails?.imageName || imageDetails?.viodeoName}
                  </span>
                  <span>Back Up Date :{imageDetails?.backUpDate} </span>
                  <span>Original Date: {imageDetails?.dateTimeOriginal}</span>
                  <span>
                    Size :
                    {imageDetails?.imageSize || imageDetails?.videoFileSize} MB
                  </span>
                  {imageDetails.videoDuration && (
                    <span>Duration : {imageDetails?.videoDuration} sec</span>
                  )}
                  {imageDetails.make != 'Missing' && (
                    <span>Make :{imageDetails?.make} </span>
                  )}
                  {imageDetails.model != 'Missing' && (
                    <span>Model :{imageDetails?.model} </span>
                  )}
                </div>

                <div className="flex flex-col h-full w-full">
                  <span className="font-bold border-b-4 border-yellow-200">
                    Location
                  </span>
                  <div className="h-full w-full rounded-[10px]">
                    {!imageDetails?.viodeoName ? (
                      <MapLocation
                        latRef={imageDetails.gPSLatitudeRef}
                        lanRef={imageDetails.gPSLongitudeRef}
                        latCod={imageDetails.gPSLatitude}
                        lanCod={imageDetails.gPSLongitude}
                      />
                    ) : (
                      <VideoMapLocation imageDetails={imageDetails} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute flex items-center justify-center gap-5 mt-1 p-2 max-sm:absolute w-full z-10">
            <div className="flex bg-slate-500 rounded-[10px] border-2 text-slate-50 w-full justify-center bg-opacity-20">
              <button
                className="text-6xl flex justify-center hover:text-slate-500"
                onClick={close}
              >
                <CiCircleChevLeft />
              </button>
              <button
                className="text-6xl flex justify-center hover:text-slate-500"
                onClick={openDetailPage}
              >
                <CiCircleInfo />
              </button>

              <button
                className="text-6xl flex justify-center hover:text-slate-500"
                onClick={(e) => setRestoreFile(true)}
              >
                <MdOutlineSettingsBackupRestore />
              </button>

              <button
                className="text-6xl flex justify-center hover:text-slate-500"
                onClick={(e) => setDeleteFile(true)}
              >
                <MdOutlineDelete />
              </button>
            </div>
          </div>
        )}
        <div className="h-full w-full flex flex-row">
          {!details && (
            <div className="h-full w-1/5 flex items-center">
              <button
                className="text-white text-6xl rotate-180 hover:text-slate-500 z-10 h-1/5"
                onClick={(e) => imageCarasouleBackward()}
              >
                {sliderL && <FaChevronRight />}
              </button>
            </div>
          )}

          <div className=" h-full w-full flex justify-center">
            {(deleteFile || restoreFile) && imageDetails?.viodeoName && (
              <div className=" w-full h-full flex items-center justify-center">
                <DeleteFiles
                  Type={'Videos'} //this is set like this cuz depending on the type of media it does works
                  choice={restoreFile ? 'Restore' : 'P_Delete'}
                  imageDetails={imageDetails}
                  setDeleteFile={setDeleteFile}
                  boxHeader={restoreFile ? 'Restore' : 'Delete'}
                  dialogBox={
                    restoreFile
                      ? 'This file will be restored'
                      : 'This file will be permanently deleted'
                  }
                  resizeFiles={resizeFiles}
                  setImageChanged={setImageChanged}
                />
              </div>
            )}

            {imageDetails?.viodeoName && (
              <div className="h-full flex justify-center absolute max-sm:absolute">
                <video
                  src={imageDetails?.videoURL || ''}
                  alt={'video playing'}
                  preload="auto"
                  controls
                  autoPlay
                  fill
                  className={`object-contain transition-opacity duration-500 ${
                    imageChanged ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </div>
            )}

            {(deleteFile || restoreFile) && !imageDetails?.viodeoName && (
              <div className=" w-full h-full flex items-center justify-center">
                <DeleteFiles
                  choice={restoreFile ? 'Restore' : 'P_Delete'}
                  imageDetails={imageDetails}
                  setDeleteFile={setDeleteFile}
                  boxHeader={restoreFile ? 'Restore' : 'Delete'}
                  dialogBox={
                    restoreFile
                      ? 'This file will be restored'
                      : 'This file will be permanently deleted'
                  }
                  resizeFiles={resizeFiles}
                  setImageChanged={setImageChanged}
                />
              </div>
            )}

            {!imageDetails.viodeoName && imageDetails?.imageURL && (
              <Image
                src={imageDetails?.imageURL}               
                alt={'Image'}
                fill
                className={`object-contain transition-opacity duration-500 ${
                  imageChanged ? 'opacity-0' : 'opacity-100'
                }`}
              />
            )}
          </div>

          {!details && (
            <div className=" z-10 h-full w-1/5 flex">
              <button
                className="text-white text-6xl  hover:text-slate-500"
                onClick={(e) => imageCarasouleForward()}
              >
                {slider && <FaChevronRight />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
