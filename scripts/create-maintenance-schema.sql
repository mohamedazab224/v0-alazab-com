-- Create maintenance requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number VARCHAR(20) UNIQUE NOT NULL,
  
  -- Client Information
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_address TEXT NOT NULL,
  
  -- Request Information
  maintenance_type VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  
  -- Scheduling Information
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(20) NOT NULL,
  
  -- Access Information
  contact_person VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  access_notes TEXT,
  
  -- Status and Tracking
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  assigned_technician VARCHAR(255),
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create maintenance status history table
CREATE TABLE IF NOT EXISTS maintenance_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  notes TEXT,
  changed_by VARCHAR(255),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance images table
CREATE TABLE IF NOT EXISTS maintenance_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type VARCHAR(20) DEFAULT 'request',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_reference ON maintenance_requests(reference_number);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_created ON maintenance_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_email ON maintenance_requests(client_email);
