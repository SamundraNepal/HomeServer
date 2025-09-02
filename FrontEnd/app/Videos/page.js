'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import UploadFiles from '../components/uploadFiles';
import { getAlbumVideos, GetLogedUserData, getVideosSearchFiles, loadVideos } from '@/API/API CALLS';
import { CiCircleChevLeft } from 'react-icons/ci';
import DeleteFiles from '../components/deleteFile';
import { FaChevronRight } from 'react-icons/fa6';
import Sppiner from '@/Components/Spiner';
import ViewVideo from '../components/viewVideo';
import DeleteMultipleFiles from '../components/deleteMultiple';
import dynamic from 'next/dynamic';
import { GoUpload } from 'react-icons/go';
import AlbumBox from '../components/albumbox';
import { FaRegFolder } from 'react-icons/fa';
import ViewAlbums from '../components/viewAlbums';
import { CiEdit } from 'react-icons/ci';
import { IoArrowBackSharp } from 'react-icons/io5';
import InfoPanel from '../components/infoPanel';
import AddPhotosToAlbumBox from '../components/addPhotosToAlbum';
import RemovePhotosFromAlbumBox from '../components/removePhotosFromAlbum';
import SelectedFiles from '../components/selectedFiles';
import EditAlbumBox from '../components/editAlbumbox';
import SearchBar from '@/Components/SearchBar';
import FileLoadingEffects from '../components/fileLoadEffects';

// Dynamically import the VideoMapLocation component without SSR
const VideoMapLocation = dynamic(() => import('../components/videoMap'), {
  ssr: false,
});

