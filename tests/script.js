import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.0.0/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export let options = {
    stages: [
        { duration: '2m', target: 200 },  // Рост до 200 пользователей за 2 минуты
        // { duration: '1m', target: 1000 }, // Рост до 2000 пользователей за следующие 5 минут
        // { duration: '1m', target: 2000 }, // Поддержание на уровне 2000 пользователей в течение 3 минут
        // { duration: '2m', target: 0 },    // Спад до 0 пользователей за 2 минуты
    ],
};


export default function () {
    let url = 'https://fztest.fozzy.lan:9999/Test.v2/REST/PincodeLogon';
    let payload = JSON.stringify({
        loginName: "v.bondariev",
        pincode: "1488",
        appGuid: "6c073fca-a68d-4ed1-bfcf-2911122f1ad5",
        appVersion: "1.0"
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let response = http.post(url, payload, params);

    check(response, {
        'is status 200': (r) => r.status === 200,
        // Добавьте дополнительные проверки при необходимости
    });

    // Пауза между запросами каждого пользователя в диапазоне 500-1000 мс
    sleep(randomIntBetween(0.5, 1));
}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}