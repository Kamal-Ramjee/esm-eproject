import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp || false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('attendee'); // State for role selection

  // Base URL for your API
  const API_URL = "http://localhost:5000/api/auth";

  useEffect(() => {
    if (location.state?.isSignUp) {
      setIsSignUp(true);
    }
  }, [location.state]);

  // --- AXIOS INTEGRATION ---

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));

        // Check role and navigate accordingly
        if (response.data.role === 'attendee') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      alert(message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role,
      });

      if (response.data) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));

        // Check role and navigate accordingly
        if (response.data.role === 'attendee') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      alert(message);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-indigo-100 overflow-hidden relative font-sans">
      <style>{`
          @keyframes show {
            0%, 49.99% { opacity: 0; z-index: 10; }
            50%, 100% { opacity: 1; z-index: 50; }
          }
          .animate-show {
            animation: show 0.6s;
          }
          @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, -50px) scale(1.1); }
            100% { transform: translate(0, 0) scale(1); }
          }
          .animate-float {
            animation: float 10s infinite ease-in-out;
          }
        `}</style>

      {/* Background Shapes */}
      <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float z-0"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float z-0" style={{ animationDelay: '5s' }}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-[850px] max-w-full min-h-[550px] overflow-hidden z-10 md:min-h-[550px] h-screen md:h-auto flex flex-col md:block">

        {/* Sign Up Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out w-full md:w-1/2 left-0 
                ${isSignUp ? "opacity-100 z-50 md:translate-x-full animate-show" : "opacity-0 z-10"}`}>
          <form onSubmit={handleRegister} className="bg-white flex items-center justify-center flex-col px-12 h-full text-center">
            <h1 className="font-bold text-3xl text-gray-800 mb-2">Create Account</h1>
            <div className="flex gap-4 my-2">
              <SocialIcon icon="fa-facebook-f" />
              <SocialIcon icon="fa-google" />
              <SocialIcon icon="fa-linkedin-in" />
            </div>
            <span className="text-xs text-gray-400 mb-2">or use your email for registration</span>

            <input
              type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required
              className="bg-gray-100 border-none p-3 my-1 w-full rounded-lg outline-none focus:bg-indigo-50 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
            <input
              type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="bg-gray-100 border-none p-3 my-1 w-full rounded-lg outline-none focus:bg-indigo-50 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
            <input
              type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="bg-gray-100 border-none p-3 my-1 w-full rounded-lg outline-none focus:bg-indigo-50 focus:ring-2 focus:ring-indigo-200 transition-all"
            />

            {/* Role Select Field */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-100 border-none p-3 my-1 w-full rounded-lg outline-none focus:bg-indigo-50 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-500 text-sm"
            >
              <option value="attendee">Register as Attendee</option>
              <option value="organizer">Register as Organizer</option>
              <option value="exhibitor">Register as Exhibitor</option>
              <option value="admin">Register as Admin</option>
            </select>

            <button type="submit" className="rounded-full border border-indigo-600 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-3 px-12 mt-4 transition-transform active:scale-95 focus:outline-none hover:bg-indigo-700">
              Sign Up
            </button>
            <div className="md:hidden mt-4 text-sm text-indigo-600 underline cursor-pointer" onClick={() => setIsSignUp(false)}>
              Already have an account? Sign In
            </div>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out w-full md:w-1/2 left-0 z-20 
                ${isSignUp ? "md:translate-x-full opacity-0 md:opacity-100" : "opacity-100"}`}>
          <form onSubmit={handleLogin} className="bg-white flex items-center justify-center flex-col px-12 h-full text-center">
            <div className="mb-5 text-indigo-600 text-2xl font-bold">
              <i className="fas fa-bolt mr-2"></i> EventSphere Management
            </div>
            <h1 className="font-bold text-3xl text-gray-800 mb-2">Sign in</h1>
            <div className="flex gap-4 my-5">
              <SocialIcon icon="fa-facebook-f" />
              <SocialIcon icon="fa-google" />
              <SocialIcon icon="fa-linkedin-in" />
            </div>
            <span className="text-xs text-gray-400 mb-4">or use your account</span>
            <input
              type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="bg-gray-100 border-none p-3 my-2 w-full rounded-lg outline-none focus:bg-indigo-50 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
            <input
              type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="bg-gray-100 border-none p-3 my-2 w-full rounded-lg outline-none focus:bg-indigo-50 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
            <a href="#" className="text-gray-600 text-xs no-underline my-4 font-medium hover:text-indigo-600 hover:underline">Forgot your password?</a>
            <button type="submit" className="rounded-full border border-indigo-600 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-3 px-12 mt-2 transition-transform active:scale-95 focus:outline-none hover:bg-indigo-700">
              Sign In
            </button>
            <div className="md:hidden mt-4 text-sm text-indigo-600 underline cursor-pointer" onClick={() => setIsSignUp(true)}>
              Don't have an account? Sign Up
            </div>
          </form>
        </div>

        {/* Overlay Section */}
        <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 z-[100] 
                ${isSignUp ? "-translate-x-full" : ""}`}>
          <div className={`bg-gradient-to-r from-indigo-600 to-violet-600 text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 
                    ${isSignUp ? "translate-x-1/2" : "translate-x-0"}`}>
            <div className={`absolute top-0 flex flex-col items-center justify-center px-10 text-center w-1/2 h-full transform transition-transform duration-600 
                        ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}`}>
              <h1 className="font-bold text-3xl text-white mb-2">Welcome Back!</h1>
              <p className="text-sm font-light leading-6 text-white/90 my-5">To keep connected with us please login with your personal info</p>
              <button className="rounded-full border border-white bg-transparent text-white text-xs font-bold uppercase tracking-wider py-3 px-12 transition-transform active:scale-95 focus:outline-none hover:bg-white/20" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center px-10 text-center w-1/2 h-full transform transition-transform duration-600 
                        ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}`}>
              <h1 className="font-bold text-3xl text-white mb-2">Hello, Friend!</h1>
              <p className="text-sm font-light leading-6 text-white/90 my-5">Enter your personal details and start your journey with us</p>
              <button className="rounded-full border border-white bg-transparent text-white text-xs font-bold uppercase tracking-wider py-3 px-12 transition-transform active:scale-95 focus:outline-none hover:bg-white/20" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex justify-center items-center text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600 hover:border-indigo-600">
    <i className={`fab ${icon}`}></i>
  </a>
);

export default Login;