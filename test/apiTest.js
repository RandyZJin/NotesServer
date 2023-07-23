const axios = require('axios');
const { expect } = require('chai');

describe('Login API', function () {
  it('should log in successfully with valid credentials and have tokens issued', async function () {
    const apiUrl = 'http://localhost:3000/api/auth/login';
    const requestData = {
      email: '123@test.com',
      password: 'password',
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property('accessToken');
    } catch (error) {
      // Handle any errors that might occur during the request
      throw new Error(`Login failed: ${error.message}`);
    }
  });
  it('should not log in successfully with invalid credentials', async function () {
    const apiUrl = 'http://localhost:3000/api/auth/login';
    const requestData = {
      email: '123@test.com',
      password: 'wrongpassword',
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.status).to.be.oneOf([401, 403]);

    } catch (error) {
      expect(error.response.status).to.be.oneOf([401, 403]);
    }
  });
  it('should log in successfully with random capitalizations in email with valid credentials and have tokens issued', async function () {
    const apiUrl = 'http://localhost:3000/api/auth/login';
    const requestData = {
      email: '123@tEst.cOm',
      password: 'password',
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property('accessToken');
    } catch (error) {
      // Handle any errors that might occur during the request
      throw new Error(`Login failed: ${error.message}`);
    }
  });
  it('should not log in successfully with different cased passwords', async function () {
    const apiUrl = 'http://localhost:3000/api/auth/login';
    const requestData = {
      email: '123@test.com',
      password: 'paSSwORd',
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.status).to.be.oneOf([401, 403]);

    } catch (error) {
      expect(error.response.status).to.be.oneOf([401, 403]);
    }
  });
});


describe('Registration API', function () {
  it('should not register successfully with an email already in use', async function () {
    const apiUrl = 'http://localhost:3000/api/auth/signup';
    const requestData = {
      name: 'Fred',
      email: '123@test.com',
      password: 'password',
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {

      expect(error.response.status).to.be.oneOf([400, 403]);
      expect(error.response).to.have.property('data')
    }
  });
  it('should not register successfully with an email already in use with different capitalization', async function () {
    const apiUrl = 'http://localhost:3000/api/auth/signup';
    const requestData = {
      name: 'Fred',
      email: '123@TEST.com',
      password: 'password',
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {

      expect(error.response.status).to.be.oneOf([400, 403]);
      expect(error.response).to.have.property('data')
    }
  });
  it('should not register successfully with empty fields', async function () {
    const apiUrl = 'http://localhost:3000/api/auth/signup';
    const requestData = {
      name: 'Fred',
      email: 'jake@test.com',
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      expect(error.response.status).to.be.oneOf([400, 401]);
      expect(error.response).to.have.property('data')
    }
  });
  it('should register successfully with valid credentials', async function () {
    const apiUrl = 'http://localhost:3000/api/auth/signup';
    const requestData = {
      name: 'Johnny Test',
      email: 'Johnny15@test.com',
      password: 'password',
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.status).to.be.oneOf([200, 201]);

    } catch (error) {
      throw new Error(`Login failed: ${error.message}`)
    }
  });
});

describe('Logging in after registration', function () {
  it('should log in successfully with newly registered account', async function () {
    const registrationUrl = 'http://localhost:3000/api/auth/signup';
    const registrationRequestData = {
      name: 'Johnny Test',
      email: 'Johnny25@test.com',
      password: 'password',
    };

    try {
      const response = await axios.post(registrationUrl, registrationRequestData, {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.status).to.be.oneOf([200, 201]);

    } catch (error) {
      throw new Error(`Login failed: ${error.message}`)
    }
     finally {
      const loginUrl = 'http://localhost:3000/api/auth/login';
      const loginRquestData = {
        email: 'joHNny25@test.com',
        password: 'password',
      };

      try {
        const response = await axios.post(loginUrl, loginRquestData, {
          headers: { 'Content-Type': 'application/json' },
        });
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.data).to.have.property('accessToken');
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    }
  });

});