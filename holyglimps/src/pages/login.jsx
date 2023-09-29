import React from 'react';
import './styles/style.css'

const Login = () => {
  return (
    <div class="outer-box">
      <div class="inner-box">
        <header class="login-header">
          <h1>login</h1>
        </header>
        <main class="login-body">
          <form action="#">
            <p>
              <label for="email">User Id</label>
              <input
                type="email"
                id="email"
                placeholder="abc@xyz.com"
                required
              />
            </p>
            <p>
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter Your Password"
                required
              />
            </p>
            <p>
              <input type="submit" id="submit" value="LogIn" />
            </p>
          </form>
        </main>

        <footer class="login-footer">
          <p>
            Don't have an Account? <a href="/signup">SignUp</a>{' '}
          </p>
        </footer>
      </div>
      <div class="circle c1"></div>
      <div class="circle c2"></div>
    </div>
  );
};

export default Login;
