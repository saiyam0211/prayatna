import axios from 'axios';

export interface LoginPayload {
  admissionNumber: string;
  email: string;
  password: string;
}

export async function loginApi(payload: LoginPayload) {
  const res = await axios.post('http://localhost:3000/api/auth/login', {
    admissionNumber: payload.admissionNumber,
    email: payload.email,
    password: payload.password,
  });
  return res.data;
}
