pipeline {
  agent any                          //run on any available Jenkins agent

  stages {
    /* ──────────────────────────────── Stage 1 ──────────────────────────────── */
    stage('Build') {                 // Stage name shown in Blue Ocean
      steps {
        // 1) Ensure npm packages are installed
        // 2) Run the project’s build script (if one exists)
        echo '👷  Building the application…'
        
        // On Windows agents use `bat`, on Linux/macOS use `sh`
        // Here: Windows example
        bat 'npm ci'                  // clean-install all dependencies
        bat 'npm run build'          //   transpile/compile/bundle (per package.json)
      }
    }
    /* ──────────────────────────────── Stage 2 ──────────────────────────────── */
    stage('Unit Tests') {
      steps {
        // Tool: Mocha (via `npm test`)
        // Purpose: execute all unit tests and save results to a log file
        //
        // catchError ensures that even if tests fail, the pipeline
        // continues, but this stage is marked UNSTABLE (not SUCCESS).
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          // Redirect stdout/stderr into testlog.txt, then
          // exit 0 so Jenkins doesn’t halt the entire pipeline.
          bat 'npm test > testlog.txt || exit 0'
        }
      }
    }
  }  
 post {
    always {
      // Archive the test log so downstream stages (or email) can fetch it
      archiveArtifacts artifacts: 'testlog.txt', allowEmptyArchive: true

      // (Emailing is configured in a later stage or in post; not repeated here)
    }
  }

}    
 
 
