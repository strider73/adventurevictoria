pipeline {
    agent none

    stages {
        stage('Pull Code') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            agent any
            steps {
                withCredentials([file(credentialsId: 'adventurevictoria-env', variable: 'ENV_FILE')]) {
                    sh 'rm -f .env.local && cp $ENV_FILE .env.local'
                    sh 'docker compose build --no-cache'
                }
            }
        }

        stage('Deploy to Both Agents') {
            parallel {
                stage('Deploy to Agent 2') {
                    agent {
                        label 'jenkins-agent2'
                    }
                    steps {
                        withCredentials([file(credentialsId: 'adventurevictoria-env', variable: 'ENV_FILE')]) {
                            sh 'rm -f .env.local && cp $ENV_FILE .env.local'
                            sh 'docker compose down || true'
                            sh 'docker compose up -d'
                        }
                    }
                }
                stage('Deploy to Agent 3') {
                    agent {
                        label 'jenkins-agent3'
                    }
                    steps {
                        withCredentials([file(credentialsId: 'adventurevictoria-env', variable: 'ENV_FILE')]) {
                            sh 'rm -f .env.local && cp $ENV_FILE .env.local'
                            sh 'docker compose down || true'
                            sh 'docker compose up -d'
                        }
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
