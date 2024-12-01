const router = require("express").Router();
const verifyToken = require("./middleware");

const {fetchDoctors,fetchPatients,fetchProfile,RegisterUser, LoginUser, VerifyEmail, RegisterUserGoogle, LoginGoogle, GetUserProfile, ProtectedRoute, GetRequests, RoleChange, PermissionChange, VerifyUserCredentials, UpdateUserPassword} = require('../Controller/authController')

 router.post('/register', RegisterUser);
 router.post('/login', LoginUser);
 router.post('/verifyEmail', VerifyEmail);
 router.post('/verifyUser', VerifyUserCredentials);
 router.post('/registerGoogle', RegisterUserGoogle);
 router.post('/loginGoogle', LoginGoogle);
 router.post('/updatePassword', UpdateUserPassword);

 router.get('/fetchDoctors', fetchDoctors);
 router.get('/fetchPatients', fetchPatients);

 router.post('/getProfile', verifyToken, GetUserProfile);
 
 router.get('/fetchProfile', verifyToken, fetchProfile);

 router.post('/protectedRoute', verifyToken, ProtectedRoute);
 router.post('/getRequests', verifyToken, GetRequests);
 router.post('/roleChange', verifyToken, RoleChange);
 router.post('/permissionChange', verifyToken, PermissionChange);
 


module.exports = router;