import Image from 'next/image';
import Tick from './tick';
import { useEffect, useState } from 'react';

export default function TrashFiles({
  index,
  items,
  viewImage,
  handleSelectedFiles,
}) {
  const [isTick, setIsTicked] = useState(false);
  const [removeDuplicate, setIsDuplicate] = useState(false);
  useEffect(() => {
    if (isTick) {
      //  handleSelectedFiles(indexOne, index);
      setIsDuplicate(true);
    } else {
      if (removeDuplicate) {
        //  handleSelectedFiles(indexOne, index);
        setIsDuplicate(false);
      }
    }
  }, [isTick]);
  return (
    <div key={index} className="relative">
      <Tick setIsTicked={setIsTicked} />
      <div key={index} onClick={(e) => viewImage(items, indexOne, index)}>
        <Image
          src={items?.imageURL}
          alt={items.imageName}
          width={400}
          height={400}
          quality={10}
          blurDataURL="https://i.pinimg.com/736x/8a/b2/1b/8ab21b1edaa6d6d3405af14cd018a91b.jpg"
          className={`border-4 hover:border-green-500 cursor-pointer transition-all duration-300 ${
            isTick ? 'p-2' : 'p-0'
          }`}
          priority
        />

        <video
          className={`border-4 hover:border-green-500 cursor-pointer transition-all duration-300  h-5/5 w-5/5 ${
            isTick ? 'p-2' : 'p-0'
          }`}
        >
          <source src={items?.videoURL} alt={items.viodeoName} />
        </video>

        {/* onLoad={ShowImagesLoaded}
          style={{
            display: onLoadCompleteImage ? 'block' : 'none',
          }} // Hide the image until fully loaded */}
      </div>
    </div>
  );
}
