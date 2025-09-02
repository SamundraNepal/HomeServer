import Sppiner from '@/Components/Spiner';
import Tick from './tick';
import { useEffect, useRef, useState } from 'react';
import VideoCompopnenet from './reuseFiles/reuseVideo';
import { base64Char } from '@/API/API CALLS';

export default function ViewVideo({
  index,
  items,
  indexOne,
  viewImage,
  handleSelectedFiles,
  scrollPosition,
}) {
  const [isTick, setIsTicked] = useState(false);
  const [removeDuplicate, setIsDuplicate] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const videoDiv = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const[base64 , setIsBase64] = useState('');



  useEffect(()=>{
    Base64Converter();
  },[])

  // Handles the selection logic and removing duplicates
  useEffect(() => {
    setShowImage(true);

    if (isTick) {
      handleSelectedFiles(indexOne, index);
      setIsDuplicate(true);
    } else {
      if (removeDuplicate) {
        handleSelectedFiles(indexOne, index);
        setIsDuplicate(false);
      }
    }
  }, [isTick]);

  // IntersectionObserver to track visibility of the video
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing once in view
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.25 }
    );

    if (videoDiv.current) {
      observer.observe(videoDiv.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (videoDiv.current) observer.unobserve(videoDiv.current);
    };
  }, [scrollPosition]);


  async function Base64Converter () {
    const token = sessionStorage.getItem('cookies');
    try {
      const response = await fetch(`https://api.snapforlifes.online/v2/memories/whiteList/getImageBase64Code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({imageurl:items.thumbnailsURL}),
      });
  
      if (!response.ok) {
        return;

      }
      const data = await response.json();
      setIsBase64(data.message);
      
    } catch (err) {
  console.log('Error loading base64 code ');
    }
  };
  




  // Conditionally render the video based on visibility and loading state
  return (
    <>
    
    <div
      key={index}
      className={`relative ${showImage ? 'scale-100' : 'scale-0'} transition-all duration-300`}
    >
      <div className="absolute z-10">
        <Tick setIsTicked={setIsTicked} />
      </div>
      {/* Position the Tick on top */}
      <div
        ref={videoDiv}
        onClick={(e) => viewImage(items, indexOne, index)}
      >
        {isVisible ? (
   <VideoCompopnenet  
    src={items?.thumbnailsURL}
    alt={'user video'}
   width={400}
   height={400}
   className={`border-4 hover:border-green-500  cursor-pointer transition-all duration-300 ${
    isTick ? 'p-2' : 'p-0'
   }`}
   blurDataURL={ base64 === "" ? base64Char : base64}
   placeholder={base64 != "" ? "blur" : "empty"}
  />        ) : (
          <div className="border-2 bg-slate-50 h-[300px]"></div>
        )}
      </div>
    </div>

    </>

  );
}
