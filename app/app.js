class Albums {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const albums = await this.getAlbums();
      
      this.paintAlbums(albums);
    } catch (error) {
      console.error(`Error initializing albums: ${error.message}`);
    }
  }

  async getAlbums() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const albums = await response.json();

      return albums;
    } catch (error) {
      throw new Error(`Error fetching albums: ${error.message}`);
    }
  }

  paintAlbums(albums) {
    const albumsContainer = document.getElementById('album-list');

    albums.forEach((album) => {
      const albumElement = document.createElement('li');
      albumElement.classList.add('list-group-item');

      albumElement.innerHTML = `
        <a href='album.html?albumId=${album.id}'>
          <h2>${album.id}. ${album.title}</h2>
        </a>
      `;

      albumsContainer.appendChild(albumElement);
    });
  }
}

class Album {
  constructor(albumId) {
    this.albumId = albumId;
    this.album = null;
    this.photos = [];
    this.init();
  }

  async init() {
    try {
      await this.getAlbum();
      await this.getPhotos();
      this.paintAlbum();
    } catch (error) {
      console.error(`Error initializing album: ${error.message}`);
    }
  }

  async getAlbum() {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${this.albumId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const album = await response.json();

      this.album = album;
    } catch (error) {
      throw new Error(`Error fetching album: ${error.message}`);
    }
  }

  async getPhotos() {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos?albumId=${this.albumId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const photos = await response.json();

      this.photos = photos;
    } catch (error) {
      throw new Error(`Error fetching photos: ${error.message}`);
    }
  }

  paintAlbum() {
    const albumContainer = document.getElementsByClassName('album-photos')[0];

    if (this.photos.length === 0) {
      albumContainer.innerHTML += '<p>No photos available for this album.</p>';
      return;
    }

    const photosList = document.createElement('div');
    photosList.classList.add('row', 'row-cols-1', 'row-cols-md-3', 'g-4');

    this.photos.forEach((photo) => {
      const photoElement = document.createElement('div');
      photoElement.classList.add('col');

      photoElement.innerHTML = `
        <div class="card h-100">
          <img src="${photo.url}" class="card-img-top" alt="${photo.title}">
          <div class="card-body">
            <p class="card-text text-center">${photo.title}</p>
          </div>
        </div>
      `;

      photosList.appendChild(photoElement);
    });

    albumContainer.appendChild(photosList);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const albumId = new URLSearchParams(window.location.search).get('albumId');

  new Album(albumId);
});

const albums = new Albums();
