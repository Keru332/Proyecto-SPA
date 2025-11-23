import { yup } from '@/assets/custuomvalidate'

export const editSchema = yup.object({
  Fullname: yup
    .string()
    .required('Introduzca su nombre completo.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),

  correo: yup
    .string()
    .email('El email es inválido.')
    .required('Introduzca su correo.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),
})
