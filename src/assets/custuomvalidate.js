import * as yup from 'yup'

// Extender Yup con métodos personalizados
yup.addMethod(yup.string, 'noSpaces', function (message = 'No se permiten espacios') {
  return this.test('no-spaces', message, function (value) {
    const { path, createError } = this
    if (!value) return true
    if (/\s/.test(value)) {
      return createError({ path, message })
    }
    return true
  })
})

// Auto-trim + validación
yup.addMethod(yup.string, 'trimmedAndValid', function (message = 'No puede tener vacio') {
  return this.transform((value) => (value ? value.trim() : value)).test(
    'trimmed-and-valid',
    message,
    function (value) {
      const { path, createError } = this
      if (value && value.length === 0) {
        return createError({ path, message })
      }
      return true
    },
  )
})

// Validación que muestra error pero NO modifica el valor
yup.addMethod(yup.string, 'noEdgeSpaces', function (message = 'Hay espacios al inicio o final') {
  return this.test('no-edge-spaces', message, function (value) {
    const { path, createError } = this

    if (!value) return true

    // Solo verifica, NO hace trim
    const hasLeadingSpace = value.startsWith(' ')
    const hasTrailingSpace = value.endsWith(' ')

    if (hasLeadingSpace || hasTrailingSpace) {
      return createError({
        path,
        message: message || 'No se permiten espacios al inicio o final',
      })
    }

    return true
  })
})

// Solo validación de espacios repetidos
yup.addMethod(
  yup.string,
  'noRepeatedSpaces',
  function (message = 'No se permiten espacios repetidos') {
    return this.test('no-repeated-spaces', message, function (value) {
      const { path, createError } = this
      if (!value) return true

      if (/\s{2,}/.test(value.trim())) {
        return createError({ path, message })
      }
      return true
    })
  },
)

export { yup }
