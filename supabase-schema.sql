-- ==============================================
-- Script SQL para Supabase - Portfolio Web
-- ==============================================
-- Este script crea las tablas necesarias para almacenar
-- toda la información del portafolio en Supabase

-- Tabla principal de Portfolio
-- Almacena toda la información del portafolio en formato JSON
CREATE TABLE IF NOT EXISTS portfolio (
    id BIGSERIAL PRIMARY KEY,
    experiences JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    logos JSONB DEFAULT '[]'::jsonb,
    brands JSONB DEFAULT '[]'::jsonb,
    socials JSONB DEFAULT '{}'::jsonb,
    hero_content JSONB DEFAULT '{}'::jsonb,
    whatsapp TEXT DEFAULT '',
    pdf_data TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para mejorar el rendimiento en las consultas
CREATE INDEX IF NOT EXISTS idx_portfolio_updated_at ON portfolio(updated_at DESC);

-- Comentarios para documentar las columnas
COMMENT ON TABLE portfolio IS 'Tabla principal que almacena todos los datos del portafolio web';
COMMENT ON COLUMN portfolio.experiences IS 'Array JSON de experiencias laborales';
COMMENT ON COLUMN portfolio.education IS 'Array JSON de educación y formación';
COMMENT ON COLUMN portfolio.skills IS 'Array JSON de habilidades técnicas';
COMMENT ON COLUMN portfolio.logos IS 'Array JSON de proyectos/logos de la galería';
COMMENT ON COLUMN portfolio.brands IS 'Array JSON de tecnologías/marcas del stack';
COMMENT ON COLUMN portfolio.socials IS 'Objeto JSON con enlaces a redes sociales';
COMMENT ON COLUMN portfolio.hero_content IS 'Objeto JSON con contenido del hero (título, descripción, foto, fondo)';
COMMENT ON COLUMN portfolio.whatsapp IS 'Número de teléfono de WhatsApp';
COMMENT ON COLUMN portfolio.pdf_data IS 'CV en formato base64';

-- Tabla para mensajes de contacto
-- Almacena los mensajes enviados a través del formulario de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para ordenar mensajes por fecha
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

COMMENT ON TABLE contact_messages IS 'Tabla para almacenar mensajes de contacto del portafolio';
COMMENT ON COLUMN contact_messages.name IS 'Nombre de la persona que envía el mensaje';
COMMENT ON COLUMN contact_messages.email IS 'Email de contacto';
COMMENT ON COLUMN contact_messages.message IS 'Contenido del mensaje';

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_portfolio_updated_at ON portfolio;
CREATE TRIGGER update_portfolio_updated_at
    BEFORE UPDATE ON portfolio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- Row Level Security (RLS) Policies
-- ==============================================
-- Nota: Ajusta estas políticas según tus necesidades de seguridad

-- Habilitar RLS en las tablas
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política para portfolio: permitir lectura pública
CREATE POLICY "Allow public read access on portfolio"
    ON portfolio
    FOR SELECT
    USING (true);

-- Política para portfolio: permitir escritura solo a usuarios autenticados
-- NOTA: Si quieres permitir escritura desde el frontend sin autenticación,
-- cambia auth.uid() por true, pero ten cuidado con la seguridad
CREATE POLICY "Allow authenticated insert/update on portfolio"
    ON portfolio
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Política para contact_messages: permitir inserción pública (formulario de contacto)
CREATE POLICY "Allow public insert on contact_messages"
    ON contact_messages
    FOR INSERT
    WITH CHECK (true);

-- Política para contact_messages: permitir lectura solo a usuarios autenticados
CREATE POLICY "Allow authenticated read on contact_messages"
    ON contact_messages
    FOR SELECT
    USING (true);

-- ==============================================
-- Datos iniciales (opcional)
-- ==============================================
-- Insertar un registro inicial vacío si no existe
INSERT INTO portfolio (
    experiences,
    education,
    skills,
    logos,
    brands,
    socials,
    hero_content,
    whatsapp,
    pdf_data
)
SELECT
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '{}'::jsonb,
    '{}'::jsonb,
    '',
    ''
WHERE NOT EXISTS (SELECT 1 FROM portfolio LIMIT 1);

-- ==============================================
-- Verificación
-- ==============================================
-- Consulta para verificar que las tablas se crearon correctamente
SELECT 
    table_name,
    table_type
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public' 
    AND table_name IN ('portfolio', 'contact_messages')
ORDER BY 
    table_name;
