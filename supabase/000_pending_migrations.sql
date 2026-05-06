-- ═══════════════════════════════════════════════════════════
-- TriFlow: Migraciones pendientes
-- Ejecutar PRIMERO, antes de RLS e índices
-- ═══════════════════════════════════════════════════════════

-- Columna RPE para slider de esfuerzo en sesiones
ALTER TABLE sesiones ADD COLUMN IF NOT EXISTS rpe INTEGER DEFAULT 0;

-- Columna logs (jsonb) para registros de series/reps/peso
ALTER TABLE sesiones ADD COLUMN IF NOT EXISTS logs JSONB DEFAULT '{}'::jsonb;
