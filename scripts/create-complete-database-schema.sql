-- إنشاء قاعدة بيانات شاملة لنظام إدارة الصيانة
-- تاريخ الإنشاء: 2025-01-19

-- تفعيل امتدادات PostgreSQL المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- للمواقع الجغرافية

-- جدول الفنيين
CREATE TABLE IF NOT EXISTS technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    specialization VARCHAR(100) NOT NULL, -- كهرباء، سباكة، تكييف، إلخ
    experience_years INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    current_location GEOGRAPHY(POINT, 4326), -- الموقع الحالي للفني
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول طلبات الصيانة الرئيسي
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(20) UNIQUE NOT NULL, -- رقم الطلب (MR-XXXXXX)
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- نوع الخدمة
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled')),
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326), -- الموقع الجغرافي
    preferred_date DATE,
    preferred_time TIME,
    estimated_cost DECIMAL(10,2),
    final_cost DECIMAL(10,2),
    assigned_technician_id UUID REFERENCES technicians(id),
    admin_notes TEXT,
    customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
    customer_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- جدول تاريخ حالات الطلبات
CREATE TABLE IF NOT EXISTS maintenance_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(100), -- اسم المستخدم أو النظام
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول صور الصيانة
CREATE TABLE IF NOT EXISTS maintenance_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(20) DEFAULT 'before' CHECK (image_type IN ('before', 'during', 'after')),
    description TEXT,
    uploaded_by VARCHAR(100), -- العميل أو الفني
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول تخصيص المهام للفنيين
CREATE TABLE IF NOT EXISTS maintenance_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by VARCHAR(100), -- المدير الذي قام بالتخصيص
    estimated_duration INTEGER, -- بالدقائق
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    technician_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(request_id, technician_id, assigned_at)
);

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(20) NOT NULL CHECK (recipient_type IN ('customer', 'technician', 'admin')),
    notification_type VARCHAR(50) NOT NULL, -- request_created, status_changed, assignment_made, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_customer_email ON maintenance_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_request_number ON maintenance_requests(request_number);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_created_at ON maintenance_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_assigned_technician ON maintenance_requests(assigned_technician_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_location ON maintenance_requests USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_technicians_email ON technicians(email);
CREATE INDEX IF NOT EXISTS idx_technicians_specialization ON technicians(specialization);
CREATE INDEX IF NOT EXISTS idx_technicians_is_active ON technicians(is_active);
CREATE INDEX IF NOT EXISTS idx_technicians_location ON technicians USING GIST(current_location);

CREATE INDEX IF NOT EXISTS idx_status_history_request_id ON maintenance_status_history(request_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_at ON maintenance_status_history(created_at);

CREATE INDEX IF NOT EXISTS idx_images_request_id ON maintenance_images(request_id);
CREATE INDEX IF NOT EXISTS idx_images_type ON maintenance_images(image_type);

CREATE INDEX IF NOT EXISTS idx_assignments_request_id ON maintenance_assignments(request_id);
CREATE INDEX IF NOT EXISTS idx_assignments_technician_id ON maintenance_assignments(technician_id);
CREATE INDEX IF NOT EXISTS idx_assignments_is_active ON maintenance_assignments(is_active);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_email ON notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_notifications_is_sent ON notifications(is_sent);

-- إنشاء دوال لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة triggers لتحديث updated_at
CREATE TRIGGER update_maintenance_requests_updated_at 
    BEFORE UPDATE ON maintenance_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at 
    BEFORE UPDATE ON technicians 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- دالة لإنشاء رقم طلب فريد
CREATE OR REPLACE FUNCTION generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.request_number IS NULL THEN
        NEW.request_number := 'MR-' || LPAD(nextval('maintenance_request_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء sequence لأرقام الطلبات
CREATE SEQUENCE IF NOT EXISTS maintenance_request_seq START 100000;

-- إضافة trigger لإنشاء رقم الطلب تلقائياً
CREATE TRIGGER generate_request_number_trigger
    BEFORE INSERT ON maintenance_requests
    FOR EACH ROW EXECUTE FUNCTION generate_request_number();

-- دالة لإضافة سجل في تاريخ الحالات عند تغيير الحالة
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO maintenance_status_history (request_id, old_status, new_status, changed_by, notes)
        VALUES (NEW.id, OLD.status, NEW.status, 'system', 'Status changed automatically');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة trigger لتسجيل تغييرات الحالة
CREATE TRIGGER log_status_change_trigger
    AFTER UPDATE ON maintenance_requests
    FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- إدراج بيانات تجريبية للفنيين
INSERT INTO technicians (name, email, phone, specialization, experience_years, rating) VALUES
('أحمد محمد', 'ahmed.mohamed@company.com', '+966501234567', 'كهرباء', 5, 4.8),
('سارة أحمد', 'sara.ahmed@company.com', '+966507654321', 'سباكة', 3, 4.6),
('محمد علي', 'mohamed.ali@company.com', '+966509876543', 'تكييف', 7, 4.9),
('فاطمة حسن', 'fatima.hassan@company.com', '+966502468135', 'عام', 4, 4.7),
('عبدالله خالد', 'abdullah.khalid@company.com', '+966508642097', 'كهرباء', 6, 4.5)
ON CONFLICT (email) DO NOTHING;

-- إنشاء views مفيدة للتقارير
CREATE OR REPLACE VIEW maintenance_requests_with_technician AS
SELECT 
    mr.*,
    t.name as technician_name,
    t.phone as technician_phone,
    t.specialization as technician_specialization
FROM maintenance_requests mr
LEFT JOIN technicians t ON mr.assigned_technician_id = t.id;

CREATE OR REPLACE VIEW maintenance_statistics AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_requests,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_requests,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_requests,
    AVG(customer_rating) as average_rating,
    AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/3600) as avg_completion_hours
FROM maintenance_requests
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';

-- منح الصلاحيات المناسبة
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- إنشاء فهارس إضافية للبحث النصي
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_search 
ON maintenance_requests USING gin(to_tsvector('arabic', description || ' ' || address));

-- تعليق على الجداول
COMMENT ON TABLE maintenance_requests IS 'جدول طلبات الصيانة الرئيسي';
COMMENT ON TABLE technicians IS 'جدول الفنيين والعمال';
COMMENT ON TABLE maintenance_status_history IS 'تاريخ تغييرات حالة الطلبات';
COMMENT ON TABLE maintenance_images IS 'صور طلبات الصيانة';
COMMENT ON TABLE maintenance_assignments IS 'تخصيص المهام للفنيين';
COMMENT ON TABLE notifications IS 'نظام الإشعارات';

-- إنهاء السكريبت
SELECT 'تم إنشاء قاعدة البيانات بنجاح!' as result;
