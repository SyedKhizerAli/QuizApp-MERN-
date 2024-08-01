import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import '../styles/loginPageStyles.css';
import { setUser } from '../redux/actions/userActions';


function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BACKENDURL = process.env.BACKEND_URL || 'http://172.31.21.192:3001/api';
  
  const [Error, setError] = useState(null);

  const handleLogin = async (values) => {
    try {
      console.log(values.email, values.password);
      const response = await axios.post(`${BACKENDURL}/login`, {
        email: values.email,
        password: values.password,
      });
      
      if (response.status === 200) {
        console.log(response);

        const token = response.data.token;
        const userID = response.data.userID;
        
        console.log (token);
        console.log(userID);

        localStorage.setItem('token', token);
        localStorage.setItem('userID', userID);
        
        navigate('/dashboardPage');
      } else {
        console.error('Login error:', response);
      }
    } catch (error) {
      console.error('Login error:', error);
      if(error.response.status === 400)
        {
          setError('Incorrect password. Please try again.');
          console.log('error--', Error);
        }
        else{
          setError('An error occurred. Please try again.');
          console.log('error--',Error);
        }
    }
  };

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
    }
    return errors;
  };

  return (
    <div className="auth-screen">
      <h2>Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={validate}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <Field type="password" name="password" placeholder="Password" />
              {Error && <p className="error-message">{Error}</p>}
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>

  );
}

export default LoginPage;
