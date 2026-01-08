-- Check if reports have verification codes
SELECT 
  id,
  company_id,
  verification_code,
  email_verified,
  is_verified,
  status,
  created_at
FROM reports
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'howard@htdstudio.net')
ORDER BY created_at DESC
LIMIT 10;
