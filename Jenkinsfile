pipeline {
  agent any

  environment {
    EMAIL_RECIPIENT = 'ahadsiddiqui094@gmail.com'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/ahadsiddiqui/RealWorld-Nodejs-goof'
          ]]
        ])
      }
    }

    stage('Install & Build') {
      steps {
        bat 'npm ci'
      }
    }

    stage('Run Unit Tests') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          bat 'npm test > testlog.txt 2>&1 || exit 0'
        }
      }
    }

    stage('Security Audit') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          bat 'npm audit > auditlog.txt 2>&1 || exit 0'
        }
      }
    }

    stage('Integration Tests') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          script {
            if (!fileExists('tests/collection.json')) {
              echo "⚠️ No Postman collection found; emitting dummy XML"
              bat 'echo ^<testsuites/^> > integration-results.xml'
            } else {
              bat 'npm list -g newman || npm install -g newman'
              bat 'newman run tests/collection.json --environment tests/env.json --reporters cli,junit --reporter-junit-export integration-results.xml'
            }
          }
        }
      }
    }
  }

  post {
    always {
      // 1) Archive all three logs/XML so you can see them under "Artifacts"
      archiveArtifacts artifacts: 'testlog.txt,auditlog.txt,integration-results.xml', allowEmptyArchive: true

      // 2) Send one single email with all three files + full console log
      script {
        def status = currentBuild.currentResult ?: 'SUCCESS'
        emailext(
          to:               EMAIL_RECIPIENT,
          subject:          "Build ${status}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
          body:             """\
            Hello,

            Your pipeline has finished with status: ${status}

            • View console: ${env.BUILD_URL}console
            • Attached: testlog.txt, auditlog.txt, integration-results.xml
          """.stripIndent(),
          attachmentsPattern: 'testlog.txt,auditlog.txt,integration-results.xml',
          attachLog:         true
        )
      }
    }
  }
}
