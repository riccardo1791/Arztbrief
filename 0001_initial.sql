-- Migration number: 0001 	 2025-04-06
DROP TABLE IF EXISTS textbausteine;
CREATE TABLE IF NOT EXISTS textbausteine (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dati iniziali
INSERT INTO textbausteine (title, content, display_order) VALUES 
  ('Aszites', 'Unter sterilen Bedingungen erfolgte nach Lokalanästhesie und sonographischer Kontrolle komplikationslos eine diagnostische bzw. therapeutische Aszitespunktion. Insgesamt konnten ___ ml klarer/trüber/hämorrhagischer Aszitesflüssigkeit aspiriert werden.', 1),
  ('Antibiotische Therapie', 'Aufgrund eines Anstiegs der Entzündungsparameter erfolgte die Einleitung einer antibiotischen Therapie mit __. Die zuvor abgenommenen Blutkulturen blieben steril.', 2);

-- Creazione indice
CREATE INDEX idx_textbausteine_display_order ON textbausteine(display_order);
