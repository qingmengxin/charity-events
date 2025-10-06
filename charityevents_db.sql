DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db;
USE charityevents_db;

CREATE TABLE organisations (
  org_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  contact_email VARCHAR(150),
  contact_phone VARCHAR(50),
  website VARCHAR(255)
);

CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  short_description VARCHAR(255),
  full_description TEXT,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME,
  location VARCHAR(255),
  city VARCHAR(100),
  ticket_price DECIMAL(10,2) DEFAULT 0.00,
  capacity INT DEFAULT 0,
  tickets_sold INT DEFAULT 0,
  goal_amount DECIMAL(12,2) DEFAULT 0.00,
  raised_amount DECIMAL(12,2) DEFAULT 0.00,
  status ENUM('active','suspended','past') DEFAULT 'active',
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organisations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

INSERT INTO organisations (name, description, contact_email, contact_phone, website)
VALUES
 ('CityCare Foundation', 'Supporting vulnerable families in the city', 'info@citycare.org', '012-345-6789', 'https://citycare.com'),
 ('GreenSteps Charity', 'Environment & community wellbeing initiatives', 'hello@greensteps.org', '012-333-4444', 'https://greensteps.com');

INSERT INTO categories (name) VALUES ('Fun Run'), ('Gala Dinner'), ('Silent Auction'), ('Concert'), ('Community Festival');

INSERT INTO events (org_id, category_id, name, short_description, full_description, start_datetime, end_datetime, location, city, ticket_price, capacity, tickets_sold, goal_amount, raised_amount, status, image_url)
VALUES
(1, 1, 'Community Book Drive & Storytelling Session', 
 'Collect books for rural children and host interactive storytime', 
 'Donate 2+ children’s books to participate; local authors will lead storytelling sessions. Free entry for all donors, with "Kindness Certificates" provided.', 
 '2025-10-19 09:30:00', '2025-10-19 14:00:00', 
 'Central Community Library', 'Kuala Lumpur', 
 0.00, 300, 85, 3200.00, 950.00, 'active', 'No special requirements'),

(1, 2, 'Parent-Child Handicraft Charity Sale', 
 'Create and sell handmade items to support disabled artisans', 
 'Families work together to make DIY keychains and quilts; 100% of sales fund training programs for disabled artisans. All crafting materials are provided on-site.', 
 '2025-09-12 10:00:00', '2025-09-12 17:00:00', 
 'Sunway Pyramid Mall Atrium', 'Kuala Lumpur', 
 15.00, 150, 128, 9600.00, 3100.00, 'past', 'Parents are encouraged to accompany children aged 5+'),

(1, 3, 'Mental Health Awareness Lecture & Workshop', 
 'Discuss youth mental well-being with experts and interactive activities', 
 'Psychologists share stress management techniques; includes Q&A sessions and group therapy demos. Free admission for students with valid ID.', 
 '2025-12-08 14:00:00', '2025-12-08 18:00:00', 
 'University Hall A', 'Kuala Lumpur', 
 0.00, 400, 210, 7500.00, 2800.00, 'active', 'Pre-registration required via university portal'),

(1, 4, 'Senior Citizen Tea Party & Talent Showcase', 
 'Celebrate seniors with companionship, music, and performances', 
 'Volunteers host a tea service and live music; seniors are invited to perform singing, dancing, or other talents. Free for seniors; volunteers welcome (training provided).', 
 '2025-08-09 10:30:00', '2025-08-09 16:30:00', 
 'Elderly Care Center Auditorium', 'Kuala Lumpur', 
 0.00, 250, 190, 4800.00, 1600.00, 'past', 'Seniors may bring 1 guest; wheelchair accessible'),

(2, 1, 'Eco-Friendly Bicycle Ride for Wildlife Conservation', 
 'Cycle to raise funds for endangered species protection', 
 '20km scenic ride along lake trails; rest stops with snacks and water provided. Helmets are mandatory (free rental for participants without equipment).', 
 '2025-11-27 07:00:00', '2025-11-27 11:00:00', 
 'Lake Gardens Starting Point', 'Kuala Lumpur', 
 45.00, 200, 62, 18000.00, 5400.00, 'active', 'Arrive 1 hour early for check-in and safety briefing'),

(2, 2, 'Charity Hike for Rural School Infrastructure', 
 'Hike to fund school building renovations in rural areas', 
 'Guided 10km mountain hike; custom certificates for all finishers. Minimum donation of 50 MYR required to participate.', 
 '2026-01-22 08:00:00', '2026-01-22 13:00:00', 
 'Mountain View Trailhead', 'Kuala Lumpur', 
 60.00, 350, 78, 24000.00, 6800.00, 'active', 'Wear non-slip hiking shoes; bring a reusable water bottle'),

(2, 3, 'Local Cuisine Tasting for Stray Animal Shelters', 
 'Sample street food to support stray animal care programs', 
 'Taste 8+ local dishes from renowned vendors; each ticket funds 1 week of food for stray animals. Family packages (2 adults + 2 children) available at a 20% discount.', 
 '2025-07-08 17:30:00', '2025-07-08 21:30:00', 
 'Old Town Food Square', 'Kuala Lumpur', 
 35.00, 500, 430, 21000.00, 8200.00, 'past', 'No outside food or drinks permitted; vegetarian options available'),

(2, 4, 'Tech Workshop for Low-Income Youth', 
 'Teach basic coding and design skills to empower underprivileged youth', 
 '2-day workshop with free laptop use; participants receive skill certificates upon completion. Sponsored by local tech companies (no prior experience needed).', 
 '2026-03-12 09:00:00', '2026-03-13 17:00:00', 
 'Tech Innovation Center', 'Kuala Lumpur', 
 0.00, 120, 95, 15000.00, 9800.00, 'active', 'Open to youth aged 12-18; pre-book via event website')

 SELECT 
  e.event_id,
  e.name AS event_name,
  c.name AS category_name,
  o.name AS organisation_name,
  e.city,
  e.start_datetime,
  e.goal_amount,
  e.raised_amount,
  e.status
FROM events e
INNER JOIN categories c ON e.category_id = c.category_id
INNER JOIN organisations o ON e.org_id = o.org_id
ORDER BY e.start_datetime;