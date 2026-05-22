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
                echo '📦 ดึงคีย์จากระบบเซฟของ Jenkins ยิงตรงไปรัน Docker build พร้อมส่งค่าตัวแปร API...'
                sshagent(credentials: ['mac-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${MAC_USER}@${MAC_HOST} "
                            cd ~/Downloads/log-app-fe-main && \\
                            DOCKER_CONFIG=/dev/null /usr/local/bin/docker build \\
                                --build-arg VITE_API_BASE_URL=http://localhost:8081 \\
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
                echo '🚀 กำลังเคลียร์ Container เก่าและรัน Frontend ตัวใหม่ขึ้นมา...'
                sshagent(credentials: ['mac-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${MAC_USER}@${MAC_HOST} "
                            # 1. เช็คและสั่งลบ Container เก่าทิ้งก่อน (ถ้ามีรันอยู่) เพื่อไม่ให้พอร์ตชนกัน
                            /usr/local/bin/docker rm -f log-app-fe-container || true
                            
                            # 2. สั่งรัน Container ตัวใหม่ (ปรับปลายท่อเข้าพอร์ต 80 ของ Nginx)
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
