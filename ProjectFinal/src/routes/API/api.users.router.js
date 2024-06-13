const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user.controller.js');
const userController = new UserController();

const upload = require('../../middleware/multer.js');

router.get('/', userController.getAllUsers);
router.delete('/', userController.deleteInactiveUsers);

router.post('/createAccount', userController.createUser);

router.put('/premium/:uid', userController.changeUserRole);
router.post('/premium/:uid/documents',
  upload.fields([{ name: 'document' }, { name: 'products' }, { name: 'profile' }]),
  userController.uploadDocuments);

module.exports = router;