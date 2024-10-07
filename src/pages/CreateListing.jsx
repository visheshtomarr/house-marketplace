import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function CreateListing() {
    // Create a piece of state which can be set to false so that the latitude and
    // longitude will be set manually.
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })

    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    // userRef will be the current logged in user's ID.
                    setFormData({ ...formData, userRef: user.uid });
                } else {
                    navigate("/sign-in")
                }
            })
        }

        return () => {
            isMounted.current = false;
        }
    }, [isMounted])

    if(loading) {
        return <Spinner /> 
    }

    return (
        <div>
            Create Listing
        </div>
    )
}

export default CreateListing;
