import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";


function Offers() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // we will be using async-await, so we need to declare a function here.
        const fetchListings = async () => {
            try {
                // Get a reference to a collection.
                const listingsReference = collection(db, "listings");

                // Create a query to fetch listings.
                let q = query(
                    listingsReference, 
                    where("offer", "==", true),
                    orderBy("timestamp", "desc"),
                    limit(10)
                );

                // Execute the above query.
                const querySnap = await getDocs(q);  // Will get the docs for this specific query.
                
                const listings = [];

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                })

                setListings(listings);
                setLoading(false);
            } catch (error) {
                toast.error("Could not fetch listings!")
            }
        }

        fetchListings();
    }, [])

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    Offers
                </p>
            </header>

            {loading ? (
                <Spinner />
             ) : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map((listing) => (
                                <ListingItem 
                                    listing={listing.data} 
                                    id={listing.id}
                                    key={listing.id}
                                />
                            ))}
                        </ul>
                    </main>
                </>
             ) : (
                <p>There are no current offers on any property</p>
             )}
        </div>
    )
}

export default Offers;
