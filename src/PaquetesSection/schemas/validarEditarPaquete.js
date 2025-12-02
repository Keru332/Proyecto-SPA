import * as yup from 'yup'

export const editarPaqueteSchema = yup.object().shape({
    duraciontotal: yup.number()
        .typeError('Introduzca una duración válida.')
        .required('Introduzca la duración total.')
        .min(5, 'La duración mínima es 5 minutos.')
        .max(1000, 'La duración máxima es 1000 minutos.'),

    preciopaquete: yup.number()
        .typeError('Introduzca un precio válido.')
        .required('Introduzca el precio del paquete.')
        .min(1, 'El precio mínimo es 1.')
        .max(9999, 'El precio máximo es 9999.'),

    tratamientos: yup.array()
        .of(yup.string().required('El ID del tratamiento es obligatorio.'))
        .min(1, 'Debe seleccionar al menos un tratamiento.'),

    nombrepaquete: yup.string()
        .required('Introduzca el nombre del paquete.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(100, 'El nombre no puede exceder 100 caracteres.')
        .notOneOf([' '], 'El nombre no puede ser solo espacios.'),
})
