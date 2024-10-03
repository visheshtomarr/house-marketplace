import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";

function ForgotPassword() {
    const [email, setEmail] = useState('')

    const onChange = (e) => setEmail(e.target.value);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success("Email reset successfully!");
        } catch (error) {
            toast.error("Could not reset email!");
        }
    }

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Forgot Password</p>
            </header>

            <form onSubmit={onSubmit}>
                <input 
                    type="email"
                    className="emailInput"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={onChange}
                />
                <Link className="forgotPasswordLink" to="/sign-in">Sign In</Link>

                <div className="signInBar">
                    <div className="signInText">Send Reset Link</div>
                    <button className="signInButton">
                        <ArrowRightIcon fill="#ffffff" width={34} height={34} />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword;
