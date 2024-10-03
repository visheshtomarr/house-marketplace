import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const auth = getAuth();
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const navigate = useNavigate();

    // Funtion to handle user logout.
    const handleLogout = () => {
        // Firebase predefined function to logout the current user.
        auth.signOut();
        navigate("/");
    }

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type="button" className="logOut" onClick={handleLogout}>
                    Logout
                </button>
            </header>
        </div>
    )
}

export default Profile;