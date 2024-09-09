import axios from "axios";
import { tg } from "../hooks/useTelegram.js";
import QualifierErrors from './_qualifierErrors.js';
import { getCookie, setCookie } from "./cookie.js";

export async function AuthWrapper(who) {
    console.log('authentificate', who)
    let initData = tg.initData;

    if (initData !== null) {
        initData = "query_id=AAGqQNUmAAAAAKpA1SaKm8S3&user=%7B%22id%22%3A651509930%2C%22first_name%22%3A%22%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22domittory8%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1724059856&hash=968f47bc7035b8f9630aa5de06e818f47f45f9dfd079a2749f2a61dc6b168c5a"
    } 
    
    await axios.post('http://127.0.0.1:3003/auth/checkInitData', {
        initData: initData
    })
    .then(res => {
        setCookie('accessToken', res.data.accessToken, {'max-age': 60});
        setCookie('refreshToken', res.data.refreshToken, {'max-age': 120});
        ScheduleRefreshTokens(who);
    })
    .catch(err => QualifierErrors(err));
}

let timer;

export function ScheduleRefreshTokens(who, timerRef) {
    console.log(who)
    const accessToken = getCookie('accessToken');
    const exp = JSON.parse(atob(accessToken.split('.')[1])).exp;
    const timeout = (exp - Math.round(Date.now() / 1000)) * 1000 - 30000;

    timerRef.current = setTimeout(() => {
        RefreshTokens(who);
    }, timeout);
}

export function CancelRefreshTokens(who, timerRef) {
    console.log(who);
    if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }
}

export async function RefreshTokens(who) {
    console.log('refresh', who);
    const refreshToken = getCookie('refreshToken');

    axios.post('http://127.0.0.1:3003/auth/refreshTokens', {
        refreshToken: refreshToken
    })
    .then(res => {
        setCookie('accessToken', res.data.accessToken, {'max-age': 60});
        setCookie('refreshToken', res.data.refreshToken, {'max-age': 120});
        ScheduleRefreshTokens(who);
    })
    .catch(err => QualifierErrors(err));
}