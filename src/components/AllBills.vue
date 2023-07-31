<template>
    <div class="all-bills">
        <h2>Список всех счетов</h2>
        <ul>
            <li v-for="bill in bills" :key="bill.id" class="bill">
                <strong>Дачник:</strong> {{ bill.resident.fio }}, <strong>Срок: с</strong> {{ bill.period.begin_date }}
                <strong>по </strong>{{ bill.period.end_date }},
                <strong>Сумма к оплате:</strong> {{ bill.amount_rub }}
            </li>
        </ul>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            bills: []
        };
    },
    mounted() {
        this.fetchAllBills();
    },
    methods: {
        fetchAllBills() {
            axios
                .get('http://127.0.0.1:8000/bill')
                .then(response => {
                    this.bills = response.data;
                })
                .catch(error => {
                    console.error('Ошибка при получении списка счетов:', error);
                });
        }
    }
};
</script>
<style>
.all-bills {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
}

.bill {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
}
</style>