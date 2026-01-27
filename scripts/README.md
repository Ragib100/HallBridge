# Database Scripts

This folder contains modular scripts for managing the HallBridge database.

## Structure

```
scripts/
├── seed.ts              # Main seed script (runs all seeds)
├── clear.ts             # Clear all database data
├── lib/
│   └── db.ts            # Database connection helper
├── seeds/
│   ├── users.ts         # User seed data (admin, staff, students)
│   ├── maintenance.ts   # Maintenance requests seed data
│   └── settings.ts      # System settings seed data
└── README.md
```

## Prerequisites

Make sure you have:
1. MongoDB running (locally or remote)
2. `.env.local` file configured with `MONGODB_URI`

Example `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hallbridge?retryWrites=true&w=majority
```

**⚠️ Important**: If using MongoDB Atlas, make sure to use `mongodb+srv://` connection string, NOT direct connection with `directConnection=true`.

## Available Commands

### Seed All Data

```bash
pnpm seed
```

Runs all seed modules. If one fails, others will still execute.

### Seed Individual Data

```bash
pnpm seed:users        # Seed only users (admin, staff, students)
pnpm seed:maintenance  # Seed only maintenance requests
pnpm seed:settings     # Seed only system settings
```

### Clear the Database

```bash
pnpm seed:clear        # With confirmation prompt
pnpm seed:clear --force # Skip confirmation (for scripts)
```

### Reset the Database

Clear and re-seed in one command:

```bash
pnpm db:reset
```

## Manual MongoDB Operations

### Connect to MongoDB Shell

```bash
# Local MongoDB
mongosh mongodb://localhost:27017/hallbridge

# MongoDB Atlas (replace with your connection string)
mongosh "mongodb+srv://cluster.mongodb.net/hallbridge"
```

### Useful MongoDB Commands

```javascript
// Show all collections
show collections

// Count documents in a collection
db.users.countDocuments()

// View all users
db.users.find().pretty()

// View all maintenance requests
db.maintenancerequests.find().pretty()

// Delete a specific collection
db.users.drop()

// Delete all documents from a collection
db.users.deleteMany({})

// Drop the entire database (DESTRUCTIVE!)
db.dropDatabase()
```

### Using MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your `MONGODB_URI`
3. Browse collections, run queries, and manage data visually

## Troubleshooting

### "MONGODB_URI is not defined"

Make sure you have a `.env.local` file in the project root with:
```
MONGODB_URI=mongodb://localhost:27017/hallbridge
```

### "Failed to connect to MongoDB"

1. Check if MongoDB is running:
   ```bash
   # For local MongoDB
   sudo systemctl status mongod
   
   # Or start it
   sudo systemctl start mongod
   ```

2. Verify your connection string is correct
3. Check network/firewall settings for remote databases

### "User already exists"

The seed script skips existing users. To fully reset, run:
```bash
pnpm db:reset
```
