'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import UploadFiles from '../components/uploadFiles';
import {
  base64Char,
  getAlbumImages,
  GetLogedUserData,
  getSearchFiles,
  loadImages,
} from '@/API/API CALLS';
import { CiCircleChevLeft } from 'react-icons/ci';
import DeleteFiles from '../components/deleteFile';
import { FaChevronRight } from 'react-icons/fa6';
import Sppiner from '@/Components/Spiner';
import ViewImage from '../components/viewImage';
import DeleteMultipleFiles from '../components/deleteMultiple';
import dynamic from 'next/dynamic';
import { GoUpload } from 'react-icons/go';
import { FaRegFolder } from 'react-icons/fa';
import AlbumBox from '../components/albumbox';
import { CiEdit } from 'react-icons/ci';
import { IoArrowBackSharp } from 'react-icons/io5';
import EditAlbumBox from '../components/editAlbumbox';
import ViewAlbums from '../components/viewAlbums';
import AddPhotosToAlbumBox from '../components/addPhotosToAlbum';
import RemovePhotosFromAlbumBox from '../components/removePhotosFromAlbum';
import InfoPanel from '../components/infoPanel';
import SelectedFiles from '../components/selectedFiles';
import SearchBar from '@/Components/SearchBar';
import FileLoadingEffects from '../components/fileLoadEffects';

// Dynamically import the VideoMapLocation component without SSR
const MapLocation = dynamic(() => import('../components/Maps'), {
  ssr: false,
});

/*export const metadata = {
  title: 'Images',
};*/

