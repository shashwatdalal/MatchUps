node {
		def goImage
		def nodeImage

    stage('Regression Test') {
      node("katalon-chrome-tests") {
        sh 'cd ../.. && git pull && ./run_chrome'
      }
    }
}