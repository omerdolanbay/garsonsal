-- ============================================================
-- AUTH SETUP: Supabase Auth ile İşletme Bağlantısı
-- ============================================================
-- Her işletme Supabase Auth'da bir user'a karşılık gelir.
-- auth.users.id = businesses.id (aynı UUID kullanılır)

-- Yeni işletme kaydında otomatik businesses satırı oluştur
CREATE OR REPLACE FUNCTION handle_new_business_auth()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.businesses (id, name, slug, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'İşletme'),
    COALESCE(NEW.raw_user_meta_data->>'slug', 'isletme-' || substring(NEW.id::text, 1, 8)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  -- Varsayılan loyalty_settings oluştur
  INSERT INTO public.loyalty_settings (business_id)
  VALUES (NEW.id)
  ON CONFLICT (business_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_business_auth();

-- Realtime için publications
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE waiter_calls;
ALTER PUBLICATION supabase_realtime ADD TABLE order_sessions;
