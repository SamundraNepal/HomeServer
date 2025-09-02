import { useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';

export default function SideBarHandler({ sideBarOpen, setSideBar }) {
  function handleNavigation() {
    setSideBar((prev) => !prev);
  }

  return (
    <div className="text-3xl">
      <div className="w-10 cursor-pointer" onClick={handleNavigation}>
        {sideBarOpen ? (
          <div
            className={`opacity-100 transition-all duration-500 ${
              sideBarOpen ? 'scale-100' : 'scale-0'
            }`}
          >
            <MdArrowBack />
          </div>
        ) : (
          <div
            className={`opacity-100 transition-all duration-500 ${
              !sideBarOpen ? 'scale-100' : 'scale-0'
            }`}
          >
            <RxHamburgerMenu />
          </div>
        )}
      </div>
    </div>
  );
}
