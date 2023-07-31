<template>
    <div class="create-resident">
        <h2>Создать дачника</h2>
        <form @submit.prevent="createResident">
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
            <button type="submit">Создать</button>
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
    methods: {
        createResident() {
            if (!this.fio || !this.area || !this.startDate || !this.time) {
                return;
            }

            const dateTimeString = moment(this.startDate + ' ' + this.time).format('YYYY-MM-DD HH:mm:ss');

            const newResident = {
                fio: this.fio,
                area: this.area,
                start_date: dateTimeString,
            };

            axios.post('http://127.0.0.1:8000/residents', JSON.stringify(newResident), {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    console.log('Дачник успешно создан:', response.data);
                    this.fio = '';
                    this.area = '';
                    this.startDate = null;
                    this.time = null;
                })
                .catch(error => {
                    console.error('Ошибка при создании дачника:', error);
                });
        },
    },
};
</script>
    
<style>
.create-resident {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-resident h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

.create-resident label {
    display: block;
    margin-bottom: 8px;
}

.create-resident input {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.create-resident button {
    background-color: #0481f7;
    color: #fff;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.create-resident button:hover {
    background-color: #0362c3;
}

.create-resident button:active {
    background-color: #02418c;
}
</style>
  