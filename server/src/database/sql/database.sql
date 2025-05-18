-- MySQL Script para sistema_escolar
-- Fecha: 2024

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema sistema_escolar
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `sistema_escolar`;
CREATE SCHEMA IF NOT EXISTS `sistema_escolar` DEFAULT CHARACTER SET utf8;
USE `sistema_escolar`;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`nivel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nivel` (
  `id_nivel` INT NOT NULL AUTO_INCREMENT,
  `tipo_nivel` ENUM('administradora', 'profesora', 'estudiante') NOT NULL,
  PRIMARY KEY (`id_nivel`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`estados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estados` (
  `id_estado` INT NOT NULL AUTO_INCREMENT,
  `estados` VARCHAR(45) NOT NULL,
  `iso-3166-2` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`ciudades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ciudades` (
  `id_ciudad` INT NOT NULL AUTO_INCREMENT,
  `id_estado` INT NOT NULL,
  `ciudad` VARCHAR(150) NOT NULL,
  `capital` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id_ciudad`),
  CONSTRAINT `fk_ciudad_estado`
    FOREIGN KEY (`id_estado`)
    REFERENCES `estados` (`id_estado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`direccion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `direccion` (
  `id_direccion` INT NOT NULL AUTO_INCREMENT,
  `direccion` VARCHAR(255) NOT NULL,
  `id_ciudad` INT NOT NULL,
  `id_estado` INT NOT NULL,
  PRIMARY KEY (`id_direccion`),
  CONSTRAINT `fk_direccion_ciudad`
    FOREIGN KEY (`id_ciudad`)
    REFERENCES `ciudades` (`id_ciudad`),
  CONSTRAINT `fk_direccion_estado`
    FOREIGN KEY (`id_estado`)
    REFERENCES `estados` (`id_estado`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `id_nivel` INT NOT NULL,
  `id_direccion` INT NOT NULL,
  `cedula` VARCHAR(12) NOT NULL COMMENT 'Formato: V-12345678 o E-12345678',
  `primer_nombre` VARCHAR(85) NOT NULL,
  `segundo_nombre` VARCHAR(45) NOT NULL,
  `primer_apellido` VARCHAR(45) NOT NULL,
  `segundo_apellido` VARCHAR(45) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `correo` VARCHAR(60) NOT NULL,
  `telefono_principal` VARCHAR(15) NOT NULL,
  `telefono_secundario` VARCHAR(15) NULL,
  `contraseña` VARCHAR(34) NOT NULL,
  `rol` ENUM('admin', 'estudiante') NOT NULL,
  `estado` TINYINT(1) DEFAULT '1',
  `ultima_conexion` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `correo_UNIQUE` (`correo` ASC),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC),
  CONSTRAINT `fk_usuario_nivel`
    FOREIGN KEY (`id_nivel`)
    REFERENCES `nivel` (`id_nivel`),
  CONSTRAINT `fk_usuario_direccion`
    FOREIGN KEY (`id_direccion`)
    REFERENCES `direccion` (`id_direccion`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`estudiantes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estudiantes` (
  `id_estudiante` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `cedula_escolar` VARCHAR(15) NULL COMMENT 'Formato: 12345678-9',
  `representante_nombre` VARCHAR(100) NOT NULL,
  `representante_cedula` VARCHAR(12) NOT NULL COMMENT 'Formato: V-12345678 o E-12345678',
  `representante_telefono` VARCHAR(15) NOT NULL,
  `representante_parentesco` VARCHAR(45) NOT NULL,
  `condicion_especial` TEXT NULL,
  `grupo_sanguineo` VARCHAR(5) NULL,
  PRIMARY KEY (`id_estudiante`),
  UNIQUE INDEX `cedula_escolar_UNIQUE` (`cedula_escolar` ASC),
  CONSTRAINT `fk_estudiante_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`materias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `materias` (
  `id_materia` INT NOT NULL AUTO_INCREMENT,
  `codigo_materia` VARCHAR(10) NOT NULL,
  `nombre_materia` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `horas_academicas` INT NOT NULL DEFAULT 0,
  `año_escolar` VARCHAR(10) NOT NULL,
  `estado` TINYINT(1) DEFAULT '1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_materia`),
  UNIQUE INDEX `codigo_materia_UNIQUE` (`codigo_materia` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`periodo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `periodo` (
  `id_periodo` INT NOT NULL AUTO_INCREMENT,
  `periodo` VARCHAR(45) NOT NULL,
  `fechaInicio` DATE NOT NULL,
  `fechaFinal` DATE NOT NULL,
  PRIMARY KEY (`id_periodo`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`lapsos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lapsos` (
  `id_lapso` INT NOT NULL AUTO_INCREMENT,
  `id_periodo` INT NOT NULL,
  `numero_lapso` INT NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `estado` ENUM('activo', 'cerrado') NOT NULL DEFAULT 'activo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_lapso`),
  CONSTRAINT `fk_lapso_periodo`
    FOREIGN KEY (`id_periodo`)
    REFERENCES `periodo` (`id_periodo`),
  INDEX `idx_lapso_estado` (`estado` ASC),
  INDEX `idx_lapso_fechas` (`fecha_inicio` ASC, `fecha_fin` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`evaluaciones_lapso`
-- -----------------------------------------------------
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
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`notas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `notas` (
  `id_nota` INT NOT NULL AUTO_INCREMENT,
  `id_evaluacion_lapso` INT NOT NULL,
  `id_estudiante` INT NOT NULL,
  `nota_obtenida` DECIMAL(5,2) NOT NULL,
  `tipo_evaluacion` ENUM('examen', 'tarea', 'proyecto', 'participacion') NOT NULL,
  `porcentaje` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `observaciones` TEXT NULL,
  `recuperacion` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_nota`),
  CONSTRAINT `fk_nota_evaluacion`
    FOREIGN KEY (`id_evaluacion_lapso`)
    REFERENCES `evaluaciones_lapso` (`id_evaluacion_lapso`),
  CONSTRAINT `fk_nota_estudiante`
    FOREIGN KEY (`id_estudiante`)
    REFERENCES `estudiantes` (`id_estudiante`),
  INDEX `idx_notas_tipo` (`tipo_evaluacion` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `sistema_escolar`.`asistencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asistencia` (
  `id_asistencia` INT NOT NULL AUTO_INCREMENT,
  `id_estudiante` INT NOT NULL,
  `id_materia` INT NOT NULL,
  `fecha` DATE NOT NULL,
  `estado` ENUM('presente', 'ausente', 'justificado') NOT NULL,
  `observacion` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_asistencia`),
  CONSTRAINT `fk_asistencia_estudiante`
    FOREIGN KEY (`id_estudiante`)
    REFERENCES `estudiantes` (`id_estudiante`),
  CONSTRAINT `fk_asistencia_materia`
    FOREIGN KEY (`id_materia`)
    REFERENCES `materias` (`id_materia`),
  INDEX `idx_asistencia_fecha` (`fecha` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Triggers para validación de datos
-- -----------------------------------------------------
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

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS; 