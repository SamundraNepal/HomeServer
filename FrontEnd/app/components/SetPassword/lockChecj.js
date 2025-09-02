import { useState } from 'react';
import { IoLockClosedOutline } from 'react-icons/io5';
import { IoLockOpenOutline } from 'react-icons/io5';

export default function CheckLock() {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <>
      {isLocked ? (
        <IoLockClosedOutline />
      ) : (
        <IoLockOpenOutline onClick={(e) => setCreatePin(true)} />
      )}
    </>
  );
}
