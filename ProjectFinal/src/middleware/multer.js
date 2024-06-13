const multer = require('multer');
const fs = require('fs').promises;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let destinationFolder;

    switch (file.fieldname) {
      case 'profile':
        destinationFolder = './src/uploads/profiles';
        break;
      case 'products':
        destinationFolder = './src/uploads/products';
        break;
      case 'document':
      default:
        destinationFolder = './src/uploads/documents';
    }

    try {
      await fs.access(destinationFolder);
    } catch (error) {
      await fs.mkdir(destinationFolder, { recursive: true });
    }

    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
