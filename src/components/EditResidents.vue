<template>
    <div class="edit-resident">
        <h2>Редактировать дачника</h2>
        <form @submit.prevent="updateResident">
            <label for="fio">ФИО:</label>
            <input type="text" v-model="fio" id="fio" required>
            <br>
            <label for="area">Площадь огорода:</label>
            <input type="number" v-model="area" id="area" required>
            <br>
            <label for="startDate">Дата подключения:</label>
            <input type="date" v-model="startDate" id="startDate" required>
            <br>
            <label for="time">Время подключения:</label>
            <input type="time" v-model="time" id="time" required>
            <br>
            <button type="submit">Сохранить</button>
        </form>
    </div>
</template>
  
<script>
import axios from 'axios';
import moment from 'moment';

export default {
    data() {
        return {
            fio: '',
            area: '',
            startDate: null,
            time: null,
        };
    },
    mounted() {
        this.fetchResident(); 
    },
    methods: {
        fetchResident() {
            const residentId = this.$route.params.id; 
            axios.get(`http://127.0.0.1:8000/residents/${residentId}`)
                .then(response => {
                    const resident = response.data;
                    this.fio = resident.fio;
                    this.area = resident.area;
                    this.startDate = moment(resident.start_date).format('YYYY-MM-DD');
                    this.time = moment(resident.start_date).format('HH:mm');
                })
                .catch(error => {
                    console.error('Ошибка при получении данных дачника:', error);
                });
        },
        updateResident() {
            const residentId = this.$route.params.id; 

            if (!this.fio || !this.area || !this.startDate || !this.time) {
                return;
            }

            const dateTimeString = moment(this.startDate + ' ' + this.time).format('YYYY-MM-DD HH:mm:ss');

            const updatedResident = {
                fio: this.fio,
                area: this.area,
                start_date: dateTimeString,
            };

            axios.put(`http://127.0.0.1:8000/residents/${residentId}`, JSON.stringify(updatedResident), {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    console.log('Дачник успешно обновлен:', response.data);
                    this.$router.push({ name: 'home' });
                })
                .catch(error => {
                    console.error('Ошибка при обновлении дачника:', error);
                });
        },
    },
};
</script>
  
<style>
.edit-resident {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-resident h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

.edit-resident label {
    display: block;
    margin-bottom: 8px;
}

.edit-resident input {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.edit-resident button {
    background-color: #0481f7;
    color: #fff;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.edit-resident button:hover {
    background-color: #0362c3;
}

.edit-resident button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
  