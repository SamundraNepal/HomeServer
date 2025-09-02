import { MdOutlineDelete } from 'react-icons/md';
import { IoIosAdd } from 'react-icons/io';
import { CiCircleMinus } from 'react-icons/ci';

export default function SelectedFiles({
  isSelected,
  setIsDeleteAll,
  setAddToAlbums,
  setRemoveFromAlbum,
  viewAlbums,
}) {
  return (
    <>
      {isSelected.length > 0 && (
        <div className="flex flex-row gap-4 text-slate-900 max-sm:flex-col">
          <span className="font-bold">Selected : {isSelected.length}</span>
          <div
            className="text-4xl cursor-pointer hover:text-slate-100 border-4 rounded-full w-[41px] border-amber-500 "
            onClick={() => setIsDeleteAll(true)}
          >
            <MdOutlineDelete />
          </div>

          {!viewAlbums ? (
            <div
              className="text-4xl cursor-pointer hover:text-slate-100 border-4 rounded-full w-[45px] border-amber-500 "
              onClick={() => setAddToAlbums(true)}
            >
              <IoIosAdd />
            </div>
          ) : (
            <div
              className="text-4xl cursor-pointer hover:text-slate-100 border-4 rounded-full w-[45px] border-amber-500 "
              onClick={() => setRemoveFromAlbum(true)}
            >
              <CiCircleMinus />
            </div>
          )}
        </div>
      )}
    </>
  );
}
