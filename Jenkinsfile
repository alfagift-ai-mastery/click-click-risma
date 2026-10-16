pipeline {
    agent any

    // Build manual: tanpa triggers, webhook, atau pollSCM.

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        APP_NAME = 'deploy-risma'
        APP_PORT = '1019'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t ${APP_NAME}:latest .'
            }
        }

        stage('Deploy') {
            steps {
                // Buang container lama (jika ada) agar tidak menumpuk
                sh 'docker rm -f ${APP_NAME} || true'
                sh '''
                    docker run -d \
                      --name ${APP_NAME} \
                      --restart unless-stopped \
                      -p ${APP_PORT}:80 \
                      ${APP_NAME}:latest
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps --filter "name=^${APP_NAME}$" --format "{{.Names}} {{.Status}} {{.Ports}}"'
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
    }
}
