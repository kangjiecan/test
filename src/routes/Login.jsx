import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/home_styles.css"; // Assuming this path is correct
import logo from "../img/CARE-logo.svg"; // Assuming this path is correct
import { Navigate, useNavigate } from 'react-router'; // Removed useOutletContext as it wasn't used after commenting out
import { useForm } from 'react-hook-form';
// Removed useCookies as setCookie wasn't used after commenting out
import axios from 'axios';
import { useUser } from '../context/UserContext'; // Assuming UserContext provides user, login, loading

import Spinner from '../components/Spinner'; // Assuming Spinner component exists

export default function Login() {

    // Retrieve API URL from environment variables
    const APIHOST = import.meta.env.VITE_API_URL

    // Initialize react-hook-form, only keeping register and handleSubmit
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    // Removed cookies state as it wasn't used
    // const [cookies, setCookie] = useCookies(['nurse']);

    // Get user state and login function from context
    const { user, login, loading } = useUser();

    // Show spinner while loading user state
    if (loading) return <Spinner />;

    // If user is already logged in, redirect to home page
    if (user) return <Navigate to="/" replace />;

    // Handle form submission
    const onSubmit = async (data) => {
        // Format data for the API request
        const formattedData = {
            Email: data.email,
            Password: data.password
        };
        console.log('Submitting data: ', formattedData);
        console.log('API Host:', APIHOST); // Log the API host URL being used

        // Ensure APIHOST is defined before making the call
        if (!APIHOST) {
            console.error("API_URL environment variable is not set!");
            alert("Configuration error: API URL is missing.");
            return; // Stop execution if API URL is missing
        }

        try {
            // Make POST request to the login endpoint
            const response = await axios.post(`${APIHOST}/auth/login`, formattedData); // Ensure the path /auth/login is correct
            console.log('Response:', response.data);

            // Call the login function from context (assuming it handles token/user state)
            login(response.data); // Pass response data to login function

            // Removed cookie setting logic
            // setCookie('nurse', response.data, { path: '/' });

            // Removed setIsLoggedIn logic
            // setIsLoggedIn(true);

            // Redirect to the home page after successful login
            navigate('/');

        } catch (error) {
            console.error('Error logging in:', error);

            // Handle specific error responses
            if (error.response) {
                 console.error('Error data:', error.response.data);
                 console.error('Error status:', error.response.status);
                 console.error('Error headers:', error.response.headers);

                if (error.response.status === 401) {
                    // Handle unauthorized error (e.g., wrong password or unregistered user)
                    alert('Login failed: Invalid email or password, or user not registered.');
                    // Optionally navigate to registration or prompt user
                    // navigate('/register');
                } else {
                    // Handle other server errors
                    alert(`An error occurred: ${error.response.data?.message || error.message}`);
                }
            } else if (error.request) {
                // Handle network errors (request made but no response received)
                console.error('Network error:', error.request);
                alert('Network error: Could not connect to the server. Please check your connection or the API URL.');
            } else {
                // Handle other errors (e.g., setup errors)
                console.error('Error message:', error.message);
                alert(`An unexpected error occurred: ${error.message}`);
            }
        }
    };

    return (
        <>
            {/* Main container with gradient background */}
            <div style={styles.container}>
                {/* Logo container */}
                <div style={styles.image}>
                    <div style={styles.ovalWrapper}>
                        <img src={logo} alt="app logo" style={styles.ovalImage} />
                    </div>
                </div>
                {/* Login title */}
                <h1 style={styles.title}>Please Log-In</h1>
                {/* Login form */}
                <form style={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    {/* Email input field */}
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            {...register('email')} // Removed required validation
                        />
                        {/* Removed email error message display */}
                    </div>
                    {/* Password input field */}
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            {...register('password')} // Removed required validation
                        />
                        {/* Removed password error message display */}
                    </div>

                    {/* Submit button */}
                    <button type="submit" className="btn btn-primary" style={{ margin: '0 10px', backgroundColor: '#004780' }}>Submit</button>
                </form>
                {/* Registration prompt */}
                <p style={styles.registerPrompt}>
                    Haven't created an account? <span onClick={() => navigate('/register')} style={styles.registerLink}>Register here</span>.
                </p>

            </div>
        </>
    );
}

// Inline styles object
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Use minHeight to ensure it covers viewport
        width: '100vw',
        background: 'linear-gradient(135deg, #004780, #00bfff)',
        padding: '20px', // Add some padding
        boxSizing: 'border-box', // Include padding in width/height calculation
    },
    title: {
        marginBottom: '20px',
        color: '#fff',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '600',
        textAlign: 'center', // Center title text
    },
    form: {
        width: '100%', // Make form responsive
        maxWidth: '400px', // Set a max-width for larger screens
        backgroundColor: '#fff',
        padding: '30px', // Increase padding
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    ovalWrapper: {
        width: 'clamp(200px, 50vw, 400px)', // Responsive width
        height: 'auto', // Adjust height automatically
        aspectRatio: '600 / 490', // Maintain aspect ratio
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        marginBottom: "20px"
    },
    ovalImage: {
        width: '100%', // Make image fill the wrapper width
        height: '100%', // Make image fill the wrapper height
        objectFit: "cover",
    },
    registerPrompt: {
        marginTop: '20px', // Increase margin
        color: '#fff',
        fontSize: '1rem', // Slightly larger font
        textAlign: 'center', // Center text
    },
    registerLink: {
        color: '#ffef00', // Bright yellow for link
        textDecoration: 'underline',
        cursor: 'pointer',
        fontWeight: 'bold', // Make link bold
    },
};
