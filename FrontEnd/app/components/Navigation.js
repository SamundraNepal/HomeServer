import Link from 'next/link';
import { PiImagesSquareThin } from 'react-icons/pi';
import { LiaVideoSolid } from 'react-icons/lia';
import { FaRegTrashAlt } from 'react-icons/fa';
import StorageTotal from './storage';
import { IoHomeOutline } from 'react-icons/io5';

export default function Navigation({ setSideBar }) {
  return (
    <div>
      <div>
        <ul
          className="flex flex-col gap-16 text-lg p-5 mt-12 text-slate-600"
          onClick={() => setSideBar((prev) => !prev)}
        >
          <li className="hover:bg-amber-400 w-24 transition-all flex items-center gap-1 text-xl border-b-4 border-gray-200 w-full py-2">
            <IoHomeOutline />
            <Link className="flex" href="/">
              Home
            </Link>
          </li>

          <li className="hover:bg-amber-400 w-24 transition-all flex items-center gap-1 text-xl border-b-4 border-gray-200 w-full py-2">
            <PiImagesSquareThin />
            <Link className="flex" href="/Image">
              Photos
            </Link>
          </li>

          <li className="hover:bg-amber-400 w-24 transition-all flex items-center gap-1 text-xl border-b-4 border-gray-200 w-full py-2">
            <LiaVideoSolid />
            <Link href="/Videos">
              Videos
            </Link>
          </li>

          <li className="hover:bg-amber-400 w-24 transition-all flex items-center gap-1 text-xl border-b-4 border-gray-200 w-full py-2">
            <FaRegTrashAlt />
            <Link href="/Trash" prefetch={false}>
              Trash
            </Link>
          </li>
        </ul>

        <div className=" h-[50px] w-full flex items-end flex flex-col p-2">
          <div className=" w-full p-2 rounded-[10px]">
            <StorageTotal />
          </div>
        </div>
      </div>
    </div>
  );
}
