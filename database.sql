-- ESTAM MyAdmin - database.sql
-- MySQL 8 / MariaDB 10+ (PDO, InnoDB, utf8mb4)

-- Recommandé :
-- 1) Crée une base vide (ex: estam_myadmin)
-- 2) Importer ce script dans cette base

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

-- =========================
-- Table: admins
-- =========================
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL,
  `display_name` VARCHAR(128) NOT NULL,
  `role` VARCHAR(64) NOT NULL,
  `pwd_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admins_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: filiere
-- =========================
CREATE TABLE IF NOT EXISTS `filiere` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `secteur_key` VARCHAR(8) NOT NULL,
  `acro` VARCHAR(16) NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_filiere_acro` (`acro`),
  KEY `idx_filiere_secteur` (`secteur_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: etudiants
-- =========================
CREATE TABLE IF NOT EXISTS `etudiants` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `matricule` VARCHAR(80) NOT NULL,
  `dossier` VARCHAR(64) NULL,
  `nom` VARCHAR(80) NOT NULL,
  `prenom` VARCHAR(80) NOT NULL,
  `secteur_key` VARCHAR(8) NOT NULL,
  `filiere_id` INT UNSIGNED NOT NULL,
  `niveau` VARCHAR(16) NOT NULL,

  `date_inscription` DATE NULL,
  `naissance` DATE NULL,
  `lieu_naissance` VARCHAR(128) NULL,
  `adresse` VARCHAR(255) NULL,
  `ville` VARCHAR(64) NULL,
  `arrondissement` VARCHAR(64) NULL,

  `tel1` VARCHAR(32) NULL,
  `tel2` VARCHAR(32) NULL,
  `whatsapp` VARCHAR(32) NULL,
  `email` VARCHAR(120) NULL,

  `tuteur_nom` VARCHAR(80) NULL,
  `tuteur_profession` VARCHAR(120) NULL,
  `tuteur_tel1` VARCHAR(32) NULL,
  `tuteur_tel2` VARCHAR(32) NULL,

  `frais_inscription` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `frais_carte` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `frais_mois` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `frais_extra` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `mode_paiement` VARCHAR(64) NOT NULL DEFAULT 'Espèces',
  `statut` VARCHAR(24) NOT NULL DEFAULT 'Actif',
  `anciennete` VARCHAR(24) NOT NULL DEFAULT 'Nouveau',

  -- Stocke l'image comme data URL (base64) si ton frontend l'envoie ainsi
  `photo_data_url` LONGTEXT NULL,

  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_etudiants_matricule` (`matricule`),
  KEY `idx_etudiants_nom` (`nom`),
  KEY `idx_etudiants_prenom` (`prenom`),
  KEY `idx_etudiants_filiere` (`filiere_id`),
  KEY `idx_etudiants_statut` (`statut`),

  CONSTRAINT `fk_etudiants_filiere`
    FOREIGN KEY (`filiere_id`) REFERENCES `filiere` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: personnel
-- =========================
CREATE TABLE IF NOT EXISTS `personnel` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `matricule` VARCHAR(32) NOT NULL,
  `type` ENUM('Administration','Formateur','Partenaire') NOT NULL,
  `fonction` VARCHAR(120) NULL,
  `statut` ENUM('Actif','Inactif') NOT NULL DEFAULT 'Actif',
  `nom` VARCHAR(80) NOT NULL,
  `prenom` VARCHAR(80) NOT NULL,
  `email` VARCHAR(120) NULL,
  `tel` VARCHAR(32) NULL,
  `nationalite` VARCHAR(80) NULL,
  `naissance` DATE NULL,
  `embauche` DATE NULL,
  `secteur_key` VARCHAR(8) NULL,
  `filiere_acros` TEXT NULL,
  `niveaux` TEXT NULL,
  `matieres` TEXT NULL,
  `grade` VARCHAR(120) NULL,
  `specialisation` VARCHAR(160) NULL,
  `notes` VARCHAR(255) NULL,
  `photo_data_url` LONGTEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_personnel_matricule` (`matricule`),
  KEY `idx_personnel_type` (`type`),
  KEY `idx_personnel_statut` (`statut`),
  KEY `idx_personnel_nom` (`nom`),
  KEY `idx_personnel_prenom` (`prenom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: bibliotheque_documents
-- =========================
CREATE TABLE IF NOT EXISTS `bibliotheque_documents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(255) NOT NULL,
  `categorie` VARCHAR(80) NOT NULL,
  `description` TEXT NULL,
  `fichier_nom` VARCHAR(255) NOT NULL,
  `fichier_path` VARCHAR(255) NOT NULL,
  `fichier_mime` VARCHAR(120) NULL,
  `fichier_size` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `secteur_key` VARCHAR(8) NULL,
  `niveau` VARCHAR(16) NULL,
  `filiere_acro` VARCHAR(16) NULL,
  `vague` VARCHAR(8) NULL,
  `published_by_admin_id` INT UNSIGNED NULL,
  `published_by_name` VARCHAR(120) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_biblio_categorie` (`categorie`),
  KEY `idx_biblio_filiere` (`filiere_acro`),
  KEY `idx_biblio_niveau` (`niveau`),
  KEY `idx_biblio_vague` (`vague`),
  KEY `idx_biblio_admin` (`published_by_admin_id`),
  CONSTRAINT `fk_biblio_admin`
    FOREIGN KEY (`published_by_admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: academic_plannings
-- =========================
CREATE TABLE IF NOT EXISTS `academic_plannings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(255) NOT NULL,
  `type_planning` VARCHAR(60) NOT NULL DEFAULT 'Emploi du temps',
  `annee_academique` VARCHAR(32) NULL,
  `semestre` VARCHAR(16) NULL,
  `secteur_key` VARCHAR(8) NULL,
  `niveau` VARCHAR(16) NULL,
  `filiere_acro` VARCHAR(16) NULL,
  `vague` VARCHAR(8) NULL,
  `fichier_nom` VARCHAR(255) NOT NULL,
  `fichier_path` VARCHAR(255) NOT NULL,
  `fichier_size` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `uploaded_by_admin_id` INT UNSIGNED NULL,
  `uploaded_by_name` VARCHAR(120) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_plan_type` (`type_planning`),
  KEY `idx_plan_filiere` (`filiere_acro`),
  KEY `idx_plan_niveau` (`niveau`),
  KEY `idx_plan_vague` (`vague`),
  KEY `idx_plan_admin` (`uploaded_by_admin_id`),
  CONSTRAINT `fk_plan_admin`
    FOREIGN KEY (`uploaded_by_admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: admin_profiles
-- =========================
CREATE TABLE IF NOT EXISTS `admin_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` INT UNSIGNED NOT NULL,
  `genre` ENUM('M','F') NOT NULL DEFAULT 'M',
  `prenom` VARCHAR(80) NULL,
  `nom` VARCHAR(80) NULL,
  `email` VARCHAR(120) NULL,
  `tel` VARCHAR(32) NULL,
  `dob` DATE NULL,
  `adresse` VARCHAR(255) NULL,
  `ville` VARCHAR(64) NULL,
  `fonction` VARCHAR(120) NULL,
  `photo_data_url` LONGTEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_profile_admin_id` (`admin_id`),
  CONSTRAINT `fk_admin_profile_admin`
    FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: app_settings (singleton row id=1)
-- =========================
CREATE TABLE IF NOT EXISTS `app_settings` (
  `id` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `etablissement_nom` VARCHAR(255) NOT NULL,
  `agrement_creation` VARCHAR(120) NULL,
  `agrement_ouverture` VARCHAR(120) NULL,
  `email_officiel` VARCHAR(120) NULL,
  `telephone_officiel` VARCHAR(120) NULL,
  `adresses_json` JSON NULL,
  `annee_academique` VARCHAR(32) NULL,
  `semestre_actif` VARCHAR(16) NULL,
  `notif_alertes_paiement` TINYINT(1) NOT NULL DEFAULT 1,
  `notif_nouvelles_inscriptions` TINYINT(1) NOT NULL DEFAULT 1,
  `notif_rapports_hebdo` TINYINT(1) NOT NULL DEFAULT 0,
  `notif_alertes_systeme` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_by_admin_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_settings_admin` (`updated_by_admin_id`),
  CONSTRAINT `fk_settings_admin`
    FOREIGN KEY (`updated_by_admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `app_settings` (
  `id`, `etablissement_nom`, `agrement_creation`, `agrement_ouverture`, `email_officiel`,
  `telephone_officiel`, `adresses_json`, `annee_academique`, `semestre_actif`,
  `notif_alertes_paiement`, `notif_nouvelles_inscriptions`, `notif_rapports_hebdo`, `notif_alertes_systeme`
) VALUES (
  1,
  'École Supérieure des Technologies Avancées et de Management (ESTAM)',
  'N° 0076/MES-CAB-DGSUP-DAAC',
  'N° 0369/MESRSIT-CAB-DGESUP-DAAC',
  'estamcongo242@gmail.com',
  '(+242) 06 822 91 78 / 05 557 58 32',
  JSON_OBJECT('ville_1', '233 rue de la Libération, OCH — Poto-Poto', 'ville_2', 'SOCOPRISE, N° 82 Avenue Nelson MANDELA'),
  '2025 - 2026',
  'Semestre 1',
  1, 1, 0, 1
)
ON DUPLICATE KEY UPDATE
  `etablissement_nom` = `etablissement_nom`;

-- =========================
-- Table: notifications
-- =========================
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(32) NOT NULL DEFAULT 'annonce',
  `priorite` VARCHAR(16) NOT NULL DEFAULT 'normale',
  `titre` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `destinataires_json` JSON NULL,
  `filiere` VARCHAR(80) NULL,
  `auto_generated` TINYINT(1) NOT NULL DEFAULT 0,
  `scheduled_for` DATETIME NULL,
  `sent` TINYINT(1) NOT NULL DEFAULT 1,
  `sent_at` DATETIME NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_by_admin_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_type` (`type`),
  KEY `idx_notif_read` (`is_read`),
  KEY `idx_notif_sent` (`sent`),
  KEY `idx_notif_sched` (`scheduled_for`),
  KEY `idx_notif_admin` (`created_by_admin_id`),
  CONSTRAINT `fk_notif_admin`
    FOREIGN KEY (`created_by_admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: notification_reminders
-- =========================
CREATE TABLE IF NOT EXISTS `notification_reminders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reminder_key` VARCHAR(32) NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `config_json` JSON NULL,
  `updated_by_admin_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reminder_key` (`reminder_key`),
  KEY `idx_reminder_admin` (`updated_by_admin_id`),
  CONSTRAINT `fk_reminder_admin`
    FOREIGN KEY (`updated_by_admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `notification_reminders` (`reminder_key`, `active`, `config_json`) VALUES
  ('paiement', 1, JSON_OBJECT('debut', 25, 'fin', 10, 'heures', JSON_ARRAY(0,6,12,18), 'msg', '📚 Rappel ESTAM : Les frais scolaires sont dus entre le 25 et le 10 de chaque mois. Merci de régulariser votre situation.')),
  ('inscription', 1, JSON_OBJECT('dests', JSON_ARRAY('Personnel interne')))
ON DUPLICATE KEY UPDATE
  `reminder_key` = VALUES(`reminder_key`);

-- =========================
-- Table: finance_operations (Journal de caisse)
-- =========================
CREATE TABLE IF NOT EXISTS `finance_operations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` ENUM('Encaissement','Décaissement') NOT NULL,
  `categorie` VARCHAR(80) NOT NULL,
  `libelle` VARCHAR(255) NOT NULL,
  `piece_no` VARCHAR(64) NOT NULL,
  `montant` DECIMAL(12,2) NOT NULL,
  `date_op` DATE NOT NULL,
  `etudiant_id` INT UNSIGNED NULL,
  `created_by_admin_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_finance_piece_no` (`piece_no`),
  KEY `idx_finance_type` (`type`),
  KEY `idx_finance_date` (`date_op`),
  KEY `idx_finance_cat` (`categorie`),
  KEY `idx_finance_etudiant` (`etudiant_id`),
  CONSTRAINT `fk_finance_etudiant`
    FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT `fk_finance_admin`
    FOREIGN KEY (`created_by_admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: finance_receipts (Reçus)
-- =========================
CREATE TABLE IF NOT EXISTS `finance_receipts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero` VARCHAR(64) NOT NULL,
  `etudiant_id` INT UNSIGNED NULL,
  `nom` VARCHAR(160) NOT NULL,
  `formation` VARCHAR(255) NOT NULL,
  `somme` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `avance` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `reste` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `date_recu` DATE NOT NULL,
  `motif` VARCHAR(120) NULL,
  `bpf` VARCHAR(255) NULL,
  `created_by_admin_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_finance_receipt_numero` (`numero`),
  KEY `idx_finance_receipt_date` (`date_recu`),
  KEY `idx_finance_receipt_etudiant` (`etudiant_id`),
  CONSTRAINT `fk_finance_receipt_etudiant`
    FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT `fk_finance_receipt_admin`
    FOREIGN KEY (`created_by_admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: academic_bulletins (Notes / Relevés)
-- =========================
CREATE TABLE IF NOT EXISTS `academic_bulletins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `etudiant_id` INT UNSIGNED NOT NULL,
  `annee` VARCHAR(32) NOT NULL,
  `semestre` VARCHAR(16) NOT NULL,
  `ues_json` LONGTEXT NOT NULL,
  `moyenne_generale` DECIMAL(5,2) NULL,
  `decision_jury` VARCHAR(64) NULL,
  `created_by_admin_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_academic_bulletin_unique` (`etudiant_id`,`annee`,`semestre`),
  KEY `idx_academic_bulletin_student` (`etudiant_id`),
  CONSTRAINT `fk_academic_bulletin_etudiant`
    FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_academic_bulletin_admin`
    FOREIGN KEY (`created_by_admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Table: academic_diplomes
-- =========================
CREATE TABLE IF NOT EXISTS `academic_diplomes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `etudiant_id` INT UNSIGNED NOT NULL,
  `type_diplome` VARCHAR(120) NOT NULL,
  `mention` VARCHAR(80) NULL,
  `annee_academique` VARCHAR(32) NULL,
  `date_delivrance` DATE NOT NULL,
  `numero_piece` VARCHAR(64) NULL,
  `observations` TEXT NULL,
  `created_by_admin_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_diplome_etudiant` (`etudiant_id`),
  KEY `idx_diplome_date` (`date_delivrance`),
  CONSTRAINT `fk_diplome_etudiant`
    FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_diplome_admin`
    FOREIGN KEY (`created_by_admin_id`) REFERENCES `admins` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Seed: filières (SG/ST)
-- =========================
INSERT INTO `filiere` (`secteur_key`, `acro`, `label`) VALUES
  ('SG', 'CGF',  'Comptabilité et Gestion Financière'),
  ('SG', 'BFA',  'Banque Finance et Assurance'),
  ('SG', 'ACCG', 'Audit, Comptabilité et Contrôle de Gestion'),
  ('SG', 'GCM',  'Gestion Commerciale et Marketing'),
  ('SG', 'AGRH', 'Administration et Gestion des Ressources Humaines'),
  ('SG', 'GTL',  'Gestion de Transport et Logistique'),
  ('ST', 'SRI',  'Systèmes et Réseaux Informatiques'),
  ('ST', 'TR',   'Télécommunication et Réseaux'),
  ('ST', 'MRI',  'Maintenance et Réseaux Informatiques'),
  ('ST', 'DSIA', 'Data Science & Intelligence Artificielle'),
  ('ST', 'GLBD', 'Génie Logiciel et Base de Données'),
  ('ST', 'QHSE', 'Qualité Hygiène Sécurité Environnement'),
  ('ST', 'IIM',  'Informatique Industrielle et Maintenance'),
  ('ST', 'EA',   'Électrotechnique et Automatisme'),
  ('ST', 'GE',   'Génie Électrique'),
  ('ST', 'GC',   'Génie Civil')
ON DUPLICATE KEY UPDATE
  `label` = VALUES(`label`),
  `secteur_key` = VALUES(`secteur_key`);

COMMIT;

