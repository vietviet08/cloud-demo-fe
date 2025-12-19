pipeline {
    agent any
    
    environment {
        EC2_HOST = 'ec2-18-141-170-131.ap-southeast-1.compute.amazonaws.com'
        EC2_USER = 'ubuntu'
        PEM_FILE = '/var/lib/jenkins/jobs/FE/builds/sing.pem'
        PROJECT_DIR = '/home/ubuntu/employee/fe'
        COMPOSE_FILE = '/home/ubuntu/employee/docker-compose.yml'
    }
    
    stages {
        stage('SSH and Deploy Frontend') {
            steps {
                script {
                    sh """
                        chmod 400 ${env.PEM_FILE} || true
                        ssh -i "${env.PEM_FILE}" -o StrictHostKeyChecking=no ${env.EC2_USER}@${env.EC2_HOST} '
                            cd ${env.PROJECT_DIR} && \\
                            echo "Pulling latest code from master branch..." && \\
                            git fetch origin && \\
                            git checkout master && \\
                            git pull origin master && \\
                            echo "Building and starting Frontend container..." && \\
                            docker compose -f ${env.COMPOSE_FILE} stop vuejs-app || true && \\
                            docker compose -f ${env.COMPOSE_FILE} rm -f vuejs-app || true && \\
                            docker compose -f ${env.COMPOSE_FILE} build vuejs-app && \\
                            docker compose -f ${env.COMPOSE_FILE} up -d vuejs-app && \\
                            echo "Frontend container started successfully" && \\
                            docker compose -f ${env.COMPOSE_FILE} ps vuejs-app
                        '
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Frontend deployment succeeded!'
        }
        failure {
            echo 'Frontend deployment failed!'
        }
    }
}
