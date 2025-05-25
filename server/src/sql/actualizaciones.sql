-- Actualizaciones a la base de datos sistema_escolar
-- Fecha: 2024

USE sistema_escolar;

-- 1. Modificaciones a la tabla usuarios
ALTER TABLE `usuarios` 
MODIFY COLUMN `cedula` VARCHAR(12) NOT NULL COMMENT 'Formato: V-12345678 o E-12345678',
ADD COLUMN `telefono_principal` VARCHAR(15) NOT NULL AFTER `correo`,
ADD COLUMN `telefono_secundario` VARCHAR(15) NULL AFTER `telefono_principal`,
ADD COLUMN `fecha_nacimiento` DATE NOT NULL AFTER `segundo_apellido`,
ADD UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC) VISIBLE;

-- 2. Modificaciones a la tabla estudiantes
ALTER TABLE `estudiantes` 
ADD COLUMN `cedula_escolar` VARCHAR(15) NULL COMMENT 'Formato: 12345678-9',
ADD COLUMN `representante_nombre` VARCHAR(100) NOT NULL,
ADD COLUMN `representante_cedula` VARCHAR(12) NOT NULL COMMENT 'Formato: V-12345678 o E-12345678',
ADD COLUMN `representante_telefono` VARCHAR(15) NOT NULL,
ADD COLUMN `representante_parentesco` VARCHAR(45) NOT NULL,
ADD COLUMN `condicion_especial` TEXT NULL,
ADD COLUMN `grupo_sanguineo` VARCHAR(5) NULL,
ADD UNIQUE INDEX `cedula_escolar_UNIQUE` (`cedula_escolar` ASC) VISIBLE;

-- 3. Modificaciones a la tabla materias
ALTER TABLE `materias` 
ADD COLUMN `codigo_materia` VARCHAR(10) NOT NULL AFTER `nombre_materia`,
ADD COLUMN `horas_academicas` INT NOT NULL DEFAULT 0,
ADD COLUMN `año_escolar` VARCHAR(10) NOT NULL,
ADD UNIQUE INDEX `codigo_materia_UNIQUE` (`codigo_materia` ASC) VISIBLE;

-- 4. Modificaciones a la tabla notas
ALTER TABLE `notas` 
ADD COLUMN `tipo_evaluacion` ENUM('examen', 'tarea', 'proyecto', 'participacion') NOT NULL,
ADD COLUMN `porcentaje` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
ADD COLUMN `observaciones` TEXT NULL,
ADD COLUMN `recuperacion` BOOLEAN DEFAULT FALSE,
ADD COLUMN `fecha_modificacion` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

-- 5. Nueva tabla para control de asistencia
CREATE TABLE IF NOT EXISTS `asistencia` (
  `id_asistencia` INT NOT NULL AUTO_INCREMENT,
  `id_matricula` INT NOT NULL,
  `fecha` DATE NOT NULL,
  `estado` ENUM('presente', 'ausente', 'justificado') NOT NULL,
  `observacion` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_asistencia`),
  CONSTRAINT `fk_asistencia_matricula`
    FOREIGN KEY (`id_matricula`)
    REFERENCES `matricula` (`id_matricula`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  INDEX `idx_asistencia_fecha` (`fecha` ASC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- 6. Nueva tabla para lapsos académicos
CREATE TABLE IF NOT EXISTS `lapsos` (
  `id_lapso` INT NOT NULL AUTO_INCREMENT,
  `id_periodo` INT NOT NULL,
  `numero_lapso` INT NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `estado` ENUM('activo', 'cerrado') NOT NULL DEFAULT 'activo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_lapso`),
  CONSTRAINT `fk_lapso_periodo`
    FOREIGN KEY (`id_periodo`)
    REFERENCES `periodo` (`id_periodo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  INDEX `idx_lapso_estado` (`estado` ASC),
  INDEX `idx_lapso_fechas` (`fecha_inicio` ASC, `fecha_fin` ASC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- 7. Tabla para registro de evaluaciones por lapso
CREATE TABLE IF NOT EXISTS `evaluaciones_lapso` (
  `id_evaluacion_lapso` INT NOT NULL AUTO_INCREMENT,
  `id_lapso` INT NOT NULL,
  `id_materia` INT NOT NULL,
  `nombre_evaluacion` VARCHAR(100) NOT NULL,
  `porcentaje` DECIMAL(5,2) NOT NULL,
  `fecha_evaluacion` DATE NOT NULL,
  `tipo_evaluacion` ENUM('examen', 'tarea', 'proyecto', 'participacion') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evaluacion_lapso`),
  CONSTRAINT `fk_evaluacion_lapso`
    FOREIGN KEY (`id_lapso`)
    REFERENCES `lapsos` (`id_lapso`),
  CONSTRAINT `fk_evaluacion_materia`
    FOREIGN KEY (`id_materia`)
    REFERENCES `materias` (`id_materia`),
  INDEX `idx_evaluacion_fecha` (`fecha_evaluacion` ASC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- 8. Agregar campos de auditoría a tablas principales
ALTER TABLE `usuarios` 
ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE `materias` 
ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE `notas` 
ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

-- 9. Índices adicionales para optimización
ALTER TABLE `notas`
ADD INDEX `idx_notas_tipo_fecha` (`tipo_evaluacion` ASC, `fechaCreada` ASC);

ALTER TABLE `matricula`
ADD INDEX `idx_matricula_estado` (`estado` ASC);

-- 10. Triggers para validación de datos
DELIMITER //

CREATE TRIGGER before_insert_nota
BEFORE INSERT ON notas
FOR EACH ROW
BEGIN
    IF NEW.nota_obtenida < 0 OR NEW.nota_obtenida > 20 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La nota debe estar entre 0 y 20';
    END IF;
END;//

CREATE TRIGGER before_insert_porcentaje
BEFORE INSERT ON evaluaciones_lapso
FOR EACH ROW
BEGIN
    IF NEW.porcentaje <= 0 OR NEW.porcentaje > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El porcentaje debe estar entre 1 y 100';
    END IF;
END;//

DELIMITER ; 