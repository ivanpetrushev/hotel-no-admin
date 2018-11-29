import history from './History';

export default class Auth {

  login = () => {
    history.replace('/login');
  }

  setSession = (authResult) => {
    localStorage.setItem('user', JSON.stringify(authResult.signinUser.user));
    localStorage.setItem('user_token', authResult.signinUser.token);
  }

  logout = () => {
    console.log('in Auth::logout()')
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('user_token');
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated = () => {
    return Boolean(localStorage.getItem('user'));
  }

  getAccessToken = () => {
    const accessToken = localStorage.getItem('user_token');
    if (!accessToken) {
      throw new Error('No Access Token found');
    }
    return accessToken;
  }

  getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  }
}