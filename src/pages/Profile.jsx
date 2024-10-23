import { getAuth, updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, updateDoc, collection, getDocs, query, where, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [changeDetails, setChangeDetails] = useState(false);

    const auth = getAuth();
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    
    const {name, email} = formData;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, "listings");

            const q = query(
                listingsRef,
                where("userRef", "==", auth.currentUser.uid),
                orderBy("timestamp", "desc") 
            );

            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings);
            setLoading(false);
        }

        fetchUserListings();
    }, [auth.currentUser.uid])

    // Funtion to handle user logout.
    const handleLogout = () => {
        // Firebase predefined function to logout the current user.
        auth.signOut();
        navigate("/");
    }

    // Function to delete a user's listing.
    const handleDelete = async (listingId) => {
        if(window.confirm("Are you sure you want to delete?")){
            await deleteDoc(doc(db, "listings", listingId));
            const updatedListings = listings.filter((listing) => listing.id !== listingId);
            setListings(updatedListings);
            toast.success("Listing deleted successfully!");
        }
    }

    // Function to edit a user's listing.
    const handleEdit = (listingId) => {
        navigate(`/edit-listing/${listingId}`);
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

                {!loading && listings?.length > 0 && (
                    <>
                        <p className="listingText">Your Listings</p>
                        <ul className="listingsList">
                            {listings.map((listing) => (
                                <ListingItem 
                                    key={listing.id} 
                                    listing={listing.data}
                                    id={listing.id}
                                    onDelete={() => handleDelete(listing.id)}
                                    onEdit={() => handleEdit(listing.id)}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </main> 
        </div>
    )
}

export default Profile;