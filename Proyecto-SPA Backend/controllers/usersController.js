const UserService = require('../services/userService');

const userController = {
  getAll: async (req, res) => {
    try {
      const data = await UserService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await UserService.getById(req.params.id);
      res.json(data);
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  register: async (req, res) => {
    try {
      const { username, password, role = 'user', email, fullname } = req.body;

      const nuevoUsuario = await UserService.register({
        username,
        password,
        role,
        email,
        fullname
      });

      const token = UserService.generateToken(nuevoUsuario);

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: nuevoUsuario,
        token: token
      });
    } catch (error) {
      if (error.message === 'Username y password son requeridos' || 
          error.message === 'La contraseña debe tener al menos 6 caracteres' ||
          error.message === 'El usuario ya existe') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      // Nota: Este método no existe en UserService, lo mantengo por compatibilidad
      // Considera mover la lógica de update a UserService también
      const User = require('../models/users');
      const actualizado = await User.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      // Nota: Este método no existe en UserService, lo mantengo por compatibilidad
      // Considera mover la lógica de delete a UserService también
      const User = require('../models/users');
      const eliminado = await User.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await UserService.login(username, password);
      const token = UserService.generateToken(user);

      res.json({
        message: 'Login exitoso',
        user: user,
        token: token
      });
    } catch (error) {
      if (error.message === 'Username y password son requeridos') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Credenciales inválidas') {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.params.id;

      const updatedUser = await UserService.updatePassword(userId, oldPassword, newPassword);

      res.json({
        message: 'Contraseña actualizada correctamente',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          role: updatedUser.role
        }
      });
    } catch (error) {
      if (error.message === 'La nueva contraseña debe tener al menos 6 caracteres' ||
          error.message === 'Contraseña actual incorrecta') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { username, correo } = req.body;
      const userId = req.params.id;

      const actualizado = await UserService.updateProfile(userId, { username, correo });

      res.json({
        message: 'Perfil actualizado correctamente',
        user: actualizado,
      });
    } catch (error) {
      if (error.message === 'Faltan campos requeridos (username o correo)') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;