export default function Page() {
  const [loading, setLoading] = useState(true);

  const [uploadBox, setUploadBox] = useState(false);
  const [filesData, setFilesdata] = useState([]);
  const [viewImageFullScreen, setViewImageFullScreen] = useState({});
  const[base64Code,setIsBase64Code] = useState("");
  //for getting image current pos
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexOne, setCurrentIndexOne] = useState(0);

  //Optimize data
  const [page, setPage] = useState(15);
  const [subPage, setSubPage] = useState(10);

  //for scroll
  const [scrollDiv, setScrollDiv] = useState();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loadData, setLoaddata] = useState(false);

  //to optimize the data
  const data = useMemo(() => {
    return filesData.slice(0, page);
  }, [filesData, page]);

  //for tick
  const [isSelected, setIsSelected] = useState([]);
  const [isDeleteAll, setIsDeleteAll] = useState(false);

  //for scroll position
  const [changePosition, setChangePosition] = useState(false);

  //for album handle
  const [createAlbum, setCreateAlbums] = useState(false);
  const [viewAlbums, setViewAlbums] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [isAlbumEdit, setIsAlbumedit] = useState(false);
  const [photoAlbums, setPhotoAlbums] = useState([]);
  const [addPhotoToAlbums, setAddPhotoToAlbums] = useState(false);
  const [albumImages, setAlbumImages] = useState([]);
  const [removePhotosFromAlbum, setRemovePhotosFromAlbum] = useState(false);
  const [datas, setData] = useState([]);

  const[searchDate , setSearchDate ] = useState('');

  useEffect(() => {
    setSubPage(10);
    setPage(5);
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
  });

  if (scrollDiv) {
    scrollDiv.addEventListener('scroll', (event) => {
      event.preventDefault();
      setLoaddata(false);

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
      const data = await loadImages();
      const pData = await GetLogedUserData();
      setPhotoAlbums(pData.message.getUser.photoAlbums);
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

  function CreateAlbumBox() {
    setCreateAlbums(true);
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

  function resizeFilesAlbumFiles() {
    // Get the specific group from filesData
    const group = albumImages[currentIndexOne];

    // Copy the fileDatas array and remove the item at currentIndex
    const updatedFileDatas = [...group.fileDatas];
    updatedFileDatas.splice(currentIndex, 1);

    // Create a new filesData array, updating only the group with modified fileDatas
    const updatedFiles = [...albumImages];
    updatedFiles[currentIndexOne] = {
      ...group,
      albumImages: updatedFileDatas,
    };

    // Update the state with the new filesData array
    setAlbumImages(updatedFiles);

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

  function resizeAllAlbumDeletedFiles() {
    const updatedFiles = [...isSelected];
    const totalFiles = [...albumImages];

    const newFiles = totalFiles.filter((items) =>
      items.fileDatas.every(
        (el) => !updatedFiles.some((sEl) => el._id === sEl._id)
      )
    );

    setData(newFiles);
    setIsSelected([]);
  }

  function viewImage(items, indexOne, index ,base64) {
    setIsBase64Code(base64);
    setCurrentIndexOne(indexOne);
    setCurrentIndex(index);
    setViewImageFullScreen(items);
    setIsFullScreen(true);
    setIsSelected([]);
  }

  function handleSelectedFiles(currentFile, currentIndex) {
    // Get the selected file data
    const selectedFile = !viewAlbums
      ? filesData[currentFile]?.fileDatas[currentIndex]
      : albumImages[currentFile]?.fileDatas[currentIndex];

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

  function HandleViewAlbums(name) {
    setAlbumName(name);
    setViewAlbums((prev) => !prev);
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

 async function handleSearchData()
  {
    try{
     const data = await getSearchFiles(searchDate);
     if (data.message.result.length > 0) {
      setFilesdata(data.message.result);
     }
    }catch(err)
    {

console.log(err.message)

    }
  }


  return (
    <>
      {!loading ? (
        <div className="h-full w-full ">
           


          {isDeleteAll && (
            <div className="absolute w-11/12 h-4/5 z-40 flex justify-center items-center">
              <div className="flex justify-center items-center w-3/5 h-4/5 ml-40 mt-10 max-sm:h-2/5 max-sm:w-full max-sm:ml-4">
                <DeleteMultipleFiles
                  setDeleteFile={setIsDeleteAll}
                  imageDetails={isSelected}
                  resizeAllDeletedFiles={
                    !viewAlbums
                      ? resizeAllDeletedFiles
                      : resizeAllAlbumDeletedFiles
                  }
                />
              </div>
            </div>
          )}
          {addPhotoToAlbums && (
            <div className="absolute w-11/12 h-4/5 z-40 flex justify-center items-center">
              <div className="flex justify-center items-center  w-3/5 h-4/5 ml-40 mt-10 max-sm:h-2/5 max-sm:w-full max-sm:ml-20">
                <AddPhotosToAlbumBox
                  setUploadBox={setAddPhotoToAlbums}
                  Type="Photos"
                  Amount="Many"
                  photoToAdd={isSelected}
                  viewAlbums={viewAlbums}
                  setIsSelected={setIsSelected}
                  resizeAllFiles={resizeAllDeletedFiles}
                />
              </div>
            </div>
          )}

          {removePhotosFromAlbum && (
            <div className="absolute w-11/12 h-4/5 z-40 flex justify-center items-center">
              <div className="flex justify-center items-center  w-3/5 h-4/5 ml-40 mt-10 max-sm:h-2/5 max-sm:w-full max-sm:ml-10">
                <RemovePhotosFromAlbumBox
                  setUploadBox={setRemovePhotosFromAlbum}
                  Type="Photos"
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
              <div className="p-4 border-b-2  border-amber-800 bg-gradient-to-r from-amber-50 via-amber-500 to-amber-50">
               

                <div className="flex justify-between items-center">
                  <SelectedFiles
                    isSelected={isSelected}
                    setIsDeleteAll={setIsDeleteAll}
                    setAddToAlbums={setAddPhotoToAlbums}
                    setRemoveFromAlbum={setRemovePhotosFromAlbum}
                    viewAlbums={viewAlbums}
                  />

                  {/* Title */}
                  <div className="uppercase font-bold text-l text-center flex-grow">
                    <span>{viewAlbums ? albumName + ' Album' : 'Photos'}</span>
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
                        Type="Photos"
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
                      <AlbumBox Type="Photo" setUploadBox={setCreateAlbums} />
                    </div>
                  </>
                )}

                {isAlbumEdit && (
                  <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    {/* Overlay */}
                    <div className="absolute z-50 h-[550px] w-3/5 flex justify-center items-center mt-20">
                      <EditAlbumBox
                        Type="Photo"
                        setUploadBox={setIsAlbumedit}
                        setAlbumName={setAlbumName}
                        prevAName={albumName}
                        setViewAlbums={setViewAlbums}
                        setPhotoAlbums={setPhotoAlbums}
                        photoAlbums={photoAlbums}
                      />
                    </div>
                  </>
                )}
              </div>




              {!viewAlbums && (
                <ViewLoadImages
                  photoAlbums={photoAlbums}
                  data={data}
                  viewImage={viewImage}
                  handleSelectedFiles={handleSelectedFiles}
                  isSelected={isSelected}
                  subPage={subPage}
                  HandleViewAlbums={HandleViewAlbums}
                  scrollPosition={scrollPosition}
                />
              )}
              {viewAlbums && (
                <ViewAlbumImages
                  photoAlbums={photoAlbums}
                  viewImage={viewImage}
                  handleSelectedFiles={handleSelectedFiles}
                  isSelected={isSelected}
                  subPage={subPage}
                  albumName={albumName}
                  setAlbumImages={setAlbumImages}
                  page={page}
                  setData={setData}
                  datas={datas}
                  scrollPosition={scrollPosition}
                  setPage={setPage}
                  setSubPage={setSubPage}

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
              albumImages={albumImages}
              resizeFilesAlbumFiles={resizeFilesAlbumFiles}
              setIsSelected={setIsSelected}
              resizeAlbumFiles={resizeAlbumFiles}
              base64Code = {base64Code}
            />
          )}
        </div>
      ) : (
          <FileLoadingEffects instances ={30}/>
 )}
    </>
  );
}

function ViewLoadImages({
  data,
  viewImage,
  handleSelectedFiles,
  subPage,
  photoAlbums,
  HandleViewAlbums,
  scrollPosition}) {
  function formatedate(dateString) {
    const date = new Date(dateString);
    const convertToString = String(date).slice(0, 15);
    return convertToString;
  }

  return (
    <div className="h-5/5 w-5/5 transition-all duration-300">
      {data?.length > 0 || photoAlbums.length > 0 ? (
        <div
          className="h-[calc(100vh-18vh)] w-full overflow-y-auto grid grid-cols-3 gap-1 max-sm:grid-cols-3 max-sm:h-[calc(100vh-20vh)]"
          id="childDiv"
        >
          <ViewAlbums
            photoAlbums={photoAlbums}
            HandleViewAlbums={HandleViewAlbums}
          />
          {/* Fixed height and vertical scroll */}

          {data.map((group, indexOne) => (
            <div
              key={group._id}
              className={`${
                !group._id ? 'scale-0' : 'scale-100'
              } transition-transform duration-300 flex flex-col p-2 ${
                group?.fileDatas?.length > 5 ? 'col-span-3' : 'max-sm:col-span-3'
              }`}
            >
              {/* Display group ID */}

              <div className="flex justify-start font-bold text-slate-500">
                <span>
                  {group?.fileDatas?.length > 0 && formatedate(group._id)}
                </span>
              </div>

              {/* First 5 images */}
              <div
                key={indexOne}
                className={`grid w-full ${
                  group?.fileDatas?.length >= 5
                    ? 'grid-cols-6 max-sm:grid-cols-3'
                    : group.fileDatas?.length === 4
                    ? 'grid-cols-4'
                    : group.fileDatas?.length === 3
                    ? 'grid-cols-3'
                    : group.fileDatas?.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-1'
                }`}
              >
                {group.fileDatas?.slice(0, subPage).map((items, index) => (
                  <div key={index} className="bg-slate-300">
                    <ViewImage
                      index={index}
                      items={items}
                      indexOne={indexOne}
                      viewImage={viewImage}
                      handleSelectedFiles={handleSelectedFiles}
                      scrollPosition={scrollPosition}

                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className=" flex justify-center items-center w-full h-[600px] text-slate-300 text-6xl uppercase max-sm:text-xl">
          <span className="-rotate-45">Upload Images to view</span>
        </div>
      )}
    </div>
  );
}


function ViewAlbumImages({
  viewImage,
  handleSelectedFiles,
  subPage,
  albumName,
  setAlbumImages,
  page,
  setData,
  datas,
  scrollPosition,
  setPage,
  setSubPage,
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
        const albumData = await getAlbumImages({ albumName });
        if (albumData?.message?.result) {
          setData(albumData.message.result);
          setAlbumImages(albumData.message.result); // this goes to the fullscreen images
        } else {
          
          console.log('Semething is wrong with the fetch ' + albumData.message);
        }
      } catch (err) {
        console.log('Error fetching the data' + err.message);
      }
    }
    loadApiData();
  }, []);

  const data = useMemo(() => {
    return datas.slice(0, page);
  }, [datas, page, subPage]);

  return (
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
              className={`${
                !group._id ? 'scale-0' : 'scale-100'
              } transition-transform duration-300 flex flex-col p-2 ${
                group.fileDatas.length > 5 ? 'col-span-3' : 'max-sm:col-span-3'
              }`}
            >
              {/* Display group ID */}

              <div className="flex justify-start font-bold text-slate-500">
                <span>
                  {group.fileDatas.length > 0 && formatedate(group._id)}
                </span>
              </div>

              {/* First 5 images */}
              <div
                key={indexOne}
                className={`grid w-full ${
                  group.fileDatas.length >= 5
                    ? 'grid-cols-6 max-sm:grid-cols-3'
                    : group.fileDatas.length === 4
                    ? 'grid-cols-4'
                    : group.fileDatas.length === 3
                    ? 'grid-cols-3'
                    : group.fileDatas.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-1'
                }`}
              >
                {group.fileDatas.slice(0, subPage).map((items, index) => (
                  <div key={index} className="bg-slate-300">
                    <ViewImage
                      index={index}
                      items={items}
                      indexOne={indexOne}
                      viewImage={viewImage}
                      handleSelectedFiles={handleSelectedFiles}
                      scrollPosition={scrollPosition}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className=" flex justify-center items-center w-full h-[640px] text-slate-300 text-6xl uppercase max-sm:text-xl">
          <span className="-rotate-45">Upload Images to Album</span>
        </div>
      )}
    </div>
  );
}

function ImageFullScreen({
  setIsFullScreen,
  currentIndex,
  currentIndexOne,
  setCurrentIndexOne,
  filesData,
  setCurrentIndex,
  resizeFiles,
  setChangePosition,
  viewAlbums,
  albumImages,
  setIsSelected,
  resizeAlbumFiles,
  base64Code
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

  //album
  const [addAlbums, setAddAlbums] = useState(false);
  const [removeAlbums, setRemoveAlbums] = useState(false);

  //setting the image based on index
  useEffect(() => {
    if (!viewAlbums) {
      setImageDetails(filesData[currentIndexOne].fileDatas[currentIndex]);
    } else {
      setImageDetails(albumImages[currentIndexOne].fileDatas[currentIndex]);
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

    setTimeout(() => {
      if (!viewAlbums) {
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
      } else {
        if (currentIndex < albumImages[currentIndexOne].fileDatas.length - 1) {
          // Move to the next item in the current fileDatas array
          setCurrentIndex((cur) => cur + 1);
        } else if (
          currentIndex === albumImages[currentIndexOne].fileDatas.length - 1 &&
          albumImages[currentIndexOne + 1]?.fileDatas
        ) {
          // Move to the next group (next currentIndexOne)
          setCurrentIndexOne((cur) => cur + 1);

          setCurrentIndex(0); // Reset index for the new group
        }
      }

      setSlider(true);
      setImageChanged(false);
    }, 1000);
  }

  function imageCarasouleBackward() {
    setImageChanged(true);
    setSliderL(false);

    setTimeout(() => {
      if (!viewAlbums) {
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
      } else {
        if (currentIndex > 0) {
          // Move to the previous item in the current fileDatas array
          setCurrentIndex((cur) => cur - 1);
        } else if (
          currentIndex === 0 &&
          albumImages[currentIndexOne - 1]?.fileDatas
        ) {
          // Move to the previous group (previous currentIndexOne)
          setCurrentIndexOne((cur) => cur - 1);

          // Set currentIndex to the last item in the previous group's fileDatas array
          setCurrentIndex(
            albumImages[currentIndexOne - 1].fileDatas.length - 1
          );
        }
      }
      setImageChanged(false);
      setSliderL(true);
    }, 1000);
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

  function handleImagesToAddToAlbums() {
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
                <div className="flex items-start max-sm:z-50 relative">
                  <div
                    className={`text-black bg-slate-50 p-1 h-full rounded-[10px] gap-4 border-r-8 border-yellow-600 transition-transform duration-500 ease-in-out ${
                      barAnimation ? 'scale-100' : 'scale-0'
                    } max-sm:w-[410px] bg-opacity-90 z-20`}
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
                        <span>Name : {imageDetails.imageName}</span>
                        <span>Back Up Date :{imageDetails.backUpDate} </span>
                        <span>
                          Original Date: {imageDetails.dateTimeOriginal}
                        </span>
                        <span>Size :{imageDetails.imageSize} Mb</span>
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
                        <div className="h-full w-full rounded-[10px]">
                          <MapLocation
                            latRef={imageDetails.gPSLatitudeRef}
                            lanRef={imageDetails.gPSLongitudeRef}
                            latCod={imageDetails.gPSLatitude}
                            lanCod={imageDetails.gPSLongitude}
                          />
                        </div>
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
                  handleImagesToAddToAlbums={handleImagesToAddToAlbums}
                  setRemoveAlbums={setRemoveAlbums}
                />
              )}

              <div className="w-full flex flex-row">
                {!details && (
                  <div className=" z-10 h-full w-1/5 flex">
                    <button
                      className="text-white text-6xl rotate-180 hover:text-slate-50"
                      onClick={(e) => imageCarasouleBackward()}
                    >
                      {sliderL && <FaChevronRight />}
                    </button>
                  </div>
                )}

                <div className=" h-full w-full flex items-center justify-center">
                  {/* p-40 to view delete files*/}
                  {deleteFile && (
                    <div className=" w-full h-full flex items-center justify-center">
                      <DeleteFiles
                        setDeleteFile={setDeleteFile}
                        imageDetails={imageDetails}
                        resizeFiles={
                          viewAlbums ? resizeAlbumFiles : resizeFiles
                        }
                        setImageChanged={setImageChanged}
                      />
                    </div>
                  )}

                  {addAlbums && (
                    <div className=" w-full h-full flex items-center justify-center z-40 max-sm:h-2/5">
                      <AddPhotosToAlbumBox
                        setUploadBox={setAddAlbums}
                        Type="Photos"
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
                        Type="Photos"
                        photoToAdd={imageDetails}
                        setIsFullScreen={setIsFullScreen}
                        setIsSelected={setIsSelected}
                        resizeAllFiles={resizeAlbumFiles}
                      />
                    </div>
                  )}

                  <div className="h-full">
                    <Image
                    priority
                      src={imageDetails?.imageURL}
                      alt={'Image'}
                      fill
                      placeholder="blur"
                      blurDataURL={ base64Code != "" ? base64Code : base64Char}
                      className={`object-contain transition-opacity duration-500 ${
                        imageChanged ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  </div>
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
          ) : (
            <Sppiner />
          )}
        </div>
      }
    </>
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
