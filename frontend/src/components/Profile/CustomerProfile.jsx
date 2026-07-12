// =============================================================================
// CustomerProfile.jsx — Smart Krishi Mitra
// =============================================================================
// Renders the Customer-specific profile view by delegating to the shared
// ProfilePage engine with role="customer".
//
// Called by: pages/Profile/Profile.jsx when user.role === 'Customer'
// Layout (Navbar, Sidebar, Footer): owned by pages/Profile/Profile.jsx
// UI primitives (Button, Card, Modal, Loader): used inside ProfilePage.jsx
// =============================================================================
import React from 'react';
import ProfilePage from './ProfilePage';

const CustomerProfile = ({ userId }) => <ProfilePage role="customer" userId={userId} />;

export default CustomerProfile;
