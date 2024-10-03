import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function Profile() {
    const auth = getAuth();
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    const [changeDetails, setChangeDetails] = useState(false);

    const navigate = useNavigate();

    const {name, email} = formData;

    // Funtion to handle user logout.
    const handleLogout = () => {
        // Firebase predefined function to logout the current user.
        auth.signOut();
        navigate("/");
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name){
                // Update display name in Firebase.
                await updateProfile(auth.currentUser, {
                    displayName: name
                });

                // Update in Firestore.
                const userReference = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userReference, {
                    name
                });
            }
        } catch (error) {
            toast.error("Could not update profile details");
        }
    }

    // Function to handle 'name' field change.
    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type="button" className="logOut" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <div className="profileDetailsHeader">
                <p className="profileDetailsText">Personal Details</p>
                <p className="changePersonalDetails" onClick={() => {
                    changeDetails && onSubmit();
                    setChangeDetails((prevState) => !prevState);
                }}>
                    {changeDetails ? "done" : "change"}
                </p>
            </div>

            <div className="profileCard">
                <form >
                    <input 
                        type="text" 
                        id="name" 
                        className={!changeDetails ? "profileName" : "profileNameActive" }
                        disabled={!changeDetails}
                        value={name}
                        onChange={handleChange}    
                    />
                    <input 
                        type="text" 
                        id="email" 
                        className={!changeDetails ? "profileEmail" : "profileEmailActive" }
                        disabled={!changeDetails}
                        value={email}
                        onChange={handleChange}    
                    />
                </form>
            </div>
        </div>
    )
}

export default Profile;