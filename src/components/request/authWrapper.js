import axios from "axios";
import { useTelegram } from "../hooks/useTelegram.jsx";
import QualifierErrors from './_qualifierErrors.js';
import { getCookie, setCookie } from "./cookie.js";

export async function AuthWrapper() {
    console.log('auth'); 
    const {tg} = useTelegram.getTelegramData();
    const initData = tg.initData;
    
    await axios.post('/user-api/auth/checkInitData', {
        initData: initData
    })
    .then(res => {
        setCookie('accessToken', res.data.accessToken, {'max-age': 60});
        setCookie('refreshToken', res.data.refreshToken, {'max-age': 120});
        ScheduleRefreshTokens();
    })
    .catch(err => QualifierErrors(err));
}

export function ScheduleRefreshTokens() {
    console.log('schedule');
    const accessToken = getCookie('accessToken');
    const exp = JSON.parse(atob(accessToken.split('.')[1])).exp;
    const timeout = (exp - Math.round(Date.now() / 1000)) * 1000 - 30000;

    setTimeout(() => {
        RefreshTokens();
    }, timeout);
}

export async function RefreshTokens() {
    console.log('refresh');
    const refreshToken = getCookie('refreshToken');

    axios.post('/user-api/auth/refreshTokens', {
        refreshToken: refreshToken
    })
    .then(res => {
        setCookie('accessToken', res.data.accessToken, {'max-age': 60});
        setCookie('refreshToken', res.data.refreshToken, {'max-age': 120});
        ScheduleRefreshTokens();
    })
    .catch(err => QualifierErrors(err));
}