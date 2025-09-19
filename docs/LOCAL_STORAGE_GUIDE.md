# Local Storage Options for Gallery App

## Current Implementation
The app currently stores images in browser memory only. Here are options to connect to local storage:

## Option 1: Browser File System API (Limited Support)
```javascript
// Only works in Chrome/Edge with user permission
if ('showDirectoryPicker' in window) {
  const dirHandle = await window.showDirectoryPicker();
  // Read/write files directly to local folder
}
```

## Option 2: Local Storage with Base64
```javascript
// Store images as base64 in localStorage (size limited)
const storeImageLocally = (file, folder) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const images = JSON.parse(localStorage.getItem('gallery-images') || '[]');
    images.push({
      id: Date.now(),
      name: file.name,
      folder,
      data: e.target.result, // base64 string
      isFavorite: false
    });
    localStorage.setItem('gallery-images', JSON.stringify(images));
  };
  reader.readAsDataURL(file);
};
```

## Option 3: IndexedDB for Larger Storage
```javascript
// Better for larger images, no size limit
const dbRequest = indexedDB.open('GalleryDB', 1);
dbRequest.onsuccess = (event) => {
  const db = event.target.result;
  const transaction = db.transaction(['images'], 'readwrite');
  const store = transaction.objectStore('images');
  
  store.add({
    id: Date.now(),
    name: file.name,
    folder,
    data: arrayBuffer, // raw file data
    isFavorite: false
  });
};
```

## Option 4: Electron App (Full Local Access)
```javascript
// Convert to desktop app with full file system access
const { dialog, app } = require('electron');

// Select root folder
const result = await dialog.showOpenDialog({
  properties: ['openDirectory']
});

// Read/write to actual local folders
const fs = require('fs');
const path = require('path');

const saveImage = (imageBuffer, folderName, fileName) => {
  const folderPath = path.join(rootFolder, folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  fs.writeFileSync(path.join(folderPath, fileName), imageBuffer);
};
```

## Option 5: Backend with File Upload
```javascript
// Add Node.js/Express backend for file management
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'default';
    const folderPath = path.join('uploads', folder);
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
```

## Recommended Implementation
For immediate use: **Option 2 (localStorage)** - works in all browsers
For production: **Option 4 (Electron)** - true desktop app with full file access
For web deployment: **Option 5 (Backend)** - server-side file management

Would you like me to implement any of these options?