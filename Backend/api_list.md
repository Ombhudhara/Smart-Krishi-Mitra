# Smart Krishi Mitra - Backend API Documentation

## adminRoutes.js

## aiRoutes.js

### `POST` `/chat`
- **Controller**: `next`

### `GET` `/conversations`
- **Controller**: `getConversations`
- **URL Params**: `id, messageId, conversationId`
- **Body Payload**: `isFavorite, rating, feedback, title, isPinned`

### `POST` `/conversations`
- **Controller**: `createConversation`
- **URL Params**: `id, conversationId, messageId`
- **Body Payload**: `isFavorite, rating, feedback, title, isPinned`

### `PUT` `/conversations/:id`
- **Controller**: `updateConversation`
- **URL Params**: `id, conversationId, messageId`
- **Body Payload**: `isFavorite, rating, feedback, title, isPinned`

### `DELETE` `/conversations/:id`
- **Controller**: `deleteConversation`
- **URL Params**: `id, conversationId, messageId`
- **Body Payload**: `feedback, rating`

### `GET` `/conversations/:conversationId/messages`
- **Controller**: `getMessagesByConversation`
- **URL Params**: `id, messageId, conversationId`
- **Body Payload**: `isFavorite, rating, feedback, title, isPinned`

### `DELETE` `/history/:messageId`
- **Controller**: `deleteMessage`
- **URL Params**: `conversationId, messageId`
- **Body Payload**: `feedback, rating`

### `POST` `/history/:messageId/feedback`
- **Controller**: `submitFeedback`
- **URL Params**: `conversationId, messageId`
- **Body Payload**: `feedback, rating`

### `GET` `/conversations/:conversationId/export/text`
- **Controller**: `exportTextTranscript`
- **URL Params**: `conversationId`

## authRoutes.js

### `POST` `/register`
- **Controller**: `register`
- **Body Payload**: `profileImage, email, password, village, city, district, taluka, address, state, role, fullName, phone, pincode`

### `POST` `/login`
- **Controller**: `login`
- **Body Payload**: `email, password`

### `GET` `/me`
- **Controller**: `getCurrentUser`

### `POST` `/logout`
- **Controller**: `logout`

## bookmarkRoutes.js

### `POST` `/`
- **Controller**: `toggleBookmark`
- **Body Payload**: `id, type`

### `GET` `/`
- **Controller**: `getBookmarks`

## calculatorRoutes.js

### `GET` `/history`
- **Controller**: `getCalculations`
- **URL Params**: `id`
- **Body Payload**: `fertilizerCost, seedCost, labourCost, irrigationCost, totalCost, expectedRevenue, year, expectedYield, season, cropName, expectedProfit, cropVariety, landArea, machineryCost, otherCost`

### `POST` `/save`
- **Controller**: `saveCalculation`
- **URL Params**: `id`
- **Body Payload**: `fertilizerCost, seedCost, labourCost, irrigationCost, totalCost, expectedRevenue, year, expectedYield, season, cropName, expectedProfit, cropVariety, landArea, machineryCost, otherCost`

### `DELETE` `/:id`
- **Controller**: `deleteCalculation`
- **URL Params**: `id`

## cropRoutes.js

### `GET` `/`
- **Controller**: `getAllCrops`
- **URL Params**: `id, season`
- **Query Params**: `sort, season, category, soil, q, search`

### `GET` `/search`
- **Controller**: `searchCrops`
- **URL Params**: `season`
- **Query Params**: `q`

### `GET` `/season/:season`
- **Controller**: `getCropsBySeason`
- **URL Params**: `season`

### `GET` `/:id`
- **Controller**: `getCropById`
- **URL Params**: `id, season`
- **Query Params**: `q`

## dashboardRoutes.js

### `GET` `/summary`
- **Controller**: `getSummary`

### `GET` `/stats`
- **Controller**: `getStats`

### `GET` `/activity`
- **Controller**: `getActivity`

## governmentRoutes.js

