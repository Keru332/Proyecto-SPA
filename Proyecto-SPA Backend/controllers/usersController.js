const User = require('../models/users');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const userController = {
  getAll: async (req, res) => {
    try {
      const data = await User.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await User.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // REGISTRO DE USUARIO
  register: async (req, res) => {
    try {
      const { username, password, role = 'user' , email, fullname} = req.body;

      // Validaciones básicas
      if (!username || !password) {
        return res.status(400).json({ error: 'Username y password son requeridos' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      // Crear usuario
      const nuevoUsuario = await User.create({ username, password, role, email, fullname });

      // Generar token
      const token = generateToken(nuevoUsuario);

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: nuevoUsuario,
        token: token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
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
      const eliminado = await User.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // LOGIN
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username y password son requeridos' });
      }

      const user = await User.findByUsername(username);

      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const isValidPassword = await User.verifyPassword(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar token
      const token = generateToken(user);

      // Eliminar password_hash de la respuesta
      const { password_hash, ...userWithoutPassword } = user;

      res.json({
        message: 'Login exitoso',
        user: userWithoutPassword,
        token: token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updatePassword: async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;

    // Validar nueva contraseña
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Obtener usuario con el método del modelo
    const user = await User.getById(userId);
     if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar la contraseña antigua usando método del modelo

    const pass = await User.getHashed(userId)
    if (!pass) {
      return res.status(400).json({ error: 'Error al actualizar' });
    }
    const valid = await User.verifyPassword(oldPassword, pass.password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    // Actualizar la contraseña usando método del modelo
    const updatedUser = await User.updatePassword(userId, newPassword);

    res.json({
      message: 'Contraseña actualizada correctamente',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ error: `Error al actualizar la contraseña ${error}` });
  }
},

updateProfile: async (req, res) => {
  try {
    const { username, correo } = req.body;

    if (!username || !correo) {
      return res.status(400).json({ error: 'Faltan campos requeridos (username o correo)' });
    }

    const actualizado = await User.updateProfile(req.params.id, { username, correo });

    if (!actualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Perfil actualizado correctamente',
      user: actualizado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
};

module.exports = userController;
