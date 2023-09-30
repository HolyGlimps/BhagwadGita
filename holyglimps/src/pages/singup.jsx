import React from 'react';
import Navbar from './navbar';
import './styles/style.css'

const Signup = () => {
  return (
    <div class="outer-box">
      <Navbar />
      <div class="inner-box">
        <header class="signup-header">
          <h1>Signup</h1>
          <p>It just takes 30 seconds</p>
        </header>
        <main class="signup-body">
          <form action="#">
            <p>
              <label for="fullname">Full Name</label>
              <input type="text" id="fullname" placeholder="XXXXX" required />
            </p>
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
              <label for="password">Create Password</label>
              <input
                type="password"
                id="password"
                placeholder="at least 8 characters"
                required
              />
            </p>
            <p>
              <input type="submit" id="submit" value="Create Account" />
            </p>
          </form>
        </main>

        <footer class="signup-footer">
          <p>
            Already have an Account? <a href="/login">Login</a>{' '}
          </p>
        </footer>
      </div>
      <div class="circle c1"></div>
      <div class="circle c2"></div>
    </div>
  );
};

export default Signup;
