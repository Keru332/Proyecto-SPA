<template>
  <div class="login-container">
    <h1>Editar Tratamiento</h1>

    <Form class="login-form" :validation-schema="editarTratamientoSchema" @submit="submitForm">

      <!-- Nombre -->
      <div class="user-container">
        <label for="nombre">Nombre del Tratamiento</label>
        <Field
          id="nombre"
          name="nombre"
          type="text"
          class="input"
          v-model="tratamientoF.nombre"
        />
        <ErrorMessage name="nombre" class="error-message" />
      </div>

      <!-- Descripción -->
      <div class="user-container">
        <label for="descripcion">Descripción</label>
        <Field
          id="descripcion"
          name="descripcion"
          type="text"
          class="input"
          v-model="tratamientoF.descripcion"
        />
        <ErrorMessage name="descripcion" class="error-message" />
      </div>

      <!-- Duración -->
      <div class="user-container">
        <label for="duracion">Duración (minutos)</label>
        <Field
          id="duracion"
          name="duracion"
          type="number"
          min="5"
          max="300"
          class="input"
          v-model="tratamientoF.duracion"
        />
        <ErrorMessage name="duracion" class="error-message" />
      </div>

      <!-- Precio -->
      <div class="user-container">
        <label for="precio">Precio ($)</label>
        <Field
          id="precio"
          name="precio"
          type="number"
          min="1"
          max="9999"
          class="input"
          v-model="tratamientoF.precio"
        />
        <ErrorMessage name="precio" class="error-message" />
      </div>

      <!-- Categoría -->
      <div class="user-container">
        <label for="categoria">Categoría</label>
        <Field
          as="select"
          id="categoria"
          name="codcategoria"
          class="input"
          v-model="tratamientoF.codcategoria"
        >
          <option value="" disabled>Selecciona una categoría</option>
          <option
            v-for="categoria in categorias"
            :key="categoria.codcategoria"
            :value="categoria.codcategoria"
          >
            {{ categoria.nombrecategoria }}
          </option>
        </Field>
        <ErrorMessage name="codcategoria" class="error-message" />
      </div>

      <button type="submit" class="submit">Editar Tratamiento</button>

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </Form>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { editarTratamientoSchema } from '../schemas/validarEditarTratamiento'
import { useEditarTratamiento } from './JS/EditarTratamiento'

const { tratamientoF, mensaje, categorias, submitForm } = useEditarTratamiento()
</script>

<style scoped src="./CSS/CrearTratamiento.css"></style>
