const User = mongoose.models.User || require('../models/Users');
const Token = mongoose.models.Token || require("../models/Tokens");

const getRegisterUser = async (username, password) => {
  const user = await User.findOne({ username, password });
  if(!user) return null;
  
  return user;
};

const getUserRoles = async (username , password) => {
  const user = await User.findOne({ username, password });
  const userRoles = Object.values(user.roles).filter(Boolean);
  return userRoles  
}

const deleteToken = async (token) => {
  await Token.deleteOne({ token });
};

module.exports = {getRegisterUser, getUserRoles, deleteToken};
