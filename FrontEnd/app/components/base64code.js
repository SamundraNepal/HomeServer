
const fetchBase64Image = (imageURL) => {
    return new Promise((resolve, reject) => {
      const token = sessionStorage.getItem('cookies');
      if (!token) {
        reject('No token found');
        return;
      }
  
      fetch('https://api.snapforlifes.online/v2/memories/whiteList/getImageBase64Code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageurl: imageURL }),
      })
        .then((response) => {
          if (!response.ok) {
            reject('Failed to fetch Base64 image');
          }
          return response.json();
        })
        .then((data) => {
          resolve(data.message); // Base64 string
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  