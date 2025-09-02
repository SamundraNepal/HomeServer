import heic2any from 'heic2any';

export async function handleHeicConvert(imageURL) {
  
  
    try {
      // Fetch the image as a blob
      const response = await fetch(imageURL);
      const blob = await response.blob();

      // Convert the HEIC file to PNG
      const convertedBlob = await heic2any({
        blob: blob,
        toType: 'image/png',
      });

      // Create a URL for the converted image
      const convertedUrl = URL.createObjectURL(convertedBlob);
      
      // Return the converted image URL
      return convertedUrl;
    } catch (error) {
      console.error('Something went wrong during conversion:', error.message);
      throw new Error(error.message); // You could throw an error here to be handled later
    }

}
