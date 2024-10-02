import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignUp() {
    // Declare state and set state method for password.
    const [showPassword, setShowPassword] = useState(false);
    // Declare state and set state method for form data, i.e., name, email and password.
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    // Destructure formData.
    const { name, email, password } = formData;
    const navigate = useNavigate();

    // Function to handle onchange of our input.
    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            // This is will take the input based on the id, whether it is 'name', 'email' or
            // 'password' and set the corresponding value to state.
            [e.target.id]: e.target.value,
        }));
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome!</p>
                </header>

                <form>
                    <input 
                        type="text" 
                        className="nameInput" 
                        placeholder="Name"
                        id="name"
                        value={name}
                        onChange={handleChange}
                    />

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

                    {/* <Link to="/forgot-password" className="forgotPasswordLink">
                        Forgot Password?
                    </Link> */}

                    <div className="signUpBar">
                        <p className="signUpText">
                            Sign Up
                        </p>
                        <button className="signUpButton">
                            <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
                        </button>
                    </div>
                </form>

                <Link to="/sign-in" className="registerLink">
                    Sign In Instead
                </Link>
            </div>
        </>
    )
}

export default SignUp;