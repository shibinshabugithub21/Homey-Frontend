'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          if (payload.exp && payload.exp > currentTime) {
            router.push('/userHome');
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
      }
    }
  }, [router]);

  const handleBackgroundClick = (e) => {
    const container = e.currentTarget;
    const bubble = document.createElement('div');
    const x = e.clientX - container.offsetLeft;
    const y = e.clientY - container.offsetTop;

    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    bubble.className = 'bubble';
    container.appendChild(bubble);

    setTimeout(() => {
      bubble.remove();
    }, 1000); // Remove bubble after animation
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setEmailError('');
    setPasswordError('');

    let valid = true;
    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }
    if (!valid) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/userHome');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid login credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_Backend_Port}/auth/google`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br relative overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {/* Background shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-300 rounded-full opacity-30 animate-move"></div>
      <div className="absolute top-20 right-20 w-80 h-80 bg-green-400 rounded-full opacity-30 animate-move-slow"></div>
      <div className="absolute -bottom-40 left-20 w-72 h-72 bg-green-200 rounded-full opacity-30 animate-move"></div>

      <div className="max-w-md w-full bg-white shadow-2xl rounded-lg p-8 relative z-10">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Homey" className="h-15" />
        </div>
        <h2 className="text-center text-2xl font-bold mb-4 text-gray-800">Sign In</h2>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className={`mt-1 p-2 w-full border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-green-400 transition-all`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className={`mt-1 p-2 w-full border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-green-400 transition-all`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
          </div>

          <div className="text-right">
            <Link href="/forget-password" className="text-green-600 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-all"
          >
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google logo"
              style={{ width: '20px', marginRight: '8px' }}
            />
            Continue with Google
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{' '}
            <Link href="/signUp" className="text-green-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
