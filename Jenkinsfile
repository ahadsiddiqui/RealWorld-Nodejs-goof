pipeline {
  agent any                          //run on any available Jenkins agent

  stages {
    stage('Build') {                 // Stage name shown in Blue Ocean
      steps {
        // 1) Ensure npm packages are installed
        // 2) Run the project’s build script (if one exists)
        echo '👷  Building the application…'
        
        // On Windows agents use `bat`, on Linux/macOS use `sh`
        // Here: Windows example
        bat 'npm ci'                  // clean-install all dependencies
        bat 'npm run build'          //transpile/compile/bundle (per package.json)
      }
    }
  }
}  
 
