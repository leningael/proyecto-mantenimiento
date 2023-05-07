import axios from 'axios'
import { GOOGLE_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL } from '../constants/userConstants'

export const loginGoogle = (userObject) => async (dispatch) => {
    try {
        dispatch({
            type: GOOGLE_LOGIN_REQUEST
        })
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const { data } = await axios.post(
            '/api/users/google-login/',
            { 'token': userObject },
            config
        )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
