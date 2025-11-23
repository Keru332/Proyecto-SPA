import { yup } from '@/assets/custuomvalidate'

export const schema = yup.object({
  user: yup
    .string()
    .required('Introduzca un nombre de usuario.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),
  password: yup
    .string()
    .required('Introduzca su contraseña.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),
})

