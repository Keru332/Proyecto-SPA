
<script setup>
import formpaq from '@/PaquetesSection/components/CrearPaquete.vue'
import formtrat from '@/TratamientoSection/components/CrearTratamiento.vue'
import { ref } from 'vue';
import { onMounted } from 'vue';
const op=ref(0);


 function Trat(){

   op.value=2
 }
  function Paq(){

   op.value=1
 }
  function Cat(){
   alert("Todavia no se que poner aqui :D");
   op.value=3
 }




</script>
<template>
    <div class="admin-container">
        <div class="sidebar">
            <div class="logo">
                <h1>Panel Admin</h1>
            </div>
            <ul class="menu">
                <li><a href="#" @click="Trat()"><i>➕</i>Tratamientos</a></li>
                <li><a href="#" @click="Paq()"><i>➕</i>Paquetes</a></li>
                <li><a href="#" @click="Cat()"><i>➕</i>Proximamente...</a></li>
            </ul>
        </div>

        
        <div class="main-content">
            <div class="form">
                <form action="" class="Paquetes" v-if="op==1">
                <formpaq></formpaq>
                </form>
                <form action="" class="Tratamientos" v-else-if="op==2">   
                <formtrat></formtrat>
                </form>


            </div>

        </div>
    </div>
</template>
<style scoped src="./CSS/admin.css"></style>

