const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserService = {
  getAll: async () => {
    return await User.getAll();
  },

  getById: async (id) => {
    const user = await User.getById(id);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  },

  register: async (userData) => {
    const { username, password, role = 'user', email, fullname } = userData;

    if (!username || !password) {
      throw new Error('Username y password son requeridos');
    }

    if (username.length > 50) {
      throw new Error('El username no puede exceder 50 caracteres');
    }

    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    if (!isStrongPassword(password)) {
      throw new Error('La contraseña debe contener mayúsculas, minúsculas, números y símbolos');
    }

    if (role && !['user', 'admin'].includes(role)) {
      throw new Error('Rol no válido. Debe ser: user, admin');
    }

    if (email) {
      if (email.length > 70) {
        throw new Error('El correo no puede exceder 70 caracteres');
      }
      if (!isValidEmail(email)) {
        throw new Error('El formato del correo electrónico no es válido');
      }
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    return await User.create({ username, password, role, email, fullname });
  },

  login: async (username, password) => {
    if (!username || !password) {
      throw new Error('Username y password son requeridos');
    }

    const user = await User.findByUsername(username);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  findByUsername: async (username) => {
    const user = await User.findByUsername(username);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  },

  updatePassword: async (userId, oldPassword, newPassword) => {

    if (!newPassword || newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
    }

    if (!isStrongPassword(newPassword)) {
      throw new Error('La nueva contraseña debe contener mayúsculas, minúsculas, números y símbolos');
    }

    const user = await User.getById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const pass = await User.getHashed(userId);
    const valid = await User.verifyPassword(oldPassword, pass.password_hash);
    if (!valid) {
      throw new Error('Contraseña actual incorrecta');
    }

    return await User.updatePassword(userId, newPassword);
  },

  updateProfile: async (userId, profileData) => {


    const { username, correo } = profileData;

    if (!username || !correo) {
      throw new Error('Faltan campos requeridos (username o correo)');
    }

    if (username.length > 50) {
      throw new Error('El username no puede exceder 50 caracteres');
    }

    if (correo.length > 70) {
      throw new Error('El correo no puede exceder 70 caracteres');
    }

    if (!isValidEmail(correo)) {
      throw new Error('El formato del correo electrónico no es válido');
    }

    await UserService.getById(userId);
    return await User.updateProfile(userId, { username, correo });
  },

  generateToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
};



function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  return strongPasswordRegex.test(password);
}

module.exports = UserService;
