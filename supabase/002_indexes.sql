-- ═══════════════════════════════════════════════════════════
-- TriFlow: Índices para rendimiento a escala
-- Ejecutar en Supabase SQL Editor DESPUÉS de 001_rls_policies.sql
-- Todos usan IF NOT EXISTS → seguro re-ejecutar
-- ═══════════════════════════════════════════════════════════

-- ────────────────────────────────────────
-- user_id indexes (todas las tablas)
-- Supabase ya indexa PKs, pero user_id es FK y se filtra siempre
-- ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_agua_diaria_user_id ON agua_diaria(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_user_id ON stock(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_semanal_user_id ON menu_semanal(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_diario_user_id ON menu_diario(user_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_user_id ON sesiones(user_id);
CREATE INDEX IF NOT EXISTS idx_progreso_peso_user_id ON progreso_peso(user_id);
CREATE INDEX IF NOT EXISTS idx_habitos_user_id ON habitos(user_id);
CREATE INDEX IF NOT EXISTS idx_habito_diario_user_id ON habito_diario(user_id);

-- ────────────────────────────────────────
-- Índices compuestos para queries frecuentes
-- ────────────────────────────────────────

-- agua_diaria: siempre se busca por (user_id, fecha) en upsert
CREATE INDEX IF NOT EXISTS idx_agua_diaria_user_fecha ON agua_diaria(user_id, fecha);

-- progreso_peso: se ordena por created_at para gráficos
CREATE INDEX IF NOT EXISTS idx_progreso_peso_user_fecha ON progreso_peso(user_id, created_at);

-- habito_diario: se filtra por user_id + rango de fecha
CREATE INDEX IF NOT EXISTS idx_habito_diario_user_fecha ON habito_diario(user_id, fecha);

-- menu_diario: se busca por user_id + fecha + comida
CREATE INDEX IF NOT EXISTS idx_menu_diario_user_fecha ON menu_diario(user_id, fecha);

-- sesiones: columna rpe (si existe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sesiones' AND column_name = 'rpe'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_sesiones_rpe ON sesiones(user_id, rpe)';
  END IF;
END $$;

-- ────────────────────────────────────────
-- Verificación: listar todos los índices creados
-- ────────────────────────────────────────
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
