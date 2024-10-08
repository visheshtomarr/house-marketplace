import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

function SignIn() {
    // Declare state and set state method for password.
    const [showPassword, setShowPassword] = useState(false);
    // Declare state and set state method for form data, i.e., email and password.
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Destructure formData.
    const { email, password } = formData;
    const navigate = useNavigate();

    // Function to handle onchange of our input.
    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            // This is will take the input based on the id, whether it is 'email' or
            // 'password' and set the corresponding value to state.
            [e.target.id]: e.target.value,
        }));
    }

    // Function to handle form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();

            
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (userCredential.user) {
                navigate("/");
            }
        } catch (error) {
            toast.error('Invalid User Credentials');
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        className="emailInput" 
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={handleChange}
                    />

                    <div className="passwordInputDiv">
                        <input 
                            type={showPassword ? "text" : "password"}
                            className="passwordInput"
                            placeholder="Password"
                            id="password"
                            value={password}
                            onChange={handleChange} 
                        />
                        <img 
                            src={visibilityIcon} 
                            className="showPassword" 
                            alt="Show password"
                            onClick={() => setShowPassword((prevState) => !prevState)} 
                        />
                    </div>

                    <Link to="/forgot-password" className="forgotPasswordLink">
                        Forgot Password?
                    </Link>

                    <div className="signInBar">
                        <p className="signInText">
                            Sign In
                        </p>
                        <button className="signInButton">
                            <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link to="/sign-up" className="registerLink">
                    Sign Up Instead
                </Link>
            </div>
        </>
    )
}

export default SignIn;