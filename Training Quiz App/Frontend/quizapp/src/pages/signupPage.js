import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import '../styles/signupPageStyles.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/actions/userActions';

function SignupPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BACKENDURL = process.env.BACKEND_URL || 'http://172.31.21.192:3001/api';  
    const handleSignup = async (values) => {
    try {
        const response = await axios.post(`${BACKENDURL}/signup`, {
            username:  values.username,
            password: values.password,
            email: values.email,
            age: values.age
        });
        console.log(response);
        if (response.status === 200) {
          
          const token = response.data.token;
          const userID = response.data.userID;
          console.log(token, userID);

          localStorage.setItem('userID', userID);
          localStorage.setItem('token', token);
          
          navigate('/dashboardPage');
        } else {
            console.error('Signup error:', response);
        }
        } catch (error) {
        console.error('Signup error:', error);
        }
    };

    // form validation
    const validate = (values) => { 
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  return (
    <div className="auth-screen">
      <h2>Signup</h2>
      <Formik
        initialValues={{ email: '', password: '', username: '', age: '' }}
        validate={validate}
        onSubmit={handleSignup}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <Field type="text" name="username" placeholder="Username" />
              <ErrorMessage name="username" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <Field type="number" name="age" placeholder="Age" />
              <ErrorMessage name="age" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Signup
            </button>
          </Form>
        )}
      </Formik>
    </div>

  );
}

export default SignupPage;
