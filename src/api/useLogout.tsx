import axios from 'axios';

export async function logoutApi() {
  try {
    await axios.post('http://localhost:3000/api/auth/logout');
  } catch (err) {
    // Optionally handle error
  }
  localStorage.removeItem('prayatna_currentUser');
  localStorage.removeItem('user');
}
