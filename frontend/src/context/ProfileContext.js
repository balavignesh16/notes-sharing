import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext'; // <-- IMPORT useAuth FROM THE NEW CONTEXT

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const { user } = useAuth(); // This now correctly consumes the context
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;
        if (user) {
            setLoading(true);
            const docRef = doc(db, 'users', user.uid);
            unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    setProfile({ uid: user.uid, ...docSnap.data() });
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching profile:", error);
                setProfile(null);
                setLoading(false);
            });
        } else {
            setProfile(null);
            setLoading(false);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    return (
        <ProfileContext.Provider value={{ profile, loading }}>
            {children}
        </ProfileContext.Provider>
    );
};
