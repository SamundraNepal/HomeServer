import Image from "next/image";


export default function VideoComponent({ src, alt, width, height, className = "", blurDataURL }) {



  const fixedSrc = src.replace(/\/\//g, '/');
  return (
    <div>
      {/* Render video initially and show loading until isLoaded is true */}

      <Image
      src={fixedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      blurDataURL={blurDataURL} // optional prop for LQIP
      placeholder={blurDataURL ? "blur" : "empty"}
      quality={20}
 />
   {/*   <video
        onCanPlay={handleCanPlay}
        className={`border-4 cursor-pointer transition-all duration-300 ${
          isTick ? 'p-2' : 'p-0'
        } hover:border-green-300`}
        preload="auto"
        height={400}
        width={400}
        style={{ display: isLoaded ? 'block' : 'none' }}  // Hide video until it's loaded
      >
        <source src={items?.videoURL} type="video/mp4" alt={items?.videoName} />
      </video>*/}
    </div>
  );
}
