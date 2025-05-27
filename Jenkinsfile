pipeline {
  agent any

  environment {
    EMAIL_RECIPIENT = 'ahadsiddiqui094@gmail.com'
  }

  stages {
    stage('Checkout') {
      steps {
        // Tool: Git via Jenkins Git plugin
        // Purpose: Fetch the latest code from GitHub
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/ahadsiddiqui/RealWorld-Nodejs-goof']]
        ])
      }
    }

    stage('Install & Build') {
      steps {
        // Tool: npm
        // Purpose: Install dependencies and build the app
        bat 'npm ci'
        // If you have a build script, e.g. transpile or bundle:
        // bat 'npm run build'
      }
    }

    stage('Unit Tests') {
      steps {
        // Tool: npm test (e.g., Mocha/Jest)
        // Purpose: Execute unit tests and capture their output
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          bat 'npm test > testlog.txt || exit 0'
        }
      }
    }

    stage('Integration Tests') {
      steps {
        // Tool: Newman (Postman CLI runner)
        // Purpose: Run end-to-end API tests against your running app
        // Assumes you have a Postman collection at tests/collection.json
        // and optionally an environment file at tests/env.json
        // Export JUnit-style results for later reporting or archiving.
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          bat '''
            REM install Newman if not already installed
            npm list -g newman || npm install -g newman

            REM run the Postman collection
            newman run tests/collection.json ^
              --environment tests/env.json ^
              --reporters cli,junit ^
              --reporter-junit-export integration-results.xml
          ''' 
        }
      }
      post {
        always {
          // Archive the raw Newman report
          archiveArtifacts artifacts: 'integration-results.xml', allowEmptyArchive: true
        }
      }
    }
  }

 
}
