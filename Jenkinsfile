pipeline {
    agent any

    environment {
        MAC_USER = 'ren' 
        MAC_HOST = 'host.docker.internal'
        // ✨ สังเกตไหมครับ รหัสผ่านหายไปอย่างถาวรแล้ว! ปลอดภัย 100%
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo '🚚 กำลังดึงโค้ดล่าสุดจาก GitHub ส่วนตัว...'
                checkout scm
            }
        }

        stage('2. Test Build Docker Image') {
            steps {
                echo '📦 ส่งคำสั่งผ่านกุญแจดิจิทัล SSH Key ไปรัน Docker build...'
                // 🔥 ตัด apt-get install และ sshpass ออกไปเลย ใช้แค่ ssh ธรรมดา
                sh """
                    ssh -o StrictHostKeyChecking=no ${MAC_USER}@${MAC_HOST} "cd ~/Downloads/log-app-be-main && DOCKER_CONFIG=/dev/null /usr/local/bin/docker build -t log-app-be:latest ."
                """
            }
        }

        stage('3. Check Docker Images') {
            steps {
                echo '🔍 ตรวจสอบความสำเร็จ...'
                sh """
                    ssh -o StrictHostKeyChecking=no ${MAC_USER}@${MAC_HOST} "DOCKER_CONFIG=/dev/null /usr/local/bin/docker images | grep log-app-be"
                """
            }
        }
    }
}
