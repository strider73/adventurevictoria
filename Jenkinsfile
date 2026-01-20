pipeline {
    agent none

    stages {
        stage('Pull Code') {
            agent any
            steps {
                // Jenkins pulls code automatically from Git
                checkout scm
            }
        }

        stage('Build Image') {
            agent any
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy to Both Agents') {
            parallel {
                stage('Deploy to Agent 2') {
                    agent {
                        label 'jenkins-agent2'
                    }
                    steps {
                        sh 'docker compose down || true'
                        sh 'docker compose up -d'
                    }
                }
                stage('Deploy to Agent 3') {
                    agent {
                        label 'jenkins-agent3'
                    }
                    steps {
                        sh 'docker compose down || true'
                        sh 'docker compose up -d'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful on both agents! Site is live.'
        }
        failure {
            echo 'Deployment failed. Check the logs.'
        }
    }
}
