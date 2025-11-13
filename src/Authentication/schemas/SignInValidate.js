import { yup } from '@/assets/custuomvalidate'

export const schema = yup.object({
  user: yup.string().required('El usuario es requerido').noEdgeSpaces().noRepeatedSpaces(),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'Debe tener minimo 8 caracteres')
    .noEdgeSpaces()
    .noRepeatedSpaces(),
  Fullname: yup.string().required('El nombre es requerido').noEdgeSpaces().noRepeatedSpaces(),
  correo: yup
    .string()
    .email('El email es invalido')
    .required('El correo es requerido')
    .noEdgeSpaces()
    .noRepeatedSpaces(),

  confirmPassword: yup
    .string()
    .required('la confirmacion es requerida')
    .noEdgeSpaces()
    .noRepeatedSpaces()
    .test('passwords-match', 'Las contraseñas no coinciden', function (value) {
      return this.parent.password === value
    }),
})
