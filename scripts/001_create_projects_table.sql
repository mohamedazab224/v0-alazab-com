-- Create projects table for Al-Azab Construction
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'industrial', 'infrastructure', 'renovation')),
  location_ar TEXT NOT NULL,
  location_en TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  budget DECIMAL(15, 2),
  client_ar TEXT,
  client_en TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
  start_date DATE,
  end_date DATE,
  area_sqm DECIMAL(10, 2),
  floors INTEGER,
  specifications JSONB,
  challenges JSONB,
  solutions JSONB,
  main_image TEXT,
  gallery_images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Create index on featured for homepage queries
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage projects" ON projects
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert sample projects
INSERT INTO projects (
  slug,
  title_ar,
  title_en,
  description_ar,
  description_en,
  category,
  location_ar,
  location_en,
  duration_months,
  budget,
  client_ar,
  client_en,
  featured,
  status,
  area_sqm,
  floors,
  main_image,
  gallery_images
) VALUES
(
  'luxury-residential-complex',
  'مجمع سكاني فاخر',
  'Luxury Residential Complex',
  'مجمع سكاني فاخر يتميز بتصميم عصري وأنظمة بناء متقدمة. يوفر المشروع وحدات سكنية راقية مع مرافق متكاملة تشمل حمامات سباحة، صالات رياضية، ومساحات خضراء واسعة.',
  'A luxury residential complex featuring modern design and advanced building systems. The project offers upscale residential units with comprehensive facilities including swimming pools, gyms, and extensive green spaces.',
  'residential',
  'القاهرة الجديدة',
  'New Cairo',
  18,
  49000.00,
  'سيمونوالا الأمريكية',
  'Simonwala America',
  true,
  'completed',
  5000.00,
  4,
  '/modern-villa-exterior.png',
  ARRAY['/modern-villa-exterior.png', '/modern-apartment-building.png', '/modern-commercial-building.png']
),
(
  'commercial-tower',
  'برج تجاري متعدد الاستخدامات',
  'Multi-Purpose Commercial Tower',
  'برج تجاري حديث يجمع بين المكاتب والمحلات التجارية في موقع استراتيجي. يتميز بواجهة زجاجية عصرية وأنظمة ذكية لإدارة الطاقة.',
  'A modern commercial tower combining offices and retail spaces in a strategic location. Features a contemporary glass facade and smart energy management systems.',
  'commercial',
  'وسط البلد، القاهرة',
  'Downtown Cairo',
  24,
  120000.00,
  'شركة النيل للاستثمار',
  'Nile Investment Company',
  true,
  'completed',
  8000.00,
  15,
  '/modern-commercial-building.png',
  ARRAY['/modern-commercial-building.png', '/modern-apartment-building.png']
),
(
  'modern-villa',
  'فيلا عصرية بتصميم معماري فريد',
  'Modern Villa with Unique Architecture',
  'فيلا سكنية فاخرة بتصميم معماري مبتكر يجمع بين الأصالة والحداثة. تتميز بمساحات واسعة وإطلالات بانورامية.',
  'A luxury residential villa with innovative architectural design combining authenticity and modernity. Features spacious areas and panoramic views.',
  'residential',
  'الساحل الشمالي',
  'North Coast',
  12,
  35000.00,
  'عميل خاص',
  'Private Client',
  false,
  'completed',
  600.00,
  2,
  '/construction-site.png',
  ARRAY['/construction-site.png', '/modern-villa-exterior.png']
);
