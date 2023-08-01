<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <div class="all-periods">
        <h2>Выберите месяцы для периодов</h2>
        <form @submit.prevent="submitForm">
            <div v-for="(period, index) in periods" :key="index" class="period">
                <label>Год:</label>
                <select v-model="period.selectedYear" @change="updateEndDate(index)">
                    <option v-for="year in years" :value="year" :key="year">{{ year }}</option>
                </select>
                <label>Месяц:</label>
                <select v-model="period.selectedMonth" @change="updateEndDate(index)">
                    <option v-for="(month, index) in months" :value="index + 1" :key="month">{{ month }}</option>
                </select>
                <p>Начальная дата: {{ formatDateTime(period.startDate, 'start') }}</p>
                <p>Конечная дата: {{ formatDateTime(period.endDate, 'end') }}</p>
            </div>
            <button type="submit">Подтвердить</button>
        </form>
        <div v-if="periodsFromServer.length > 0">
            <h2>Список всех периодов</h2>
            <ul>
                <li v-for="period in periodsFromServer" :key="period.id">
                    <strong>Начальная дата:</strong> {{ period.begin_date }}, <strong>Конечная дата:</strong> {{
                        period.end_date }}

                    <template v-if="!period.isEditing">
                        <span>Цена: {{ period.water_cost }}</span>
                        <i class="fas fa-edit" @click="enableEditing(period)"></i>
                    </template>
                    <template v-else>
                        <input type="number" v-model="period.editedCost" id="water_cost" required>
                        <button @click="saveCost(period)">Сохранить цену</button>
                    </template>

                    <template v-if="!period.isEditingVolume">
                        <span>Счётчик: {{ period.amount_volume }}</span>
                        <i class="fas fa-edit" @click="enableEditingVolume(period)"></i>
                    </template>
                    <template v-else>
                        <input type="number" v-model="period.editedVolume" id="amount_volume" required>
                        <button @click="saveVolume(period)">Сохранить счётчик</button>
                    </template>

                    <button @click="bill(period)">Выставить счета</button>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import moment from 'moment';

export default {
    data() {
        return {
            periods: [{ selectedYear: null, selectedMonth: null, startDate: null, endDate: null }],
            periodsFromServer: [],

            years: Array.from({ length: 10 }, (_, i) => moment().year() + i),
            months: [
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь',
            ],
        };
    },
    mounted() {
        this.fetchPeriodsFromServer();
    },
    created() {
        this.loadCostsForPeriods();
        this.loadVolumeForPeriods();
    },

    methods: {
        enableEditing(period) {
            period.isEditing = true;
            period.editedCost = period.water_cost;
            period.isEditingVolume = false;
        },

        enableEditingVolume(period) {
            period.isEditingVolume = true;
            period.editedVolume = period.amount_volume;
            period.isEditing = false;
        },

        fetchPeriodsFromServer() {
            axios.get('http://127.0.0.1:8000/period')
                .then(response => {
                    this.periodsFromServer = response.data;

                    this.loadCostsForPeriods();
                    this.loadVolumeForPeriods();
                })
                .catch(error => {
                    console.error('Ошибка при получении списка периодов:', error);
                });
        },
        loadCostsForPeriods() {
            this.periodsFromServer.forEach(async period => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/period/${period.id}/cost`);
                    period.water_cost = response.data[0].water_cost; // Обратите внимание на использование response.data[0]
                    period.isEditing = false;
                } catch (error) {
                    console.error('Ошибка при получении цены для периода:', error);
                }
            });
        },

        loadVolumeForPeriods() {
            this.periodsFromServer.forEach(async period => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/period/${period.id}/volume`);
                    period.amount_volume = response.data[0].amount_volume;
                    period.isEditing = false;
                } catch (error) {
                    console.error('Ошибка при получении счётчика для периода:', error);
                }
            })
        },
        updateEndDate(index) {
            const period = this.periods[index];
            if (period.selectedYear && period.selectedMonth) {
                const startDateString = `${period.selectedYear}-${period.selectedMonth}-01`;
                period.startDate = moment(startDateString).format('YYYY-MM-DD HH:mm:ss');
                period.endDate = moment(startDateString).endOf('month').format('YYYY-MM-DD HH:mm:ss');
            }
        },
        submitForm() {
            for (const period of this.periods) {
                if (period.selectedYear && period.selectedMonth) {
                    this.updateEndDate(this.periods.indexOf(period));

                    axios
                        .post('http://127.0.0.1:8000/period', {
                            begin_date: period.startDate,
                            end_date: period.endDate,
                        })
                        .then(response => {
                            this.fetchPeriodsFromServer();
                        })
                        .catch(error => {
                            console.error('Ошибка при создании периода:', error);
                        });
                } else {
                    console.error('Выберите год и месяц');
                }
            }
        },
        bill(period) {
            const periodId = period.id;
            axios
                .post(`http://127.0.0.1:8000/period/${periodId}/bill`)
                .then(response => {
                    response.data;
                })
                .catch(error => {
                    // Обработка ошибки
                    console.error('Ошибка при генерации счетов:', error);
                });
        },
        formatDateTime(dateTime, type) {
            const momentDateTime = moment.utc(dateTime);
            if (type === 'start') {
                momentDateTime.startOf('day');
            } else if (type === 'end') {
                momentDateTime.endOf('day');
            }
            return momentDateTime.format('YYYY-MM-DD HH:mm:ss');
        },
        saveCost(period) {
            const periodId = period.id;
            if (periodId) {
                const costData = {
                    water_cost: period.editedCost,
                };

                axios.post(`http://127.0.0.1:8000/period/${periodId}/cost`, costData)
                    .then(response => {
                        console.log('Цена успешно обновлена:', response.data);
                        period.isEditing = false;
                        period.water_cost = period.editedCost;
                    })
                    .catch(error => {
                        console.error('Ошибка при обновлении цены:', error);
                    });
            } else {
                console.error('Период с указанным ID не найден');
            }
        },
        saveVolume(period) {
            const periodId = period.id;
            if (periodId) {
                const volumeData = {
                    amount_volume: period.editedVolume,
                };

                axios.post(`http://127.0.0.1:8000/period/${periodId}/volume`, volumeData)
                    .then(response => {
                        console.log('Счетчик успешно обновлен:', response.data);
                        period.isEditingVolume = false;
                        period.amount_volume = period.editedVolume;
                    })
                    .catch(error => {
                        console.error('Ошибка при обновлении счетчика:', error);
                    });
            } else {
                console.error('Период с указанным ID не найден');
            }
        }

    }
};
</script>
<style>
.all-periods {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
}

.period {
    margin-bottom: 20px;
}

.period label {
    margin-right: 5px;
}

.period select {
    padding: 5px;
}

.period p {
    margin: 5px 0;
}

.fa-edit {
    margin-left: 10px;
    cursor: pointer;
    color: blue;
}

button {
    padding: 8px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
}

button:hover {
    background-color: #45a049;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
}
</style>