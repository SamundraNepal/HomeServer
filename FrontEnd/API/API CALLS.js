export const apiLink = 'https://api.snapforlifes.online/v1/memories';

export const base64Char =
  'data:image/png;base64,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';

export async function GetLogedUserData() {
  const token = sessionStorage.getItem('cookies');
  const response = await fetch(`${apiLink}/user/userData`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    //      credentials: "include", // Include cookies
  });

  if (response.ok) {
    const data = await response.json();
    return data; // Return the data if successful
  } else {
    const errorData = await response.json();
    throw new Error(
      `Failed to get data: ${errorData.message || 'Unknown error'}`
    );
  }
}

export async function handleAdminData() {
  const token = sessionStorage.getItem('cookies');
  try {
    const response = await fetch(`${apiLink}/users/admin/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      //      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      const userError = await response.json();
      throw new Error('Failed to get the data', userError);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the data ', err.message);
  }
}


export async function approvedData() {
  const token = sessionStorage.getItem('cookies');
  try {
    const response = await fetch(`${apiLink}/users/admin/approvedAccounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      //      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      const userError = await response.json();
      throw new Error('Failed to get the data', userError);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the data ', err.message);
  }
}

export async function loadImages() {
  const token = sessionStorage.getItem('cookies'); // Replace with the actual token

  try {
    const response = await fetch(`${apiLink}/images/images`, {
      
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error('Following is the error : ' + errorMessage.message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the images : ' + err.message);
  }
}

export async function loadVideos() {
  const token = sessionStorage.getItem('cookies'); // Replace with the actual token

  try {
    const response = await fetch(`${apiLink}/videos/videos`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error('Following is the error : ' + errorMessage.message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the videos : ' + err.message);
  }
}

export async function loadTrashImages() {
  const token = sessionStorage.getItem('cookies'); // Replace with the actual token

  try {
    const response = await fetch(`${apiLink}/images/trashImages`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error('Following is the error : ' + errorMessage.message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the deleted images : ' + err.message);
  }
}

export async function loadTrashVideos() {
  const token = sessionStorage.getItem('cookies'); // Replace with the actual token

  try {
    const response = await fetch(`${apiLink}/videos/trashVideos`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error('Following is the error : ' + errorMessage.message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the deleted Videos : ' + err.message);
  }
}

export async function getAlbumImages({ albumName }) {
  const token = sessionStorage.getItem('cookies'); // Replace with the actual token
  try {
    const response = await fetch(`${apiLink}/images/albumImage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure Content-Type is set for JSON
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ albumName }), // Send JSON data in the body
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error('Following is the error : ' + errorMessage.message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the album images : ' + err.message);
  }
}

export async function getAlbumVideos({ albumName }) {
  const token = sessionStorage.getItem('cookies'); // Replace with the actual token
  try {
    const response = await fetch(`${apiLink}/videos/albumVideo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure Content-Type is set for JSON
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ albumName }), // Send JSON data in the body
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error('Following is the error : ' + errorMessage.message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the album images : ' + err.message);
  }
}

export async function getStorageSize() {
  const token = sessionStorage.getItem('cookies'); // Replace with the actual token

  try {
    const response = await fetch(`${apiLink}/user/getStorageSize`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error('Following is the error : ' + errorMessage.message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the storage size : ' + err.message);
  }
}


export async function getSearchFiles(searchDate) {

  const token = sessionStorage.getItem('cookies'); // Replace with the actual token

  try {
    const response = await fetch(`${apiLink}/images/searchFiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure Content-Type is set for JSON
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify({searchDate})
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error('Following is the error : ' + errorMessage.message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the searched files : ' + err.message);
  }
}

export async function getVideosSearchFiles(searchDate) {


  const token = sessionStorage.getItem('cookies'); // Replace with the actual token

  try {
    const response = await fetch(`${apiLink}/videos/searchFiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure Content-Type is set for JSON
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify({searchDate})
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error('Following is the error : ' + errorMessage.message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to get the searched files : ' + err.message);
  }
}

