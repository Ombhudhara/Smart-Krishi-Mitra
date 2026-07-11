// =============================================================================
// FarmerProfile.jsx — Smart Krishi Mitra
// =============================================================================
// Renders the Farmer-specific profile view by delegating to the shared
// ProfilePage engine with role="farmer".
//
// Called by: pages/Profile/Profile.jsx when user.role === 'Farmer'
// Layout (Navbar, Sidebar, Footer): owned by pages/Profile/Profile.jsx
// UI primitives (Button, Card, Modal, Loader): used inside ProfilePage.jsx
// =============================================================================
import React from 'react';
import ProfilePage from './ProfilePage';

const FarmerProfile = () => <ProfilePage role="farmer" />;

export default FarmerProfile;
