import Link from 'next/link';
import { PiImagesSquareThin } from 'react-icons/pi';
import { IoHomeOutline } from 'react-icons/io5';

export default function AdminNav({ setSideBar }) {
  return (
    <div>
      <div>
        <ul
          className="flex flex-col gap-16 text-lg p-5 mt-12 text-slate-600"
          onClick={() => setSideBar((prev) => !prev)}
        >
          <li className="hover:bg-amber-400 w-24 transition-all flex items-center gap-1 text-xl border-b-4 border-gray-200 w-full py-2">
            <IoHomeOutline />
            <Link className="flex" href="/adminPage">
              Attention
            </Link>
          </li>

          <li className="hover:bg-amber-400 w-24 transition-all flex items-center gap-1 text-xl border-b-4 border-gray-200 w-full py-2">
            <PiImagesSquareThin />
            <Link className="flex" href="/adminPage/approvedPage">
              Approved
            </Link>
          </li>

        </ul>

       
      </div>
    </div>
  );
}
