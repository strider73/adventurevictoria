pipeline {
    agent {label 'jenkins-agent3'}

    stages {
        stage('Pull Code') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment Files') {
            steps {
                withCredentials([
                    file(credentialsId: 'env.pi3', variable: 'ENV_PI3_FILE')
                ]) {
                    sh '''
                        rm -f env.pi3
                        cp $ENV_PI3_FILE ./env.pi3
                        chmod 644 env.pi3
                    '''
                }
            }
        }

        stage('Sync Host Repo') {
            steps {
                // Jenkins agent container SSHs into Pi3 as yegun, then yegun pulls from GitHub
                sh '''
                    . ./env.pi3
                    ssh -i /home/jenkins/.ssh/id_rsa -o StrictHostKeyChecking=no yegun@${PI3_HOST} "cd ~/adventurevictoria && git checkout -- . && git pull"
                '''
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker compose build --no-cache'
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
            echo 'Deployment successful on Agent 3! Site is live.'
        }
        failure {
            echo 'Deployment failed. Check the logs.'
        }
    }
}
