<template>
  <div class="login-container">
    <h1>Crear Tratamiento</h1>

    <Form class="login-form" :validation-schema="crearTratamientoSchema" @submit="submitForm">
      <!-- Nombre -->
      <div class="user-container">
        <label for="nombre">Nombre del Tratamiento</label>
        <Field
          id="nombre"
          name="nombre"
          v-model="tratamiento.nombre"
          placeholder="Ejemplo: Masaje relajante"
          type="text"
          class="input"
        />
        <ErrorMessage name="nombre" class="error-message" />
      </div>

      <!-- Descripción -->
      <div class="user-container">
        <label for="descripcion">Descripción</label>
        <Field
          as="textarea"
          id="descripcion"
          name="descripcion"
          rows="4"
          cols="40"
          maxlength="250"
          v-model="tratamiento.descripcion"
          placeholder="Describe el tratamiento"
          class="input"
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
          v-model="tratamiento.duracion"
          placeholder="0"
          class="input"
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
          v-model="tratamiento.precio"
          placeholder="0"
          class="input"
        />
        <ErrorMessage name="precio" class="error-message" />
      </div>

      <!-- Categoría -->
      <div class="user-container">
        <label for="categoria">Categoría</label>
        <Field as="select" id="categoria" name="codcategoria" class="input">
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

      <button type="submit" class="submit">Crear Tratamiento</button>

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </Form>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { crearTratamientoSchema } from '../schemas/validarCrearTratamiento'
import { useCrearTratamiento } from './JS/CrearTratamiento'

const { tratamiento, categorias, submitForm, mensaje } = useCrearTratamiento()
</script>

<style scoped src="./CSS/CrearTratamiento.css"></style>
