import { useState } from 'react';
import { TiTick } from 'react-icons/ti';

export default function Tick({ setIsTicked }) {
  const [isClicked, setIsClicked] = useState(false);

  function isTicked() {
    setIsClicked((prevState) => !prevState);
    setIsTicked((prevSate) => !prevSate);
  }
  return (
    <div className="flex justify-start ">
      <div
        onClick={isTicked}
        className={`absolute border-4  ${
          isClicked
            ? 'border-slate-100 opacity-100'
            : 'border-slate-300 opacity-20'
        }  hover:border-slate-100 hover:opacity-100 top-4 left-4 p-2 w-[30px] h-[30px] rounded-full cursor-pointer transition-all duration-300`}
      />
      {isClicked && (
        <div
          onClick={isTicked}
          className={`absolute text-4xl left-4 top-[14px] text-slate-200 cursor-pointer  ${
            isClicked ? 'opacity-100' : 'opacity-0'
          } transition-all ease-out duration-500`}
        >
          <TiTick />
        </div>
      )}
    </div>
  );
}
