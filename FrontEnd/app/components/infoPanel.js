import { CiCircleInfo, CiCircleChevLeft } from 'react-icons/ci';
import { IoIosAdd } from 'react-icons/io';
import { CiCircleMinus } from 'react-icons/ci';
import { MdOutlineDelete } from 'react-icons/md';

export default function InfoPanel({
  close,
  openDetailPage,
  setDeleteFile,
  imageDetails,
  handleImagesToAddToAlbums,
  setRemoveAlbums,
}) {
  return (
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
          onClick={(e) => setDeleteFile(true)}
        >
          <MdOutlineDelete />
        </button>

        {imageDetails.photoAlbums?.length === 0 ||
        imageDetails.videoAlbums?.length === 0 ? (
          <button
            className="text-6xl flex justify-center hover:text-slate-500"
            onClick={handleImagesToAddToAlbums}
          >
            <IoIosAdd />
          </button>
        ) : (
          <button
            className="text-6xl flex justify-center hover:text-slate-500"
            onClick={(e) => setRemoveAlbums(true)}
          >
            <CiCircleMinus />
          </button>
        )}
      </div>
    </div>
  );
}
