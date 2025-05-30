import axios from 'axios';

export interface SignupPayload {
  fullName: string;
  gender: string;
  dateOfBirth: Date;
  phone: string;
  alternatePhone?: string;
  admissionNumber: string;
  password: string;
  confirmPassword: string;
}

export async function signupApi(payload: SignupPayload) {
  // Always convert dateOfBirth to string in YYYY-MM-DD format
  const dob = payload.dateOfBirth.toISOString().split('T')[0];
  const res = await axios.post('http://localhost:3000/api/auth/register', {
    name: payload.fullName,
    gender: payload.gender,
    dob,
    mobile: payload.phone,
    admissionNumber: payload.admissionNumber,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
    alternatePhone: payload.alternatePhone,
    // You can add email logic here if needed
  });
  return res.data;
}
