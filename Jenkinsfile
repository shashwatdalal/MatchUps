pipeline {
  agent none
  stages {
    stage('Build Dockerfile') {
      agent any
      steps { sh 'docker build -t go-ci-test .' }
    }
    stage('Build Source') {
       agent { docker { image 'go-ci-test:latest' } }
      steps { sh 'go build main.go' }
    }
    stage('Unit-Tests') {
      parallel {
        stage('Util Test') {
          agent { docker { image 'go-ci-test:latest' } }
          steps { sh 'cd tests/go-tests && go test basic_test.go -v | go2xunit -fail -output basic_test.xml' }
          post { always { junit 'tests/go-tests/basic_test.xml' } }
        }
        stage('Handler Test') {
          agent { docker { image 'go-ci-test:latest' } }
          steps { sh 'cd tests/go-tests && go test handler_test.go -v | go2xunit -fail -output handler_test.xml' }
          post { always { junit 'tests/go-tests/handler_test.xml' } }
        }
      }
    }
    stage('System-Tests') {
      parallel {
        stage('Chrome') {
          agent { label 'katalon-chrome-tests' }
          steps { sh 'cd tests/ui-tests && ./run_chrome' }
          post { always { junit 'tests/reports/chrome/*.xml' } }
        }
      }
    }
    stage('Production') {
      agent { label 'production' }
      steps { sh 'git pull && docker build -t go-ci-test .' }
    }
  }
}
