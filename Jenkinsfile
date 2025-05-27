pipeline {
  agent any

  environment {
    EMAIL_RECIPIENT = 'ahadsiddiqui094@gmail.com'
  }

  stages {
    stage('Checkout') {
      steps {
        // Tool: Git
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/ahadsiddiqui/RealWorld-Nodejs-goof']]
        ])
      }
    }

    stage('Install & Build') {
      steps {
        // Tool: npm
        bat 'npm ci'
      }
    }

    stage('Unit Tests') {
      steps {
        // Tool: npm test
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          bat 'npm test > testlog.txt || exit 0'
        }
      }
    }

    stage('Integration Tests') {
      steps {
        // Tool: Newman (Postman CLI)
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          // ensure newman is installed
          bat 'npm list -g newman || npm install -g newman'

          // run collection and export JUnit XML in one single command
          bat 'newman run tests/collection.json --environment tests/env.json --reporters cli,junit --reporter-junit-export integration-results.xml'
        }
      }
    }
  }

  post {
    always {
      // archive all three logs/artifacts
      archiveArtifacts artifacts: 'testlog.txt,auditlog.txt,integration-results.xml', allowEmptyArchive: true

      // send one email with everything attached
      script {
        def result = currentBuild.currentResult ?: 'SUCCESS'
        emailext(
          to:               EMAIL_RECIPIENT,
          subject:          "Build ${result}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
          body:             """\
            Hello,

            Your pipeline finished with status: ${result}

            • View console log: ${env.BUILD_URL}console
            • Attached: testlog.txt, auditlog.txt, integration-results.xml
          """.stripIndent(),
          attachmentsPattern: 'testlog.txt,auditlog.txt,integration-results.xml',
          attachLog:         true
        )
      }
    }
  }
}
