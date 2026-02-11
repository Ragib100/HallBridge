# Room Management - Admin Guide

## ✅ New Feature: Add Rooms Through Admin Panel

Admins can now create rooms directly through the web interface without running seed scripts!

## How to Add Rooms

### Access the Room Management Page
1. Login as **Admin**
2. Navigate to **Admin Dashboard > Rooms**
3. Click the **"Add Room"** button in the top filters section

### Creating Rooms

#### Option 1: Single Room Creation
- Select **"Single Room"** mode
- Choose **Floor Number** (1-8)
- Enter **Room Number** (e.g., 01, 02, 103)
  - Display format: Floor + Room Number (e.g., Floor 1, Room 01 = "101")
- Select **Bed Capacity** (1-6 beds)
- Choose optional **Amenities** (AC, Fan, Bathrooms, Balcony, WiFi)
- Click **"Create Room"**

#### Option 2: Bulk Room Creation
Perfect for setting up an entire floor at once!

- Select **"Bulk Create"** mode
- Choose **Floor Number** (1-8)
- Enter **Room Range**:
  - Start Room: e.g., 1
  - End Room: e.g., 20
  - This will create rooms 101-120 (if Floor 1)
- Select **Bed Capacity** (applies to all rooms)
- Choose **Amenities** (applies to all rooms)
- Click **"Create Rooms"**
- Maximum: 50 rooms per batch

### Example: Setting Up Floor 2

**Bulk Mode:**
- Floor: 2
- Start Room: 1
- End Room: 25
- Capacity: 4 beds
- Amenities: Fan, Attached Bath, WiFi

**Result:** Creates rooms 201-225, each with 4 beds and selected amenities

## Room Display Format
- **Floor 1, Room 5** → Display: "105"
- **Floor 3, Room 12** → Display: "312"
- **Floor 8, Room 1** → Display: "801"

## Features

### ✨ Single Room Creation
- Create individual rooms with custom configurations
- Full control over room number and amenities

### 🚀 Bulk Room Creation
- Create up to 50 rooms at once
- Consistent configuration across all rooms
- Perfect for setting up new floors

### 🔒 Duplicate Prevention
- System prevents creating rooms with the same floor + room number combination
- Validation ensures data integrity

### 📊 Real-time Updates
- Room stats update automatically after creation
- Rooms appear immediately in the list

## Room deletion
Rooms can only be deleted if they have NO occupied beds. Remove all students first before deleting a room.

## API Endpoints

### Create Room
- **POST** `/api/admin/rooms/create`
- Body: `{ floor, roomNumber, capacity, amenities, hallId }`

### Delete Room
- **DELETE** `/api/admin/rooms/create?roomId={id}`
- Only works for empty rooms

## Migration from Seed Scripts

You can still use seed scripts (recommended for initial setup):
```bash
npx tsx scripts/seeds/rooms.ts
```

But for adding individual rooms or small batches, use the web interface!

## Notes
- All new rooms start with "vacant" status
- Rooms are automatically configured with empty beds equal to capacity
- Room numbers are automatically padded (5 → 05)
- Floor numbers must be between 1 and 8
