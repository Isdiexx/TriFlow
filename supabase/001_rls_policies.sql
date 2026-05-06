-- ═══════════════════════════════════════════════════════════
-- TriFlow: Row Level Security (RLS) Policies
-- Ejecutar en Supabase SQL Editor (Dashboard > SQL)
-- IMPORTANTE: Ejecutar en orden, una sección a la vez
-- ═══════════════════════════════════════════════════════════

-- ────────────────────────────────────────
-- 1. PROFILES
-- ────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas duplicadas (idempotente)
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No DELETE: los perfiles no se borran

-- ────────────────────────────────────────
-- 2. AGUA_DIARIA
-- ────────────────────────────────────────
ALTER TABLE agua_diaria ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "agua_select_own" ON agua_diaria;
DROP POLICY IF EXISTS "agua_insert_own" ON agua_diaria;
DROP POLICY IF EXISTS "agua_update_own" ON agua_diaria;

CREATE POLICY "agua_select_own" ON agua_diaria
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "agua_insert_own" ON agua_diaria
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "agua_update_own" ON agua_diaria
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 3. STOCK (Despensa)
-- ────────────────────────────────────────
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stock_select_own" ON stock;
DROP POLICY IF EXISTS "stock_insert_own" ON stock;
DROP POLICY IF EXISTS "stock_update_own" ON stock;
DROP POLICY IF EXISTS "stock_delete_own" ON stock;

CREATE POLICY "stock_select_own" ON stock
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "stock_insert_own" ON stock
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stock_update_own" ON stock
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stock_delete_own" ON stock
  FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 4. MENU_SEMANAL
-- ────────────────────────────────────────
ALTER TABLE menu_semanal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "menu_select_own" ON menu_semanal;
DROP POLICY IF EXISTS "menu_insert_own" ON menu_semanal;
DROP POLICY IF EXISTS "menu_update_own" ON menu_semanal;
DROP POLICY IF EXISTS "menu_delete_own" ON menu_semanal;

CREATE POLICY "menu_select_own" ON menu_semanal
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "menu_insert_own" ON menu_semanal
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "menu_update_own" ON menu_semanal
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "menu_delete_own" ON menu_semanal
  FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 5. MENU_DIARIO (tracking comidas)
-- ────────────────────────────────────────
ALTER TABLE menu_diario ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "menu_diario_select_own" ON menu_diario;
DROP POLICY IF EXISTS "menu_diario_insert_own" ON menu_diario;
DROP POLICY IF EXISTS "menu_diario_update_own" ON menu_diario;
DROP POLICY IF EXISTS "menu_diario_delete_own" ON menu_diario;

CREATE POLICY "menu_diario_select_own" ON menu_diario
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "menu_diario_insert_own" ON menu_diario
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "menu_diario_update_own" ON menu_diario
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "menu_diario_delete_own" ON menu_diario
  FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 6. SESIONES (entrenamiento)
-- ────────────────────────────────────────
ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sesiones_select_own" ON sesiones;
DROP POLICY IF EXISTS "sesiones_insert_own" ON sesiones;
DROP POLICY IF EXISTS "sesiones_update_own" ON sesiones;
DROP POLICY IF EXISTS "sesiones_delete_own" ON sesiones;

CREATE POLICY "sesiones_select_own" ON sesiones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sesiones_insert_own" ON sesiones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sesiones_update_own" ON sesiones
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sesiones_delete_own" ON sesiones
  FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 7. PROGRESO_PESO
-- ────────────────────────────────────────
ALTER TABLE progreso_peso ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "peso_select_own" ON progreso_peso;
DROP POLICY IF EXISTS "peso_insert_own" ON progreso_peso;
DROP POLICY IF EXISTS "peso_update_own" ON progreso_peso;
DROP POLICY IF EXISTS "peso_delete_own" ON progreso_peso;

CREATE POLICY "peso_select_own" ON progreso_peso
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "peso_insert_own" ON progreso_peso
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "peso_update_own" ON progreso_peso
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "peso_delete_own" ON progreso_peso
  FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 8. HABITOS
-- ────────────────────────────────────────
ALTER TABLE habitos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "habitos_select_own" ON habitos;
DROP POLICY IF EXISTS "habitos_insert_own" ON habitos;
DROP POLICY IF EXISTS "habitos_update_own" ON habitos;
DROP POLICY IF EXISTS "habitos_delete_own" ON habitos;

CREATE POLICY "habitos_select_own" ON habitos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "habitos_insert_own" ON habitos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habitos_update_own" ON habitos
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habitos_delete_own" ON habitos
  FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- 9. HABITO_DIARIO
-- ────────────────────────────────────────
ALTER TABLE habito_diario ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "habito_diario_select_own" ON habito_diario;
DROP POLICY IF EXISTS "habito_diario_insert_own" ON habito_diario;
DROP POLICY IF EXISTS "habito_diario_update_own" ON habito_diario;
DROP POLICY IF EXISTS "habito_diario_delete_own" ON habito_diario;

CREATE POLICY "habito_diario_select_own" ON habito_diario
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "habito_diario_insert_own" ON habito_diario
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habito_diario_update_own" ON habito_diario
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habito_diario_delete_own" ON habito_diario
  FOR DELETE USING (auth.uid() = user_id);
