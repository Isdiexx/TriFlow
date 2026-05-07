-- ═══════════════════════════════════════════════════════════
-- TriFlow: Tablas faltantes + RLS + Índices
-- Script unificado — seguro re-ejecutar (idempotente)
-- Ejecutar TODO junto en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 1: CREAR TABLAS FALTANTES     ║
-- ╚═══════════════════════════════════════╝

-- menu_diario (tracking de comidas completadas)
CREATE TABLE IF NOT EXISTS menu_diario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fecha DATE NOT NULL,
  comida TEXT NOT NULL,
  completada BOOLEAN DEFAULT false,
  comentario TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columnas en sesiones
ALTER TABLE sesiones ADD COLUMN IF NOT EXISTS rpe INTEGER DEFAULT 0;
ALTER TABLE sesiones ADD COLUMN IF NOT EXISTS logs JSONB DEFAULT '{}'::jsonb;


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 2: HABILITAR RLS              ║
-- ╚═══════════════════════════════════════╝

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agua_diaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_semanal ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_diario ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_peso ENABLE ROW LEVEL SECURITY;
ALTER TABLE habitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE habito_diario ENABLE ROW LEVEL SECURITY;


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 3: POLICIES — PROFILES        ║
-- ╚═══════════════════════════════════════╝

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


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 4: POLICIES — AGUA_DIARIA     ║
-- ╚═══════════════════════════════════════╝

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


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 5: POLICIES — STOCK           ║
-- ╚═══════════════════════════════════════╝

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


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 6: POLICIES — MENU_SEMANAL    ║
-- ╚═══════════════════════════════════════╝

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


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 7: POLICIES — MENU_DIARIO     ║
-- ╚═══════════════════════════════════════╝

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


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 8: POLICIES — SESIONES        ║
-- ╚═══════════════════════════════════════╝

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


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 9: POLICIES — PROGRESO_PESO   ║
-- ╚═══════════════════════════════════════╝

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


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 10: POLICIES — HABITOS        ║
-- ╚═══════════════════════════════════════╝

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


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 11: POLICIES — HABITO_DIARIO  ║
-- ╚═══════════════════════════════════════╝

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


-- ╔═══════════════════════════════════════╗
-- ║  PARTE 12: ÍNDICES                   ║
-- ╚═══════════════════════════════════════╝

-- user_id indexes
CREATE INDEX IF NOT EXISTS idx_agua_diaria_user_id ON agua_diaria(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_user_id ON stock(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_semanal_user_id ON menu_semanal(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_diario_user_id ON menu_diario(user_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_user_id ON sesiones(user_id);
CREATE INDEX IF NOT EXISTS idx_progreso_peso_user_id ON progreso_peso(user_id);
CREATE INDEX IF NOT EXISTS idx_habitos_user_id ON habitos(user_id);
CREATE INDEX IF NOT EXISTS idx_habito_diario_user_id ON habito_diario(user_id);

-- Índices compuestos para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_agua_diaria_user_fecha ON agua_diaria(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_progreso_peso_user_fecha ON progreso_peso(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_habito_diario_user_fecha ON habito_diario(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_menu_diario_user_fecha ON menu_diario(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_sesiones_user_rpe ON sesiones(user_id, rpe);


-- ╔═══════════════════════════════════════╗
-- ║  VERIFICACIÓN                        ║
-- ╚═══════════════════════════════════════╝

-- Mostrar todas las policies creadas
SELECT
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
