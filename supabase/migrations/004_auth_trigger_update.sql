-- Plan bilgisini de kaydet
CREATE OR REPLACE FUNCTION handle_new_business_auth()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.businesses (id, name, slug, email, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'İşletme'),
    COALESCE(NEW.raw_user_meta_data->>'slug', 'isletme-' || substring(NEW.id::text, 1, 8)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'plan', 'starter')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.loyalty_settings (business_id)
  VALUES (NEW.id)
  ON CONFLICT (business_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
