import Image from 'next/image';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ImageComponent = ({ src, alt, width, height, className = "", blurDataURL }) => {

  return (

    <div>
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      blurDataURL={blurDataURL} // optional prop for LQIP
      placeholder={blurDataURL ? "blur" : "empty"}

/>

    </div>

  );
};

export default ImageComponent;
