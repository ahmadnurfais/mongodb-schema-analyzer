# Database Schema Documentation

**Database:** NeoEmployee
**Analyzed:** 2025-06-22T10:46:41.885Z
**Collections:** 9

## Collections Overview

### sessions
- **Documents:** 22
- **Fields:** 7
- **Relationships:** 0

### news
- **Documents:** 1
- **Fields:** 7
- **Relationships:** 0

### tasks
- **Documents:** 3
- **Fields:** 13
- **Relationships:** 0

### user_verifications
- **Documents:** 2
- **Fields:** 7
- **Relationships:** 0

### attendances
- **Documents:** 4
- **Fields:** 14
- **Relationships:** 0

### employee_offices
- **Documents:** 2
- **Fields:** 8
- **Relationships:** 0

### cache
- **Documents:** 1
- **Fields:** 4
- **Relationships:** 0

### offices
- **Documents:** 1
- **Fields:** 11
- **Relationships:** 0

### users
- **Documents:** 4
- **Fields:** 17
- **Relationships:** 0

## Detailed Schemas

### sessions

| Field | Type | Optional | Frequency |
|-------|------|----------|----------|
| _id | string | ✗ | 100.00% |
| payload | string | ✗ | 100.00% |
| last_activity | number | ✗ | 100.00% |
| custom | string | ✗ | 100.00% |
| user_id | null | ✗ | 100.00% |
| ip_address | string | ✗ | 100.00% |
| user_agent | string | ✗ | 100.00% |

### news

| Field | Type | Optional | Frequency |
|-------|------|----------|----------|
| _id | ObjectId | ✗ | 100.00% |
| tags | array \| string | ✗ | 100.00% |
| title | string | ✗ | 100.00% |
| preview_content | string | ✗ | 100.00% |
| datetime | object | ✗ | 100.00% |
| updated_at | object | ✗ | 100.00% |
| created_at | object | ✗ | 100.00% |

### tasks

| Field | Type | Optional | Frequency |
|-------|------|----------|----------|
| _id | ObjectId | ✗ | 100.00% |
| status | string | ✗ | 100.00% |
| priority | string | ✗ | 100.00% |
| collaborators | array \| string | ✗ | 100.00% |
| attachments | array | ✗ | 100.00% |
| title | string | ✗ | 100.00% |
| description | string | ✗ | 100.00% |
| project_name | string | ✗ | 100.00% |
| due_date | object | ✗ | 100.00% |
| creator_id | ObjectId | ✗ | 100.00% |
| office_id | ObjectId | ✗ | 100.00% |
| updated_at | object | ✗ | 100.00% |
| created_at | object | ✗ | 100.00% |

### user_verifications

| Field | Type | Optional | Frequency |
|-------|------|----------|----------|
| _id | ObjectId | ✗ | 100.00% |
| user_id | ObjectId | ✗ | 100.00% |
| email | string | ✗ | 100.00% |
| otp | number | ✗ | 100.00% |
| expires_at | object | ✗ | 100.00% |
| updated_at | object | ✗ | 100.00% |
| created_at | object | ✗ | 100.00% |

### attendances

| Field | Type | Optional | Frequency |
|-------|------|----------|----------|
| _id | ObjectId | ✗ | 100.00% |
| status | string | ✗ | 100.00% |
| check_out_time | null \| object | ✗ | 100.00% |
| check_out_location | null \| string | ✗ | 100.00% |
| notes | null | ✗ | 100.00% |
| user_id | ObjectId | ✗ | 100.00% |
| office_id | ObjectId | ✗ | 100.00% |
| date | object | ✗ | 100.00% |
| check_in_time | object | ✗ | 100.00% |
| check_in_location | string | ✗ | 100.00% |
| check_in_photo | null | ✗ | 100.00% |
| updated_at | object | ✗ | 100.00% |
| created_at | object | ✗ | 100.00% |
| check_out_photo | null | ✓ | 50.00% |

### employee_offices

| Field | Type | Optional | Frequency |
|-------|------|----------|----------|
| _id | ObjectId | ✗ | 100.00% |
| status | string | ✗ | 100.00% |
| end_date | null | ✗ | 100.00% |
| user_id | ObjectId | ✗ | 100.00% |
| office_id | ObjectId | ✗ | 100.00% |
| start_date | object | ✗ | 100.00% |
| updated_at | object | ✗ | 100.00% |
| created_at | object | ✗ | 100.00% |

### cache

| Field | Type | Optional | Frequency |
|-------|------|----------|----------|
| _id | ObjectId | ✗ | 100.00% |
| key | string | ✗ | 100.00% |
| expiration | number | ✗ | 100.00% |
| value | string | ✗ | 100.00% |

### offices

| Field | Type | Optional | Frequency |
|-------|------|----------|----------|
| _id | ObjectId | ✗ | 100.00% |
| is_active | boolean | ✗ | 100.00% |
| name | string | ✗ | 100.00% |
| address | string | ✗ | 100.00% |
| latitude | number | ✗ | 100.00% |
| longitude | number | ✗ | 100.00% |
| radius | number | ✗ | 100.00% |
| working_hours_start | string | ✗ | 100.00% |
| working_hours_end | string | ✗ | 100.00% |
| updated_at | object | ✗ | 100.00% |
| created_at | object | ✗ | 100.00% |

### users

| Field | Type | Optional | Frequency |
|-------|------|----------|----------|
| _id | ObjectId | ✗ | 100.00% |
| image | string | ✗ | 100.00% |
| role | string | ✗ | 100.00% |
| is_verified | boolean | ✗ | 100.00% |
| email_verified_at | object | ✗ | 100.00% |
| fcm_tokens | array \| string | ✗ | 100.00% |
| google_uid | string \| null | ✗ | 100.00% |
| email | string | ✗ | 100.00% |
| password | string | ✗ | 100.00% |
| name | string | ✗ | 100.00% |
| phone | null \| string | ✗ | 100.00% |
| gender | null \| string | ✗ | 100.00% |
| age | null \| string | ✗ | 100.00% |
| address | null \| string | ✗ | 100.00% |
| reg_method | string | ✗ | 100.00% |
| updated_at | object | ✗ | 100.00% |
| created_at | object | ✗ | 100.00% |

