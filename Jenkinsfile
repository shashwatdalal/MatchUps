pipeline {
  agent {
    dockerfile true
  } 
  stages {
    stage('Docker Tests') {
      steps {
        sh 'tree'
      }
    }
    stage('Build') {
      steps {
        sh 'echo $GOROOT'
        sh 'echo $GOPATH'
        sh 'pwd'
        sh 'go build *.go'
      }
    }
    stage('Test') {
      steps {
        sh 'cd src/'
        sh 'go test -v | go2xunit -output tests.xml'
      }
    }
  }
}