export default function Page() {
  const [uploadBox, setUploadBox] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filesData, setFilesdata] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexOne, setCurrentIndexOne] = useState(0);
  const [page, setPage] = useState(10);
  const [subPage, setSubPage] = useState(10);

  const [onLoadCompleteVideo, setOnLoadCompleteVideo] = useState(false);
  const [isSelected, setIsSelected] = useState([]);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [loadData, setLoaddata] = useState(false);

  const [scrollDiv, setScrollDiv] = useState();

  const [changePosition, setChangePosition] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  //for album handle
  const [createAlbum, setCreateAlbums] = useState(false);
  const [viewAlbums, setViewAlbums] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [isAlbumEdit, setIsAlbumedit] = useState(false);
  const [videoAlbums, setVideoAlbums] = useState([]);
  const [addVideosToAlbums, setAddVideosToAlbums] = useState(false);
  const [albumVideos, setAlbumVideos] = useState([]);
  const [removeVideosFromAlbum, setRemoveVideosFromAlbum] = useState(false);
  const [datas, setData] = useState([]); // this is used in  load album images this receives fetch data

  const[searchDate , setSearchDate ] = useState('');

  const data = useMemo(() => {
    return filesData.slice(0, page);
  }, [filesData, page, subPage]);

  useEffect(() => {
    setPage(5);
    setSubPage(10);
    GetloadVideos();
  }, []);

  // this needs to mount everytime to catch the div
  useEffect(() => {
    setTimeout(() => {
      setScrollDiv(document.getElementById('childDiv'));

      if (changePosition) {
        if (scrollDiv) {
          scrollDiv.scrollTop = scrollPosition;
          setChangePosition(false);
        }
      }
    }, 500);

    return clearTimeout();
  });

  if (scrollDiv) {
    scrollDiv?.addEventListener('scroll', (event) => {
      event.preventDefault();
      const scrollHeight = scrollDiv.scrollHeight;
      const totalHeight = scrollDiv.scrollTop + scrollDiv.clientHeight;
      setScrollPosition(scrollDiv.scrollTop);

      if (totalHeight + 1 >= scrollHeight) {
        setLoaddata(true);
      }
    });
  }

  useEffect(() => {
    if (loadData) {
      setSubPage((prev) => prev + 10);
      setPage((prev) => prev + 2);
      setLoaddata(false);
    }
  }, [loadData]);

  async function GetloadVideos() {
    try {
      setLoading(true);
      const data = await loadVideos();
      const pData = await GetLogedUserData();
      setVideoAlbums(pData.message.getUser.videoAlbums);
      const videoFiles = data.message.result;

      if (data.message.result.length > 0) {
        setFilesdata(videoFiles);
      }
    } catch (error) {
      console.error('Failed to load more videos:' + error.message);
    } finally {
      setLoading(false);
    }
  }

  function UploadImageBox() {
    setUploadBox(true);
  }

  function resizeFiles() {
    // Get the specific group from filesData
    const group = filesData[currentIndexOne];

    // Copy the fileDatas array and remove the item at currentIndex
    const updatedFileDatas = [...group.fileDatas];
    updatedFileDatas.splice(currentIndex, 1);

    // Create a new filesData array, updating only the group with modified fileDatas
    const updatedFiles = [...filesData];
    updatedFiles[currentIndexOne] = {
      ...group,
      fileDatas: updatedFileDatas,
    };

    // Update the state with the new filesData array
    setFilesdata(updatedFiles);

    // Exit full-screen mode if applicable
    setIsFullScreen(false);
  }

  function resizeAlbumFiles() {
    // Get the specific group from filesData
    const group = datas[currentIndexOne];

    // Copy the fileDatas array and remove the item at currentIndex
    const updatedFileDatas = [...group.fileDatas];
    updatedFileDatas.splice(currentIndex, 1);

    // Create a new filesData array, updating only the group with modified fileDatas
    const updatedFiles = [...datas];
    updatedFiles[currentIndexOne] = {
      ...group,
      fileDatas: updatedFileDatas,
    };

    // Update the state with the new filesData array
    setData(updatedFiles);

    // Exit full-screen mode if applicable
    setIsFullScreen(false);
  }

  function resizeAllDeletedFiles() {
    const updatedFiles = [...isSelected];
    const totalFiles = [...filesData];

    const newFiles = totalFiles.filter((items) =>
      items.fileDatas.every(
        (el) => !updatedFiles.some((sEl) => el._id === sEl._id)
      )
    );

    setFilesdata(newFiles);
    setIsSelected([]);
  }
  function viewImage(items, indexOne, index) {
    setCurrentIndexOne(indexOne);
    setCurrentIndex(index);
    setIsFullScreen(true);
    setIsSelected([]);
  }

  function handleSelectedFiles(currentFile, currentIndex) {
    // Get the selected file data
    const selectedFile = !viewAlbums
      ? filesData[currentFile]?.fileDatas[currentIndex]
      : albumVideos[currentFile]?.fileDatas[currentIndex];

    if (!selectedFile) {
      return console.log(selectedFile);
    }
    setIsSelected((prevData) => {
      // Check if the file is already in the state
      const alreadySelected =
        prevData.length > 0 && prevData.some((item) => item === selectedFile);

      if (!alreadySelected) {
        // Add the new file to the state if it's not selected
        return [...prevData, selectedFile];
      } else {
        // Remove the duplicate file if it already exists in the state
        return prevData.filter((item) => item !== selectedFile);
      }
    });
  }

  //all albums
  function CreateAlbumBox() {
    setCreateAlbums(true);
  }

  function HandleViewAlbums(name) {
    setAlbumName(name);
    setViewAlbums((prev) => !prev);
  }

  function resizeAllAlbumDeletedFiles() {
    const updatedFiles = [...isSelected];
    const totalFiles = [...albumVideos];

    const newFiles = totalFiles.filter((items) =>
      items.fileDatas.every(
        (el) => !updatedFiles.some((sEl) => el._id === sEl._id)
      )
    );
    setData(newFiles);
    setIsSelected([]);
  }


  async function handleSearchData()
  {
    try{
     const data = await getVideosSearchFiles(searchDate);
     if(data.message.result.length > 0)
     {
     setFilesdata(data.message.result);
     }
    }catch(err)
    {

console.log(err.message)

    }
  }



  
  // console.log(filesData.map((ietms) => ietms.fileDatas.length > 1));
  return (
    <>
      {!loading ? (
        <div className="h-full w-full">
          {isDeleteAll && (
            <div className="absolute w-4/5 h-4/5 flex justify-center items-center">
              <DeleteMultipleFiles
                setDeleteFile={setIsDeleteAll}
                imageDetails={isSelected}
                resizeAllDeletedFiles={
                  !viewAlbums
                    ? resizeAllDeletedFiles
                    : resizeAllAlbumDeletedFiles
                }
                Type={'Videos'}
              />
            </div>
          )}

          {addVideosToAlbums && (
            <div className="absolute w-11/12 h-4/5 z-40 flex justify-center items-center">
              <div className="flex justify-center items-center  w-3/5 h-4/5 ml-40 mt-10 max-sm:h-2/5 max-sm:w-full max-sm:ml-20">
                <AddPhotosToAlbumBox
                  setUploadBox={setAddVideosToAlbums}
                  Type="Videos"
                  Amount="Many"
                  photoToAdd={isSelected}
                  viewAlbums={viewAlbums}
                  setIsSelected={setIsSelected}
                  resizeAllFiles={resizeAllDeletedFiles}
                />
              </div>
            </div>
          )}

          {removeVideosFromAlbum && (
            <div className="absolute w-11/12 h-4/5 z-40 flex justify-center items-center">
              <div className="flex justify-center items-center  w-3/5 h-4/5 ml-40 mt-10 max-sm:h-2/5 max-sm:w-full max-sm:ml-10">
                <RemovePhotosFromAlbumBox
                  setUploadBox={setRemoveVideosFromAlbum}
                  Type="Videos"
                  photoToAdd={isSelected}
                  setIsSelected={setIsSelected}
                  setIsFullScreen={setIsFullScreen}
                  Amount="Many"
                  resizeAllFiles={resizeAllAlbumDeletedFiles}
                />
              </div>
            </div>
          )}
          {!isFullScreen ? (
            <div>
              {/* Header with gradient background */}
              <div className="p-4 border-b-2 border-amber-800 bg-gradient-to-r from-amber-50 via-amber-500 to-amber-50">
                <div className="flex justify-between items-center gap-2">
                  <SelectedFiles
                    isSelected={isSelected}
                    setIsDeleteAll={setIsDeleteAll}
                    setAddToAlbums={setAddVideosToAlbums}
                    setRemoveFromAlbum={setRemoveVideosFromAlbum}
                    viewAlbums={viewAlbums}
                  />

                  {/* Title */}

                  <div className="uppercase font-bold text-l text-center flex-grow">
                    <span>{viewAlbums ? albumName + ' Album' : 'Videos'}</span>
                    {viewAlbums && isSelected.length <= 0 && (
                      <div className=" w-20">
                        <AlbumEdit
                          setIsAlbumedit={setIsAlbumedit}
                          setViewAlbums={setViewAlbums}
                          setAlbumName={setAlbumName}
                          setIsSelected={setIsSelected}
                        />
                      </div>
                    )}
                  </div>

                  <SearchBar placeholder={'Search by Year (eg 2022)'} searchDate ={searchDate} setSearchDate ={setSearchDate} handleFunction={handleSearchData}/>

                  {/* Button */}

                  <div className="ml-4 text-3xl">
                    <div className="cursor-pointer border-4 border-amber-500 rounded-full p-1 text-black">
                      <GoUpload onClick={UploadImageBox} />
                    </div>
                  </div>

                  {!viewAlbums && (
                    <div className="ml-4 text-3xl">
                      <div className="cursor-pointer border-4 border-amber-500 rounded-full p-1 text-black">
                        <FaRegFolder onClick={CreateAlbumBox} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative flex justify-center">
                {uploadBox && (
                  <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    {/* Overlay */}
                    <div className="absolute z-50 h-[550px] w-3/5">
                      <UploadFiles
                        Type="Videos"
                        setUploadBox={setUploadBox}
                        albumName={albumName}
                        viewAlbums={viewAlbums}
                      />
                    </div>
                  </>
                )}

                {createAlbum && (
                  <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"></div>
                    {/* Overlay */}
                    <div className="absolute z-50 h-[600px] w-3/5 flex items-center justify-center max-sm:h-[300px] mt-20">
                      <AlbumBox Type="Video" setUploadBox={setCreateAlbums} />
                    </div>
                  </>
                )}

                {isAlbumEdit && (
                  <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    {/* Overlay */}
                    <div className="absolute z-50 h-[550px] w-3/5 flex justify-center items-center mt-20">
                      <EditAlbumBox
                        Type="Video"
                        setUploadBox={setIsAlbumedit}
                        setAlbumName={setAlbumName}
                        prevAName={albumName}
                        setViewAlbums={setViewAlbums}
                        setPhotoAlbums={setVideoAlbums}
                        photoAlbums={videoAlbums}
                      />
                    </div>
                  </>
                )}
              </div>
              {!viewAlbums && (
                <ViewLoadVidoes
                  data={data}
                  setOnLoadCompleteVideo={setOnLoadCompleteVideo}
                  onLoadCompleteVideo={onLoadCompleteVideo}
                  viewImage={viewImage}
                  handleSelectedFiles={handleSelectedFiles}
                  subPage={subPage}
                  videoAlbums={videoAlbums}
                  HandleViewAlbums={HandleViewAlbums}
                  scrollPosition={scrollPosition}
                />
              )}

              {viewAlbums && (
                <ViewAlbumVidoes
                  data={data}
                  setOnLoadCompleteVideo={setOnLoadCompleteVideo}
                  onLoadCompleteVideo={onLoadCompleteVideo}
                  viewImage={viewImage}
                  handleSelectedFiles={handleSelectedFiles}
                  subPage={subPage}
                  videoAlbums={videoAlbums}
                  setAlbumVideos={setAlbumVideos}
                  HandleViewAlbums={HandleViewAlbums}
                  page={page}
                  albumName={albumName}
                  datas={datas}
                  setData={setData}
                  scrollPosition={scrollPosition}
                  setSubPage={setSubPage}
                  setPage={setPage}
                />
              )}
            </div>
          ) : (
            <ImageFullScreen
              setIsFullScreen={setIsFullScreen}
              currentIndexOne={currentIndexOne}
              currentIndex={currentIndex}
              filesData={filesData}
              setCurrentIndex={setCurrentIndex}
              resizeFiles={resizeFiles}
              setCurrentIndexOne={setCurrentIndexOne}
              setChangePosition={setChangePosition}
              viewAlbums={viewAlbums}
              albumVideos={albumVideos}
              setIsSelected={setIsSelected}
              resizeAlbumFiles={resizeAlbumFiles}
            />
          )}
        </div>
      ) : (

        <FileLoadingEffects instances ={30}/>
        
)}
    </>
  );
}

function ImageFullScreen({
  setIsFullScreen,
  currentIndex,
  currentIndexOne,
  filesData,
  setCurrentIndex,
  setCurrentIndexOne,
  resizeFiles,
  setChangePosition,
  viewAlbums,
  albumVideos,
  setIsSelected,
  resizeAlbumFiles,
}) {
  const [loading, setLoading] = useState(true);
  const [imageDetails, setImageDetails] = useState({});
  const [details, setDetails] = useState(false);
  const [barAnimation, setBarAnimation] = useState(false);
  const [openAnim, setOpenAnim] = useState(false);
  const [deleteFile, setDeleteFile] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const [slider, setSlider] = useState(true);
  const [sliderL, setSliderL] = useState(true);

  //for albums
  //album
  const [addAlbums, setAddAlbums] = useState(false);
  const [removeAlbums, setRemoveAlbums] = useState(false);

  useEffect(() => {
    if (!viewAlbums) {
      setImageDetails(filesData[currentIndexOne].fileDatas[currentIndex]);
    } else {
      setImageDetails(albumVideos[currentIndexOne].fileDatas[currentIndex]);
    }
    setLoading(false);

    if (!openAnim) {
      setOpenAnim(true);
    }
  }, [currentIndex, currentIndexOne]);

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

    if (!viewAlbums) {
      setTimeout(() => {
        if (currentIndex < filesData[currentIndexOne].fileDatas.length - 1) {
          // Move to the next item in the current fileDatas array
          setCurrentIndex((cur) => cur + 1);
        } else if (
          currentIndex === filesData[currentIndexOne].fileDatas.length - 1 &&
          filesData[currentIndexOne + 1]?.fileDatas
        ) {
          // Move to the next group (next currentIndexOne)
          setCurrentIndexOne((cur) => cur + 1);
          setCurrentIndex(0); // Reset index for the new group
        }

        setSlider(true);
        setImageChanged(false);
      }, 1000);
    } else {
      setTimeout(() => {
        if (currentIndex < albumVideos[currentIndexOne].fileDatas.length - 1) {
          // Move to the next item in the current fileDatas array
          setCurrentIndex((cur) => cur + 1);
        } else if (
          currentIndex === albumVideos[currentIndexOne].fileDatas.length - 1 &&
          albumVideos[currentIndexOne + 1]?.fileDatas
        ) {
          // Move to the next group (next currentIndexOne)
          setCurrentIndexOne((cur) => cur + 1);
          setCurrentIndex(0); // Reset index for the new group
        }

        setSlider(true);
        setImageChanged(false);
      }, 1000);
    }
  }

  function imageCarasouleBackward() {
    setImageChanged(true);
    setSliderL(false);

    if (!viewAlbums) {
      setTimeout(() => {
        if (currentIndex > 0) {
          // Move to the previous item in the current fileDatas array
          setCurrentIndex((cur) => cur - 1);
        } else if (
          currentIndex === 0 &&
          filesData[currentIndexOne - 1]?.fileDatas
        ) {
          // Move to the previous group (previous currentIndexOne)
          setCurrentIndexOne((cur) => cur - 1);
          // Set currentIndex to the last item in the previous group's fileDatas array
          setCurrentIndex(filesData[currentIndexOne - 1].fileDatas.length - 1);
        }
        setImageChanged(false);
        setSliderL(true);
      }, 1000);
    } else {
      setTimeout(() => {
        if (currentIndex > 0) {
          // Move to the previous item in the current fileDatas array
          setCurrentIndex((cur) => cur - 1);
        } else if (
          currentIndex === 0 &&
          albumVideos[currentIndexOne - 1]?.fileDatas
        ) {
          // Move to the previous group (previous currentIndexOne)
          setCurrentIndexOne((cur) => cur - 1);
          // Set currentIndex to the last item in the previous group's fileDatas array
          setCurrentIndex(
            albumVideos[currentIndexOne - 1].fileDatas.length - 1
          );
        }
        setImageChanged(false);
        setSliderL(true);
      }, 1000);
    }
  }

  function close() {
    setDetails(false);
    setOpenAnim(false);
    setBarAnimation(false);
    setChangePosition(true);
    setTimeout(() => {
      setIsFullScreen(false);
    }, 500);

    clearTimeout();
  }

  // for albums
  function handleVideosToAddToAlbums() {
    setAddAlbums(true);
  }

  return (
    <>
      {
        <div
          className={`h-full w-full transition-transform transform duration-300 ease-in-out ${
            openAnim ? 'scale-100' : 'scale-0'
          }`}
        >
          {!loading ? (
            <div className="w-full h-full bg-black flex">
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
                      <div className="flex flex-col mt-5 gap-4">
                        <span className="font-bold border-b-4 border-yellow-200">
                          Details
                        </span>
                        <span>Name : {imageDetails.viodeoName}</span>
                        <span>Back Up Date :{imageDetails.backUpDate} </span>
                        <span>
                          Original Date: {imageDetails.dateTimeOriginal}
                        </span>

                        <span>Duration : {Number(imageDetails.videoDuration).toFixed(2)} Sec</span>

                        <span>Size :{imageDetails.videoFileSize} Mb</span>
                        {imageDetails.make != 'Missing' && (
                          <span>Make :{imageDetails.make} </span>
                        )}
                        {imageDetails.model != 'Missing' && (
                          <span>Model :{imageDetails.model} </span>
                        )}
                      </div>

                      <div className="flex flex-col h-full w-full">
                        <span className="font-bold border-b-4 border-yellow-200">
                          Location
                        </span>
                        <VideoMapLocation imageDetails={imageDetails} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <InfoPanel
                  close={close}
                  openDetailPage={openDetailPage}
                  setDeleteFile={setDeleteFile}
                  imageDetails={imageDetails}
                  handleImagesToAddToAlbums={handleVideosToAddToAlbums}
                  setRemoveAlbums={setRemoveAlbums}
                />
              )}
              <div className="w-full flex flex-row">
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

                <div className=" h-full w-full flex items-center justify-center">
                  {deleteFile && (
                    <div className=" w-full h-full flex items-center justify-center">
                      <DeleteFiles
                        setDeleteFile={setDeleteFile}
                        imageDetails={imageDetails}
                        resizeFiles={
                          viewAlbums ? resizeAlbumFiles : resizeFiles
                        }
                        setImageChanged={setImageChanged}
                        Type="Videos"
                      />
                    </div>
                  )}

                  {addAlbums && (
                    <div className=" w-full h-full flex items-center justify-center z-40 max-sm:h-2/5">
                      <AddPhotosToAlbumBox
                        setUploadBox={setAddAlbums}
                        Type="Videos"
                        photoToAdd={imageDetails}
                        setIsFullScreen={setIsFullScreen}
                        setIsSelected={setIsSelected}
                        resizeAllFiles={resizeFiles}
                      />
                    </div>
                  )}

                  {removeAlbums && (
                    <div className=" w-full h-full flex items-center justify-center z-40 max-sm:h-2/5">
                      <RemovePhotosFromAlbumBox
                        setUploadBox={setAddAlbums}
                        Type="Videos"
                        photoToAdd={imageDetails}
                        setIsFullScreen={setIsFullScreen}
                        setIsSelected={setIsSelected}
                        resizeAllFiles={resizeAlbumFiles}
                      />
                    </div>
                  )}

                  <div className=" h-full flex justify-center absolute">
                    <video
                      src={imageDetails?.videoURL}
                      alt={'video playing'}
                      controls
                      autoPlay
                      fill
                      preload="metadata"
                      className={`object-contain transition-opacity duration-500 ${
                        imageChanged ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  </div>
                </div>

                {!details && (
                  <div className="h-full w-1/5 flex items-center">
                    <button
                      className="text-white text-6xl hover:text-slate-500 z-10 h-1/5"
                      onClick={(e) => imageCarasouleForward()}
                    >
                      {slider && <FaChevronRight className='z-10' />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Sppiner Size="p-20" />
          )}
        </div>
      }
    </>
  );
}

function ViewLoadVidoes({
  data,
  setOnLoadCompleteVideo,
  onLoadCompleteVideo,
  viewImage,
  handleSelectedFiles,
  subPage,
  videoAlbums,
  HandleViewAlbums,
  scrollPosition,
}) {
  function formatedate(dateString) {
    const date = new Date(dateString);
    const convertToString = String(date).slice(0, 15);
    return convertToString;
  }

  return (
    <div>
      <div className="h-full w-full transition-all duration-300">
        {data?.length > 0 || videoAlbums?.length > 0 ? (
          <div
            className="h-[calc(100vh-18vh)] w-full overflow-y-auto grid grid-cols-3 gap-1 max-sm:grid-cols-3 max-sm:h-[calc(100vh-20vh)]"
            id="childDiv"
          >
            {/* Fixed height and vertical scroll */}

            <ViewAlbums
              photoAlbums={videoAlbums}
              HandleViewAlbums={HandleViewAlbums}
            />

          
{data.map((group, indexOne) => (
            <div
              key={group._id}
              className={`${
                !group._id ? 'scale-0' : 'scale-100'
              } transition-transform duration-300 flex flex-col p-2 ${
                group.fileDatas.length > 5 ? 'col-span-3' : 'max-sm:col-span-3'
              }`}
            >
                <div>
                  <div className="flex justify-start font-bold text-slate-500">
                    <span>
                      {group.fileDatas.length > 0 && formatedate(group._id)}
                    </span>
                  </div>

                  {/* First 5 images */}
                  <div
                    className={` grid w-full ${
                      group.fileDatas.length >= 5
                        ? 'grid-cols-6 max-sm:grid-cols-3'
                        : group.fileDatas.length === 4
                        ? 'grid-cols-4 '
                        : group.fileDatas.length === 3
                        ? 'grid-cols-3'
                        : group.fileDatas.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-1'
                    }`}
                  >
                    {group.fileDatas.slice(0, subPage).map((items, index) => (
                      <div key={index} className="bg-slate-300">
                        <ViewVideo
                          index={index}
                          items={items}
                          indexOne={indexOne}
                          setOnLoadCompleteVideo={setOnLoadCompleteVideo}
                          onLoadCompleteVideo={onLoadCompleteVideo}
                          viewImage={viewImage}
                          handleSelectedFiles={handleSelectedFiles}
                          scrollPosition={scrollPosition}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className=" flex justify-center items-center w-full h-[600px] text-slate-300 text-6xl uppercase max-sm:text-2xl">
            <span className="-rotate-45">Upload Videos to view</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ViewAlbumVidoes({
  setOnLoadCompleteVideo,
  onLoadCompleteVideo,
  viewImage,
  handleSelectedFiles,
  subPage,
  page,
  albumName,
  setAlbumVideos,
  datas,
  setData,
  scrollPosition,
  setSubPage,
  setPage,
}) {
  function formatedate(dateString) {
    const date = new Date(dateString);
    const convertToString = String(date).slice(0, 15);
    return convertToString;
  }

  useEffect(() => {
    setPage(5);
    setSubPage(15);
    async function loadApiData() {
      try {
        const albumData = await getAlbumVideos({ albumName });
        if (albumData?.message?.result) {
          setData(albumData.message.result);
          setAlbumVideos(albumData.message.result); // this goes to the fullscreen images
        } else {
          console.log('something is wrong with the fetch ' + albumData.message);
        }
      } catch (err) {
        console.log('Error fetching the data ' + err.message);
      }
    }
    loadApiData();
  }, []);

  const data = useMemo(() => {
    return datas.slice(0, page);
  }, [datas, page, subPage]);

  return (
    <div>
      <div className="h-full w-full transition-all duration-300">
        {data?.length > 0 ? (
          <div
            className="h-[calc(100vh-18vh)] w-full overflow-y-auto grid grid-cols-3 gap-1 max-sm:grid-cols-3 max-sm:h-[calc(100vh-20vh)]"
            id="childDiv"
          >
            {/* Fixed height and vertical scroll */}

            {data.map((group, indexOne) => (
              <div
                key={group._id}
                className={`flex flex-col p-0 ${
                  group.fileDatas.length > 5
                    ? 'col-span-3'
                    : 'max-sm:col-span-3'
                }`}
              >
                <div>
                  <div className="flex justify-start font-bold text-slate-500">
                    <span>
                      {group.fileDatas.length > 0 && formatedate(group._id)}
                    </span>
                  </div>

                  {/* First 5 images */}
                  <div
                    className={`grid w-full ${
                      group.fileDatas.length >= 5
                        ? 'grid-cols-6 max-sm:grid-cols-3'
                        : group.fileDatas.length === 4
                        ? 'grid-cols-4 '
                        : group.fileDatas.length === 3
                        ? 'grid-cols-3'
                        : group.fileDatas.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-1'
                    }`}
                  >
                    {group.fileDatas.slice(0, subPage).map((items, index) => (
                      <div key={index}>
                        <ViewVideo
                          index={index}
                          items={items}
                          indexOne={indexOne}
                          setOnLoadCompleteVideo={setOnLoadCompleteVideo}
                          onLoadCompleteVideo={onLoadCompleteVideo}
                          viewImage={viewImage}
                          handleSelectedFiles={handleSelectedFiles}
                          scrollPosition={scrollPosition}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className=" flex justify-center items-center w-full h-[640px] text-slate-300 text-6xl uppercase max-sm:text-xl">
            <span className="-rotate-45">Upload Videos to Album</span>
          </div>
        )}
      </div>
    </div>
  );
}
function AlbumEdit({ setIsAlbumedit, setViewAlbums, setIsSelected }) {
  function handleViewAlbums() {
    setIsSelected('');
    setViewAlbums((prev) => !prev);
  }
  return (
    <div>
      <span className="flex gap-2 text-3xl ml-4">
        <div className="cursor-pointer hover:text-slate-500">
          <IoArrowBackSharp onClick={handleViewAlbums} />
        </div>
        <div className="cursor-pointer hover:text-slate-500">
          <CiEdit onClick={(e) => setIsAlbumedit(true)} />
        </div>
      </span>
    </div>
  );
}
