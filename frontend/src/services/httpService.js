import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL

function setJwt(jwt) {
    if (!jwt) {
        delete axios.defaults.headers.common["Authorization"];
        return;
    }
    axios.defaults.headers.common["Authorization"] = `JWT ${jwt}`;
}  

export default {
    get:axios.get,
    post:axios.post,
    put:axios.put,
    patch:axios.patch,
    delete:axios.delete,
    setJwt
}