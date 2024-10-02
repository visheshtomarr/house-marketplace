import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

function Profile() {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        console.log(user);
        // Set current authorised user to state. 
        setUser(auth.currentUser);
    }, [])

    return user ? <h1>{user.displayName}</h1> : "Not Loggin In";
}

export default Profile;