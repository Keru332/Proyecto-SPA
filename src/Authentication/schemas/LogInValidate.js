import { yup } from '@/assets/custuomvalidate'

export const schema = yup.object({
  user: yup
    .string()
    .required('El usuario es requerido')
    .noSpaces('El usuario no puede contener espacios'),
  password: yup.string().required('La contraseña es requerida'),
})
