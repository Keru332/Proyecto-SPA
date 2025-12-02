import { yup } from '@/assets/custuomvalidate'

export const editarTratamientoSchema = yup.object({
  nombre: yup
    .string()
    .required('Introduzca el nombre del tratamiento.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),

  descripcion: yup
    .string()
    .required('Introduzca la descripción.')
    .max(250, 'Máximo 250 caracteres.')
    .noEdgeSpaces()
    .noRepeatedSpaces(),

  duracion: yup
    .number()
    .typeError('Introduzca una duración válida.')
    .required('Introduzca la duración.')
    .min(5, 'Mínimo 5 minutos.')
    .max(300, 'Máximo 300 minutos.'),

  precio: yup
    .number()
    .typeError('Introduzca un precio válido.')
    .required('Introduzca el precio.')
    .min(1, 'El precio mínimo es 1.')
    .max(9999, 'El precio máximo es 9999.'),

  codcategoria: yup
    .string()
    .required('Seleccione una categoría.')
})
