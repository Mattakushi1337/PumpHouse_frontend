<template>
    <div class="all-residents">
        <h2>Список дачников</h2>
        <ul>
            <li v-for="resident in residents" :key="resident.id">
                <strong>{{ resident.fio }}</strong> - Площадь огорода: {{ resident.area }} м. кв., Дата подключения: {{
                    formatDateTime(resident.start_date) }}
                <button @click="editResident(resident.id)">Редактировать</button>
                <button @click="deleteResident(resident.id)">Удалить</button>
            </li>
        </ul>
    </div>
</template>
  
<script>
import axios from 'axios';
import moment from 'moment';

export default {
    data() {
        return {
            residents: [],
        };
    },
    mounted() {
        this.fetchResidents();
    },
    methods: {
        fetchResidents() {
            axios.get('http://127.0.0.1:8000/residents')
                .then(response => {
                    this.residents = response.data;
                })
                .catch(error => {
                    console.error('Ошибка при получении списка дачников:', error);
                });
        },
        formatDateTime(dateTime) {
            return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
        },
        editResident(residentId) {
            this.$router.push({ name: 'EditResident', params: { id: residentId } });
        },
        deleteResident(residentId) {
            axios.delete(`http://127.0.0.1:8000/residents/${residentId}`)
                .then(response => {
                    console.log('Дачник успешно удален:', response.data);
                    this.fetchResidents();
                })
                .catch(error => {
                    console.error('Ошибка при удалении дачника:', error);
                });
        },
    },
};
</script>
  
<style>
.all-residents {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.all-residents h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

.all-residents ul {
    list-style: none;
    padding: 0;
}

.all-residents li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.all-residents button {
    margin-left: 10px;
}
</style>
  