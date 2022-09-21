import axios from "axios";

const api = axios.create({
    baseURL:'http://192.168.0.4:3333', //pq React Native dont allow localhost
})

export {api};