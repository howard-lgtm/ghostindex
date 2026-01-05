-- Seed Script: Top 50 S&P 500 Tech Companies
-- Populates companies table with baseline 'Audit Pending' status (ghost_index_score = NULL)

INSERT INTO companies (name, domain, logo, ghost_index_score) VALUES
-- FAANG + Microsoft
('Apple Inc.', 'apple.com', 'https://logo.clearbit.com/apple.com', NULL),
('Microsoft Corporation', 'microsoft.com', 'https://logo.clearbit.com/microsoft.com', NULL),
('Alphabet Inc.', 'google.com', 'https://logo.clearbit.com/google.com', NULL),
('Amazon.com Inc.', 'amazon.com', 'https://logo.clearbit.com/amazon.com', NULL),
('Meta Platforms Inc.', 'meta.com', 'https://logo.clearbit.com/meta.com', NULL),
('NVIDIA Corporation', 'nvidia.com', 'https://logo.clearbit.com/nvidia.com', NULL),

-- Cloud & Enterprise Software
('Salesforce Inc.', 'salesforce.com', 'https://logo.clearbit.com/salesforce.com', NULL),
('Oracle Corporation', 'oracle.com', 'https://logo.clearbit.com/oracle.com', NULL),
('Adobe Inc.', 'adobe.com', 'https://logo.clearbit.com/adobe.com', NULL),
('ServiceNow Inc.', 'servicenow.com', 'https://logo.clearbit.com/servicenow.com', NULL),
('Workday Inc.', 'workday.com', 'https://logo.clearbit.com/workday.com', NULL),
('Snowflake Inc.', 'snowflake.com', 'https://logo.clearbit.com/snowflake.com', NULL),
('Datadog Inc.', 'datadoghq.com', 'https://logo.clearbit.com/datadoghq.com', NULL),
('MongoDB Inc.', 'mongodb.com', 'https://logo.clearbit.com/mongodb.com', NULL),

-- Semiconductors
('Broadcom Inc.', 'broadcom.com', 'https://logo.clearbit.com/broadcom.com', NULL),
('Advanced Micro Devices', 'amd.com', 'https://logo.clearbit.com/amd.com', NULL),
('Qualcomm Inc.', 'qualcomm.com', 'https://logo.clearbit.com/qualcomm.com', NULL),
('Intel Corporation', 'intel.com', 'https://logo.clearbit.com/intel.com', NULL),
('Texas Instruments', 'ti.com', 'https://logo.clearbit.com/ti.com', NULL),
('Analog Devices Inc.', 'analog.com', 'https://logo.clearbit.com/analog.com', NULL),
('Micron Technology', 'micron.com', 'https://logo.clearbit.com/micron.com', NULL),

-- Payments & Fintech
('PayPal Holdings', 'paypal.com', 'https://logo.clearbit.com/paypal.com', NULL),
('Block Inc.', 'block.xyz', 'https://logo.clearbit.com/block.xyz', NULL),
('Intuit Inc.', 'intuit.com', 'https://logo.clearbit.com/intuit.com', NULL),

-- Cybersecurity
('Palo Alto Networks', 'paloaltonetworks.com', 'https://logo.clearbit.com/paloaltonetworks.com', NULL),
('CrowdStrike Holdings', 'crowdstrike.com', 'https://logo.clearbit.com/crowdstrike.com', NULL),
('Fortinet Inc.', 'fortinet.com', 'https://logo.clearbit.com/fortinet.com', NULL),

-- Social Media & Communications
('Netflix Inc.', 'netflix.com', 'https://logo.clearbit.com/netflix.com', NULL),
('Uber Technologies', 'uber.com', 'https://logo.clearbit.com/uber.com', NULL),
('Airbnb Inc.', 'airbnb.com', 'https://logo.clearbit.com/airbnb.com', NULL),
('Zoom Video Communications', 'zoom.us', 'https://logo.clearbit.com/zoom.us', NULL),

-- E-commerce & Retail Tech
('Shopify Inc.', 'shopify.com', 'https://logo.clearbit.com/shopify.com', NULL),
('eBay Inc.', 'ebay.com', 'https://logo.clearbit.com/ebay.com', NULL),

-- Software & Development Tools
('Atlassian Corporation', 'atlassian.com', 'https://logo.clearbit.com/atlassian.com', NULL),
('GitLab Inc.', 'gitlab.com', 'https://logo.clearbit.com/gitlab.com', NULL),
('Twilio Inc.', 'twilio.com', 'https://logo.clearbit.com/twilio.com', NULL),

-- Hardware & Electronics
('Tesla Inc.', 'tesla.com', 'https://logo.clearbit.com/tesla.com', NULL),
('HP Inc.', 'hp.com', 'https://logo.clearbit.com/hp.com', NULL),
('Dell Technologies', 'dell.com', 'https://logo.clearbit.com/dell.com', NULL),

-- Telecommunications
('Cisco Systems', 'cisco.com', 'https://logo.clearbit.com/cisco.com', NULL),
('T-Mobile US', 't-mobile.com', 'https://logo.clearbit.com/t-mobile.com', NULL),

-- Gaming & Entertainment
('Activision Blizzard', 'activisionblizzard.com', 'https://logo.clearbit.com/activisionblizzard.com', NULL),
('Electronic Arts', 'ea.com', 'https://logo.clearbit.com/ea.com', NULL),
('Roblox Corporation', 'roblox.com', 'https://logo.clearbit.com/roblox.com', NULL),

-- Analytics & Data
('Palantir Technologies', 'palantir.com', 'https://logo.clearbit.com/palantir.com', NULL),
('Splunk Inc.', 'splunk.com', 'https://logo.clearbit.com/splunk.com', NULL),

-- Additional Tech Giants
('IBM Corporation', 'ibm.com', 'https://logo.clearbit.com/ibm.com', NULL),
('Autodesk Inc.', 'autodesk.com', 'https://logo.clearbit.com/autodesk.com', NULL),
('VMware Inc.', 'vmware.com', 'https://logo.clearbit.com/vmware.com', NULL),
('Synopsys Inc.', 'synopsys.com', 'https://logo.clearbit.com/synopsys.com', NULL),
('Cadence Design Systems', 'cadence.com', 'https://logo.clearbit.com/cadence.com', NULL)

ON CONFLICT (domain) DO NOTHING;

-- Verify insertion
SELECT 
  COUNT(*) as total_companies,
  COUNT(CASE WHEN ghost_index_score IS NULL THEN 1 END) as audit_pending
FROM companies;
