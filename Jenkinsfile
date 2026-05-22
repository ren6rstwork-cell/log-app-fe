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
                echo '📦 ดึงคีย์จากระบบเซฟของ Jenkins ยิงตรงไปรัน Docker build...'
                // 🔥 บล็อก sshagent จะไปเปิดเซฟหยิบคีย์ 'mac-ssh-key' ออกมาใช้รันอัตโนมัติอย่างปลอดภัย
                sshagent(credentials: ['mac-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${MAC_USER}@${MAC_HOST} "cd ~/Downloads/log-app-fe-main && DOCKER_CONFIG=/dev/null /usr/local/bin/docker build -t log-app-fe:latest ."
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
    }
}
