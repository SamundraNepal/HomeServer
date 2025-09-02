import Image from 'next/image';
import Tick from './tick';
import { useEffect, useRef, useState } from 'react';
import { base64Char } from '@/API/API CALLS';
import ImageComponent from './reuseFiles/reuseImage';

export default function ViewImage({
  index,
  items,
  indexOne,
  viewImage,
  handleSelectedFiles,
  scrollPosition
}) {
  const [isTick, setIsTicked] = useState(false);
  const [removeDuplicate, setIsDuplicate] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const imageDiv = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const[base64 , setIsBase64] = useState('');


  useEffect(() =>{
    if(isVisible)
    {
      Base64Converter();
    }
  },[isVisible])

   // States to track the recycled image slots

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


  async function Base64Converter () {
    const token = sessionStorage.getItem('cookies');
    try {
      const response = await fetch(`https://api.snapforlifes.online/v2/memories/whiteList/getImageBase64Code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({imageurl:items.imageURL}),
      });
  
      if (!response.ok) {
        return;

      }
      const data = await response.json();
      setIsBase64(data.message);
      
    } catch (err) {
  console.log('Error loading base64 code' , err.message);
    }
  };
  

  //this is to optimize the images for example if they are not in view dont show them
  //this saves performance and images loades faster
  useEffect(() => {
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {

            setIsVisible(true);

          observer.unobserve(entry.target);
          //elemet is visisble so stop tracking it
       } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.25}
      // this is what % of the images should be visible before it stop tracking
    );

    if (imageDiv) {
      observer.observe(imageDiv.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (imageDiv.current) observer.unobserve(imageDiv.current);
    };
  }, [scrollPosition]);




  return (
    <div
      key={index}
      className={`relative ${
        showImage ? 'scale-100' : 'scale-0'
      } transition-all duration-300`}
    >
      <Tick setIsTicked={setIsTicked} />
      {
        <div
          ref={imageDiv}
          key={index}
          onClick={(e) => viewImage(items, indexOne, index , base64)}
        >
          {isVisible ? (

            <ImageComponent  
            src={items?.imageURL}
            alt={'useer image'}
            width={400}
            height={400}
            className={`border-4 hover:border-green-500  cursor-pointer transition-all duration-300 ${
              isTick ? 'p-2' : 'p-0'
            }`}
            blurDataURL={ base64 === "" ? base64Char : base64}
            placeholder={base64 != "" ? "blur" : "empty"}
           />
                   
          ) : (
            <div
              className="border-2 bg-slate-200"
              style={{ width: '100px', height: '400px' }}
            >
            </div>
          )}
        </div>
      }
    </div>
  );
}
