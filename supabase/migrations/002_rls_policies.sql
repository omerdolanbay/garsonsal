-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================
-- Supabase Auth: businesses.id = auth.uid() (her işletme kendi auth user'ı)

-- BUSINESSES
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "businesses_select_own" ON businesses
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "businesses_update_own" ON businesses
  FOR UPDATE USING (id = auth.uid());

-- TABLES
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tables_all_own" ON tables
  FOR ALL USING (business_id = auth.uid());

-- Public okuma: müşteriler QR token ile masayı doğrulayabilir
CREATE POLICY "tables_select_public" ON tables
  FOR SELECT USING (is_active = true);

-- MENU CATEGORIES
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_categories_all_own" ON menu_categories
  FOR ALL USING (business_id = auth.uid());

-- Herkese açık okuma (müşteri menü sayfası)
CREATE POLICY "menu_categories_select_public" ON menu_categories
  FOR SELECT USING (is_active = true);

-- MENU ITEMS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_items_all_own" ON menu_items
  FOR ALL USING (business_id = auth.uid());

-- Herkese açık okuma
CREATE POLICY "menu_items_select_public" ON menu_items
  FOR SELECT USING (is_active = true);

-- ORDER SESSIONS
ALTER TABLE order_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_sessions_all_own" ON order_sessions
  FOR ALL USING (business_id = auth.uid());

-- Müşteriler session oluşturabilir (anon)
CREATE POLICY "order_sessions_insert_anon" ON order_sessions
  FOR INSERT WITH CHECK (true);

-- Müşteriler kendi session'larını okuyabilir
CREATE POLICY "order_sessions_select_by_token" ON order_sessions
  FOR SELECT USING (true);

-- ORDERS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_all_own" ON orders
  FOR ALL USING (business_id = auth.uid());

-- Müşteriler sipariş oluşturabilir (anon)
CREATE POLICY "orders_insert_anon" ON orders
  FOR INSERT WITH CHECK (true);

-- Müşteriler kendi siparişlerini görebilir
CREATE POLICY "orders_select_by_session" ON orders
  FOR SELECT USING (true);

-- WAITER CALLS
ALTER TABLE waiter_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waiter_calls_all_own" ON waiter_calls
  FOR ALL USING (business_id = auth.uid());

-- Müşteriler garson çağırabilir
CREATE POLICY "waiter_calls_insert_anon" ON waiter_calls
  FOR INSERT WITH CHECK (true);

-- LOYALTY MEMBERS
ALTER TABLE loyalty_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loyalty_members_all_own" ON loyalty_members
  FOR ALL USING (business_id = auth.uid());

-- Müşteriler loyalty kaydı yapabilir
CREATE POLICY "loyalty_members_insert_anon" ON loyalty_members
  FOR INSERT WITH CHECK (true);

-- LOYALTY SETTINGS
ALTER TABLE loyalty_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loyalty_settings_all_own" ON loyalty_settings
  FOR ALL USING (business_id = auth.uid());

-- Herkese açık okuma (müşteri loyalty sayfası)
CREATE POLICY "loyalty_settings_select_public" ON loyalty_settings
  FOR SELECT USING (true);

-- LOYALTY TRANSACTIONS
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loyalty_transactions_all_own" ON loyalty_transactions
  FOR ALL USING (business_id = auth.uid());

-- SUBSCRIPTIONS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_all_own" ON subscriptions
  FOR ALL USING (business_id = auth.uid());

-- DISCOUNT CODES
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Herkese açık okuma (kayıt sırasında kod doğrulama)
CREATE POLICY "discount_codes_select_public" ON discount_codes
  FOR SELECT USING (is_active = true);

-- Sadece service_role yazabilir (Süper admin API)
CREATE POLICY "discount_codes_all_service" ON discount_codes
  FOR ALL USING (auth.role() = 'service_role');

-- SUPER ADMINS
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

-- Sadece service_role erişebilir
CREATE POLICY "super_admins_service_only" ON super_admins
  FOR ALL USING (auth.role() = 'service_role');
