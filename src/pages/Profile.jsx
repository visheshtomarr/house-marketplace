import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

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

            <main>
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

                <Link to="/create-listing" className="createListing">
                    <img src={homeIcon} alt="Home" />
                    <p>Sell or Rent your home</p>
                    <img src={arrowRight} alt="Arrow right" />
                </Link>
            </main> 
        </div>
    )
}

export default Profile;