import mongoose from 'mongoose';

const featureTierSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['free', 'pro', 'business'],
    required: true,
    unique: true
  },
  features: {
    scrollControl: {
      staticResistance: {
        enabled: Boolean,
        maxLevel: Number
      },
      dynamicResistance: {
        enabled: Boolean,
        maxLevel: Number,
        progressiveResistance: Boolean,
        customPatterns: Boolean
      },
      smartPause: {
        enabled: Boolean,
        customDuration: Boolean
      }
    },
    siteBlocking: {
      maxSites: Number,
      patterns: {
        enabled: Boolean,
        regex: Boolean,
        customRules: Boolean
      },
      schedules: {
        enabled: Boolean,
        maxSchedules: Number,
        recurring: Boolean,
        exceptions: Boolean
      },
      categories: {
        predefined: Boolean,
        custom: Boolean
      }
    },
    focus: {
      pomodoro: {
        enabled: Boolean,
        customIntervals: Boolean,
        templates: Boolean
      },
      modes: {
        count: Number,
        custom: Boolean
      },
      automation: {
        enabled: Boolean,
        rules: Boolean,
        triggers: Boolean
      }
    },
    analytics: {
      basic: Boolean,
      advanced: {
        enabled: Boolean,
        retention: Number, // days
        export: Boolean,
        customReports: Boolean
      },
      insights: {
        enabled: Boolean,
        ai: Boolean,
        recommendations: Boolean
      }
    },
    team: {
      enabled: Boolean,
      maxMembers: Number,
      roles: {
        custom: Boolean,
        templates: Boolean
      },
      policies: {
        enabled: Boolean,
        custom: Boolean
      }
    },
    integration: {
      calendar: Boolean,
      tasks: Boolean,
      customApps: Boolean,
      api: {
        enabled: Boolean,
        rateLimit: Number
      }
    },
    backup: {
      enabled: Boolean,
      frequency: Number,
      retention: Number,
      encryption: Boolean
    }
  }
}, {
  timestamps: true
});