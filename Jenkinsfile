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

        stage('Build Image with nerdctl') {
            steps {
                // Build directly into K3s containerd (namespace=k8s.io) via nerdctl+buildkit on PI3.
                // Replaces old docker build + `docker save | k3s ctr images import` flow, which
                // was slow and memory-heavy on PI3 (only 1.8 GB RAM).
                // Buildkit cache is pruned (>24h old) to keep disk usage bounded.
                sh '''
                    . ./env.pi3
                    ssh -i /home/jenkins/.ssh/id_rsa -o StrictHostKeyChecking=no yegun@${PI3_HOST} '
                        set -e
                        cd ~/adventurevictoria
                        sudo nerdctl --address /run/k3s/containerd/containerd.sock --namespace k8s.io \
                            compose -f docker-compose.yml build web
                        sudo buildctl --addr unix:///run/buildkit/buildkitd.sock prune --keep-duration 24h || true
                    '
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
                    ssh -i /home/jenkins/.ssh/id_rsa -o StrictHostKeyChecking=no strider@${PI1_HOST} "sudo kubectl apply -n adventuretube -f - && sudo kubectl rollout restart deployment/adventurevictoria -n adventuretube" < k8s/adventurevictoria-deployment.yaml
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
