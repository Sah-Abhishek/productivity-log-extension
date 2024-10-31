import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

import axios from 'axios';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const baseURL = import.meta.env.VITE_BACK_URL;

  const onSubmit = async (data) => {
    console.log("This is data", data);
    console.log(data);
    try{
      const response = await axios.post(`${baseURL}/login`, data);
      console.log("This is response", response, response.data);
      if(response.status === 200){
        const { token } = response.data;
        if(token){
          console.log("This is the token", token);
          localStorage.setItem('token', token);
          // window.location.href = '/';
        }
      }

    }catch(error){
      console.log("There was an error: ", error);
    }
    
    // Simulate a login process (replace with your logic)
    
  };

//   

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-white p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-center">Sign in to your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              type="text"
              {...register("username", {
                required: "Username is required",
                pattern: {
                  value: /^[a-z0-9]+$/,
                  message: "Invalid Username"
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
              placeholder="Username"
            />
            {errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
          </div>
          <div className="space-y-1">
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <h3 className="text-l font-bold mb-6 text-center text-red-600">{loginError}</h3>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800"
            >
              {isSubmitting ? "Loading" : "Submit"}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
