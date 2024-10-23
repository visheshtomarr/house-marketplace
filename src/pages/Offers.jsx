import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";


function Offers() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);

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
                    limit(1)
                );

                // Execute the above query.
                const querySnap = await getDocs(q);  // Will get the docs for this specific query.
                
                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchedListing(lastVisible);

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

    // Function to implement Pagination/Load more functionality.
    const loadMoreListings = async () => {
        try {
            // Get a reference to a collection.
            const listingsReference = collection(db, "listings");

            // Create a query to fetch listings.
            let q = query(
                listingsReference, 
                where("offer", "==", true),
                orderBy("timestamp", "desc"),
                startAfter(lastFetchedListing),
                limit(5)
            );

            // Execute the above query.
            const querySnap = await getDocs(q);  // Will get the docs for this specific query.
            
            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchedListing(lastVisible);

            const listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings((prevState) => [...prevState, ...listings]);
            setLoading(false);
        } catch (error) {
            toast.error("Could not fetch listings!")
        }
    }

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

                    <br />
                    <br />

                    {lastFetchedListing && (
                        <p className="loadMore" onClick={loadMoreListings}>Load More</p>
                    )}
                </>
             ) : (
                <p>There are no current offers on any property</p>
             )}
        </div>
    )
}

export default Offers;
