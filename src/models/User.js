import mongoose from 'mongoose';

const blockedWebsiteSchema = new mongoose.Schema({
  url: { type: String, required: true },
  pattern: { type: String, required: true }, // URL pattern for matching
  category: { type: String, enum: ['social', 'entertainment', 'news', 'other'] },
  customIcon: { type: String }, // Custom icon URL
  scheduleOnly: { type: Boolean, default: false } // Only block during scheduled times
});

const focusScheduleSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // 24h format "HH:mm"
  endTime: { type: String, required: true },
  days: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  active: { type: Boolean, default: true }
});

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'business'],
    default: 'free'
  },
  extensionSettings: {
    syncEnabled: { type: Boolean, default: true },
    offlineMode: { type: Boolean, default: false },
    notifications: {
      enabled: { type: Boolean, default: true },
      sound: { type: Boolean, default: false },
      breakReminders: { type: Boolean, default: true }
    },
    appearance: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      compactMode: { type: Boolean, default: false }
    }
  },
  scrollSettings: {
    dynamicResistance: {
      isEnabled: { type: Boolean, default: false },
      resistanceLevel: { type: Number, min: 1, max: 10, default: 5 },
      progressiveResistance: {
        isEnabled: { type: Boolean, default: false },
        increaseRate: { type: Number, default: 1 }
      }
    },
    staticResistance: {
      isEnabled: { type: Boolean, default: false },
      resistanceLevel: { type: Number, min: 1, max: 10, default: 5 }
    }
  },
  focusMode: {
    blockedApps: [{
      appName: { type: String, required: true },
      isBlocked: { type: Boolean, default: true }
    }],
    schedule: [focusScheduleSchema],
    screenLock: {
      isEnabled: { type: Boolean, default: false },
      allowedVideoDomains: [String],
      autoLockDuration: { type: Number, default: 0 }
    }
  },
  blockedWebsites: [blockedWebsiteSchema],
  lastSync: { type: Date, default: Date.now },
  offlineData: {
    lastUpdate: { type: Date },
    settings: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);