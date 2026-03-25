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
                // env.pi3 contains:
                //   MONGODB_URI  - MongoDB connection string for the app
                //   PI3_HOST     - PI3 worker node IP (build, image import, repo sync)
                //   PI1_HOST     - PI1 control plane IP (kubectl commands)
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

        stage('Import Image to K3s') {
            steps {
                // Export Docker image and import into K3s containerd on PI3
                sh '''
                    . ./env.pi3
                    ssh -i /home/jenkins/.ssh/id_rsa -o StrictHostKeyChecking=no yegun@${PI3_HOST} "docker save adventuretube-web:latest | sudo k3s ctr images import -"
                '''
            }
        }

        stage('Deploy to K3s') {
            steps {
                // kubectl must run on PI1 (control plane) because worker nodes (PI2/PI3)
                // don't have access to the K3s API server.
                // The deployment YAML is piped via stdin to avoid needing the file on PI1.
                sh '''
                    . ./env.pi3
                    ssh -i /home/jenkins/.ssh/id_rsa -o StrictHostKeyChecking=no strider@${PI1_HOST} "sudo kubectl apply -f - && sudo kubectl rollout restart deployment/adventurevictoria" < k8s/adventurevictoria-deployment.yaml
                '''
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