### `GET` `/`
- **Controller**: `getGovSchemes`
- **URL Params**: `id, schemeId`
- **Query Params**: `category, search`
- **Body Payload**: `landholding, income, age, state`

### `POST` `/check-eligibility`
- **Controller**: `checkEligibility`
- **URL Params**: `schemeId`
- **Body Payload**: `landholding, income, age, state`

### `GET` `/:id`
- **Controller**: `getSchemeById`
- **URL Params**: `id, schemeId`
- **Body Payload**: `landholding, income, age, state`

### `POST` `/:schemeId/apply`
- **Controller**: `applyForScheme`
- **URL Params**: `schemeId`

## marketplaceRoutes.js

### `GET` `/`
- **Controller**: `getListings`
- **URL Params**: `id`
- **Query Params**: `q, category`
- **Body Payload**: `minimumOrder, location, stock, unit, pickupAvailable, price, deliveryAvailable, maximumOrder, status, district, category, cropName, images, pricePerUnit, state, description, isOrganic, quantity`

### `GET` `/search`
- **Controller**: `searchListings`
- **URL Params**: `id`
- **Query Params**: `q`
- **Body Payload**: `minimumOrder, location, stock, unit, pickupAvailable, price, deliveryAvailable, maximumOrder, status, district, category, cropName, images, pricePerUnit, state, description, isOrganic, quantity`

### `GET` `/:id`
- **Controller**: `getListingById`
- **URL Params**: `id`
- **Query Params**: `q`
- **Body Payload**: `minimumOrder, location, stock, unit, pickupAvailable, price, deliveryAvailable, maximumOrder, status, district, category, cropName, images, pricePerUnit, state, description, isOrganic, quantity`

### `POST` `/:id/contact`
- **Controller**: `contactSeller`
- **URL Params**: `id`
- **Body Payload**: `minimumOrder, location, stock, unit, pickupAvailable, price, deliveryAvailable, maximumOrder, status, district, category, cropName, images, pricePerUnit, state, description, isOrganic, quantity`

### `GET` `/mine`
- **Controller**: `getMyListings`
- **URL Params**: `id`
- **Body Payload**: `minimumOrder, location, stock, unit, pickupAvailable, price, deliveryAvailable, maximumOrder, status, district, category, cropName, images, pricePerUnit, state, description, isOrganic, quantity`

### `GET` `/my/all`
- **Controller**: `getMyListings`
- **URL Params**: `id`
- **Body Payload**: `minimumOrder, location, stock, unit, pickupAvailable, price, deliveryAvailable, maximumOrder, status, district, category, cropName, images, pricePerUnit, state, description, isOrganic, quantity`

### `POST` `/`
- **Controller**: `createListing`
- **URL Params**: `id`
- **Body Payload**: `minimumOrder, location, stock, unit, pickupAvailable, price, deliveryAvailable, maximumOrder, status, district, category, cropName, images, pricePerUnit, state, description, isOrganic, quantity`

### `PUT` `/:id`
- **Controller**: `updateListing`
- **URL Params**: `id`
- **Body Payload**: `minimumOrder, location, stock, unit, pickupAvailable, price, deliveryAvailable, status, maximumOrder, district, category, cropName, images, pricePerUnit, state, description, isOrganic, quantity`

### `PUT` `/:id/status`
- **Controller**: `toggleListingStatus`
- **URL Params**: `id`
- **Body Payload**: `status`

### `DELETE` `/:id`
- **Controller**: `deleteListing`
- **URL Params**: `id`
- **Body Payload**: `status`

## marketPriceRoutes.js

### `GET` `/`
- **Controller**: `getMarketPrices`
- **URL Params**: `id, crop, district, category, state`
- **Query Params**: `marketStatus, cropCategory, district, season, page, sortBy, minPrice, maxPrice, state, limit, demandLevel, q, keyword`

### `GET` `/search`
- **Controller**: `searchMarketPrices`
- **URL Params**: `id`
- **Query Params**: `q, keyword`

