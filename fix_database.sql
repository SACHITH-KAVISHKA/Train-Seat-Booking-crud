-- Fix database schema issue: Remove user_id column from bookings table
-- This column is not needed in the current entity model

USE train_booking;

-- Check if user_id column exists and remove it
SET @sql = '';
SELECT CONCAT('ALTER TABLE bookings DROP COLUMN user_id;')
INTO @sql 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'train_booking' 
  AND TABLE_NAME = 'bookings' 
  AND COLUMN_NAME = 'user_id';

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the bookings table structure
DESCRIBE bookings;

-- Show existing bookings (if any)
SELECT COUNT(*) as booking_count FROM bookings;