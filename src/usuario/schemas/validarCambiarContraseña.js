import { yup } from '@/assets/custuomvalidate'

export const changePasswordSchema = yup.object({
  oldPassword: yup
    .string()
    .required('Debe introducir la contraseña actual.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),

  newPassword: yup
    .string()
    .required('Introduzca la nueva contraseña.')
    .min(8, 'Debe tener mínimo 8 caracteres.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),

  confirmPassword: yup
    .string()
    .required('Debe confirmar la nueva contraseña.')
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),
})
