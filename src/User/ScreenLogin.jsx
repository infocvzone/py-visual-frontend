import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'; // You can use Heroicons or any icon library
import logo from '../assets/logo.png';

function ScreenLogin() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleTogglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = () => {
        // Logic for login goes here (e.g., API call)
        console.log('Logging in with', { email, password });
    };

    return (

        <div className="fixed top-[12%] left-[30%] flex flex-col items-center bg-[#08B9E2ED] p-8 rounded-lg shadow-lg w-[40%] z-30">
            <img src={logo} alt="Py-Visual" className='my-8'/>
            <h2 className="text-2xl text-white text-center mb-2">Welcome Back!</h2>
            <h2 className="text-sm text-zinc-200 text-center mb-6">Please Login To Your Account</h2>

            <div className="mb-4 flex flex-col items-center justify-center">
                <label htmlFor="email" className="block text-gray-700 text-sm mb-2">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg focus:outline-none text-center bg-transparent"
                    placeholder="Enter your email"
                />
                <hr className='w-full' />
            </div>

            <div className="mb-4 relative flex flex-col items-center justify-center">
                <label htmlFor="password" className="block text-gray-700 text-sm mb-2">Password</label>
                <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 text-center rounded-lg focus:outline-none bg-transparent"
                    placeholder="Enter your password"
                />
                <hr className='w-full' />
                <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute inset-y-0 right-3 flex flex-col items-center justify-center text-gray-500"
                >
                    {passwordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            </div>

            <button
                onClick={handleLogin}
                className=" bg-white text-[#08B9E2ED] px-12 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
                Login
            </button>

            <div className="text-center mt-4">
                <span className="text-gray-600 text-sm">Don't have an account? </span>
                <button
                    onClick={() => navigate('/signup')}
                    className="text-blue-500 font-semibold hover:underline"
                >
                    Sign up
                </button>
            </div>
        </div>
    );
}

export default ScreenLogin;