### `GET` `/trending`
- **Controller**: `getTrending`
- **URL Params**: `id`

### `GET` `/dashboard`
- **Controller**: `getDashboard`
- **URL Params**: `id`

### `GET` `/state/:state`
- **Controller**: `getMarketPricesByState`
- **URL Params**: `id, district, category, state`
- **Query Params**: `q, keyword`

### `GET` `/district/:district`
- **Controller**: `getMarketPricesByDistrict`
- **URL Params**: `id, district, category`
- **Query Params**: `q, keyword`

### `GET` `/category/:category`
- **Controller**: `getMarketPricesByCategory`
- **URL Params**: `id, category`
- **Query Params**: `q, keyword`

### `GET` `/:crop`
- **Controller**: `getMarketPriceByCropName`
- **URL Params**: `id, crop, district, category, state`
- **Query Params**: `q, keyword`

### `POST` `/`
- **Controller**: `allowRoles("Admin"`

### `PUT` `/:id`
- **Controller**: `allowRoles("Admin"`

### `DELETE` `/:id`
- **Controller**: `allowRoles("Admin"`

## messageRoutes.js

### `GET` `/conversations`
- **Controller**: `getConversations`
- **URL Params**: `id, messageId, conversationId`
- **Body Payload**: `isFavorite, rating, feedback, title, isPinned`

### `POST` `/conversations`
- **Controller**: `startConversation`
- **URL Params**: `conversationId`
- **Body Payload**: `text, conversationId, recipientId`

### `PUT` `/conversations/:conversationId/read`
- **Controller**: `markConversationRead`
- **URL Params**: `conversationId`

### `GET` `/messages/:conversationId`
- **Controller**: `getMessages`

### `POST` `/messages`
- **Controller**: `sendMessage`
- **URL Params**: `conversationId`
- **Body Payload**: `text, recipientId, conversationId`

## newsRoutes.js

### `GET` `/`
- **Controller**: `getNews`
- **URL Params**: `id`
- **Query Params**: `category`

### `GET` `/:id`
- **Controller**: `getNewsById`
- **URL Params**: `id`

## notificationRoutes.js

### `GET` `/`
- **Controller**: `getNotifications`
- **URL Params**: `id`

### `PUT` `/read-all`
- **Controller**: `markAllAsRead`
- **URL Params**: `id`

### `PUT` `/:id/read`
- **Controller**: `markAsRead`
- **URL Params**: `id`

### `DELETE` `/:id`
- **Controller**: `deleteNotification`
- **URL Params**: `id`

## profileRoutes.js

### `GET` `/public/:userId`
- **Controller**: `getPublicProfile`
- **URL Params**: `userId`
- **Body Payload**: `id, type`

### `GET` `/`
- **Controller**: `getProfile`
- **URL Params**: `userId`
- **Body Payload**: `smsAlerts, transactionAlerts, currentPassword, newPassword, emailAlerts, fullName, emailNotifications, marketplaceNotifications, notificationSettings, address, pushNotifications, type, farmSize, dob, gender, farmName, district, soilType, state, phone, pincode, id, preferredLanguage, profileImage, messages, aiRecommendations, village, city, taluka, language, weatherAlerts, cropsGrown, governmentSchemeUpdates`

### `PUT` `/`
- **Controller**: `updateProfile`
- **URL Params**: `userId`
- **Body Payload**: `smsAlerts, transactionAlerts, currentPassword, newPassword, emailAlerts, fullName, emailNotifications, marketplaceNotifications, notificationSettings, address, pushNotifications, type, farmSize, dob, gender, farmName, district, soilType, state, phone, pincode, id, preferredLanguage, profileImage, messages, aiRecommendations, village, city, taluka, language, weatherAlerts, cropsGrown, governmentSchemeUpdates`

