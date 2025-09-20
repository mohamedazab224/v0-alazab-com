-- إضافة جدول الفنيين ومعلومات الموقع
CREATE TABLE IF NOT EXISTS technicians (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  specialization VARCHAR(50),
  status VARCHAR(20) DEFAULT 'available',
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إضافة عمود الفني المخصص لجدول طلبات الصيانة
ALTER TABLE maintenance_requests 
ADD COLUMN IF NOT EXISTS assigned_technician_id INTEGER REFERENCES technicians(id),
ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS location_address TEXT;

-- إضافة مؤشرات للأداء
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_technician ON maintenance_requests(assigned_technician_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_location ON maintenance_requests(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_technicians_location ON technicians(current_location_lat, current_location_lng);

-- إدراج بيانات تجريبية للفنيين
INSERT INTO technicians (name, email, phone, specialization, status) VALUES
('أحمد محمد', 'ahmed@alazab.com', '01234567890', 'كهرباء', 'available'),
('محمد علي', 'mohamed@alazab.com', '01234567891', 'سباكة', 'available'),
('علي حسن', 'ali@alazab.com', '01234567892', 'تكييف', 'busy'),
('حسن أحمد', 'hassan@alazab.com', '01234567893', 'عام', 'available');
