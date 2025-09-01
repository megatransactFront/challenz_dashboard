-- SQL functions to add to your Supabase database

-- Function to get manufacturer count for a specific product
CREATE OR REPLACE FUNCTION get_product_manufacturers_count(p_product_id TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM product_manufacturers pm
    WHERE pm.product_id = p_product_id
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get manufacturers for a specific product with their details
CREATE OR REPLACE FUNCTION get_product_manufacturers(p_product_id TEXT)
RETURNS TABLE(
  manufacturer_id TEXT,
  name TEXT,
  country TEXT,
  contact_email TEXT,
  phone_number TEXT,
  state TEXT,
  city TEXT,
  suburb TEXT,
  postcode TEXT,
  street TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.manufacturer_id,
    m.name,
    m.country,
    m.contact_email,
    m.phone_number,
    m.state,
    m.city,
    m.suburb,
    m.postcode,
    m.street
  FROM manufacturers m
  INNER JOIN product_manufacturers pm ON m.manufacturer_id = pm.manufacturer_id
  WHERE pm.product_id = p_product_id
  ORDER BY m.name;
END;
$$ LANGUAGE plpgsql;
