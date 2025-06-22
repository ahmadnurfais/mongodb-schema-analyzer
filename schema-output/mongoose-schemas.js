// Generated Mongoose Schemas
const mongoose = require('mongoose');
const { Schema } = mongoose;

// sessions Schema
const SessionsSchema = new Schema({
  _id: {
    type: String
  }, // Frequency: 100.00%
  payload: {
    type: String
  }, // Frequency: 100.00%
  last_activity: {
    type: Number
  }, // Frequency: 100.00%
  custom: {
    type: String
  }, // Frequency: 100.00%
  user_id: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  ip_address: {
    type: String
  }, // Frequency: 100.00%
  user_agent: {
    type: String
  }, // Frequency: 100.00%
}, {
  timestamps: true,
  collection: 'sessions'
});

const Sessions = mongoose.model('Sessions', SessionsSchema);

// news Schema
const NewsSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  tags: {
    type: [String]
  }, // Frequency: 100.00%
  title: {
    type: String
  }, // Frequency: 100.00%
  preview_content: {
    type: String
  }, // Frequency: 100.00%
  datetime: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  updated_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  created_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
}, {
  timestamps: true,
  collection: 'news'
});

const News = mongoose.model('News', NewsSchema);

// tasks Schema
const TasksSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  status: {
    type: [String]
  }, // Frequency: 100.00%
  priority: {
    type: String
  }, // Frequency: 100.00%
  collaborators: {
    type: String
  }, // Frequency: 100.00%
  attachments: {
    type: [Array]
  }, // Frequency: 100.00%
  title: {
    type: String
  }, // Frequency: 100.00%
  description: {
    type: String
  }, // Frequency: 100.00%
  project_name: {
    type: String
  }, // Frequency: 100.00%
  due_date: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  creator_id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  office_id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  updated_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  created_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
}, {
  timestamps: true,
  collection: 'tasks'
});

const Tasks = mongoose.model('Tasks', TasksSchema);

// user_verifications Schema
const UserVerificationsSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  user_id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  email: {
    type: String
  }, // Frequency: 100.00%
  otp: {
    type: Number
  }, // Frequency: 100.00%
  expires_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  updated_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  created_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
}, {
  timestamps: true,
  collection: 'user_verifications'
});

const UserVerifications = mongoose.model('UserVerifications', UserVerificationsSchema);

// attendances Schema
const AttendancesSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  status: {
    type: String
  }, // Frequency: 100.00%
  check_out_time: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  check_out_location: {
    type: String
  }, // Frequency: 100.00%
  notes: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  user_id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  office_id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  date: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  check_in_time: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  check_in_location: {
    type: String
  }, // Frequency: 100.00%
  check_in_photo: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  updated_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  created_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  check_out_photo: {
    type: Schema.Types.Mixed,
    required: false
  }, // Frequency: 50.00%
}, {
  timestamps: true,
  collection: 'attendances'
});

const Attendances = mongoose.model('Attendances', AttendancesSchema);

// employee_offices Schema
const EmployeeOfficesSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  status: {
    type: String
  }, // Frequency: 100.00%
  end_date: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  user_id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  office_id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  start_date: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  updated_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  created_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
}, {
  timestamps: true,
  collection: 'employee_offices'
});

const EmployeeOffices = mongoose.model('EmployeeOffices', EmployeeOfficesSchema);

// cache Schema
const CacheSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  key: {
    type: String
  }, // Frequency: 100.00%
  expiration: {
    type: Number
  }, // Frequency: 100.00%
  value: {
    type: String
  }, // Frequency: 100.00%
}, {
  timestamps: true,
  collection: 'cache'
});

const Cache = mongoose.model('Cache', CacheSchema);

// offices Schema
const OfficesSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  is_active: {
    type: Boolean
  }, // Frequency: 100.00%
  name: {
    type: String
  }, // Frequency: 100.00%
  address: {
    type: String
  }, // Frequency: 100.00%
  latitude: {
    type: Number
  }, // Frequency: 100.00%
  longitude: {
    type: Number
  }, // Frequency: 100.00%
  radius: {
    type: Number
  }, // Frequency: 100.00%
  working_hours_start: {
    type: String
  }, // Frequency: 100.00%
  working_hours_end: {
    type: String
  }, // Frequency: 100.00%
  updated_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  created_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
}, {
  timestamps: true,
  collection: 'offices'
});

const Offices = mongoose.model('Offices', OfficesSchema);

// users Schema
const UsersSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  }, // Frequency: 100.00%
  image: {
    type: [String]
  }, // Frequency: 100.00%
  role: {
    type: String
  }, // Frequency: 100.00%
  is_verified: {
    type: Boolean
  }, // Frequency: 100.00%
  email_verified_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  fcm_tokens: {
    type: String
  }, // Frequency: 100.00%
  google_uid: {
    type: String
  }, // Frequency: 100.00%
  email: {
    type: String
  }, // Frequency: 100.00%
  password: {
    type: String
  }, // Frequency: 100.00%
  name: {
    type: String
  }, // Frequency: 100.00%
  phone: {
    type: String
  }, // Frequency: 100.00%
  gender: {
    type: String
  }, // Frequency: 100.00%
  age: {
    type: String
  }, // Frequency: 100.00%
  address: {
    type: String
  }, // Frequency: 100.00%
  reg_method: {
    type: String
  }, // Frequency: 100.00%
  updated_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
  created_at: {
    type: Schema.Types.Mixed
  }, // Frequency: 100.00%
}, {
  timestamps: true,
  collection: 'users'
});

const Users = mongoose.model('Users', UsersSchema);

module.exports = {
  Sessions,
  News,
  Tasks,
  UserVerifications,
  Attendances,
  EmployeeOffices,
  Cache,
  Offices,
  Users
};
