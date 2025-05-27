pipeline {
  agent any

  environment {
    EMAIL_RECIPIENT = 'ahadsiddiqui094@gmail.com'
  }

  stages {
    stage('Checkout') {
      steps {
        // Tool: Git (Jenkins Git plugin)
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
        // Tool: npm
        bat 'npm ci'
      }
    }

    stage('Run Unit Tests') {
      steps {
        // Always capture output to testlog.txt, but never fail the pipeline
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          bat 'npm test > testlog.txt 2>&1 || exit 0'
        }
      }
    }

    stage('Security Audit') {
      steps {
        // Always capture output to auditlog.txt, but never fail the pipeline
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          bat 'npm audit > auditlog.txt 2>&1 || exit 0'
        }
      }
    }

    stage('Integration Tests') {
      steps {
        // Tool: Newman (Postman CLI)
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          // ensure newman is available
          bat 'npm list -g newman || npm install -g newman'

          // run collection → output JUnit XML
          bat 'newman run tests/collection.json --environment tests/env.json --reporters cli,junit --reporter-junit-export integration-results.xml'
        }
      }
    }
  }

  post {
    always {
      // 1) Archive all three artifacts so you see them in the Jenkins UI
      archiveArtifacts artifacts: 'testlog.txt,auditlog.txt,integration-results.xml', allowEmptyArchive: true

      // 2) Send one single email with all three attached + the full console log
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
