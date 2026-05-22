pipeline {
    agent any

    environment {
        MAC_USER = 'ren' 
        MAC_HOST = 'host.docker.internal'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo '🚚 กำลังดึงโค้ดล่าสุดจาก GitHub ส่วนตัว (Frontend)...'
                checkout scm
            }
        }

        stage('2. Test Build Docker Image') {
            steps {
                echo '📦 บิวด์ Frontend ใหม่ บังคับให้ยิงเข้าหาหลังบ้านผ่านพอร์ต 8081 ของเครื่อง Mac...'
                sshagent(credentials: ['mac-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${MAC_USER}@${MAC_HOST} "
                            cd ~/Downloads/log-app-fe-main && \\
                            DOCKER_CONFIG=/dev/null /usr/local/bin/docker build \\
                                --build-arg VITE_API_BASE_URL=http://127.0.0.1:8081 \\
                                -t log-app-fe:latest .
                        "
                    """
                }
            }
        }

        stage('3. Check Docker Images') {
            steps {
                echo '🔍 ตรวจสอบความสำเร็จ...'
                sshagent(credentials: ['mac-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${MAC_USER}@${MAC_HOST} "DOCKER_CONFIG=/dev/null /usr/local/bin/docker images | grep log-app-fe"
                    """
                }
            }
        }

        stage('4. Deploy Frontend') {
            steps {
                echo '🚀 กำลังเคลียร์ Container เก่าและรัน Frontend ตัวใหม่ขึ้นมาที่พอร์ต 3000...'
                sshagent(credentials: ['mac-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${MAC_USER}@${MAC_HOST} "
                            /usr/local/bin/docker rm -f log-app-fe-container || true
                            
                            /usr/local/bin/docker run -d \\
                                --name log-app-fe-container \\
                                -p 3000:80 \\
                                log-app-fe:latest
                        "
                    """
                }
            }
        }
    } // จบ stages
} // จบ pipeline
