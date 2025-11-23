import { yup } from '@/assets/custuomvalidate'

export const schema = yup.object({
  user: yup.string().required('Introduzca su usuario.').noEdgeSpaces().noRepeatedSpaces(),
  password: yup
    .string()
    .required('Introduzca una contraseña.')
    .min(8, 'La contraseña debe tener mínimo 8 caracteres.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),
  Fullname: yup.string().required('Introduzca su usuario.').noEdgeSpaces().noRepeatedSpaces(),
  correo: yup
    .string()
    .email('El email es inválido.')
    .required('Introduzca su correo.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),

  confirmPassword: yup
    .string()
    .required('Repita la contraseña para confirmar.')
    .noEdgeSpaces()
    .noRepeatedSpaces()
    .test('passwords-match', 'Las contraseñas no coinciden', function (value) {
      return this.parent.password === value
    }),
})
