import { useEffect, useState } from 'react';
import LockAndUnlock from './SetPassword/lockAndUnLock';

export default function ViewAlbums({ photoAlbums, HandleViewAlbums }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      {photoAlbums.length > 0 && (
        <div
          className={`flex flex-row text-center flex-wrap col-span-3 transition-all max-sm:flex-col`}
        >
          <span className="font-bold text-slate-500">Albums</span>

          {photoAlbums.map((items, index) => (
            <div
              key={index}
              className={`flex flex-col items-center cursor-pointer h-5/5 transition-all duration-300 ${
                isOpen ? 'scale-100' : 'scale-0'
              }`}
            >
              <LockAndUnlock
                HandleViewAlbums={HandleViewAlbums}
                items={items}
                photoAlbums={photoAlbums}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