### `PUT` `/password`
- **Controller**: `changePassword`
- **URL Params**: `userId`
- **Body Payload**: `id, messages, transactionAlerts, aiRecommendations, smsAlerts, emailNotifications, marketplaceNotifications, language, emailAlerts, currentPassword, weatherAlerts, newPassword, governmentSchemeUpdates, pushNotifications, type`

### `PUT` `/language`
- **Controller**: `changeLanguage`
- **URL Params**: `userId`
- **Body Payload**: `id, messages, transactionAlerts, aiRecommendations, smsAlerts, emailNotifications, marketplaceNotifications, language, emailAlerts, weatherAlerts, governmentSchemeUpdates, pushNotifications, type`

### `PUT` `/notifications`
- **Controller**: `updateNotificationSettings`
- **URL Params**: `userId`
- **Body Payload**: `id, messages, transactionAlerts, aiRecommendations, smsAlerts, emailNotifications, marketplaceNotifications, emailAlerts, weatherAlerts, governmentSchemeUpdates, pushNotifications, type`

### `PUT` `/image`
- **Controller**: `updateProfileImage`
- **URL Params**: `userId`
- **Body Payload**: `id, messages, transactionAlerts, aiRecommendations, smsAlerts, emailNotifications, marketplaceNotifications, language, emailAlerts, currentPassword, weatherAlerts, newPassword, governmentSchemeUpdates, pushNotifications, type`

### `DELETE` `/image`
- **Controller**: `deleteProfileImage`
- **URL Params**: `userId`
- **Body Payload**: `id, type`

### `PUT` `/cover`
- **Controller**: `updateCoverImage`
- **URL Params**: `userId`
- **Body Payload**: `id, type`

### `DELETE` `/cover`
- **Controller**: `deleteCoverImage`
- **URL Params**: `userId`
- **Body Payload**: `id, type`

### `GET` `/images`
- **Controller**: `getProfileImages`
- **URL Params**: `userId`
- **Body Payload**: `id, type`

### `GET` `/account`
- **Controller**: `getAccountInfo`
- **Body Payload**: `id, type`

## transactionRoutes.js

### `GET` `/`
- **Controller**: `getTransactions`
- **URL Params**: `id`
- **Query Params**: `order, page = 1, sortBy, limit = 10, search`
- **Body Payload**: `buyerPhone, transactionId, price, status, listingId, cropName, invoicePdf, sellerPhone, deliveryAddress, paymentGateway, type = "delivery", quantity, sellerId, paymentMethod`

### `POST` `/`
- **Controller**: `createTransaction`
- **Body Payload**: `buyerPhone, transactionId, price, listingId, cropName, invoicePdf, sellerPhone, deliveryAddress, paymentGateway, quantity, sellerId, paymentMethod`

### `GET` `/:id`
- **Controller**: `getTransactionById`
- **URL Params**: `id`
- **Body Payload**: `buyerPhone, transactionId, price, status, listingId, cropName, invoicePdf, sellerPhone, deliveryAddress, paymentGateway, type = "delivery", quantity, sellerId, paymentMethod`

### `PUT` `/:id/status`
- **Controller**: `updateTransactionStatus`
- **URL Params**: `id`
- **Body Payload**: `buyerPhone, transactionId, price, status, listingId, cropName, invoicePdf, sellerPhone, deliveryAddress, paymentGateway, type = "delivery", quantity, sellerId, paymentMethod`

### `GET` `/:id/invoice`
- **Controller**: `downloadInvoice`
- **URL Params**: `id`
- **Body Payload**: `buyerPhone, transactionId, price, listingId, cropName, invoicePdf, sellerPhone, deliveryAddress, paymentGateway, quantity, sellerId, paymentMethod`

## uploadRoutes.js

## weatherRoutes.js

### `GET` `/`
- **Controller**: `getCurrentWeather`

### `GET` `/hourly`
- **Controller**: `getHourlyForecast`

### `GET` `/weekly`
- **Controller**: `getWeeklyForecast`

### `GET` `/aqi`
- **Controller**: `getAirQuality`

