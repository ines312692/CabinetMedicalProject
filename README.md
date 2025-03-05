# Cabinet Medical

## Description
Cabinet Medical est une application mobile multiplateforme pour la gestion des rendez-vous, consultations et échanges de documents médicaux. L'application est accessible aux patients et au personnel médical, avec des fonctionnalités spécifiques pour chaque type d'utilisateur.

## Fonctionnalités
### Pour les patients :
1. **Prise de rendez-vous** :
  - Consulter les créneaux disponibles par médecin.
  - Prendre un rendez-vous en sélectionnant la date, l'heure et le médecin.
  - Recevoir une confirmation de rendez-vous (par notification ou email).
2. **Envoi de documents médicaux** :
  - Télécharger et envoyer des documents tels que des radios, des résultats de laboratoire, ou tout autre fichier médical.
  - Lister les documents envoyés et leur statut (consulté ou non par le médecin).
3. **Historique médical personnel** :
  - Consulter l’historique des rendez-vous et des consultations.
  - Voir les diagnostics et les prescriptions.
4. **Notifications** :
  - Recevoir des rappels pour les rendez-vous à venir.
  - Être notifié lorsque les documents sont consultés par le médecin.

### Pour le personnel médical :
1. **Gestion des rendez-vous** :
  - Voir les demandes de rendez-vous des patients et les accepter/rejeter.
  - Modifier ou annuler les rendez-vous en fonction des disponibilités.
  - Visualiser les rendez-vous sous forme de calendrier.
2. **Consultation des documents** :
  - Accéder aux documents envoyés par les patients.
  - Ajouter des annotations ou remarques sur les documents consultés.
3. **Gestion des consultations** :
  - Enregistrer les diagnostics et les prescriptions pour chaque consultation.
  - Associer des documents aux consultations pour un meilleur suivi médical.
4. **Profil utilisateur** :
  - Mettre à jour leurs informations personnelles.
  - Gérer les horaires de disponibilité.

## Prérequis
- Node.js et npm
- Angular CLI
- Python 3.x
- Pip (gestionnaire de paquets Python)
- MongoDB
- SQLite
- Firebase Cloud Messaging (FCM)

## Installation

### Backend
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/ines312692/CabinetMedicalProject.git
   cd CabinetMedicalProject/BackendCabinetMedical/pythonProject

## Installation

### Backend
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/ines312692/cabinet-medical.git
   cd CabinetMedical/BackendCabinetMedical/pythonProject
   
2. Créez un environnement virtuel :
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
4. Créez la base de données :
   ```medic_db 
   
5. Lancez le serveur :
   ```bash
   flask run
   ```

### Frontend
1. Allez dans le répertoire du frontend : 
   ```bash
   cd CabinetMedical/CabinetMedical
   ```
1. Installez les dépendances :
   ```bash
    npm install
   ```
2. Lancez l'application :
   ```bash
   ionic serve
   ```