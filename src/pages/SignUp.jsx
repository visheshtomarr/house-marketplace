import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth/cordova";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
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

    // Function to handle form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create auth
            const auth = getAuth();

            // Register user using the function "createUserWithEmailAndPassword"
            // which returns a promise. 
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // Update the display name.
            updateProfile(auth.currentUser, {
                displayName: name,
            })

            // Creates a copy of whatever we have in our 'formatData' state.
            const formDataCopy = {...formData};
            // We don't want to store the password to the database that's why
            // we will delete it from the database.
            delete formDataCopy.password;

            // This will add a timestamp property to the data.
            formDataCopy.timestamp = serverTimestamp();

            // 'setDoc' will update the database and set a 'user' to the 'users' collection.
            await setDoc(doc(db, "users", user.uid), formDataCopy);
            
            // Navigate to the Homepage, in our case, 'explore'.
            navigate("/");
        } catch (error) {
            toast.error('Something went wrong!');
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome!</p>
                </header>

                <form onSubmit={handleSubmit}>
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