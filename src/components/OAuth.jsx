import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

function OAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    // Function to hanle onclick for google icon.
    const onGoogleIconClick = async () => {
        try {
            // All this will sign-in/up the user with Google.
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Get the document reference from firestore. 
            const docReference = doc(db, "users", user.uid);
            // Get the snapshot of the document.
            const docSnap = await getDoc(docReference);

            // Will check if the user already exists in firestore, if it doesn't,
            // we will add it.
            if(!docSnap.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                }); 
            }
            navigate("/");
        } catch (error) {
            toast.error("Could not authorize with Google!");
        }
    }
    
    return (
        <div className="socialLogin">
            <p>Sign {location.pathname === "/sign-in" ? "In" : "Up"} with</p>
            <button className="socialIconDiv" onClick={onGoogleIconClick}>
                <img src={googleIcon} className="socialIconImg" alt="Google Icon" />
            </button>
        </div>
    )
}

export default OAuth;
