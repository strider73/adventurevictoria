pipeline {
    agent any

    stages {
        stage('Pull Code') {
            steps {
                // Jenkins pulls code automatically from Git
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! Site is live.'
        }
        failure {
            echo 'Deployment failed. Check the logs.'
        }
    }
}
