// =============================================================================
// VendorProfile.jsx — Smart Krishi Mitra
// =============================================================================
// Renders the Vendor-specific profile view by delegating to the shared
// ProfilePage engine with role="vendor".
//
// Called by: pages/Profile/Profile.jsx when user.role === 'Vendor'
// Layout (Navbar, Sidebar, Footer): owned by pages/Profile/Profile.jsx
// UI primitives (Button, Card, Modal, Loader): used inside ProfilePage.jsx
// =============================================================================
import React from 'react';
import ProfilePage from './ProfilePage';

const VendorProfile = () => <ProfilePage role="vendor" />;

export default VendorProfile;
